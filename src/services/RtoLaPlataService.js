import axios from 'axios'

// Configuración base de Axios - Usando proxy de Vite temporalmente hasta configurar CORS
const API_BASE_URL = '/api-backend'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Aumentado a 60 segundos para manejar cargas grandes de datos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para añadir el token de autorización
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la petición:', error)
    if (error.response?.status === 401) {
      console.error('❌ Token expirado o inválido - limpiando localStorage')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
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
    'RTO 001': 0,
    'RTO 002': 0,
    'RTO 003': 0,
    'RTO 004': 0,
    'RTO 005': 0,
    'RTO 006': 0,
    'RTO 007': 0,
    'RTO 008': 0
  }
}

/**
 * Formatea la composición esperada en texto legible
 * @param {string} composicion - String con letras de composición (E, C, R)
 * @returns {string} Descripción formateada
 */
function formatearComposicionEsperada(composicion) {
  if (!composicion) return ''
  
  // Separar las letras con guiones: E - C - R
  return [...composicion].join(' - ')
}

export default {
  /**
   * Obtiene los repartos de La Plata desde el nuevo endpoint del backend
   * @param {string} date - Fecha en formato YYYY-MM-DD (opcional, por defecto fecha actual)
   * @returns {Promise} 
   */
  async getRepartos(date = null) {
    try {
      // Convertir fecha al formato esperado por el nuevo endpoint (YYYY-MM-DD)
      const fechaConsulta = date ? this.convertToBackendDateFormat(date) : this.getTodayBackendFormat()
      
      console.log('🔍 [LA PLATA] ============ INICIANDO LLAMADA A BACKEND ============')
      console.log('🔍 [LA PLATA] Fecha recibida:', date)
      console.log('🔍 [LA PLATA] Fecha convertida para backend:', fechaConsulta)
      console.log('🔍 [LA PLATA] URL completa:', `${API_BASE_URL}/deposits/db/by-plant?date=${fechaConsulta}`)
      
      // Usar el nuevo endpoint que devuelve datos estructurados por planta
      const response = await apiClient.get(`/deposits/db/by-plant?date=${fechaConsulta}`)
      
      console.log('✅ [LA PLATA] Respuesta del backend recibida:', response.data)
      
      // Verificar que tenemos datos de la plata
      if (!response.data || !response.data.plants || !response.data.plants.plata || !response.data.plants.plata.deposits || response.data.plants.plata.deposits.length === 0) {
        console.log('❌ [LA PLATA] No se encontraron datos de La Plata en el nuevo backend para la fecha:', fechaConsulta)
        console.log('🔄 [LA PLATA] Intentando fallback a API antigua...')
        return await this.getRepartosFromOldAPI(date)
      }
      
      const plataData = response.data.plants.plata
      console.log('📊 [LA PLATA] Datos de La Plata encontrados:', plataData.count, 'depósitos totales')
      
      // Transformar los datos del nuevo formato al formato esperado por el frontend
      const repartos = await this.transformBackendDataToRepartos(plataData, fechaConsulta)
      
      console.log('📊 [LA PLATA] Repartos transformados:', repartos.length, 'repartos encontrados')
      
      return repartos
    } catch (error) {
      console.error('❌ [LA PLATA] Error detallado al obtener repartos:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      })
      
      // Si hay error con el nuevo backend, intentar API antigua
      console.log('🔄 [LA PLATA] Error en nuevo backend, intentando fallback a API antigua...')
      try {
        return await this.getRepartosFromOldAPI(date)
      } catch (fallbackError) {
        console.error('❌ [LA PLATA] Error también en API antigua:', fallbackError)
        throw error // Lanzar el error original
      }
    }
  },

  /**
   * Convierte fecha de MM-DD-YYYY a YYYY-MM-DD
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {string} Fecha en formato YYYY-MM-DD
   */
  convertToBackendDateFormat(date) {
    if (!date) return this.getTodayBackendFormat()
    
    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date
    }
    
    // Convertir de MM-DD-YYYY a YYYY-MM-DD
    const [month, day, year] = date.split('-')
    return `${year}-${month}-${day}`
  },

  /**
   * Obtiene la fecha de hoy en formato YYYY-MM-DD
   * @returns {string} Fecha de hoy
   */
  getTodayBackendFormat() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  /**
   * Transforma los datos del nuevo backend al formato esperado por el frontend
   * @param {Object} plataData - Datos de La Plata del backend
   * @param {string} fecha - Fecha de consulta
   * @returns {Array} Array de repartos transformados
   */
  async transformBackendDataToRepartos(plataData, fecha) {
    const repartos = []
    
    // Verificar que tenemos depósitos
    if (!plataData.deposits || !Array.isArray(plataData.deposits)) {
      console.log('❌ [LA PLATA] No hay depósitos en los datos')
      return repartos
    }
    
    // Agrupar depósitos por número de reparto
    const repartosPorNumero = {}
    
    plataData.deposits.forEach(deposit => {
      // Extraer número de reparto con validaciones
      let numeroReparto = null
      
      // Si el backend envía el número de reparto directamente
      if (deposit.numero_reparto) {
        numeroReparto = deposit.numero_reparto
      } else if (deposit.rto || deposit.rtoNumber) {
        numeroReparto = deposit.rto || deposit.rtoNumber
      } else if (deposit.user_name) {
        // Extraer número de reparto del user_name (ej: "RTO 272, 272" -> "272")
        const userNameMatch = deposit.user_name.match(/RTO\s+(\d+)/)
        numeroReparto = userNameMatch ? userNameMatch[1] : null
      } else {
        // Como último recurso, usar los últimos 2-3 dígitos del deposit_id
        const depositIdStr = String(deposit.deposit_id)
        numeroReparto = depositIdStr.slice(-2) // Tomar los últimos 2 dígitos
      }
      
      // Si no se pudo extraer el número de reparto, saltar este depósito
      if (!numeroReparto) {
        console.warn('⚠️ [LA PLATA] No se pudo extraer número de reparto de:', deposit)
        return
      }
      
      // Asegurar que numeroReparto es string para padStart
      const numeroRepartoStr = String(numeroReparto)
      const repartoKey = `RTO ${numeroRepartoStr.padStart(3, '0')}`
      
      if (!repartosPorNumero[repartoKey]) {
        repartosPorNumero[repartoKey] = {
          id: `plata-${numeroRepartoStr}`,
          idReparto: repartoKey,
          fechaReparto: fecha,
          numeroReparto: numeroRepartoStr,
          userName: deposit.user_name,
          identifier: deposit.identifier,
          posName: deposit.pos_name,
          stName: deposit.st_name,
          depositoReal: 0,
          depositoEsperado: 0,
          diferencia: 0,
          composicionEsperado: '', // Nuevo campo para la composición
          estado: 'PENDIENTE',
          movimientoFinanciero: null,
          deposits: []
        }
      }
      
      // Usar los valores calculados por el backend
      const amount = parseFloat(deposit.total_amount) || 0
      const esperado = parseFloat(deposit.deposit_esperado) || 0
      const diferencia = parseFloat(deposit.diferencia) || 0
      
      repartosPorNumero[repartoKey].depositoReal += amount
      repartosPorNumero[repartoKey].depositoEsperado += esperado
      repartosPorNumero[repartoKey].diferencia += diferencia
      
      // Agregar información de composición esperada
      if (deposit.composicion_esperado) {
        // Si ya existe composición, combinar sin duplicar
        const composicionActual = repartosPorNumero[repartoKey].composicionEsperado || ''
        const nuevaComposicion = deposit.composicion_esperado
        
        // Crear conjunto único de letras de composición
        const letrasUnicas = new Set([...composicionActual, ...nuevaComposicion])
        repartosPorNumero[repartoKey].composicionEsperado = Array.from(letrasUnicas).sort().join('')
      }
      
      // El estado del reparto será el último estado encontrado
      // O se podría implementar lógica más compleja para determinar el estado del grupo
      repartosPorNumero[repartoKey].estado = deposit.estado || 'PENDIENTE'
      
      // Agregar información adicional del backend
      const depositInfo = {
        ...deposit,
        tieneDiferencia: deposit.tiene_diferencia || false,
        composicionEsperado: deposit.composicion_esperado || ''
      }
      
      repartosPorNumero[repartoKey].deposits.push(depositInfo)
    })
    
    // Convertir a array y procesar cada reparto para cargar movimientos financieros
    for (const reparto of Object.values(repartosPorNumero)) {
      try {
        // Cargar movimientos financieros de los datos que ya vienen en cada depósito (nueva estructura del backend)
        let totalCheques = 0
        let totalRetenciones = 0
        let movimientosCargados = []

        // Inicializar arrays de movimientos en el reparto
        reparto.cheques = []
        reparto.retenciones = []

        for (const deposit of reparto.deposits) {
          const depositId = deposit.deposit_id || deposit.id || deposit.identifier

          console.log(`🔍 [LA PLATA] Procesando movimientos para depósito ${depositId}:`, {
            cheques: deposit.cheques?.length || 0,
            retenciones: deposit.retenciones?.length || 0,
            total_cheques: deposit.total_cheques || 0,
            total_retenciones: deposit.total_retenciones || 0
          })

          // Primero intentar obtener directamente del depósito (ya vienen en la respuesta principal)
          if (deposit.cheques && Array.isArray(deposit.cheques) && deposit.cheques.length > 0) {
            reparto.cheques.push(...deposit.cheques)
            const montoCheques = deposit.cheques.reduce((sum, cheque) => sum + parseFloat(cheque.importe || cheque.monto || 0), 0)
            totalCheques += montoCheques
            movimientosCargados.push(...deposit.cheques)
            console.log(`💰 [LA PLATA] Depósito ${depositId}: ${deposit.cheques.length} cheques por $${montoCheques} (desde respuesta principal)`)
          } else {
            // Si no vienen en la respuesta principal, hacer llamada específica como en Jumillano
            try {
              const chequesAdicionales = await this.getCheques(depositId)
              if (chequesAdicionales && chequesAdicionales.length > 0) {
                reparto.cheques.push(...chequesAdicionales)
                const montoCheques = chequesAdicionales.reduce((sum, cheque) => sum + parseFloat(cheque.importe || cheque.monto || 0), 0)
                totalCheques += montoCheques
                movimientosCargados.push(...chequesAdicionales)
                console.log(`💰 [LA PLATA] Depósito ${depositId}: ${chequesAdicionales.length} cheques por $${montoCheques} (desde llamada adicional)`)
              }
            } catch (error) {
              console.error(`❌ [LA PLATA] Error obteniendo cheques adicionales para ${depositId}:`, error)
            }
          }

          // Primero intentar obtener directamente del depósito (ya vienen en la respuesta principal)
          if (deposit.retenciones && Array.isArray(deposit.retenciones) && deposit.retenciones.length > 0) {
            reparto.retenciones.push(...deposit.retenciones)
            const montoRetenciones = deposit.retenciones.reduce((sum, retencion) => sum + parseFloat(retencion.importe || retencion.monto || 0), 0)
            totalRetenciones += montoRetenciones
            movimientosCargados.push(...deposit.retenciones)
            console.log(`💰 [LA PLATA] Depósito ${depositId}: ${deposit.retenciones.length} retenciones por $${montoRetenciones} (desde respuesta principal)`)
          } else {
            // Si no vienen en la respuesta principal, hacer llamada específica como en Jumillano
            try {
              const retencionesAdicionales = await this.getRetenciones(depositId)
              if (retencionesAdicionales && retencionesAdicionales.length > 0) {
                reparto.retenciones.push(...retencionesAdicionales)
                const montoRetenciones = retencionesAdicionales.reduce((sum, retencion) => sum + parseFloat(retencion.importe || retencion.monto || 0), 0)
                totalRetenciones += montoRetenciones
                movimientosCargados.push(...retencionesAdicionales)
                console.log(`💰 [LA PLATA] Depósito ${depositId}: ${retencionesAdicionales.length} retenciones por $${montoRetenciones} (desde llamada adicional)`)
              }
            } catch (error) {
              console.error(`❌ [LA PLATA] Error obteniendo retenciones adicionales para ${depositId}:`, error)
            }
          }
        }

        // Si hay movimientos, crear el movimiento financiero principal del reparto (como en Jumillano)
        if (totalCheques > 0 || totalRetenciones > 0) {
          reparto.movimientoFinanciero = {
            tipo: 'MIXTO',
            totalCheques: reparto.cheques.length,
            totalRetenciones: reparto.retenciones.length,
            montoTotal: totalCheques + totalRetenciones,
            cheques: reparto.cheques,
            retenciones: reparto.retenciones
          }
          
          console.log(`💰 [LA PLATA] Reparto ${reparto.idReparto} - Movimiento financiero creado:`, {
            cheques: reparto.cheques.length,
            retenciones: reparto.retenciones.length,
            montoTotal: totalCheques + totalRetenciones
          })
        }

        // Actualizar el monto real sumando los movimientos
        const montoOriginal = reparto.depositoReal
        reparto.depositoReal = montoOriginal + totalCheques + totalRetenciones

        // Recalcular diferencia con el nuevo monto
        reparto.diferencia = reparto.depositoReal - reparto.depositoEsperado

        // Determinar el estado final del reparto
        const estadosDepositos = reparto.deposits.map(d => d.estado)
        const tieneDiferencias = reparto.deposits.some(d => d.tiene_diferencia)
        
        // Lógica mejorada para determinar el estado del reparto
        if (totalCheques > 0 || totalRetenciones > 0) {
          reparto.estado = Math.abs(reparto.diferencia) < 0.01 ? 'EXACTO' : 
                          reparto.diferencia > 0 ? 'SOBRANTE' : 'FALTANTE'
        } else if (estadosDepositos.every(estado => estado === 'LISTO')) {
          reparto.estado = 'LISTO'
        } else if (estadosDepositos.some(estado => estado === 'ENVIADO')) {
          reparto.estado = 'ENVIADO'
        } else if (tieneDiferencias) {
          reparto.estado = reparto.diferencia === 0 ? 'EXACTO' : 
                          reparto.diferencia > 0 ? 'SOBRANTE' : 'FALTANTE'
        } else {
          reparto.estado = 'PENDIENTE'
        }
        
        // Agregar descripción formateada de la composición
        reparto.composicionEsperadoDescripcion = this._formatearComposicion(reparto.composicionEsperado)

        // Agregar información de movimientos al reparto
        reparto.movimientos = {
          cheques: totalCheques,
          retenciones: totalRetenciones,
          total: totalCheques + totalRetenciones,
          count: movimientosCargados.length
        }

        console.log(`✅ [LA PLATA] ${reparto.idReparto}: Original $${montoOriginal} + Movimientos $${totalCheques + totalRetenciones} = Final $${reparto.depositoReal} (Estado: ${reparto.estado})`)

      } catch (error) {
        console.error(`❌ [LA PLATA] Error procesando movimientos para ${reparto.idReparto}:`, error)
      }
      
      repartos.push(reparto)
    }
    
    console.log(`📊 [LA PLATA] Procesados ${repartos.length} repartos con movimientos financieros cargados`)
    return repartos
  },

  /**
   * Fallback a API antigua cuando el nuevo backend no tiene datos
   * @param {string} date - Fecha en formato YYYY-MM-DD o MM-DD-YYYY
   * @returns {Promise<Array>} Array de repartos (vacío por ahora)
   */
  async getRepartosFromOldAPI(date = null) {
    console.log('🔄 [LA PLATA] Ejecutando fallback a API antigua...')
    console.log('⚠️ [LA PLATA] API antigua no implementada aún - devolviendo array vacío')
    
    // TODO: Implementar llamada a la API antigua de La Plata cuando esté disponible
    // Por ahora devolver array vacío
    return []
  },

  /**
   * Obtiene los estados disponibles para depósitos
   * @returns {Promise<Array>} Lista de estados disponibles
   */
  async getEstadosDisponibles() {
    try {
      const response = await apiClient.get('/deposits/states')
      console.log('📋 [LA PLATA] Estados disponibles:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [LA PLATA] Error al obtener estados:', error)
      // Fallback a estados por defecto
      return [
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'LISTO', label: 'LISTO' }
      ]
    }
  },

  /**
   * Cambia el estado de un depósito
   * @param {string} depositId - ID del depósito
   * @param {string} nuevoEstado - Nuevo estado (PENDIENTE o LISTO)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  async cambiarEstadoDeposito(depositId, nuevoEstado) {
    try {
      console.log(`🔄 [LA PLATA] Cambiando estado de depósito ${depositId} a ${nuevoEstado}`)
      
      const response = await apiClient.put(`/deposits/${depositId}/status`, {
        status: nuevoEstado
      })
      
      console.log('✅ [LA PLATA] Estado cambiado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [LA PLATA] Error al cambiar estado:', error)
      
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail)
      } else {
        throw new Error(`Error al cambiar estado del depósito ${depositId}`)
      }
    }
  },

  /**
   * Cambia el estado de todos los depósitos de un reparto
   * @param {Object} reparto - Objeto del reparto con sus depósitos
   * @param {string} nuevoEstado - Nuevo estado para todos los depósitos
   * @returns {Promise<Array>} Array con los resultados de cada cambio
   */
  async cambiarEstadoReparto(reparto, nuevoEstado) {
    try {
      console.log(`🔄 [LA PLATA] Cambiando estado de todos los depósitos del reparto ${reparto.idReparto} a ${nuevoEstado}`)
      console.log('🔍 [LA PLATA] Depósitos en el reparto:', reparto.deposits)
      
      const cambios = []
      
      for (const deposit of reparto.deposits) {
        try {
          // Intentar diferentes campos que podrían contener el ID
          let depositId = deposit.deposit_id || deposit.id || deposit.identifier || deposit.deposit_identifier
          
          console.log('🔍 [LA PLATA] Procesando depósito:', {
            depositKeys: Object.keys(deposit),
            deposit_id: deposit.deposit_id,
            id: deposit.id,
            identifier: deposit.identifier,
            depositId: depositId
          })
          
          if (!depositId) {
            console.error('❌ [LA PLATA] No se encontró ID válido para el depósito:', deposit)
            cambios.push({ 
              depositId: 'unknown', 
              success: false, 
              error: 'No se encontró ID válido para el depósito' 
            })
            continue
          }
          
          const resultado = await this.cambiarEstadoDeposito(depositId, nuevoEstado)
          cambios.push({ depositId: depositId, success: true, data: resultado })
        } catch (error) {
          cambios.push({ 
            depositId: deposit.deposit_id || deposit.id || 'unknown', 
            success: false, 
            error: error.message 
          })
        }
      }
      
      const exitosos = cambios.filter(c => c.success).length
      console.log(`✅ [LA PLATA] Estados cambiados: ${exitosos}/${cambios.length} depósitos`)
      console.log('📊 [LA PLATA] Detalles de cambios:', cambios)
      
      return cambios
    } catch (error) {
      console.error('❌ [LA PLATA] Error al cambiar estado del reparto:', error)
      throw error
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
        id: 'RTO 001',
        nombre: 'Reparto RTO 001',
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
        id: 'RTO 003',
        nombre: 'Reparto RTO 003',
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
   * Fallback a API antigua cuando el nuevo backend no tiene datos
   * @param {string} date - Fecha en formato YYYY-MM-DD o MM-DD-YYYY
   * @returns {Promise<Array>} Array de repartos (vacío por ahora)
   */
  async getRepartosFromOldAPI(date = null) {
    console.log('🔄 [LA PLATA] Ejecutando fallback a API antigua...')
    console.log('⚠️ [LA PLATA] API antigua no implementada aún - devolviendo array vacío')
    
    // TODO: Implementar llamada a la API antigua de La Plata cuando esté disponible
    // Por ahora devolver array vacío
    return []
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
  },

  /**
   * Crea un movimiento financiero
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento creado
   */
  async createMovimientoFinanciero(idReparto, movimientoData) {
    try {
      console.log(`📤 [LA PLATA] Creando movimiento financiero:`, movimientoData)
      
      // Usar el endpoint correcto que espera tu backend
      const response = await apiClient.post('/movimientos-financieros', movimientoData)
      
      console.log(`✅ [LA PLATA] Movimiento creado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al crear movimiento financiero:`, error)
      throw error
    }
  },

  /**
   * Obtiene todos los cheques de un depósito específico
   * @param {string} depositId - ID del depósito
   * @returns {Promise<Array>} Lista de cheques
   */
  async getCheques(depositId) {
    try {
      console.log(`📋 [LA PLATA] Obteniendo cheques para depósito ${depositId}`)
      const response = await apiClient.get(`/deposits/${depositId}/cheques`)
      console.log(`✅ [LA PLATA] Cheques obtenidos:`, response.data)
      return response.data || []
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al obtener cheques:`, error)
      return []
    }
  },

  /**
   * Crea un nuevo cheque para un depósito
   * @param {string} depositId - ID del depósito
   * @param {Object} chequeData - Datos del cheque
   * @returns {Promise<Object>} Cheque creado
   */
  async createCheque(depositId, chequeData) {
    try {
      console.log(`📤 [LA PLATA] Creando cheque para depósito ${depositId}:`, chequeData)
      const response = await apiClient.post(`/deposits/${depositId}/cheques`, chequeData)
      console.log(`✅ [LA PLATA] Cheque creado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al crear cheque:`, error)
      throw error
    }
  },

  /**
   * Actualiza un cheque existente
   * @param {string} depositId - ID del depósito
   * @param {string} chequeId - ID del cheque
   * @param {Object} chequeData - Datos actualizados del cheque
   * @returns {Promise<Object>} Cheque actualizado
   */
  async updateCheque(depositId, chequeId, chequeData) {
    try {
      console.log(`📝 [LA PLATA] Actualizando cheque ${chequeId} del depósito ${depositId}:`, chequeData)
      const response = await apiClient.put(`/cheques-retenciones/cheques/${chequeId}`, chequeData)
      console.log(`✅ [LA PLATA] Cheque actualizado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al actualizar cheque:`, error)
      throw error
    }
  },

  /**
   * Elimina un cheque
   * @param {string} depositId - ID del depósito
   * @param {string} chequeId - ID del cheque
   * @returns {Promise<boolean>} Resultado de la eliminación
   */
  async deleteCheque(depositId, chequeId) {
    try {
      console.log(`🗑️ [LA PLATA] Eliminando cheque ${chequeId} del depósito ${depositId}`)
      await apiClient.delete(`/deposits/${depositId}/cheques/${chequeId}`)
      console.log(`✅ [LA PLATA] Cheque eliminado exitosamente`)
      return true
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al eliminar cheque:`, error)
      throw error
    }
  },

  /**
   * Obtiene todas las retenciones de un depósito específico
   * @param {string} depositId - ID del depósito
   * @returns {Promise<Array>} Lista de retenciones
   */
  async getRetenciones(depositId) {
    try {
      console.log(`📋 [LA PLATA] Obteniendo retenciones para depósito ${depositId}`)
      const response = await apiClient.get(`/deposits/${depositId}/retenciones`)
      console.log(`✅ [LA PLATA] Retenciones obtenidas:`, response.data)
      return response.data || []
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al obtener retenciones:`, error)
      return []
    }
  },

  /**
   * Crea una nueva retención para un depósito
   * @param {string} depositId - ID del depósito
   * @param {Object} retencionData - Datos de la retención
   * @returns {Promise<Object>} Retención creada
   */
  async createRetencion(depositId, retencionData) {
    try {
      console.log(`📤 [LA PLATA] Creando retención para depósito ${depositId}:`, retencionData)
      const response = await apiClient.post(`/deposits/${depositId}/retenciones`, retencionData)
      console.log(`✅ [LA PLATA] Retención creada exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al crear retención:`, error)
      throw error
    }
  },

  /**
   * Actualiza una retención existente
   * @param {string} depositId - ID del depósito
   * @param {string} retencionId - ID de la retención
   * @param {Object} retencionData - Datos actualizados de la retención
   * @returns {Promise<Object>} Retención actualizada
   */
  async updateRetencion(depositId, retencionId, retencionData) {
    try {
      console.log(`📝 [LA PLATA] Actualizando retención ${retencionId} del depósito ${depositId}:`, retencionData)
      const response = await apiClient.put(`/cheques-retenciones/retenciones/${retencionId}`, retencionData)
      console.log(`✅ [LA PLATA] Retención actualizada exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al actualizar retención:`, error)
      throw error
    }
  },

  /**
   * Elimina una retención
   * @param {string} depositId - ID del depósito
   * @param {string} retencionId - ID de la retención
   * @returns {Promise<boolean>} Resultado de la eliminación
   */
  async deleteRetencion(depositId, retencionId) {
    try {
      console.log(`🗑️ [LA PLATA] Eliminando retención ${retencionId} del depósito ${depositId}`)
      await apiClient.delete(`/deposits/${depositId}/retenciones/${retencionId}`)
      console.log(`✅ [LA PLATA] Retención eliminada exitosamente`)
      return true
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al eliminar retención:`, error)
      throw error
    }
  },

  /**
   * Obtiene los detalles completos de un depósito (incluye cheques y retenciones)
   * @param {string} depositId - ID del depósito
   * @returns {Promise<Object>} Detalles completos del depósito
   */
  async getDepositDetails(depositId) {
    try {
      console.log(`📋 [LA PLATA] Obteniendo detalles completos para depósito ${depositId}`)
      const response = await apiClient.get(`/deposits/${depositId}/details`)
      console.log(`✅ [LA PLATA] Detalles obtenidos:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [LA PLATA] Error al obtener detalles del depósito:`, error)
      throw error
    }
  },

  /**
   * Actualiza un movimiento financiero
   * NOTA: Por ahora el backend solo soporta POST (crear), no PUT (actualizar)
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento actualizado
   */
  async updateMovimientoFinanciero(idReparto, movimientoData) {
    console.log(`⚠️ [LA PLATA] ADVERTENCIA: Backend no soporta PUT, redirigiendo a CREATE`)
    
    // Por ahora, redirigir a CREATE ya que el backend no soporta PUT
    return this.createMovimientoFinanciero(idReparto, movimientoData)
  },

  /**
   * Formatea la composición esperada en texto legible
   * @param {string} composicion - String con letras de composición (E, C, R)
   * @returns {string} Descripción formateada
   */
  formatearComposicionEsperada(composicion) {
    if (!composicion) return ''
    
    // Separar las letras con guiones: E - C - R
    return [...composicion].join(' - ')
  },

  /**
   * Función auxiliar para formatear composición - disponible dentro del contexto del objeto
   * @param {string} composicion - String con letras de composición (E, C, R)
   * @returns {string} Descripción formateada
   */
  _formatearComposicion(composicion) {
    if (!composicion) return ''
    
    // Separar las letras con guiones: E - C - R
    return [...composicion].join(' - ')
  }
}
