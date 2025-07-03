import config from '../config/config.js'

// Servicio de autenticación para conectar con el backend usando Basic Auth
class AuthService {
  constructor() {
    this.baseURL = config.API_BASE_URL
  }

  /**
   * Realiza el login con usuario y contraseña usando Basic Auth
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Datos del usuario
   */
  async login(username, password) {
    try {
      // Si estamos en modo desarrollo, usar simulación
      if (config.DEV_MODE) {
        return this.simulateLogin(username, password)
      }

      // Crear Basic Auth header
      const basicAuth = "Basic " + btoa(`${username}:${password}`)

      // Hacer petición directa a /usuario/me con Basic Auth
      const response = await fetch(`${this.baseURL}${config.AUTH_ENDPOINTS.CURRENT_USER}`, {
        method: 'GET',
        headers: {
          'Authorization': basicAuth,
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Usuario o contraseña incorrectos')
        }
        if (response.status === 403) {
          throw new Error('Acceso denegado')
        }
        if (response.status === 0) {
          throw new Error('Error de conexión con el servidor. Verifica que el backend esté corriendo y configurado para CORS.')
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const userData = await response.json()
      
      // Almacenar las credenciales de Basic Auth para futuras peticiones
      this.setAuthCredentials(username, password)
      
      // Agregar información de login
      const enrichedUserData = {
        ...userData,
        username: username,
        loginTime: new Date().toISOString(),
        authType: 'basic'
      }

      return enrichedUserData
    } catch (error) {
      console.error('Error en login:', error)
      
      // Manejar errores de red específicos
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080 y configurado para CORS.')
      }
      
      throw error
    }
  }

  /**
   * Simulación de login para desarrollo
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} - Datos simulados del usuario
   */
  async simulateLogin(username, password) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Buscar usuario en la lista de desarrollo
    const user = config.DEV_USERS.find(u => u.username === username && u.password === password)
    
    if (!user) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    // Generar datos simulados
    const userData = {
      username: user.username,
      roles: [user.role],
      id: Math.floor(Math.random() * 1000) + 1,
      loginTime: new Date().toISOString(),
      authType: 'simulated'
    }

    // Almacenar credenciales simuladas
    this.setAuthCredentials(username, password)

    console.log('🔧 Modo desarrollo: Login simulado exitoso', userData)
    return userData
  }

  /**
   * Obtiene los datos del usuario actual usando Basic Auth
   * @returns {Promise<Object>} - Datos del usuario
   */
  async getCurrentUser() {
    try {
      const credentials = this.getAuthCredentials()
      if (!credentials) {
        throw new Error('No hay credenciales almacenadas')
      }

      // Si estamos en modo desarrollo y las credenciales son simuladas
      if (config.DEV_MODE) {
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          console.log('🔧 Modo desarrollo: Usuario desde storage', userData)
          return userData
        }
        // Si no hay datos guardados, devolver usuario por defecto
        return {
          username: credentials.username,
          id: 1,
          roles: ['admin']
        }
      }

      // Usar Basic Auth con el backend real
      const basicAuth = "Basic " + btoa(`${credentials.username}:${credentials.password}`)

      const response = await fetch(`${this.baseURL}${config.AUTH_ENDPOINTS.CURRENT_USER}`, {
        method: 'GET',
        headers: {
          'Authorization': basicAuth,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Credenciales inválidas')
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error)
      throw error
    }
  }

  /**
   * Verifica si las credenciales actuales son válidas
   * @returns {Promise<boolean>} - True si las credenciales son válidas
   */
  async validateToken() {
    try {
      await this.getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Realiza logout
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Simplemente limpiar credenciales locales ya que Basic Auth no requiere logout del servidor
      console.log('Cerrando sesión...')
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar credenciales locales
      this.clearAuthCredentials()
    }
  }

  /**
   * Almacena las credenciales de Basic Auth
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   */
  setAuthCredentials(username, password) {
    const credentials = { username, password }
    localStorage.setItem('auth_credentials', JSON.stringify(credentials))
  }

  /**
   * Obtiene las credenciales de Basic Auth almacenadas
   * @returns {Object|null} - Credenciales o null si no existen
   */
  getAuthCredentials() {
    const stored = localStorage.getItem('auth_credentials')
    return stored ? JSON.parse(stored) : null
  }

  /**
   * Elimina las credenciales de autenticación
   */
  clearAuthCredentials() {
    localStorage.removeItem('auth_credentials')
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
  }

  /**
   * Verifica si hay credenciales almacenadas
   * @returns {boolean} - True si hay credenciales
   */
  hasAuthCredentials() {
    return !!this.getAuthCredentials()
  }

  // Métodos para mantener compatibilidad con código existente
  setAuthToken(token) {
    // No usado en Basic Auth, pero mantenido para compatibilidad
  }

  getAuthToken() {
    // No usado en Basic Auth, pero mantenido para compatibilidad
    return this.getAuthCredentials() ? 'basic-auth-present' : null
  }

  clearAuthToken() {
    this.clearAuthCredentials()
  }

  hasAuthToken() {
    return this.hasAuthCredentials()
  }

  setBaseURL(url) {
    this.baseURL = url
  }
}

// Crear instancia singleton
const authService = new AuthService()

export default authService
