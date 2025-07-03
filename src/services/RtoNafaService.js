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

export default {
  /**
   * Obtiene los repartos de NAFA desde la API real
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional, por defecto fecha actual)
   * @returns {Promise} 
   */
  async getRepartos(date = null) {
    try {
      // Si no se proporciona fecha, usar la fecha actual en formato MM-DD-YYYY
      const fechaConsulta = date || this.getFechaActual()
      
      console.log('🔍 Consultando API de NAFA para fecha:', fechaConsulta)
      
      const response = await apiClient.get(`/deposits/nafa?date=${fechaConsulta}`)
      
      console.log('✅ Respuesta de API NAFA recibida:', Object.keys(response.data).length, 'identificadores')
      
      // Transformar los datos de la API al formato esperado por el frontend
      const repartos = await this.transformApiDataToRepartos(response.data, fechaConsulta)
      
      console.log('📊 Repartos transformados:', repartos.length, 'repartos encontrados')
      
      return repartos
    } catch (error) {
      console.error('❌ Error al obtener repartos de NAFA:', error)
      throw error
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
   * Transforma los datos de la API al formato esperado por el frontend
   * @param {Object} apiData - Datos de la API
   * @param {string} fecha - Fecha de consulta
   * @returns {Array} Array de repartos transformados
   */
  async transformApiDataToRepartos(apiData, fecha) {
    const repartos = []
    
    // Obtener montos esperados para esta fecha (siempre 0 para NAFA)
    const montosEsperados = await this.getMontoEsperadoPorReparto(fecha)
    
    // Iterar sobre cada identificador (L-EJU-004, etc.)
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
          // Extraer número de reparto del userName (ej: "RTO 414, 414" -> "414")
          const userNameMatch = deposit.userName.match(/RTO\s+(\d+)/)
          const numeroReparto = userNameMatch ? userNameMatch[1] : deposit.userName
          
          const repartoKey = `RTO ${numeroReparto}` // Cambiar formato a "RTO 418"
          
          if (!repartosPorUsuario[repartoKey]) {
            repartosPorUsuario[repartoKey] = {
              idReparto: repartoKey,
              numeroReparto: numeroReparto,
              fechaReparto: fecha,
              userName: deposit.userName,
              totalDeposits: 0,
              depositCount: 0,
              deposits: []
            }
          }
          
          // Sumar el monto del depósito
          const amount = deposit.currencies?.WSDepositCurrency?.totalAmount 
            ? parseFloat(deposit.currencies.WSDepositCurrency.totalAmount) 
            : 0
          
          repartosPorUsuario[repartoKey].totalDeposits += amount
          repartosPorUsuario[repartoKey].depositCount++
          repartosPorUsuario[repartoKey].deposits.push({
            amount: amount,
            dateTime: deposit.dateTime,
            depositId: deposit.depositId
          })
        })
        
        // Convertir a formato final
        Object.values(repartosPorUsuario).forEach(reparto => {
          const montoEsperado = montosEsperados[reparto.idReparto] || 0
          const diferencia = reparto.totalDeposits - montoEsperado
          
          repartos.push({
            id: reparto.idReparto,
            idReparto: reparto.idReparto,
            fechaReparto: reparto.fechaReparto,
            depositoEsperado: montoEsperado,
            depositoReal: reparto.totalDeposits,
            diferencia: diferencia,
            estado: 'COMPLETADO', // Siempre completado ya que tenemos datos reales
            movimientoFinanciero: null, // Sin movimientos por ahora
            detalles: {
              userName: reparto.userName,
              cantidadDepositos: reparto.depositCount,
              deposits: reparto.deposits
            }
          })
        })
      }
    })
    
    console.log('✅ Transformación completada. Repartos NAFA:', repartos.length)
    
    return repartos
  },

  /**
   * Obtiene los montos esperados por reparto para NAFA
   * @param {string} fecha - Fecha de consulta
   * @returns {Object} Montos esperados por reparto (siempre 0)
   */
  async getMontoEsperadoPorReparto(fecha) {
    // Para NAFA, por ahora todos los montos esperados son 0
    return {}
  },

  /**
   * Obtiene un reparto específico de NAFA
   * @param {string} idReparto 
   * @returns {Promise} 
   */
  async getRepartoById(idReparto) {
    try {
      const response = await apiClient.get(`/repartos/nafa/${idReparto}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Actualiza un reparto de NAFA
   * @param {string} idReparto 
   * @param {Object} repartoData 
   * @returns {Promise} 
   */
  async updateReparto(idReparto, repartoData) {
    try {
      const response = await apiClient.put(`/repartos/nafa/${idReparto}`, repartoData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Crea un nuevo reparto de NAFA
   * @param {Object} repartoData - Datos del nuevo reparto
   * @returns {Promise} Promesa con el reparto creado
   */
  async createReparto(repartoData) {
    try {
      const response = await apiClient.post('/repartos/nafa', repartoData)
      return response.data
    } catch (error) {
      console.error('Error al crear reparto de NAFA:', error)
      throw error
    }
  },

  /**
   * Elimina un reparto de NAFA
   * @param {string} idReparto - ID del reparto a eliminar
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteReparto(idReparto) {
    try {
      const response = await apiClient.delete(`/repartos/nafa/${idReparto}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Obtiene repartos de NAFA filtrados por fecha
   * @param {string} fecha 
   * @returns {Promise} 
   */
  async getRepartosByFecha(fecha) {
    try {
      const response = await apiClient.get(`/repartos/nafa?fecha=${fecha}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener repartos de NAFA por fecha ${fecha}:`, error)
      throw error
    }
  },

  /**
   * Crea un movimiento financiero para un reparto de NAFA
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento creado
   */
  async createMovimientoFinanciero(idReparto, movimientoData) {
    try {
      const response = await apiClient.post(`/repartos/nafa/${idReparto}/movimiento`, movimientoData)
      return response.data
    } catch (error) {
      console.error(`Error al crear movimiento para reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Actualiza un movimiento financiero de un reparto de NAFA
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento actualizado
   */
  async updateMovimientoFinanciero(idReparto, movimientoData) {
    try {
      const response = await apiClient.put(`/repartos/nafa/${idReparto}/movimiento`, movimientoData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar movimiento para reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Elimina un movimiento financiero de un reparto de NAFA
   * @param {string} idReparto - ID del reparto
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteMovimientoFinanciero(idReparto) {
    try {
      const response = await apiClient.delete(`/repartos/nafa/${idReparto}/movimiento`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar movimiento para reparto ${idReparto} de NAFA:`, error)
      throw error
    }
  },

  /**
   * Obtiene movimientos financieros para un reparto específico de NAFA
   * @param {string} repartoId - ID del reparto
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {Promise<Array>} Lista de movimientos
   */
  async getMovimientosFinancieros(repartoId, date = null) {
    try {
      const selectedDate = date || getCurrentDate()
      
      console.log(`[NAFA] Obteniendo movimientos para reparto ${repartoId} en fecha ${selectedDate}`)
      
      // TODO: Integrar con API real de movimientos cuando esté disponible
      // const response = await apiClient.get(`/movements/nafa/${repartoId}?date=${selectedDate}`)
      
      // Por ahora simulamos movimientos
      return [
        {
          id: 1,
          tipo: 'depósito',
          monto: Math.floor(Math.random() * 100000),
          descripcion: `Depósito inicial ${repartoId}`,
          fecha: selectedDate,
          estado: 'completado'
        }
      ]
    } catch (error) {
      console.error('[NAFA] Error al obtener movimientos:', error)
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
      console.log(`[NAFA] Creando movimiento para reparto ${repartoId}:`, movimiento)
      
      // TODO: Integrar con API real
      // const response = await apiClient.post(`/movements/nafa/${repartoId}`, movimiento)
      
      // Simular respuesta por ahora
      const nuevoMovimiento = {
        id: Date.now(),
        ...movimiento,
        fecha: movimiento.fecha || getCurrentDate(),
        estado: 'completado'
      }
      
      console.log('[NAFA] Movimiento creado:', nuevoMovimiento)
      return nuevoMovimiento
    } catch (error) {
      console.error('[NAFA] Error al crear movimiento:', error)
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
      console.log(`[NAFA] Actualizando movimiento ${movimientoId} del reparto ${repartoId}:`, datosActualizados)
      
      // TODO: Integrar con API real
      // const response = await apiClient.put(`/movements/nafa/${repartoId}/${movimientoId}`, datosActualizados)
      
      // Simular respuesta por ahora
      const movimientoActualizado = {
        id: movimientoId,
        ...datosActualizados,
        fechaActualizacion: getCurrentDate()
      }
      
      console.log('[NAFA] Movimiento actualizado:', movimientoActualizado)
      return movimientoActualizado
    } catch (error) {
      console.error('[NAFA] Error al actualizar movimiento:', error)
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
      console.log(`[NAFA] Eliminando movimiento ${movimientoId} del reparto ${repartoId}`)
      
      // TODO: Integrar con API real
      // await apiClient.delete(`/movements/nafa/${repartoId}/${movimientoId}`)
      
      console.log('[NAFA] Movimiento eliminado correctamente')
      return true
    } catch (error) {
      console.error('[NAFA] Error al eliminar movimiento:', error)
      throw error
    }
  }
}
