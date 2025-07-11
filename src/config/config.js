// Configuración de la aplicación
export const config = {
  // URL base de tu API - ajusta según tu configuración
  API_BASE_URL: '/api',
  
  // Modo de desarrollo - cambiar a false cuando el backend esté listo
  DEV_MODE: false,
  
  // Endpoints de autenticación
  AUTH_ENDPOINTS: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    CURRENT_USER: '/usuario/me',
    REFRESH_TOKEN: '/refresh'
  },

  // Endpoints de repartos por sucursal
  REPARTO_ENDPOINTS: {
    JUMILLANO: '/repartos/jumillano',
    NAFA: '/repartos/nafa',
    LA_PLATA: '/repartos/laplata'
  },
  
  // Usuarios de prueba para desarrollo
  DEV_USERS: [
    { username: 'gwinazki', password: 'Gonzalo', role: 'admin' },
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'user', password: 'user', role: 'user' },
    { username: 'operator', password: '123', role: 'operator' }
  ],
  
  // Configuración de tokens
  TOKEN_CONFIG: {
    STORAGE_KEY: 'authToken',
    REFRESH_KEY: 'refreshToken',
    // Tiempo antes de expiración para renovar token (en minutos)
    REFRESH_THRESHOLD: 5
  },
  
  // Configuración de la aplicación
  APP_CONFIG: {
    NAME: 'Cierre de Repartos',
    VERSION: '1.0.0',
    // Tiempo de inactividad para logout automático (en minutos)
    IDLE_TIMEOUT: 30
  }
}

export default config
