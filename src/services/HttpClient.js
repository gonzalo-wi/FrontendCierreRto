import config from '../config/config.js'
import authService from './AuthService.js'

/**
 * Interceptor HTTP para manejar automáticamente la autenticación
 * en todas las peticiones a la API
 */
class HttpClient {
  constructor() {
    this.baseURL = config.API_BASE_URL
  }

  /**
   * Realiza una petición HTTP con manejo automático de tokens
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Response>} - Respuesta de la petición
   */
  async request(url, options = {}) {
    const token = authService.getAuthToken()
    
    // Configurar headers por defecto
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // Agregar token de autorización si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Configurar URL completa
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`

    // Realizar petición
    const response = await fetch(fullUrl, {
      ...options,
      headers
    })

    // Manejar errores de autenticación
    if (response.status === 401) {
      // Token expirado o inválido
      authService.clearAuthToken()
      // Redirigir al login si no estamos ya allí
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      throw new Error('Sesión expirada')
    }

    return response
  }

  /**
   * Petición GET
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async get(url, options = {}) {
    const response = await this.request(url, {
      method: 'GET',
      ...options
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Petición POST
   * @param {string} url - URL del endpoint
   * @param {any} data - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async post(url, data = null, options = {}) {
    const response = await this.request(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
      ...options
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Petición PUT
   * @param {string} url - URL del endpoint
   * @param {any} data - Datos a enviar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async put(url, data = null, options = {}) {
    const response = await this.request(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
      ...options
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Petición DELETE
   * @param {string} url - URL del endpoint
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<any>} - Datos de la respuesta
   */
  async delete(url, options = {}) {
    const response = await this.request(url, {
      method: 'DELETE',
      ...options
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`)
    }

    // Para DELETE, puede que no haya contenido
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    return true
  }
}

// Crear instancia singleton
const httpClient = new HttpClient()

export default httpClient
