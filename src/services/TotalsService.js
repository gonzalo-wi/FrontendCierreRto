import axios from 'axios'
import MockTotalsService from './MockTotalsService.js'

// Configuración base de Axios - Usando proxy de Vite
const API_BASE_URL = '/api-backend'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Aumentado a 60 segundos para consultas pesadas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Cache para evitar múltiples peticiones simultáneas
const requestCache = new Map()

// Flag para determinar si usar datos simulados
const USAR_DATOS_SIMULADOS = import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.DEV

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
    console.error('Error en la petición de totales:', error)
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
   * Limpia el caché de peticiones
   */
  clearCache() {
    requestCache.clear()
    console.log('🧹 Caché de peticiones limpiado')
  },
  /**
   * Obtiene los totales parciales por planta y el total general
   * @param {string} date - Fecha en formato MM-DD-YYYY (opcional, por defecto 07-02-2025)
   * @returns {Promise} Promesa con los totales
   */
  async getTotales(date = null) {
    try {
      // Si no se proporciona fecha, usar la fecha actual
      let fechaConsulta = date
      if (!fechaConsulta) {
        const hoy = new Date()
        // Formato MM-DD-YYYY que espera la API
        fechaConsulta = `${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}-${hoy.getFullYear()}`
      }
      
      // Cache key para evitar peticiones duplicadas
      const cacheKey = `totales_${fechaConsulta}`
      
      // Si ya hay una petición en curso para esta fecha, retornar la promesa existente
      if (requestCache.has(cacheKey)) {
        console.log('� Usando petición en caché para fecha:', fechaConsulta)
        return await requestCache.get(cacheKey)
      }
      
      console.log('�🔍 Consultando API de totales para fecha:', fechaConsulta)
      
      // Crear la promesa y guardarla en caché
      const promise = apiClient.get(`/totals/all?date=${fechaConsulta}`)
        .then(response => {
          console.log('✅ Respuesta de API totales recibida:', response.data)
          
          // Verificar si la respuesta tiene datos válidos
          const hasValidData = response.data && (
            response.data.jumillano_total > 0 || 
            response.data.plata_total > 0 || 
            response.data.nafa_total > 0
          )

          if (!hasValidData) {
            console.log('⚠️ No hay datos para la fecha:', fechaConsulta)
          }
          
          const result = {
            fecha: response.data.date || fechaConsulta,
            jumillano: response.data.jumillano_total || 0,
            laplata: response.data.plata_total || 0,
            nafa: response.data.nafa_total || 0,
            totalGeneral: response.data.grand_total || 0
          }
          
          // Limpiar caché después del éxito
          requestCache.delete(cacheKey)
          return result
        })
        .catch(error => {
          // Limpiar caché en caso de error
          requestCache.delete(cacheKey)
          throw error
        })
      
      requestCache.set(cacheKey, promise)
      return await promise
      
    } catch (error) {
      console.error('❌ Error al obtener totales:', error)
      
      // Verificar si el error es de timeout, conexión o error del servidor
      const isConnectionError = error.code === 'ECONNREFUSED' || 
                               error.code === 'ENOTFOUND' || 
                               error.message.includes('timeout') ||
                               error.message.includes('Network Error')
      
      const isServerError = error.response && (
                               error.response.status >= 500 || 
                               error.response.status === 404 ||
                               error.response.status === 403
                             )
      
      if (isConnectionError || isServerError) {
        if (isServerError) {
          console.log(`🔄 Error del servidor (${error.response.status}) - usando datos de demostración`)
        } else {
          console.log('🔄 Error de conexión - usando datos de demostración estables')
        }
        
        // Usar el servicio de simulación para datos más realistas
        try {
          return await MockTotalsService.getTotales(date)
        } catch (mockError) {
          console.error('❌ Error en servicio de simulación:', mockError)
          
          // Fallback final a datos estáticos
          const fechaConsulta = date || new Date().toISOString().split('T')[0]
          return {
            fecha: fechaConsulta,
            jumillano: 1500000000,
            laplata: 1200000000,
            nafa: 2000000000,
            totalGeneral: 4700000000
          }
        }
      } else {
        // Para otros tipos de error, también usar fallback
        console.log('🔄 Error desconocido - usando datos de demostración como fallback')
        try {
          return await MockTotalsService.getTotales(date)
        } catch (mockError) {
          const fechaConsulta = date || new Date().toISOString().split('T')[0]
          return {
            fecha: fechaConsulta,
            jumillano: 1500000000,
            laplata: 1200000000,
            nafa: 2000000000,
            totalGeneral: 4700000000
          }
        }
      }
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
