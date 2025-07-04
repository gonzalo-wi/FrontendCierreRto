<template>
  <nav class="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl border-b border-blue-700/30 backdrop-blur-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <!-- Logo/Título mejorado con animaciones -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <img src="../assets/LogoIvess.png" alt="Logo Ivess" class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain hover:scale-110 transition-all duration-500 filter drop-shadow-lg">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <router-link 
            to="/" 
            class="group text-white text-lg sm:text-xl md:text-2xl font-bold hover:text-blue-200 transition-all duration-500 relative"
          >
            <span class="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-white transition-all duration-500">
              <span class="hidden sm:inline">Cierre Repartos</span>
              <span class="sm:hidden">Cierre</span>
            </span>
            <div class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-500"></div>
          </router-link>
        </div>

        <!-- Enlaces de navegación mejorados con efectos premium -->
        <div class="hidden lg:flex items-center space-x-1">
          <router-link 
            to="/" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/' }"
          >
            <div class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <div class="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-semibold text-sm tracking-wide">Dashboard</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>

          <router-link 
            to="/jumillano" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/jumillano' }"
          >
            <div class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-semibold text-sm tracking-wide">Ciudadela</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>
          
          <router-link 
            to="/laplata" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/laplata' }"
          >
            <div class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-semibold text-sm tracking-wide">La Plata</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>
          
          <router-link 
            to="/nafa" 
            class="nav-link group relative overflow-hidden"
            :class="{ 'active': $route.path === '/nafa' }"
          >
            <div class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group-hover:bg-white/10 backdrop-blur-sm">
              <div class="relative">
                <svg class="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <div class="absolute inset-0 bg-purple-400 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span class="font-semibold text-sm tracking-wide">NAFA</span>
            </div>
            <div class="nav-indicator absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-indigo-400 group-hover:w-3/4 transition-all duration-300"></div>
          </router-link>

          <!-- Indicador de estado online y usuario -->
          <div class="ml-6 flex items-center space-x-4">
            <!-- Usuario logueado -->
            <div class="flex items-center space-x-2 bg-blue-500/20 px-3 py-2 rounded-full border border-blue-500/30">
              <svg class="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span class="text-blue-200 text-sm font-medium">{{ user?.username || 'Usuario' }}</span>
            </div>
            
            <!-- Estado Online -->
            <div class="flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-green-200 text-sm font-medium">Online</span>
            </div>
            
            <!-- Botón Logout -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-2 bg-red-500/20 px-3 py-2 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
              title="Cerrar sesión"
            >
              <svg class="w-4 h-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span class="text-red-200 text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>

        <!-- Menú móvil mejorado -->
        <div class="lg:hidden">
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
          <div class="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-blue-700/30">
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
              to="/nafa" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/nafa' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="font-medium">Nafa</span>
              </div>
            </router-link>
            
            <router-link 
              to="/la-plata" 
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'active': $route.path === '/la-plata' }"
            >
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span class="font-medium">La Plata</span>
              </div>
            </router-link>

            <!-- Estado en móvil -->
            <div class="pt-4 mt-4 border-t border-blue-700/30">
              <div class="flex items-center justify-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-green-200 text-sm font-medium">Sistema Online</span>
              </div>
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
const { user, logout } = useAuth()

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
/* Estilos para enlaces de navegación */
.nav-link {
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
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
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.nav-link.active {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  color: white;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.3);
}

/* Indicador de navegación activa */
.nav-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link.active .nav-indicator {
  transform: scaleX(1);
}

/* Botón de menú móvil mejorado */
.mobile-menu-btn {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: none;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: white;
  transition: all 0.3s ease-in-out;
  margin-bottom: 4px;
}

.hamburger-line:last-child {
  margin-bottom: 0;
}

.mobile-menu-btn.open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.mobile-menu-btn.open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* Enlaces móviles */
.mobile-nav-link {
  color: white;
  background-color: transparent;
  display: block;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  border: 1px solid transparent;
  text-decoration: none;
}

.mobile-nav-link:hover {
  background-color: rgba(37, 99, 235, 0.3);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(8px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobile-nav-link.active {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4));
  border-color: rgba(96, 165, 250, 0.5);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Animación del gradiente del título */
@keyframes gradient {
  0%, 100% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
}

/* Efecto glassmorphism para el navbar */
nav {
  backdrop-filter: blur(12px);
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.95), 
    rgba(30, 58, 138, 0.95), 
    rgba(30, 41, 59, 0.95)
  );
}

/* Responsive improvements */
@media (max-width: 768px) {
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
}

/* Animación para el estado online */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
