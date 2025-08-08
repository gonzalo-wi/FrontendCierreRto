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

export default {
  /**
   * Obtiene los repartos de Jumillano desde el nuevo endpoint del backend
   * @param {string} date - Fecha en formato YYYY-MM-DD (opcional, por defecto fecha actual)
   * @returns {Promise} 
   */
  async getRepartos(date = null) {
    try {
      // Convertir fecha al formato esperado por el nuevo endpoint (YYYY-MM-DD)
      const fechaConsulta = date ? this.convertToBackendDateFormat(date) : this.getTodayBackendFormat()
      
      console.log('🔍 [JUMILLANO] ============ INICIANDO LLAMADA A BACKEND ============')
      console.log('🔍 [JUMILLANO] Fecha recibida:', date)
      console.log('🔍 [JUMILLANO] Fecha convertida para backend:', fechaConsulta)
      console.log('🔍 [JUMILLANO] Fecha actual del sistema:', new Date().toLocaleString())
      console.log('🔍 [JUMILLANO] Fecha actual ISO:', new Date().toISOString())
      console.log('🔍 [JUMILLANO] URL completa:', `${API_BASE_URL}/deposits/db/by-plant?date=${fechaConsulta}`)
      
      // Usar el nuevo endpoint que devuelve datos estructurados por planta
      const response = await apiClient.get(`/deposits/db/by-plant?date=${fechaConsulta}`)
      
      console.log('✅ [JUMILLANO] Respuesta del backend recibida:', response.data)
      
      // Verificar que tenemos datos de jumillano
      if (!response.data || !response.data.plants || !response.data.plants.jumillano) {
        console.log('❌ [JUMILLANO] No se encontraron datos de Jumillano para la fecha:', fechaConsulta)
        return []
      }
      
      const jumillanoData = response.data.plants.jumillano
      console.log('📊 [JUMILLANO] Datos de Jumillano encontrados:', jumillanoData.count, 'depósitos totales')
      
      // Transformar los datos del nuevo formato al formato esperado por el frontend
      const repartos = await this.transformBackendDataToRepartos(jumillanoData, fechaConsulta)
      
      console.log('📊 [JUMILLANO] Repartos transformados:', repartos.length, 'repartos encontrados')
      
      return repartos
    } catch (error) {
      console.error('❌ [JUMILLANO] Error detallado al obtener repartos:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      })
      throw error
    }
  },

  /**
   * Convierte fecha de MM-DD-YYYY a YYYY-MM-DD
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {string} Fecha en formato YYYY-MM-DD
   */
  convertToBackendDateFormat(date) {
    if (!date) {
      console.log('📅 [FECHA] No se proporcionó fecha, usando fecha actual')
      return this.getTodayBackendFormat()
    }
    
    console.log('📅 [FECHA] Convirtiendo fecha:', date)
    
    // Si ya está en formato YYYY-MM-DD, devolverlo tal como está
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log('📅 [FECHA] Fecha ya está en formato YYYY-MM-DD:', date)
      return date
    }
    
    // Convertir de MM-DD-YYYY a YYYY-MM-DD
    const [month, day, year] = date.split('-')
    const fechaConvertida = `${year}-${month}-${day}`
    
    console.log('📅 [FECHA] Fecha convertida de MM-DD-YYYY a YYYY-MM-DD:', {
      original: date,
      convertida: fechaConvertida
    })
    
    return fechaConvertida
  },

  /**
   * Obtiene la fecha de hoy en formato YYYY-MM-DD (usando zona horaria local)
   * @returns {string} Fecha de hoy
   */
  getTodayBackendFormat() {
    // Usar el método que maneja correctamente la zona horaria
    return this.getTodayLocalBackendFormat()
  },

  /**
   * Obtiene la fecha actual ajustada para zona horaria local (evita problemas de UTC)
   * @returns {string} Fecha en formato YYYY-MM-DD
   */
  getTodayLocalBackendFormat() {
    // Crear fecha con offset de zona horaria para evitar problemas de UTC
    const now = new Date()
    const timezoneOffset = now.getTimezoneOffset() * 60000 // Convertir a milisegundos
    const localDate = new Date(now.getTime() - timezoneOffset)
    
    // Obtener componentes de la fecha local
    const year = localDate.getUTCFullYear()
    const month = String(localDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(localDate.getUTCDate()).padStart(2, '0')
    
    const fechaFormateada = `${year}-${month}-${day}`
    
    console.log('📅 [FECHA_LOCAL] Generando fecha ajustada por zona horaria:', {
      fechaOriginal: now.toString(),
      timezoneOffset: now.getTimezoneOffset(),
      fechaAjustada: localDate.toISOString(),
      fechaFormateadaFinal: fechaFormateada
    })
    
    return fechaFormateada
  },

  /**
   * Transforma los datos del nuevo backend al formato esperado por el frontend
   * @param {Object} jumillanoData - Datos de Jumillano del backend
   * @param {string} fecha - Fecha de consulta
   * @returns {Array} Array de repartos transformados
   */
  async transformBackendDataToRepartos(jumillanoData, fecha) {
    const repartos = []
    
    // Verificar que tenemos depósitos
    if (!jumillanoData.deposits || !Array.isArray(jumillanoData.deposits)) {
      console.log('❌ [JUMILLANO] No hay depósitos en los datos')
      return repartos
    }
    
    // Agrupar depósitos por número de reparto
    const repartosPorNumero = {}
    
    jumillanoData.deposits.forEach(deposit => {
      // Extraer número de reparto
      let numeroReparto = null
      
      if (deposit.numero_reparto) {
        numeroReparto = deposit.numero_reparto
      } else if (deposit.user_name) {
        // Extraer número de reparto del user_name (ej: "39, RTO 039" -> "039")
        const userNameMatch = deposit.user_name.match(/RTO\s+(\d+)/)
        numeroReparto = userNameMatch ? userNameMatch[1] : null
      }
      
      if (!numeroReparto) {
        console.warn('⚠️ [JUMILLANO] No se pudo extraer número de reparto de:', deposit)
        return
      }
      
      const repartoKey = `RTO ${numeroReparto}` // Formato "RTO 039"
      
      if (!repartosPorNumero[repartoKey]) {
        repartosPorNumero[repartoKey] = {
          id: `jumillano-${numeroReparto}`,
          idReparto: repartoKey,
          fechaReparto: fecha,
          numeroReparto: numeroReparto,
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
      
      // El estado del reparto será determinado por la lógica del frontend
      repartosPorNumero[repartoKey].estado = deposit.estado || 'PENDIENTE'
      
      // Agregar información adicional del backend
      const depositInfo = {
        ...deposit,
        tieneDiferencia: deposit.tiene_diferencia || false,
        composicionEsperado: deposit.composicion_esperado || '',
        // Debug: Asegurar que tenemos el ID correcto
        depositId: deposit.id || deposit.deposit_id || deposit.identifier || 'NO_ID'
      }
      
      console.log('🔍 [JUMILLANO] Información del depósito:', {
        id: deposit.id,
        deposit_id: deposit.deposit_id,
        identifier: deposit.identifier,
        depositIdFinal: depositInfo.depositId,
        amount: amount,
        diferencia: diferencia
      })
      
      repartosPorNumero[repartoKey].deposits.push(depositInfo)
    })
    
    // Convertir a array y calcular estados finales
    const repartosFinales = []
    
    for (const reparto of Object.values(repartosPorNumero)) {
      // Determinar el estado final del reparto basado en todos sus depósitos
      const estadosDepositos = reparto.deposits.map(d => d.estado)
      const tieneDiferencias = reparto.deposits.some(d => d.tiene_diferencia)
      
      // Lógica para determinar el estado del reparto
      if (estadosDepositos.every(estado => estado === 'LISTO')) {
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
      reparto.composicionEsperadoDescripción = this._formatearComposicion(reparto.composicionEsperado)
      
      // Cargar cheques y retenciones de los datos que ya vienen en cada depósito (nueva estructura del backend)
      try {
        console.log(`🔍 [JUMILLANO] Cargando movimientos para reparto ${reparto.idReparto}`)
        let montoTotalMovimientos = 0
        let totalCheques = 0
        let totalRetenciones = 0
        
        // Inicializar arrays de movimientos en el reparto
        reparto.cheques = []
        reparto.retenciones = []
        
        // Debug específico para RTO 007
        if (reparto.idReparto && reparto.idReparto.includes('007')) {
          console.log(`🔍 [JUMI] ============ DEBUG RTO 007 ============`)
          console.log(`🔍 [JUMI] Reparto completo:`, reparto)
          console.log(`🔍 [JUMI] Depósitos en el reparto:`, reparto.deposits)
          console.log(`🔍 [JUMI] Fecha de consulta: ${fecha}`)
        }

        // Para cada depósito del reparto, usar los cheques y retenciones que ya vienen en el depósito
        for (const deposit of reparto.deposits) {
          const depositId = deposit.depositId || deposit.deposit_id || deposit.id || deposit.identifier
          
          // Debug específico para RTO 007
          if (reparto.idReparto && reparto.idReparto.includes('007')) {
            console.log(`🔍 [JUMI] ============ PROCESANDO DEPÓSITO RTO 007 ============`)
            console.log(`🔍 [JUMI] Depósito:`, deposit)
            console.log(`🔍 [JUMI] Deposit ID extraído: ${depositId}`)
            console.log(`🔍 [JUMI] Cheques en depósito:`, deposit.cheques)
            console.log(`🔍 [JUMI] Retenciones en depósito:`, deposit.retenciones)
            console.log(`🔍 [JUMI] Total cheques del depósito: ${deposit.total_cheques || 0}`)
            console.log(`🔍 [JUMI] Total retenciones del depósito: ${deposit.total_retenciones || 0}`)
          }
          
          // Obtener cheques directamente del depósito (ya vienen en la respuesta principal)
          if (deposit.cheques && Array.isArray(deposit.cheques) && deposit.cheques.length > 0) {
            reparto.cheques.push(...deposit.cheques)
            const montoCheques = deposit.cheques.reduce((total, cheque) => {
              return total + parseFloat(cheque.importe || cheque.monto || 0)
            }, 0)
            montoTotalMovimientos += montoCheques
            totalCheques += deposit.cheques.length
            console.log(`💰 [JUMI] Depósito ${depositId}: ${deposit.cheques.length} cheques por $${montoCheques} (desde respuesta principal)`)
          }
          
          // Obtener retenciones directamente del depósito (ya vienen en la respuesta principal)
          if (deposit.retenciones && Array.isArray(deposit.retenciones) && deposit.retenciones.length > 0) {
            reparto.retenciones.push(...deposit.retenciones)
            const montoRetenciones = deposit.retenciones.reduce((total, retencion) => {
              return total + parseFloat(retencion.importe || retencion.monto || 0)
            }, 0)
            montoTotalMovimientos += montoRetenciones
            totalRetenciones += deposit.retenciones.length
            console.log(`💰 [JUMI] Depósito ${depositId}: ${deposit.retenciones.length} retenciones por $${montoRetenciones} (desde respuesta principal)`)
          }
        }
        
        // Si hay movimientos, crear el movimiento financiero principal del reparto
        if (totalCheques > 0 || totalRetenciones > 0) {
          reparto.movimientoFinanciero = {
            tipo: 'MIXTO',
            totalCheques: totalCheques,
            totalRetenciones: totalRetenciones,
            montoTotal: montoTotalMovimientos,
            cheques: reparto.cheques,
            retenciones: reparto.retenciones
          }
          
          // Sumar los movimientos al cobrado real
          reparto.depositoReal += montoTotalMovimientos
          
          // Recalcular la diferencia
          reparto.diferencia = reparto.depositoReal - reparto.depositoEsperado
          
          console.log(`💰 [JUMILLANO] Reparto ${reparto.idReparto}:`, {
            cheques: totalCheques,
            retenciones: totalRetenciones,
            montoTotal: montoTotalMovimientos,
            depositoRealActualizado: reparto.depositoReal,
            nuevaDiferencia: reparto.diferencia
          })
        }
      } catch (error) {
        console.warn(`⚠️ [JUMILLANO] Error cargando movimientos para ${reparto.idReparto}:`, error)
        // Continuar sin los movimientos si hay error
        reparto.cheques = []
        reparto.retenciones = []
      }
      
      repartosFinales.push(reparto)
    }
    
    console.log('🔧 [JUMILLANO] Datos transformados:', repartosFinales)
    return repartosFinales
  },

  /**
   * Obtiene un reparto específico de Jumillano
   * @param {string} idReparto 
   * @returns {Promise} 
   */
  async getRepartoById(idReparto) {
    try {
      const response = await apiClient.get(`/repartos/jumillano/${idReparto}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Actualiza un reparto de Jumillano
   * @param {string} idReparto 
   * @param {Object} repartoData 
   * @returns {Promise} 
   */
  async updateReparto(idReparto, repartoData) {
    try {
      const response = await apiClient.put(`/repartos/jumillano/${idReparto}`, repartoData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Crea un nuevo reparto de Jumillano
   * @param {Object} repartoData - Datos del nuevo reparto
   * @returns {Promise} Promesa con el reparto creado
   */
  async createReparto(repartoData) {
    try {
      const response = await apiClient.post('/repartos/jumillano', repartoData)
      return response.data
    } catch (error) {
      console.error('Error al crear reparto de Jumillano:', error)
      throw error
    }
  },

  /**
   * Elimina un reparto de Jumillano
   * @param {string} idReparto - ID del reparto a eliminar
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteReparto(idReparto) {
    try {
      const response = await apiClient.delete(`/repartos/jumillano/${idReparto}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Obtiene repartos de Jumillano filtrados por fecha
   * @param {string} fecha 
   * @returns {Promise} 
   */
  async getRepartosByFecha(fecha) {
    try {
      const response = await apiClient.get(`/repartos/jumillano?fecha=${fecha}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener repartos de Jumillano por fecha ${fecha}:`, error)
      throw error
    }
  },

  /**
   * Crea un movimiento financiero para un reparto de Jumillano
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento creado
   */
  async createMovimientoFinanciero(idReparto, movimientoData) {
    try {
      console.log(`📤 [JUMI] Creando movimiento financiero:`, movimientoData)
      
      // Usar el endpoint correcto que espera tu backend
      const response = await apiClient.post('/movimientos-financieros', movimientoData)
      
      console.log(`✅ [JUMI] Movimiento creado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al crear movimiento financiero:`, error)
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
      console.log(`📋 [JUMI] ============ OBTENIENDO CHEQUES ============`)
      console.log(`📋 [JUMI] Depósito ID: ${depositId}`)
      console.log(`📋 [JUMI] URL completa: ${API_BASE_URL}/deposits/${depositId}/cheques`)
      
      const response = await apiClient.get(`/deposits/${depositId}/cheques`)
      
      console.log(`✅ [JUMI] Respuesta recibida:`)
      console.log(`📊 [JUMI] Status: ${response.status}`)
      console.log(`📊 [JUMI] Data:`, response.data)
      console.log(`📊 [JUMI] Cantidad de cheques: ${response.data?.length || 0}`)
      
      return response.data || []
    } catch (error) {
      console.error(`❌ [JUMI] ============ ERROR OBTENIENDO CHEQUES ============`)
      console.error(`❌ [JUMI] Depósito ID: ${depositId}`)
      console.error(`❌ [JUMI] URL: ${API_BASE_URL}/deposits/${depositId}/cheques`)
      console.error(`❌ [JUMI] Status: ${error.response?.status}`)
      console.error(`❌ [JUMI] Status Text: ${error.response?.statusText}`)
      console.error(`❌ [JUMI] Response Data:`, error.response?.data)
      console.error(`❌ [JUMI] Error completo:`, error)
      
      // Re-lanzar el error para que sea manejado por el catch específico en transformBackendDataToRepartos
      throw error
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
      console.log(`📤 [JUMI] Creando cheque para depósito ${depositId}:`, chequeData)
      const response = await apiClient.post(`/deposits/${depositId}/cheques`, chequeData)
      console.log(`✅ [JUMI] Cheque creado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al crear cheque:`, error)
      console.error(`❌ [JUMI] Detalles del error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      console.error(`❌ [JUMI] Datos enviados:`, chequeData)
      console.error(`❌ [JUMI] URL del endpoint:`, `/deposits/${depositId}/cheques`)
      
      // Si el backend devuelve información de validación, mostrarla
      if (error.response?.data?.detail) {
        console.error(`❌ [JUMI] Mensaje del backend:`, error.response.data.detail)
      }
      
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
      console.log(`📝 [JUMI] Actualizando cheque ${chequeId} del depósito ${depositId}:`, chequeData)
      const response = await apiClient.put(`/deposits/${depositId}/cheques/${chequeId}`, chequeData)
      console.log(`✅ [JUMI] Cheque actualizado exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al actualizar cheque:`, error)
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
      console.log(`🗑️ [JUMI] Eliminando cheque ${chequeId} del depósito ${depositId}`)
      await apiClient.delete(`/deposits/${depositId}/cheques/${chequeId}`)
      console.log(`✅ [JUMI] Cheque eliminado exitosamente`)
      return true
    } catch (error) {
      console.error(`❌ [JUMI] Error al eliminar cheque:`, error)
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
      console.log(`📋 [JUMI] ============ OBTENIENDO RETENCIONES ============`)
      console.log(`📋 [JUMI] Depósito ID: ${depositId}`)
      console.log(`📋 [JUMI] URL completa: ${API_BASE_URL}/deposits/${depositId}/retenciones`)
      
      const response = await apiClient.get(`/deposits/${depositId}/retenciones`)
      
      console.log(`✅ [JUMI] Respuesta recibida:`)
      console.log(`📊 [JUMI] Status: ${response.status}`)
      console.log(`📊 [JUMI] Data:`, response.data)
      console.log(`📊 [JUMI] Cantidad de retenciones: ${response.data?.length || 0}`)
      
      return response.data || []
    } catch (error) {
      console.error(`❌ [JUMI] ============ ERROR OBTENIENDO RETENCIONES ============`)
      console.error(`❌ [JUMI] Depósito ID: ${depositId}`)
      console.error(`❌ [JUMI] URL: ${API_BASE_URL}/deposits/${depositId}/retenciones`)
      console.error(`❌ [JUMI] Status: ${error.response?.status}`)
      console.error(`❌ [JUMI] Status Text: ${error.response?.statusText}`)
      console.error(`❌ [JUMI] Response Data:`, error.response?.data)
      console.error(`❌ [JUMI] Error completo:`, error)
      
      // Re-lanzar el error para que sea manejado por el catch específico en transformBackendDataToRepartos
      throw error
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
      console.log(`📤 [JUMI] Creando retención para depósito ${depositId}:`, retencionData)
      const response = await apiClient.post(`/deposits/${depositId}/retenciones`, retencionData)
      console.log(`✅ [JUMI] Retención creada exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al crear retención:`, error)
      console.error(`❌ [JUMI] Detalles del error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      console.error(`❌ [JUMI] Datos enviados:`, retencionData)
      console.error(`❌ [JUMI] URL del endpoint:`, `/deposits/${depositId}/retenciones`)
      
      // Si el backend devuelve información de validación, mostrarla
      if (error.response?.data?.detail) {
        console.error(`❌ [JUMI] Mensaje del backend:`, error.response.data.detail)
      }
      
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
      console.log(`📝 [JUMI] Actualizando retención ${retencionId} del depósito ${depositId}:`, retencionData)
      const response = await apiClient.put(`/deposits/${depositId}/retenciones/${retencionId}`, retencionData)
      console.log(`✅ [JUMI] Retención actualizada exitosamente:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al actualizar retención:`, error)
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
      console.log(`🗑️ [JUMI] Eliminando retención ${retencionId} del depósito ${depositId}`)
      await apiClient.delete(`/deposits/${depositId}/retenciones/${retencionId}`)
      console.log(`✅ [JUMI] Retención eliminada exitosamente`)
      return true
    } catch (error) {
      console.error(`❌ [JUMI] Error al eliminar retención:`, error)
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
      console.log(`📋 [JUMI] Obteniendo detalles completos para depósito ${depositId}`)
      const response = await apiClient.get(`/deposits/${depositId}/details`)
      console.log(`✅ [JUMI] Detalles obtenidos:`, response.data)
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] Error al obtener detalles del depósito:`, error)
      throw error
    }
  },

  /**
   * Actualiza un movimiento financiero de un reparto de Jumillano
   * NOTA: Por ahora el backend solo soporta POST (crear), no PUT (actualizar)
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento actualizado
   */
  async updateMovimientoFinanciero(idReparto, movimientoData) {
    console.log(`⚠️ [JUMI] ADVERTENCIA: Backend no soporta PUT, redirigiendo a CREATE`)
    
    // Por ahora, redirigir a CREATE ya que el backend no soporta PUT
    return this.createMovimientoFinanciero(idReparto, movimientoData)
  },

  /**
   * Elimina un cheque específico usando el nuevo endpoint simplificado
   * @param {string} depositId - ID del depósito
   * @param {string} numeroCheque - Número del cheque a eliminar
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteCheque(depositId, numeroCheque) {
    try {
      console.log(`🗑️ [JUMI] ============ ELIMINANDO CHEQUE ============`)
      console.log(`🗑️ [JUMI] Depósito ID: ${depositId}`)
      console.log(`🗑️ [JUMI] Cheque N°: ${numeroCheque}`)
      console.log(`🗑️ [JUMI] Base URL: ${apiClient.defaults.baseURL}`)
      console.log(`🗑️ [JUMI] URL relativa: /deposits/${depositId}/cheques/${numeroCheque}`)
      console.log(`🗑️ [JUMI] URL completa: ${API_BASE_URL}/deposits/${depositId}/cheques/${numeroCheque}`)
      console.log(`🗑️ [JUMI] Método: DELETE`)
      console.log(`🗑️ [JUMI] Headers:`, apiClient.defaults.headers)
      
      // Verificar parámetros antes de enviar
      if (!depositId || !numeroCheque) {
        throw new Error(`Parámetros faltantes - depositId: ${depositId}, numeroCheque: ${numeroCheque}`)
      }
      
      const response = await apiClient.delete(`/deposits/${depositId}/cheques/${numeroCheque}`)
      
      console.log(`✅ [JUMI] Cheque eliminado exitosamente:`, response.data)
      console.log(`📊 [JUMI] Status: ${response.status}`)
      
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] ============ ERROR ELIMINANDO CHEQUE ============`)
      console.error(`❌ [JUMI] Depósito ID: ${depositId}`)
      console.error(`❌ [JUMI] Cheque N°: ${numeroCheque}`)
      console.error(`❌ [JUMI] URL: DELETE ${API_BASE_URL}/deposits/${depositId}/cheques/${numeroCheque}`)
      console.error(`❌ [JUMI] Status: ${error.response?.status}`)
      console.error(`❌ [JUMI] Status Text: ${error.response?.statusText}`)
      console.error(`❌ [JUMI] Response Data:`, error.response?.data)
      
      // Si el backend devuelve información de error, mostrarla detalladamente
      if (error.response?.data?.detail) {
        console.error(`❌ [JUMI] Detalles del error del backend:`)
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach((detail, index) => {
            console.error(`❌ [JUMI] Error ${index + 1}:`, detail)
            // Mostrar específicamente el campo que falta
            if (detail.loc && Array.isArray(detail.loc)) {
              console.error(`❌ [JUMI] Campo faltante: '${detail.loc.join('.')}'`)
            }
            if (detail.type === 'missing') {
              console.error(`❌ [JUMI] ⚠️  CAMPO REQUERIDO FALTANTE ⚠️`)
            }
          })
        } else {
          console.error(`❌ [JUMI] Mensaje del backend:`, error.response.data.detail)
        }
      }
      
      console.error(`❌ [JUMI] Error completo:`, error)
      
      throw error
    }
  },

  /**
   * Elimina una retención específica usando el nuevo endpoint simplificado
   * @param {string} depositId - ID del depósito
   * @param {string} numeroRetencion - Número de la retención a eliminar
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteRetencion(depositId, numeroRetencion) {
    try {
      console.log(`🗑️ [JUMI] ============ ELIMINANDO RETENCIÓN ============`)
      console.log(`🗑️ [JUMI] Depósito ID: ${depositId}`)
      console.log(`🗑️ [JUMI] Retención N°: ${numeroRetencion}`)
      console.log(`🗑️ [JUMI] Base URL: ${apiClient.defaults.baseURL}`)
      console.log(`🗑️ [JUMI] URL relativa: /deposits/${depositId}/retenciones/${numeroRetencion}`)
      console.log(`🗑️ [JUMI] URL completa: ${API_BASE_URL}/deposits/${depositId}/retenciones/${numeroRetencion}`)
      console.log(`🗑️ [JUMI] Método: DELETE`)
      console.log(`🗑️ [JUMI] Headers:`, apiClient.defaults.headers)
      
      // Verificar parámetros antes de enviar
      if (!depositId || !numeroRetencion) {
        throw new Error(`Parámetros faltantes - depositId: ${depositId}, numeroRetencion: ${numeroRetencion}`)
      }
      
      const response = await apiClient.delete(`/deposits/${depositId}/retenciones/${numeroRetencion}`)
      
      console.log(`✅ [JUMI] Retención eliminada exitosamente:`, response.data)
      console.log(`📊 [JUMI] Status: ${response.status}`)
      
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] ============ ERROR ELIMINANDO RETENCIÓN ============`)
      console.error(`❌ [JUMI] Depósito ID: ${depositId}`)
      console.error(`❌ [JUMI] Retención N°: ${numeroRetencion}`)
      console.error(`❌ [JUMI] URL: DELETE ${API_BASE_URL}/deposits/${depositId}/retenciones/${numeroRetencion}`)
      console.error(`❌ [JUMI] Status: ${error.response?.status}`)
      console.error(`❌ [JUMI] Status Text: ${error.response?.statusText}`)
      console.error(`❌ [JUMI] Response Data:`, error.response?.data)
      
      // Si el backend devuelve información de error, mostrarla detalladamente
      if (error.response?.data?.detail) {
        console.error(`❌ [JUMI] Detalles del error del backend:`)
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach((detail, index) => {
            console.error(`❌ [JUMI] Error ${index + 1}:`, detail)
            // Mostrar específicamente el campo que falta
            if (detail.loc && Array.isArray(detail.loc)) {
              console.error(`❌ [JUMI] Campo faltante: '${detail.loc.join('.')}'`)
            }
            if (detail.type === 'missing') {
              console.error(`❌ [JUMI] ⚠️  CAMPO REQUERIDO FALTANTE ⚠️`)
            }
          })
        } else {
          console.error(`❌ [JUMI] Mensaje del backend:`, error.response.data.detail)
        }
      }
      
      console.error(`❌ [JUMI] Error completo:`, error)
      
      throw error
    }
  },

  /**
   * Elimina un movimiento financiero usando el endpoint original (DEPRECATED - usar deleteCheque o deleteRetencion)
   * @param {string} depositId - ID del depósito
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteMovimientoFinanciero(depositId) {
    try {
      console.log(`🗑️ [JUMI] ============ ELIMINANDO TODOS LOS MOVIMIENTOS ============`)
      console.log(`🗑️ [JUMI] Depósito ID: ${depositId}`)
      console.log(`🗑️ [JUMI] URL: DELETE ${API_BASE_URL}/deposits/${depositId}/movimiento`)
      
      // Petición DELETE simple sin payload - el backend elimina todos los movimientos del depósito
      const response = await apiClient.delete(`/deposits/${depositId}/movimiento`)
      
      console.log(`✅ [JUMI] Todos los movimientos eliminados exitosamente:`, response.data)
      console.log(`📊 [JUMI] Status: ${response.status}`)
      
      return response.data
    } catch (error) {
      console.error(`❌ [JUMI] ============ ERROR ELIMINANDO MOVIMIENTO ============`)
      console.error(`❌ [JUMI] Depósito ID: ${depositId}`)
      console.error(`❌ [JUMI] URL: DELETE ${API_BASE_URL}/deposits/${depositId}/movimiento`)
      console.error(`❌ [JUMI] Status: ${error.response?.status}`)
      console.error(`❌ [JUMI] Status Text: ${error.response?.statusText}`)
      console.error(`❌ [JUMI] Response Data:`, error.response?.data)
      
      // Si el backend devuelve información de error, mostrarla detalladamente
      if (error.response?.data?.detail) {
        console.error(`❌ [JUMI] Detalles del error del backend:`)
        if (Array.isArray(error.response.data.detail)) {
          error.response.data.detail.forEach((detail, index) => {
            console.error(`❌ [JUMI] Error ${index + 1}:`, detail)
            // Mostrar específicamente el campo que falta
            if (detail.loc && Array.isArray(detail.loc)) {
              console.error(`❌ [JUMI] Campo faltante: '${detail.loc.join('.')}'`)
            }
            if (detail.type === 'missing') {
              console.error(`❌ [JUMI] ⚠️  CAMPO REQUERIDO FALTANTE ⚠️`)
            }
          })
        } else {
          console.error(`❌ [JUMI] Mensaje del backend:`, error.response.data.detail)
        }
      }
      
      console.error(`❌ [JUMI] Error completo:`, error)
      
      throw error
    }
  },

  /**
   * Obtiene los montos esperados para los repartos (esto podría venir de otro endpoint)
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise} 
   */
  async getMontoEsperadoPorReparto(date) {
    try {
      // Por ahora retornar valores simulados por reparto, esto debería venir de otro endpoint
      // TODO: Implementar endpoint real para montos esperados
      console.log('📋 [JUMILLANO] Obteniendo montos esperados para fecha:', date)
      
      // Montos esperados simulados basados en los RTOs reales de la API
      const montosEsperados = {
        'RTO 001': 450000,
        'RTO 002': 320000,
        'RTO 003': 480000,
        'RTO 004': 475000,
        'RTO 005': 455000,
        'RTO 006': 700000,
        'RTO 007': 520000,
        'RTO 008': 340000,
        'RTO 009': 490000,
        'RTO 010': 430000,
        'RTO 011': 715000,
        'RTO 012': 485000,
        'RTO 013': 380000,
        'RTO 014': 535000,
        'RTO 015': 515000,
        'RTO 016': 350000,
        'RTO 017': 540000,
        'RTO 018': 365000,
        'RTO 019': 655000,
        'RTO 020': 225000,
        'RTO 021': 405000,
        'RTO 022': 435000,
        'RTO 023': 565000,
        'RTO 024': 585000,
        'RTO 025': 370000,
        'RTO 026': 420000,
        'RTO 027': 445000,
        'RTO 028': 390000,
        'RTO 029': 400000,
        'RTO 030': 430000,
        'RTO 031': 795000,
        'RTO 032': 410000,
        'RTO 033': 370000,
        'RTO 034': 665000,
        'RTO 035': 440000,
        'RTO 036': 765000,
        'RTO 037': 365000,
        'RTO 038': 385000,
        'RTO 039': 380000,
        'RTO 040': 630000,
        'RTO 041': 230000,
        'RTO 042': 410000,
        'RTO 043': 675000,
        'RTO 044': 590000,
        'RTO 045': 345000,
        'RTO 046': 400000,
        'RTO 047': 460000,
        'RTO 048': 595000,
        'RTO 049': 615000,
        'RTO 050': 245000,
        'RTO 051': 370000,
        'RTO 052': 235000,
        'RTO 053': 555000,
        'RTO 054': 455000,
        'RTO 055': 565000,
        'RTO 056': 1090000,
        'RTO 057': 605000,
        'RTO 058': 485000,
        'RTO 059': 810000,
        'RTO 060': 715000,
        'RTO 061': 320000,
        'RTO 062': 225000,
        'RTO 063': 610000,
        'RTO 064': 260000,
        'RTO 065': 200000,
        'RTO 066': 345000,
        'RTO 067': 995000,
        'RTO 068': 4000,
        'RTO 069': 325000,
        'RTO 070': 205000,
        'RTO 071': 280000,
        'RTO 072': 415000,
        'RTO 073': 415000,
        'RTO 074': 430000,
        'RTO 075': 175000,
        'RTO 076': 510000,
        'RTO 077': 335000,
        'RTO 078': 290000,
        'RTO 079': 705000,
        'RTO 080': 480000,
        'RTO 081': 230000,
        'RTO 082': 255000,
        'RTO 083': 595000,
        'RTO 084': 695000,
        'RTO 085': 435000,
        'RTO 087': 700000,
        'RTO 089': 415000,
        'RTO 090': 600000,
        'RTO 091': 640000,
        'RTO 092': 400000,
        'RTO 093': 375000,
        'RTO 094': 335000,
        'RTO 095': 615000,
        'RTO 096': 590000,
        'RTO 097': 375000,
        'RTO 098': 495000,
        'RTO 099': 445000,
        'RTO 100': 355000,
        'RTO 101': 385000,
        'RTO 102': 350000,
        'RTO 104': 305000,
        'RTO 105': 200000,
        'RTO 106': 325000,
        'RTO 107': 190000,
        'RTO 109': 420000,
        'RTO 110': 175000,
        'RTO 111': 480000,
        'RTO 112': 215000,
        'RTO 114': 315000,
        'RTO 115': 265000,
        'RTO 116': 200000,
        'RTO 117': 275000,
        'RTO 118': 180000,
        'RTO 119': 185000,
        'RTO 120': 425000,
        'RTO 121': 140000,
        'RTO 122': 185000,
        'RTO 157': 35000,
        'RTO 158': 70000,
        'RTO 159': 15000,
        'RTO 163': 120000,
        'RTO 164': 30000,
        'RTO 170': 160000,
        'RTO 171': 490000,
        'RTO 172': 285000,
        'RTO 173': 320000,
        'RTO 174': 12000,
        'RTO 176': 390000
      }
      
      console.log('✅ [JUMILLANO] Montos esperados obtenidos para', Object.keys(montosEsperados).length, 'RTOs')
      
      return montosEsperados
    } catch (error) {
      console.error('❌ [JUMILLANO] Error al obtener montos esperados:', error)
      return {}
    }
  },

  /**
   * Obtiene los repartos con montos esperados incluidos
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise} 
   */
  async getRepartosCompletos(date = null) {
    try {
      const fechaConsulta = date || this.getTodayBackendFormat()
      
      const [repartos, montosEsperados] = await Promise.all([
        this.getRepartos(fechaConsulta),
        this.getMontoEsperadoPorReparto(fechaConsulta)
      ])
      
      // Asignar montos esperados a cada reparto
      return repartos.map(reparto => ({
        ...reparto,
        depositoEsperado: montosEsperados[reparto.idReparto] || 0,
        diferencia: reparto.depositoReal - (montosEsperados[reparto.idReparto] || 0),
        estado: this.calcularEstado(reparto.depositoReal, montosEsperados[reparto.idReparto] || 0)
      }))
    } catch (error) {
      console.error('❌ [JUMILLANO] Error al obtener repartos completos:', error)
      throw error
    }
  },

  /**
   * Calcula el estado basado en la diferencia
   * @param {number} real - Monto real
   * @param {number} esperado - Monto esperado
   * @returns {string} Estado del reparto
   */
  calcularEstado(real, esperado) {
    const diferencia = real - esperado
    if (diferencia === 0) return 'EXACTO'
    if (diferencia > 0) return 'SOBRANTE'
    return 'FALTANTE'
  },

  /**
   * Fallback a API antigua cuando el nuevo backend no tiene datos
   * @param {string} date - Fecha en formato YYYY-MM-DD o MM-DD-YYYY
   * @returns {Promise<Array>} Array de repartos (vacío por ahora)
   */
  async getRepartosFromOldAPI(date = null) {
    console.log('🔄 [JUMILLANO] Ejecutando fallback a API antigua...')
    console.log('⚠️ [JUMILLANO] API antigua no implementada aún - devolviendo array vacío')
    
    // TODO: Implementar llamada a la API antigua de Jumillano cuando esté disponible
    // Por ahora devolver array vacío
    return []
  },

  /**
   * Obtiene los estados disponibles para depósitos
   * @returns {Promise<Array>} Lista de estados disponibles
   */
  async getEstadosDisponibles() {
    try {
      console.log('📋 [JUMILLANO] Obteniendo estados disponibles...')
      const response = await apiClient.get('/deposits/states')
      console.log('✅ [JUMILLANO] Estados disponibles:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [JUMILLANO] Error al obtener estados:', error)
      // Fallback a estados por defecto que acepta el backend
      const estadosDefault = [
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'LISTO', label: 'LISTO' }
      ]
      console.log('🔄 [JUMILLANO] Usando estados fallback:', estadosDefault)
      return estadosDefault
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
      console.log(`🔄 [JUMILLANO] Cambiando estado de depósito ${depositId} a ${nuevoEstado}`)
      
      const requestBody = {
        status: nuevoEstado
      }
      
      console.log('📤 [JUMILLANO] Enviando request:', {
        url: `/deposits/${depositId}/status`,
        method: 'PUT',
        body: requestBody
      })
      
      const response = await apiClient.put(`/deposits/${depositId}/status`, requestBody)
      
      console.log('✅ [JUMILLANO] Estado cambiado exitosamente:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ [JUMILLANO] Error al cambiar estado:', error)
      console.error('❌ [JUMILLANO] Detalles del error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      
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
      console.log(`🔄 [JUMILLANO] Cambiando estado de todos los depósitos del reparto ${reparto.idReparto} a ${nuevoEstado}`)
      console.log('🔍 [JUMILLANO] Depósitos en el reparto:', reparto.deposits)
      
      const cambios = []
      
      for (const deposit of reparto.deposits) {
        try {
          // Intentar diferentes campos que podrían contener el ID
          let depositId = deposit.deposit_id || deposit.id || deposit.identifier || deposit.deposit_identifier
          
          console.log('🔍 [JUMILLANO] Procesando depósito:', {
            depositKeys: Object.keys(deposit),
            deposit_id: deposit.deposit_id,
            id: deposit.id,
            identifier: deposit.identifier,
            depositId: depositId
          })
          
          if (!depositId) {
            console.error('❌ [JUMILLANO] No se encontró ID válido para el depósito:', deposit)
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
      console.log(`✅ [JUMILLANO] Estados cambiados: ${exitosos}/${cambios.length} depósitos`)
      console.log('📊 [JUMILLANO] Detalles de cambios:', cambios)
      
      return cambios
    } catch (error) {
      console.error('❌ [JUMILLANO] Error al cambiar estado del reparto:', error)
      throw error
    }
  },

  /**
   * Función de debug para verificar las fechas del sistema
   * @returns {Object} Información detallada de fechas
   */
  debugFechas() {
    const ahora = new Date()
    const info = {
      fechaCompleta: ahora.toString(),
      fechaISO: ahora.toISOString(),
      fechaLocal: ahora.toLocaleDateString(),
      fechaLocalCompleta: ahora.toLocaleString(),
      horaLocal: ahora.toLocaleTimeString(),
      timezoneOffset: ahora.getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      fechaBackend: this.getTodayBackendFormat(),
      año: ahora.getFullYear(),
      mes: ahora.getMonth() + 1,
      día: ahora.getDate(),
      hora: ahora.getHours(),
      minutos: ahora.getMinutes()
    }
    
    console.table(info)
    return info
  },

  /**
   * Obtiene la fecha actual en formato de visualización del frontend
   * @returns {string} Fecha en formato DD/MM/YYYY
   */
  getTodayDisplayFormat() {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
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
