import axios from 'axios'
import config from '@/config'

class AuthService {
  constructor() {
    this.API_URL = config.API_URL + '/fix'
    
    // Configurar axios interceptors para añadir el token automáticamente
    this.setupAxiosInterceptors()
  }

  setupAxiosInterceptors() {
    // Request interceptor - añadir token a todas las requests
    axios.interceptors.request.use(
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

    // Response interceptor - manejar tokens expirados
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          this.logout()
        }
        return Promise.reject(error)
      }
    )
  }

  async login(username, password) {
    try {
      console.log('🔐 Intentando login con:', { username })
      
      const response = await axios.post(`${this.API_URL}/login`, {
        username,
        password
      })

      console.log('✅ Respuesta de login:', response.data)

      if (response.data && response.data.access_token) {
        const { access_token, user } = response.data
        
        // Guardar token en localStorage
        localStorage.setItem('auth_token', access_token)
        
        // Enriquecer datos del usuario con información adicional
        const enrichedUserData = {
          ...user,
          token: access_token,
          isAuthenticated: true,
          permissions: this.getPermissionsByRole(user.role)
        }
        
        // Guardar datos del usuario
        localStorage.setItem('user_data', JSON.stringify(enrichedUserData))
        
        console.log('✅ Usuario autenticado:', enrichedUserData)
        
        // Retornar en el formato esperado por useAuth
        return {
          success: true,
          user: enrichedUserData
        }
      } else {
        throw new Error('Respuesta de login inválida')
      }
    } catch (error) {
      console.error('❌ Error en login:', error)
      
      // Limpiar cualquier dato previo
      this.logout()
      
      // Manejo mejorado de errores
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Credenciales incorrectas'
        }
      } else if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Acceso denegado'
        }
      } else if (error.response?.status === 500) {
        console.error('🔥 Error interno del servidor:', error.response?.data)
        return {
          success: false,
          error: 'Error interno del servidor. Contacte al administrador.'
        }
      } else if (error.response?.data?.detail) {
        return {
          success: false,
          error: `Error en el proceso de login: ${error.response.data.detail}`
        }
      } else if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'No se puede conectar al servidor de autenticación'
        }
      } else {
        return {
          success: false,
          error: 'Error de conexión con el servidor'
        }
      }
    }
  }

  async logout() {
    try {
      // Opcional: llamar al endpoint de logout del backend
      const token = localStorage.getItem('auth_token')
      if (token) {
        await axios.post(`${this.API_URL}/logout`)
      }
    } catch (error) {
      console.error('Error en logout del servidor:', error)
    } finally {
      // Limpiar datos locales siempre
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      console.log('🔓 Sesión cerrada')
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user_data')
      const token = localStorage.getItem('auth_token')
      
      if (userData && token) {
        const user = JSON.parse(userData)
        return {
          ...user,
          isAuthenticated: true
        }
      }
      
      return null
    } catch (error) {
      console.error('Error al obtener usuario actual:', error)
      this.logout() // Limpiar datos corruptos
      return null
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')
    return !!(token && userData)
  }

  getToken() {
    return localStorage.getItem('auth_token')
  }

  // Sistema de permisos basado en roles
  getPermissionsByRole(role) {
    const permissions = {
      SUPERADMIN: [
        'view_all',
        'manage_repartos',
        'manage_users',
        'system_admin',
        'export_data',
        'view_reports'
      ],
      ADMIN: [
        'view_all',
        'manage_repartos',
        'export_data',
        'view_reports'
      ],
      USUARIO: [
        'view_all',
        'view_reports'
      ]
    }
    
    return permissions[role] || []
  }

  hasPermission(permission) {
    const user = this.getCurrentUser()
    if (!user) return false
    
    return user.permissions?.includes(permission) || false
  }

  canManageRepartos() {
    return this.hasPermission('manage_repartos')
  }

  canManageUsers() {
    return this.hasPermission('manage_users')
  }

  canExportData() {
    return this.hasPermission('export_data')
  }

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'
  }

  isSuperAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'SUPERADMIN'
  }

  // Verificar si el token sigue siendo válido
  async verifyToken() {
    try {
      const token = this.getToken()
      if (!token) return false

      const response = await axios.get(`${this.API_URL}/verify-token`)
      return response.status === 200
    } catch (error) {
      console.error('Token inválido:', error)
      this.logout()
      return false
    }
  }

  // Refrescar token si el backend lo soporta
  async refreshToken() {
    try {
      const response = await axios.post(`${this.API_URL}/refresh-token`)
      
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
        
        // Actualizar datos del usuario si se incluyen
        if (response.data.user) {
          const currentUser = this.getCurrentUser()
          const updatedUser = {
            ...currentUser,
            ...response.data.user,
            token: response.data.access_token
          }
          localStorage.setItem('user_data', JSON.stringify(updatedUser))
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error al refrescar token:', error)
      this.logout()
      return false
    }
  }

  // Diagnóstico de conectividad del backend
  async checkBackendHealth() {
    try {
      console.log('🔍 [HEALTH] Verificando conectividad del backend...')
      
      // Intentar hacer ping al servidor usando el endpoint fix/login como test
      const response = await axios.get(`${this.API_URL.replace('/fix', '')}/health`, {
        timeout: 5000 // 5 segundos timeout
      })
      
      console.log('✅ [HEALTH] Backend disponible:', response.status)
      return {
        available: true,
        status: response.status,
        message: 'Servidor disponible'
      }
    } catch (error) {
      console.error('❌ [HEALTH] Backend no disponible:', error)
      
      // Si falla el health check, intentar con el endpoint de login como backup
      try {
        console.log('🔄 [HEALTH] Probando endpoint de login como backup...')
        const loginTest = await axios.get(`${this.API_URL}/login`, {
          timeout: 3000
        })
        
        return {
          available: true,
          status: 'PARTIAL',
          message: 'Servidor disponible (endpoint /fix/login operativo)'
        }
      } catch (loginError) {
        if (error.code === 'ECONNREFUSED') {
          return {
            available: false,
            error: 'ECONNREFUSED',
            message: 'Servidor no ejecutándose en localhost:8001'
          }
        } else if (error.code === 'TIMEOUT') {
          return {
            available: false,
            error: 'TIMEOUT',
            message: 'Servidor no responde (timeout)'
          }
        } else {
          return {
            available: false,
            error: error.code || 'UNKNOWN',
            message: 'Error de conectividad'
          }
        }
      }
    }
  }
}

// Exportar instancia singleton
const authService = new AuthService()
export default authService
