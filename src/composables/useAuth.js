import { ref, computed } from 'vue'
import authService from '../services/AuthService.js'
import { config } from '../config/config.js'

// Estado global de autenticación
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

// Función para verificar si hay una sesión guardada
const checkAuthStatus = async () => {
  // Verificar si hay datos de autenticación JWT guardados
  const currentUser = authService.getCurrentUser()
  if (currentUser && authService.isAuthenticated()) {
    user.value = currentUser
    console.log('✅ [AUTH] Usuario autenticado encontrado:', currentUser)
    return true
  }

  // También verificar método anterior para compatibilidad
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser)
      user.value = userData
      console.log('✅ [AUTH] Usuario de localStorage encontrado:', userData)
      return true
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  const sessionUser = sessionStorage.getItem('user')
  if (sessionUser) {
    try {
      const userData = JSON.parse(sessionUser)
      user.value = userData
      console.log('✅ [AUTH] Usuario de sessionStorage encontrado:', userData)
      return true
    } catch (e) {
      sessionStorage.removeItem('user')
    }
  }

  console.log('❌ [AUTH] No se encontró usuario autenticado')
  return false
}

// Función para iniciar sesión
const login = async (username, password, remember = false) => {
  try {
    const result = await authService.login(username, password)
    
    if (result && result.success) {
      user.value = result.user
      
      // Guardar datos adicionales para compatibilidad
      const userDataToStore = {
        ...result.user,
        loginTime: new Date().toISOString()
      }
      
      if (remember) {
        localStorage.setItem('user', JSON.stringify(userDataToStore))
      } else {
        sessionStorage.setItem('user', JSON.stringify(userDataToStore))
      }
      
      console.log('✅ [AUTH] Usuario autenticado:', result.user)
      return result
    } else {
      // Si result.success es false, usar el error del resultado
      const errorMessage = result?.error || 'Error en login'
      console.error('❌ [AUTH] Login fallido:', errorMessage)
      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error('❌ [AUTH] Error en login:', error)
    
    // Categorizar el error para mejor UX
    if (error.message.includes('Error interno del servidor')) {
      console.error('🔥 [AUTH] Error crítico del backend - revisar logs del servidor')
    } else if (error.message.includes('No se puede conectar')) {
      console.error('🌐 [AUTH] Servidor no disponible')
    } else if (error.message.includes('Credenciales incorrectas')) {
      console.error('🔑 [AUTH] Credenciales inválidas')
    }
    
    throw error
  }
}

// Función para cerrar sesión
const logout = async () => {
  try {
    await authService.logout()
  } catch (error) {
    console.error('Error en logout del backend:', error)
  } finally {
    user.value = null
    console.log('Sesión cerrada')
  }
}

// Función para verificar si el usuario tiene un rol específico
const hasRole = (role) => {
  return user.value?.roles?.includes(role) || false
}

// Función para obtener datos del usuario
const getUserData = () => {
  return user.value
}

// Función para verificar permisos
const checkPermissions = (permission) => {
  return authService.hasPermission(permission)
}

// Funciones de permisos específicas
const canManageRepartos = () => {
  return authService.canManageRepartos()
}

const canManageUsers = () => {
  return authService.canManageUsers()
}

const canExportData = () => {
  return authService.canExportData()
}

const isAdmin = () => {
  return authService.isAdmin()
}

const isSuperAdmin = () => {
  return authService.isSuperAdmin()
}

// Exportar el composable
export const useAuth = () => {
  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    hasRole,
    getUserData,
    checkPermissions,
    canManageRepartos,
    canManageUsers,
    canExportData,
    isAdmin,
    isSuperAdmin
  }
}
