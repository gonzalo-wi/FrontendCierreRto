// Configuración de la aplicación
const config = {
  // URL base del backend
  API_URL: 'http://localhost:8001/api',
  
  // Configuración de desarrollo vs producción
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'auth_token',
    userDataKey: 'user_data',
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 horas en ms
  },
  
  // Configuración de la aplicación
  app: {
    name: 'Cierre de Repartos',
    version: '1.0.0',
    defaultPageSize: 10
  },
  
  // URLs de endpoints específicos
  endpoints: {
    auth: {
      login: '/fix/login',
      logout: '/fix/logout',
      verify: '/fix/verify-token',
      refresh: '/fix/refresh-token'
    },
    repartos: {
      cerrar: '/reparto-cierre/cerrar-repartos',
      estados: '/deposits/states',
      byPlant: '/deposits/db/by-plant'
    },
    charts: {
      dailyTotals: '/charts/daily-totals'
    },
    totals: {
      all: '/totals/all'
    }
  }
}

export default config
