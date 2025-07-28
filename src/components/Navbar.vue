<template>
  <nav class="bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 shadow-2xl border-b border-blue-600/40 backdrop-blur-lg relative overflow-hidden">
    <!-- Efecto de partículas decorativas -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute top-8 right-1/4 w-16 h-16 bg-purple-400/10 rounded-full blur-lg animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute bottom-4 right-8 w-20 h-20 bg-indigo-400/10 rounded-full blur-xl animate-pulse" style="animation-delay: 4s"></div>
    </div>
    
    <div class="container mx-auto px-4 relative z-10">
      <div class="flex justify-between items-center h-20">
        <!-- Logo/Título mejorado y mejor centrado -->
        <div class="flex items-center space-x-3">
          <div class="relative flex items-center justify-center">
            <img src="../assets/LogoSolo.png" alt="Logo Ivess" class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain hover:scale-110 transition-all duration-500 filter drop-shadow-lg">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div class="flex flex-col">
            <router-link 
              to="/" 
              class="group text-white text-base sm:text-lg md:text-xl font-bold hover:text-blue-200 transition-all duration-500 relative leading-tight"
            >
              <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-white transition-all duration-500">
                <span class="hidden sm:inline">Cierre de Caja</span>
                <span class="sm:hidden">Cierre</span>
              </span>
              <div class="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500"></div>
            </router-link>
            <span class="text-blue-200/70 text-xs font-medium tracking-wide">Sistema de Gestión</span>
          </div>
        </div>

        <!-- Enlaces de navegación mejorados con diseño más compacto -->
        <div class="hidden lg:flex items-center space-x-0.5">
          <router-link 
            to="/" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/' }"
          >
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <div class="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-medium text-sm tracking-wide">Dashboard</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>

          <router-link 
            to="/jumillano" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/jumillano' }"
          >
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-medium text-sm tracking-wide">Ciudadela</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>
          
          <router-link 
            to="/laplata" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/laplata' }"
          >
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-medium text-sm tracking-wide">La Plata</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>
          
          <router-link 
            to="/nafa" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/nafa' }"
          >
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-purple-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-medium text-sm tracking-wide">NAFA</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>

          <!-- Gestión de Usuarios - Solo para SuperAdmin -->
          <router-link 
            v-if="isSuperAdmin"
            to="/admin/users" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/admin/users' }"
          >
            <div class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <div class="absolute inset-0 bg-orange-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-medium text-sm tracking-wide">Usuarios</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-red-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>
        </div>
        <!-- Área de usuario mejorada y más compacta -->
        <div class="hidden lg:flex items-center space-x-3">
          <!-- Usuario logueado con diseño más elegante -->
          <div class="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="text-sm">
              <div class="text-white font-medium leading-tight">{{ user?.username || 'Usuario' }}</div>
              <div class="text-blue-200 text-xs">{{ user?.role || 'USUARIO' }}</div>
            </div>
          </div>
          
          <!-- Estado Online más discreto -->
          <div class="flex items-center space-x-1.5 bg-green-500/20 px-2.5 py-1.5 rounded-full border border-green-500/30">
            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-green-200 text-xs font-medium">Online</span>
          </div>
          
          <!-- Botón Logout más elegante -->
          <button
            @click="handleLogout"
            class="flex items-center space-x-1.5 bg-red-500/20 px-2.5 py-1.5 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all duration-200 group"
            title="Cerrar sesión"
          >
            <svg class="w-4 h-4 text-red-200 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="text-red-200 text-xs font-medium hidden xl:block">Salir</span>
          </button>
        </div>

        <!-- Menú móvil mejorado -->
        <div class="lg:hidden flex items-center space-x-3">
          <!-- Info de usuario en móvil -->
          <div class="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded-full border border-white/20">
            <div class="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span class="text-white text-xs font-medium">{{ user?.username || 'Usuario' }}</span>
          </div>
          
          <button 
            @click="toggleMobileMenu"
            class="mobile-menu-btn"
            :class="{ 'open': mobileMenuOpen }"
          >
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
          </button>
        </div>
      </div>

      <!-- Menú móvil desplegable mejorado -->
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="mobileMenuOpen" class="lg:hidden">
          <div class="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-b from-slate-700 to-slate-800 border-t border-blue-600/30">
            <!-- Dashboard en menú móvil -->
            <router-link 
              to="/" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">Dashboard</span>
              </div>
            </router-link>
            
            <router-link 
              to="/jumillano" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/jumillano' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="font-medium">Ciudadela</span>
              </div>
            </router-link>
            
            <router-link 
              to="/laplata" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/laplata' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="font-medium">La Plata</span>
              </div>
            </router-link>
            
            <router-link 
              to="/nafa" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/nafa' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="font-medium">NAFA</span>
              </div>
            </router-link>

            <!-- Gestión de Usuarios en móvil -->
            <router-link 
              v-if="isSuperAdmin"
              to="/admin/users" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/admin/users' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
                <span class="font-medium">Gestión de Usuarios</span>
              </div>
            </router-link>

            <!-- Botones de acción en móvil -->
            <div class="pt-4 mt-4 border-t border-blue-600/30 space-y-3">
              <div class="flex items-center justify-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-green-200 text-sm font-medium">Sistema Online</span>
              </div>
              
              <button
                @click="handleLogout"
                class="w-full flex items-center justify-center space-x-2 bg-red-500/20 px-3 py-2 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
              >
                <svg class="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span class="text-red-200 text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()

// Usar el composable de autenticación
const { user, logout, isSuperAdmin } = useAuth()

// Estado del menú móvil
const mobileMenuOpen = ref(false)

// Funciones para manejar el menú móvil
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Función para manejar logout
const handleLogout = async () => {
  const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?')
  if (confirmLogout) {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Redirigir al login de todas formas
      router.push('/login')
    }
  }
}
</script>

<style scoped>
/* Estilos para enlaces de navegación más compactos */
.nav-link {
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(4px);
  text-decoration: none;
  display: inline-block;
}

.nav-link:hover {
  color: rgb(191, 219, 254);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.nav-link.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  color: white;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
}

/* Indicador de navegación activa */
.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247));
  transform: scaleX(0);
  transition: transform 0.3s ease;
  border-radius: 2px;
}

.nav-link.active .nav-indicator {
  transform: scaleX(1);
}

/* Botón de menú móvil mejorado */
.mobile-menu-btn {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: none;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.hamburger-line {
  width: 18px;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease-in-out;
  margin-bottom: 3px;
  border-radius: 1px;
}

.hamburger-line:last-child {
  margin-bottom: 0;
}

.mobile-menu-btn.open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translateY(6px);
}

.mobile-menu-btn.open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translateY(-6px);
}

/* Enlaces móviles mejorados */
.mobile-nav-link {
  color: white;
  background-color: transparent;
  display: block;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid transparent;
  text-decoration: none;
  margin-bottom: 2px;
}

.mobile-nav-link:hover {
  background-color: rgba(59, 130, 246, 0.25);
  border-color: rgba(96, 165, 250, 0.4);
  transform: translateX(8px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.mobile-nav-link.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
  border-color: rgba(96, 165, 250, 0.6);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

/* Efectos de partículas animadas */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-10px) rotate(180deg); 
  }
}

/* Efecto glassmorphism mejorado para el navbar */
nav {
  backdrop-filter: blur(16px);
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.9), 
    rgba(30, 58, 138, 0.9), 
    rgba(67, 56, 202, 0.85)
  );
  border-bottom: 1px solid rgba(96, 165, 250, 0.2);
}

/* Mejora de la sombra principal */
nav::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1), 
    rgba(147, 51, 234, 0.1),
    rgba(99, 102, 241, 0.1)
  );
  pointer-events: none;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .nav-link {
    padding: 6px 10px;
    font-size: 13px;
  }
}

/* Animación mejorada para el estado online */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0);
  }
}

.animate-pulse {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efectos adicionales para botones de usuario */
.user-button {
  transition: all 0.3s ease;
}

.user-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* Gradiente animado para el avatar */
@keyframes gradient-shift {
  0%, 100% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
}

.gradient-avatar {
  background: linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #10B981);
  background-size: 300% 300%;
  animation: gradient-shift 4s ease infinite;
}
</style>
