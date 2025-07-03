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
    console.error('Error en la petición de totales:', error)
    return Promise.reject(error)
  }
)

export default {
  /**
   * Obtiene los totales parciales por planta y el total general
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional, por defecto 07-02-2025)
   * @returns {Promise} Promesa con los totales
   */
  async getTotales(date = null) {
    try {
      // Si no se proporciona fecha, usar una fecha específica con datos conocidos
      // Formato MM-DD-YYYY que espera la API
      const fechaConsulta = date || '07-02-2025'
      
      console.log('🔍 Consultando API de totales para fecha:', fechaConsulta)
      
      const response = await apiClient.get(`/totals/all?date=${fechaConsulta}`)
      
      console.log('✅ Respuesta de API totales recibida:', response.data)
      
      return {
        fecha: response.data.date,
        jumillano: response.data.jumillano_total,
        laplata: response.data.plata_total,
        nafa: response.data.nafa_total,
        totalGeneral: response.data.grand_total
      }
    } catch (error) {
      console.error('❌ Error al obtener totales:', error)
      throw error
    }
  },

  /**
   * Formatea los totales para mostrar en la interfaz
   * @param {Object} totales - Totales obtenidos de la API
   * @returns {Object} Totales formateados
   */
  formatearTotales(totales) {
    return {
      fecha: totales.fecha,
      jumillano: this.formatearMonto(totales.jumillano),
      laplata: this.formatearMonto(totales.laplata),
      nafa: this.formatearMonto(totales.nafa),
      totalGeneral: this.formatearMonto(totales.totalGeneral),
      // Valores numéricos para cálculos
      jumillanoNumerico: totales.jumillano,
      laplataNumerico: totales.laplata,
      nafaNumerico: totales.nafa,
      totalGeneralNumerico: totales.totalGeneral
    }
  },

  /**
   * Formatea un monto a formato de moneda colombiana
   * @param {number} monto - Monto a formatear
   * @returns {string} Monto formateado
   */
  formatearMonto(monto) {
    if (monto == null || isNaN(monto)) return '$0'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto)
  }
}
