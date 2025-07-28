import { createRouter, createWebHistory } from 'vue-router'
import TablaJumiViews from '../views/TablaJumiViews.vue'
import TablaNafaViews from '../views/TablaNafaViews.vue'
import TablaLaPlataViews from '../views/TablaLaPlataViews.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ComprobantesDemo from '../views/ComprobantesDemo.vue'
import UserManagementView from '../views/UserManagementView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/jumillano',
    name: 'Ciudadela',
    component: TablaJumiViews
  },
  {
    path: '/nafa',
    name: 'Nafa',
    component: TablaNafaViews
  },
  {
    path: '/laplata',
    name: 'LaPlata',
    component: TablaLaPlataViews
  },
  {
    path: '/la-plata',
    redirect: '/laplata'
  },
  {
    path: '/comprobantes-demo',
    name: 'ComprobantesDemo',
    component: ComprobantesDemo
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagementView,
    meta: { requiresSuperAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación - TEMPORALMENTE DESHABILITADO PARA DESARROLLO
router.beforeEach(async (to, from, next) => {
  console.log('Router guard ejecutándose para:', to.path)
  
  // Verificar si la ruta requiere permisos de SuperAdmin
  if (to.meta.requiresSuperAdmin) {
    try {
      const { useAuth } = await import('../composables/useAuth.js')
      const { isSuperAdmin, isAuthenticated } = useAuth()
      
      console.log('🔍 Verificando autenticación y permisos...')
      console.log('✅ isAuthenticated.value:', isAuthenticated.value)
      console.log('✅ isSuperAdmin():', isSuperAdmin())
      
      if (!isAuthenticated.value) {
        console.log('❌ Usuario no autenticado, redirigiendo a login')
        next('/login')
        return
      }
      
      if (!isSuperAdmin()) {
        console.log('❌ Usuario no es SuperAdmin, acceso denegado')
        alert('❌ Acceso denegado. Solo SuperAdmins pueden acceder a esta sección.')
        next(from.path || '/')
        return
      }
      
      console.log('✅ SuperAdmin verificado, permitiendo acceso')
    } catch (error) {
      console.error('❌ Error verificando permisos:', error)
      next('/login')
      return
    }
  }
  
  // TEMPORALMENTE PERMITIR TODAS LAS OTRAS RUTAS SIN AUTENTICACIÓN
  next()
  
  /* GUARD DE AUTENTICACIÓN ORIGINAL (COMENTADO PARA DESARROLLO)
  // Importar useAuth dinámicamente para evitar problemas de importación circular
  const { useAuth } = await import('../composables/useAuth.js')
  const { isAuthenticated, checkAuthStatus } = useAuth()
  
  // Verificar el estado de autenticación actual
  await checkAuthStatus()
  
  // Si la ruta es login y ya está autenticado, redirigir al home
  if (to.path === '/login' && isAuthenticated.value) {
    console.log('Usuario ya autenticado, redirigiendo al home')
    next('/')
    return
  }
  
  // Si la ruta no es login y no está autenticado, redirigir al login
  if (to.path !== '/login' && !isAuthenticated.value) {
    console.log('Usuario no autenticado, redirigiendo al login')
    next('/login')
    return
  }
  
  // En cualquier otro caso, permitir el acceso
  next()
  */
})

export default router
