<template>
  <div class="min-h-screen w-full relative overflow-hidden">
    <!-- Fondo principal con gradiente sutil -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
    
    <!-- Patrón de fondo animado -->
    <div class="absolute inset-0">
      <!-- Ondas de fondo -->
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-float-slow"></div>
        <div class="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-float-slow animation-delay-2000"></div>
        <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl animate-float-slow animation-delay-4000"></div>
      </div>
      
      <!-- Grid pattern sutil -->
      <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <!-- Contenedor principal centrado -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-6xl mx-auto">
        <!-- Card principal con glassmorphism -->
        <div class="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 lg:p-16">
          <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <!-- Columna izquierda - Logo y información -->
            <div class="text-center lg:text-left space-y-8">
              <!-- Logo container -->
              <div class="relative">
                <div class="inline-block relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-lg opacity-40 animate-pulse-slow"></div>
                  <div class="relative bg-gradient-to-br from-blue-800/80 via-blue-700/70 to-indigo-800/80 backdrop-blur-sm p-2 lg:p-4 rounded-3xl shadow-xl border border-blue-300/30 flex items-center justify-center max-h-[280px] lg:max-h-[400px]">
                    <img 
                      src="/src/assets/LogoNuevo1.png" 
                      alt="Logo Empresa" 
                      class="max-h-full h-auto w-auto object-contain mx-auto transition-transform duration-500 hover:scale-105 filter brightness-110"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Títulos -->
              <div class="space-y-6">
                <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
                  Bienvenido
                </h1>
                <div class="space-y-3">
                  <h2 class="text-xl lg:text-2xl font-semibold text-blue-200">
                    Sistema de Gestión AutoCierre
                  </h2>
                  <p class="text-lg lg:text-xl text-gray-300 max-w-md mx-auto lg:mx-0">
                    Accede al panel de control para gestionar y monitorear todos los depósitos
                  </p>
                </div>
                
                <!-- Línea decorativa -->
                <div class="w-32 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto lg:mx-0 rounded-full"></div>
              </div>

              <!-- Features destacados -->
              <div class="hidden lg:block space-y-4">
                <div class="flex items-center space-x-4 text-gray-300">
                  <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span class="text-lg">Control total de depósitos</span>
                </div>
                <div class="flex items-center space-x-4 text-gray-300">
                  <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <span class="text-lg">Reportes en tiempo real</span>
                </div>
                <div class="flex items-center space-x-4 text-gray-300">
                  <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <span class="text-lg">Seguridad avanzada</span>
                </div>
              </div>
            </div>

            <!-- Columna derecha - Formulario -->
            <div class="w-full">
              <div class="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-8 lg:p-12 shadow-2xl">
                <form @submit.prevent="handleSubmit" class="space-y-8">
                  <!-- Header del formulario -->
                  <div class="text-center space-y-3">
                    <h3 class="text-2xl lg:text-3xl font-bold text-white">Iniciar Sesión</h3>
                    <p class="text-gray-300 text-lg">Ingresa tus credenciales para continuar</p>
                  </div>

                  <!-- Campos del formulario -->
                  <div class="space-y-6">
                    <!-- Campo Usuario -->
                    <div class="space-y-2">
                      <label for="username" class="block text-lg font-medium text-gray-200">
                        Usuario
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <input
                          id="username"
                          v-model="form.username"
                          type="text"
                          required
                          class="w-full pl-12 pr-4 py-4 text-lg bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Ingresa tu usuario"
                        />
                      </div>
                    </div>

                    <!-- Campo Contraseña -->
                    <div class="space-y-2">
                      <label for="password" class="block text-lg font-medium text-gray-200">
                        Contraseña
                      </label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                        <input
                          id="password"
                          v-model="form.password"
                          :type="showPassword ? 'text' : 'password'"
                          required
                          class="w-full pl-12 pr-12 py-4 text-lg bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          placeholder="Ingresa tu contraseña"
                        />
                        <button
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <svg v-if="showPassword" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Recordar sesión -->
                  <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-3 cursor-pointer">
                      <input 
                        v-model="form.rememberMe" 
                        type="checkbox" 
                        class="w-5 h-5 text-blue-500 bg-white/10 border-white/30 rounded focus:ring-blue-400 focus:ring-2"
                      />
                      <span class="text-gray-300 text-lg">Recordar sesión</span>
                    </label>
                    <a href="#" class="text-blue-800 hover:text-blue-300 text-lg transition-colors duration-200">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <!-- Botón de login -->
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-5 px-6 rounded-xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span v-if="!loading" class="flex items-center justify-center space-x-3">
                      <span>Iniciar Sesión</span>
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                    <span v-else class="flex items-center justify-center space-x-3">
                      <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Iniciando sesión...</span>
                    </span>
                  </button>

                  <!-- Error message -->
                  <div v-if="error" class="bg-red-500/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl text-center">
                    {{ error }}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="fixed bottom-0 left-0 right-0 z-10 mb-4">
      <div class="text-center">
        <div class="inline-flex items-center space-x-6 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4 border border-white/20">
          <div class="flex items-center space-x-2">
            
            <span class="text-white text-sm font-medium">IVESS - El Jumillano</span>
          </div>
          <div class="w-px h-4 bg-white/30"></div>
          <span class="text-gray-300 text-sm">© {{ new Date().getFullYear() }} - Derechos reservados</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

// Emisiones
const emit = defineEmits(['login-success'])

// Estado del formulario
const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Composable de autenticación
const { login } = useAuth()

// Manejar envío del formulario
const handleSubmit = async () => {
  error.value = ''
  loading.value = true
  
  try {
    const result = await login(form.value.username, form.value.password)
    
    if (result.success) {
      emit('login-success', result.user)
    } else {
      error.value = result.error || 'Credenciales incorrectas'
    }
  } catch (err) {
    // Mejores mensajes de error según el tipo
    if (err.message.includes('Error interno del servidor')) {
      error.value = '⚠️ Error del servidor. Contacte al administrador del sistema.'
    } else if (err.message.includes('No se puede conectar')) {
      error.value = '🌐 Servidor no disponible. Verifique su conexión.'
    } else if (err.message.includes('Credenciales incorrectas')) {
      error.value = '🔑 Usuario o contraseña incorrectos.'
    } else if (err.message.includes('Acceso denegado')) {
      error.value = '🚫 Su cuenta no tiene permisos de acceso.'
    } else {
      error.value = err.message || 'Error de conexión. Intenta nuevamente.'
    }
    
    console.error('Error en login:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Animaciones suaves */
@keyframes float-slow {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(15px, -15px) scale(1.05);
  }
  66% {
    transform: translate(-10px, 10px) scale(0.95);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.animate-float-slow {
  animation: float-slow 12s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Efectos de glassmorphism mejorados */
.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Transiciones suaves para inputs */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

/* Hover effect para el card principal */
.backdrop-blur-2xl {
  transition: all 0.5s ease;
}

.backdrop-blur-2xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

/* Responsive design */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
}

@media (max-width: 640px) {
  .backdrop-blur-2xl {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .backdrop-blur-xl {
    padding: 1.5rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .py-5 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
