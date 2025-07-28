import axios from 'axios'
import config from '@/config'

class UserService {
  constructor() {
    this.API_URL = config.API_URL + '/admin/users'
  }

  // Listar todos los usuarios
  async getUsers() {
    try {
      console.log('👥 [USERS] Obteniendo lista de usuarios...')
      const response = await axios.get(this.API_URL)
      console.log('✅ [USERS] Usuarios obtenidos:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ [USERS] Error al obtener usuarios:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Crear nuevo usuario
  async createUser(userData) {
    try {
      console.log('➕ [USERS] Creando nuevo usuario:', userData.username)
      const response = await axios.post(this.API_URL, userData)
      console.log('✅ [USERS] Usuario creado:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ [USERS] Error al crear usuario:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Actualizar usuario
  async updateUser(userId, userData) {
    try {
      console.log(`✏️ [USERS] Actualizando usuario ID: ${userId}`)
      const response = await axios.put(`${this.API_URL}/${userId}`, userData)
      console.log('✅ [USERS] Usuario actualizado:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ [USERS] Error al actualizar usuario:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Eliminar usuario
  async deleteUser(userId) {
    try {
      console.log(`🗑️ [USERS] Eliminando usuario ID: ${userId}`)
      const response = await axios.delete(`${this.API_URL}/${userId}`)
      console.log('✅ [USERS] Usuario eliminado')
      return {
        success: true,
        message: 'Usuario eliminado correctamente'
      }
    } catch (error) {
      console.error('❌ [USERS] Error al eliminar usuario:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Cambiar contraseña
  async changePassword(passwordData) {
    try {
      console.log('🔐 [USERS] Cambiando contraseña para usuario:', passwordData.user_id)
      const response = await axios.post(`${this.API_URL}/change-password`, passwordData)
      console.log('✅ [USERS] Contraseña cambiada exitosamente')
      return {
        success: true,
        message: 'Contraseña cambiada correctamente'
      }
    } catch (error) {
      console.error('❌ [USERS] Error al cambiar contraseña:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Activar/Desactivar usuario
  async toggleUserStatus(userId) {
    try {
      console.log(`🔄 [USERS] Cambiando estado de usuario ID: ${userId}`)
      const response = await axios.put(`${this.API_URL}/${userId}/toggle-status`)
      console.log('✅ [USERS] Estado de usuario cambiado:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ [USERS] Error al cambiar estado:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Obtener roles disponibles
  async getRoles() {
    try {
      console.log('🎭 [USERS] Obteniendo roles disponibles...')
      const response = await axios.get(`${this.API_URL}/roles`)
      console.log('✅ [USERS] Roles obtenidos:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ [USERS] Error al obtener roles:', error)
      return {
        success: false,
        error: this.handleError(error)
      }
    }
  }

  // Manejar errores
  handleError(error) {
    if (error.response?.status === 403) {
      return 'No tienes permisos para realizar esta acción'
    } else if (error.response?.status === 404) {
      return 'Usuario no encontrado'
    } else if (error.response?.status === 409) {
      return 'El usuario ya existe'
    } else if (error.response?.data?.detail) {
      return error.response.data.detail
    } else if (error.code === 'ECONNREFUSED') {
      return 'No se puede conectar al servidor'
    } else {
      return 'Error interno del servidor'
    }
  }
}

// Exportar instancia singleton
const userService = new UserService()
export default userService
