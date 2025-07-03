import axios from 'axios'

// Configuración base de Axios - Usando proxy de Vite
const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error)
    return Promise.reject(error)
  }
)

/**
 * Obtiene la fecha actual en formato MM-DD-YYYY
 * @returns {string} Fecha en formato MM-DD-YYYY
 */
function getCurrentDate() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const year = today.getFullYear()
  return `${month}-${day}-${year}`
}

/**
 * Simula los montos esperados para La Plata
 * @returns {Object} Montos esperados por RTO
 */
function getExpectedAmountsLaPlata() {
  return {
    'RTO_01': 0,
    'RTO_02': 0,
    'RTO_03': 0,
    'RTO_04': 0,
    'RTO_05': 0,
    'RTO_06': 0,
    'RTO_07': 0,
    'RTO_08': 0
  }
}

export default {
  /**
   * Obtiene los depósitos de La Plata desde la API real
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional, por defecto fecha actual)
   * @returns {Promise} Datos de depósitos agrupados por RTO
   */
  async getDeposits(date = null) {
    try {
      // Si no se proporciona fecha, usar la fecha actual
      const selectedDate = date || getCurrentDate()
      
      console.log(`[La Plata] Obteniendo depósitos para la fecha: ${selectedDate}`)
      
      const response = await apiClient.get(`/deposits/plata?date=${selectedDate}`)
      
      console.log(`[La Plata] Respuesta de la API:`, response.data)
      
      // Verificar si hay datos - La API devuelve un objeto con identificadores como keys
      if (!response.data || typeof response.data !== 'object' || Object.keys(response.data).length === 0) {
        console.log(`[La Plata] No se encontraron depósitos para la fecha: ${selectedDate}`)
        return {
          success: true,
          data: [],
          fecha: selectedDate,
          total: 0,
          mensaje: `No se encontraron depósitos para el ${selectedDate}`
        }
      }

      // Transformar los datos usando el mismo método que Jumillano
      const repartos = await this.transformApiDataToRepartos(response.data, selectedDate)
      
      console.log(`[La Plata] Datos procesados - ${repartos.length} repartos:`, repartos)
      
      return {
        success: true,
        data: repartos,
        fecha: selectedDate,
        total: repartos.length
      }
      
    } catch (error) {
      console.error('[La Plata] Error al obtener depósitos:', error)
      
      // En caso de error, devolver mensaje claro
      throw new Error(`No se pudo conectar con la API de La Plata: ${error.message}`)
    }
  },

  /**
   * Método principal para obtener repartos (wrapper para compatibilidad)
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional)
   * @returns {Promise} 
   */
  async getRepartos(date = null) {
    const result = await this.getDeposits(date)
    return result.data
  },

  /**
   * Transforma los datos de la API al formato esperado por el frontend
   * @param {Object} apiData - Datos de la API
   * @param {string} fecha - Fecha de consulta
   * @returns {Array} Array de repartos transformados
   */
  async transformApiDataToRepartos(apiData, fecha) {
    const repartos = []
    
    // Obtener montos esperados para esta fecha (siempre 0 para La Plata)
    const montosEsperados = await this.getMontoEsperadoPorReparto(fecha)
    
    // Iterar sobre cada identificador (L-EJU-001, etc.)
    Object.keys(apiData).forEach(identifier => {
      const depositData = apiData[identifier]
      
      // Verificar si tiene la estructura ArrayOfWSDepositsByDayDTO
      if (depositData.ArrayOfWSDepositsByDayDTO && depositData.ArrayOfWSDepositsByDayDTO.WSDepositsByDayDTO) {
        const deposits = depositData.ArrayOfWSDepositsByDayDTO.WSDepositsByDayDTO
        
        // Asegurar que deposits sea un array
        const depositsArray = Array.isArray(deposits) ? deposits : [deposits]
        
        // Agrupar por userName para obtener repartos únicos
        const repartosPorUsuario = {}
        
        depositsArray.forEach(deposit => {
          // Extraer número de reparto del userName (ej: "72, RTO 072" -> "072")
          const userNameMatch = deposit.userName.match(/RTO\s+(\d+)/)
          const numeroReparto = userNameMatch ? userNameMatch[1] : deposit.userName
          
          const repartoKey = `RTO ${numeroReparto}` // Formato "RTO 123"
          
          if (!repartosPorUsuario[repartoKey]) {
            repartosPorUsuario[repartoKey] = {
              id: `${identifier}-${numeroReparto}`,
              idReparto: repartoKey,
              fechaReparto: fecha,
              numeroReparto: numeroReparto,
              userName: deposit.userName,
              identifier: identifier,
              posName: deposit.posName,
              stName: deposit.stName,
              entityName: deposit.entityName,
              depositoReal: 0,
              depositoEsperado: montosEsperados[repartoKey] || 0,
              diferencia: 0,
              estado: 'PENDIENTE',
              movimientoFinanciero: null,
              deposits: []
            }
          }
          
          // Sumar el monto del depósito
          const amount = parseFloat(deposit.currencies.WSDepositCurrency.totalAmount) || 0
          repartosPorUsuario[repartoKey].depositoReal += amount
          repartosPorUsuario[repartoKey].deposits.push(deposit)
        })
        
        // Calcular diferencia y estado para cada reparto
        Object.values(repartosPorUsuario).forEach(reparto => {
          reparto.diferencia = reparto.depositoReal - reparto.depositoEsperado
          
          if (reparto.diferencia === 0) {
            reparto.estado = 'EXACTO'
          } else if (reparto.diferencia > 0) {
            reparto.estado = 'SOBRANTE'
          } else {
            reparto.estado = 'FALTANTE'
          }
          
          repartos.push(reparto)
        })
      }
    })
    
    return repartos
  },

  /**
   * Obtiene los montos esperados por reparto para La Plata
   * @param {string} fecha - Fecha de consulta
   * @returns {Object} Montos esperados por reparto (siempre 0)
   */
  async getMontoEsperadoPorReparto(fecha) {
    // Para La Plata, todos los montos esperados son 0
    return {
      'RTO-001': 0,
      'RTO-002': 0,
      'RTO-003': 0,
      'RTO-004': 0,
      'RTO-005': 0,
      'RTO-006': 0,
      'RTO-007': 0,
      'RTO-008': 0,
      'RTO-009': 0,
      'RTO-010': 0,
      // Agregar más RTOs según sea necesario
    }
  },

  /**
   * Datos simulados para fallback - Solo algunos repartos con datos realistas
   * @param {string} date - Fecha seleccionada
   * @returns {Object} Datos simulados
   */
  getSimulatedData(date = null) {
    const selectedDate = date || getCurrentDate()
    
    // Datos simulados más realistas - solo unos pocos repartos
    const repartos = [
      {
        id: 'RTO_01',
        nombre: 'Reparto RTO_01',
        montoEsperado: 0,
        montoReal: 45000,
        diferencia: 45000,
        porcentajeEjecucion: 100,
        estado: 'simulado',
        fecha: selectedDate,
        movimientos: [{
          tipo: 'depósito',
          monto: 45000,
          descripcion: `Depósito simulado del ${selectedDate}`,
          fecha: selectedDate
        }]
      },
      {
        id: 'RTO_03',
        nombre: 'Reparto RTO_03',
        montoEsperado: 0,
        montoReal: 67000,
        diferencia: 67000,
        porcentajeEjecucion: 100,
        estado: 'simulado',
        fecha: selectedDate,
        movimientos: [{
          tipo: 'depósito',
          monto: 67000,
          descripcion: `Depósito simulado del ${selectedDate}`,
          fecha: selectedDate
        }]
      }
    ]
    
    return {
      success: true,
      data: repartos,
      fecha: selectedDate,
      total: repartos.length,
      isSimulated: true,
      mensaje: 'Datos simulados - API no disponible'
    }
  },

  /**
   * Obtiene la fecha actual en formato MM-DD-YYYY
   * @returns {string} Fecha actual
   */
  getFechaActual() {
    return getCurrentDate()
  },

  /**
   * Obtiene movimientos financieros para un reparto específico de La Plata
   * @param {string} repartoId - ID del reparto
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {Promise<Array>} Lista de movimientos
   */
  async getMovimientosFinancieros(repartoId, date = null) {
    try {
      const selectedDate = date || getCurrentDate()
      
      console.log(`[La Plata] Obteniendo movimientos para reparto ${repartoId} en fecha ${selectedDate}`)
      
      // TODO: Integrar con API real de movimientos cuando esté disponible
      // const response = await apiClient.get(`/movements/plata/${repartoId}?date=${selectedDate}`)
      
      // Por ahora simulamos movimientos
      return [
        {
          id: 1,
          tipo: 'depósito',
          monto: Math.floor(Math.random() * 100000),
          descripcion: `Depósito inicial ${repartoId}`,
          fecha: selectedDate,
          estado: 'completado'
        },
        {
          id: 2,
          tipo: 'retiro',
          monto: Math.floor(Math.random() * 50000),
          descripcion: `Retiro parcial ${repartoId}`,
          fecha: selectedDate,
          estado: 'completado'
        }
      ]
    } catch (error) {
      console.error('[La Plata] Error al obtener movimientos:', error)
      return []
    }
  },

  /**
   * Crea un nuevo movimiento financiero
   * @param {string} repartoId - ID del reparto
   * @param {Object} movimiento - Datos del movimiento
   * @returns {Promise<Object>} Movimiento creado
   */
  async crearMovimiento(repartoId, movimiento) {
    try {
      console.log(`[La Plata] Creando movimiento para reparto ${repartoId}:`, movimiento)
      
      // TODO: Integrar con API real
      // const response = await apiClient.post(`/movements/plata/${repartoId}`, movimiento)
      
      // Simular respuesta por ahora
      const nuevoMovimiento = {
        id: Date.now(),
        ...movimiento,
        fecha: movimiento.fecha || getCurrentDate(),
        estado: 'completado'
      }
      
      console.log('[La Plata] Movimiento creado:', nuevoMovimiento)
      return nuevoMovimiento
    } catch (error) {
      console.error('[La Plata] Error al crear movimiento:', error)
      throw error
    }
  },

  /**
   * Actualiza un movimiento financiero existente
   * @param {string} repartoId - ID del reparto
   * @param {string} movimientoId - ID del movimiento
   * @param {Object} datosActualizados - Nuevos datos del movimiento
   * @returns {Promise<Object>} Movimiento actualizado
   */
  async actualizarMovimiento(repartoId, movimientoId, datosActualizados) {
    try {
      console.log(`[La Plata] Actualizando movimiento ${movimientoId} del reparto ${repartoId}:`, datosActualizados)
      
      // TODO: Integrar con API real
      // const response = await apiClient.put(`/movements/plata/${repartoId}/${movimientoId}`, datosActualizados)
      
      // Simular respuesta por ahora
      const movimientoActualizado = {
        id: movimientoId,
        ...datosActualizados,
        fechaActualizacion: getCurrentDate()
      }
      
      console.log('[La Plata] Movimiento actualizado:', movimientoActualizado)
      return movimientoActualizado
    } catch (error) {
      console.error('[La Plata] Error al actualizar movimiento:', error)
      throw error
    }
  },

  /**
   * Elimina un movimiento financiero
   * @param {string} repartoId - ID del reparto
   * @param {string} movimientoId - ID del movimiento
   * @returns {Promise<boolean>} Resultado de la operación
   */
  async eliminarMovimiento(repartoId, movimientoId) {
    try {
      console.log(`[La Plata] Eliminando movimiento ${movimientoId} del reparto ${repartoId}`)
      
      // TODO: Integrar con API real
      // await apiClient.delete(`/movements/plata/${repartoId}/${movimientoId}`)
      
      console.log('[La Plata] Movimiento eliminado correctamente')
      return true
    } catch (error) {
      console.error('[La Plata] Error al eliminar movimiento:', error)
      throw error
    }
  }
}
