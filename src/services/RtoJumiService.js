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

export default {
  /**
   * Obtiene los repartos de Jumillano desde la API real
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional, por defecto 07-02-2025)
   * @returns {Promise} 
   */
  async getRepartos(date = null) {
    try {
      // Si no se proporciona fecha, usar una fecha específica con datos conocidos
      // Formato MM-DD-YYYY que espera la API
      const fechaConsulta = date || '07-02-2025'
      
      console.log('🔍 Consultando API de Jumillano para fecha:', fechaConsulta)
      
      const response = await apiClient.get(`/deposits/jumillano?date=${fechaConsulta}`)
      
      console.log('✅ Respuesta de API Jumillano recibida:', Object.keys(response.data).length, 'identificadores')
      
      // Transformar los datos de la API al formato esperado por el frontend
      const repartos = await this.transformApiDataToRepartos(response.data, fechaConsulta)
      
      console.log('📊 Repartos transformados:', repartos.length, 'repartos encontrados')
      
      return repartos
    } catch (error) {
      console.error('❌ Error al obtener repartos de Jumillano:', error)
      throw error
    }
  },

  /**
   * Transforma los datos de la API al formato esperado por el frontend
   * @param {Object} apiData - Datos de la API
   * @param {string} fecha - Fecha de consulta
   * @returns {Array} Array de repartos transformados
   */
  async transformApiDataToRepartos(apiData, fecha) {
    const repartos = []
    
    // Obtener montos esperados para esta fecha
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
      const response = await apiClient.post(`/repartos/jumillano/${idReparto}/movimiento`, movimientoData)
      return response.data
    } catch (error) {
      console.error(`Error al crear movimiento para reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Actualiza un movimiento financiero de un reparto de Jumillano
   * @param {string} idReparto - ID del reparto
   * @param {Object} movimientoData - Datos del movimiento financiero
   * @returns {Promise} Promesa con el movimiento actualizado
   */
  async updateMovimientoFinanciero(idReparto, movimientoData) {
    try {
      const response = await apiClient.put(`/repartos/jumillano/${idReparto}/movimiento`, movimientoData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar movimiento para reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Elimina un movimiento financiero de un reparto de Jumillano
   * @param {string} idReparto - ID del reparto
   * @returns {Promise} Promesa con la confirmación de eliminación
   */
  async deleteMovimientoFinanciero(idReparto) {
    try {
      const response = await apiClient.delete(`/repartos/jumillano/${idReparto}/movimiento`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar movimiento para reparto ${idReparto} de Jumillano:`, error)
      throw error
    }
  },

  /**
   * Obtiene los montos esperados para los repartos (esto podría venir de otro endpoint)
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {Promise} 
   */
  async getMontoEsperadoPorReparto(date) {
    try {
      // Por ahora retornar valores simulados por reparto, esto debería venir de otro endpoint
      // TODO: Implementar endpoint real para montos esperados
      console.log('📋 Obteniendo montos esperados para fecha:', date)
      
      // Montos esperados simulados basados en los RTOs reales de la API
      const montosEsperados = {
        'RTO-001': 450000,
        'RTO-002': 320000,
        'RTO-003': 480000,
        'RTO-004': 475000,
        'RTO-005': 455000,
        'RTO-006': 700000,
        'RTO-007': 520000,
        'RTO-008': 340000,
        'RTO-009': 490000,
        'RTO-010': 430000,
        'RTO-011': 715000,
        'RTO-012': 485000,
        'RTO-013': 380000,
        'RTO-014': 535000,
        'RTO-015': 515000,
        'RTO-016': 350000,
        'RTO-017': 540000,
        'RTO-018': 365000,
        'RTO-019': 655000,
        'RTO-020': 225000,
        'RTO-021': 405000,
        'RTO-022': 435000,
        'RTO-023': 565000,
        'RTO-024': 585000,
        'RTO-025': 370000,
        'RTO-026': 420000,
        'RTO-027': 445000,
        'RTO-028': 390000,
        'RTO-029': 400000,
        'RTO-030': 430000,
        'RTO-031': 795000,
        'RTO-032': 410000,
        'RTO-033': 370000,
        'RTO-034': 665000,
        'RTO-035': 440000,
        'RTO-036': 765000,
        'RTO-037': 365000,
        'RTO-038': 385000,
        'RTO-039': 380000,
        'RTO-040': 630000,
        'RTO-041': 230000,
        'RTO-042': 410000,
        'RTO-043': 675000,
        'RTO-044': 590000,
        'RTO-045': 345000,
        'RTO-046': 400000,
        'RTO-047': 460000,
        'RTO-048': 595000,
        'RTO-049': 615000,
        'RTO-050': 245000,
        'RTO-051': 370000,
        'RTO-052': 235000,
        'RTO-053': 555000,
        'RTO-054': 455000,
        'RTO-055': 565000,
        'RTO-056': 1090000,
        'RTO-057': 605000,
        'RTO-058': 485000,
        'RTO-059': 810000,
        'RTO-060': 715000,
        'RTO-061': 320000,
        'RTO-062': 225000,
        'RTO-063': 610000,
        'RTO-064': 260000,
        'RTO-065': 200000,
        'RTO-066': 345000,
        'RTO-067': 995000,
        'RTO-068': 4000,
        'RTO-069': 325000,
        'RTO-070': 205000,
        'RTO-071': 280000,
        'RTO-072': 415000,
        'RTO-073': 415000,
        'RTO-074': 430000,
        'RTO-075': 175000,
        'RTO-076': 510000,
        'RTO-077': 335000,
        'RTO-078': 290000,
        'RTO-079': 705000,
        'RTO-080': 480000,
        'RTO-081': 230000,
        'RTO-082': 255000,
        'RTO-083': 595000,
        'RTO-084': 695000,
        'RTO-085': 435000,
        'RTO-087': 700000,
        'RTO-089': 415000,
        'RTO-090': 600000,
        'RTO-091': 640000,
        'RTO-092': 400000,
        'RTO-093': 375000,
        'RTO-094': 335000,
        'RTO-095': 615000,
        'RTO-096': 590000,
        'RTO-097': 375000,
        'RTO-098': 495000,
        'RTO-099': 445000,
        'RTO-100': 355000,
        'RTO-101': 385000,
        'RTO-102': 350000,
        'RTO-104': 305000,
        'RTO-105': 200000,
        'RTO-106': 325000,
        'RTO-107': 190000,
        'RTO-109': 420000,
        'RTO-110': 175000,
        'RTO-111': 480000,
        'RTO-112': 215000,
        'RTO-114': 315000,
        'RTO-115': 265000,
        'RTO-116': 200000,
        'RTO-117': 275000,
        'RTO-118': 180000,
        'RTO-119': 185000,
        'RTO-120': 425000,
        'RTO-121': 140000,
        'RTO-122': 185000,
        'RTO-157': 35000,
        'RTO-158': 70000,
        'RTO-159': 15000,
        'RTO-163': 120000,
        'RTO-164': 30000,
        'RTO-170': 160000,
        'RTO-171': 490000,
        'RTO-172': 285000,
        'RTO-173': 320000,
        'RTO-174': 12000,
        'RTO-176': 390000
      }
      
      console.log('✅ Montos esperados obtenidos para', Object.keys(montosEsperados).length, 'RTOs')
      
      return montosEsperados
    } catch (error) {
      console.error('❌ Error al obtener montos esperados:', error)
      return {}
    }
  },

  /**
   * Obtiene los repartos con montos esperados incluidos
   * @param {string} date - Fecha en formato DD-MM-YYYY
   * @returns {Promise} 
   */
  async getRepartosCompletos(date = null) {
    try {
      const [repartos, montosEsperados] = await Promise.all([
        this.getRepartos(date),
        this.getMontoEsperadoPorReparto(date)
      ])
      
      // Asignar montos esperados a cada reparto
      return repartos.map(reparto => ({
        ...reparto,
        depositoEsperado: montosEsperados[reparto.idReparto] || 0,
        diferencia: reparto.depositoReal - (montosEsperados[reparto.idReparto] || 0),
        estado: this.calcularEstado(reparto.depositoReal, montosEsperados[reparto.idReparto] || 0)
      }))
    } catch (error) {
      console.error('Error al obtener repartos completos:', error)
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
}
