import { ref, computed } from 'vue'
import authService from '../services/AuthService.js'
import { config } from '../config/config.js'

// Estado global de autenticación
const user = ref(null)
const isAuthenticated = computed(() => !!user.value)

// Función para verificar si hay una sesión guardada
const checkAuthStatus = async () => {
  // En modo desarrollo, solo verificar sesión local, no hacer llamadas al backend
  if (config.DEV_MODE) {
    // Solo verificar almacenamiento local/sesión
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        return true
      } catch (e) {
        localStorage.removeItem('user')
      }
    }

    const sessionUser = sessionStorage.getItem('user')
    if (sessionUser) {
      try {
        user.value = JSON.parse(sessionUser)
        return true
      } catch (e) {
        sessionStorage.removeItem('user')
      }
    }

    return false
  }

  // Modo producción: verificar si hay token y es válido
  if (authService.hasAuthToken()) {
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      return true
    } catch (error) {
      console.error('Error verificando sesión:', error)
      // Si hay error, limpiar datos
      authService.clearAuthToken()
      user.value = null
      return false
    }
  }

  // También verificar método anterior para compatibilidad
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      user.value = JSON.parse(savedUser)
      return true
    } catch (e) {
      localStorage.removeItem('user')
    }
  }

  const sessionUser = sessionStorage.getItem('user')
  if (sessionUser) {
    try {
      user.value = JSON.parse(sessionUser)
      return true
    } catch (e) {
      sessionStorage.removeItem('user')
    }
  }

  return false
}

// Función para iniciar sesión
const login = async (username, password, remember = false) => {
  try {
    const userData = await authService.login(username, password)
    user.value = userData
    
    // Guardar datos adicionales para compatibilidad
    const userDataToStore = {
      ...userData,
      loginTime: new Date().toISOString()
    }
    
    if (remember) {
      localStorage.setItem('user', JSON.stringify(userDataToStore))
    } else {
      sessionStorage.setItem('user', JSON.stringify(userDataToStore))
    }
    
    console.log('Usuario autenticado:', userData)
    return userData
  } catch (error) {
    console.error('Error en login:', error)
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

// Exportar el composable
export const useAuth = () => {
  return {
    user: computed(() => user.value),
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    hasRole,
    getUserData
  }
}
