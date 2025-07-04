<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
    <!-- Centro de Notificaciones -->
    <NotificationCenter ref="notificationCenter" />
    
    <!-- Header Ejecutivo Mejorado -->
    <header class="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-lg sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between h-auto sm:h-24 py-4 sm:py-0">
          <!-- Logo y título mejorado -->
          <div class="flex items-center space-x-4 mb-4 sm:mb-0">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Dashboard Ejecutivo
              </h1>
              <p class="text-sm sm:text-base text-gray-600 hidden sm:block font-medium">Control Central de Repartos • Sistema Integrado</p>
            </div>
          </div>

          <!-- Indicadores de tiempo mejorados -->
          <div class="flex items-center space-x-6">
            <!-- Estado del sistema -->
            <div class="hidden md:flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <span class="text-sm font-medium text-green-700">Sistema Activo</span>
            </div>
            
            <!-- Hora actual mejorada -->
            <div class="text-right bg-white/60 backdrop-blur rounded-xl px-4 py-3 border border-gray-200/50 shadow-lg">
              <div class="text-lg font-bold text-gray-900">{{ currentTime }}</div>
              <div class="text-xs text-gray-500 font-medium">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <!-- Estado de Conexión a Plantas -->
      <div class="mb-10">
        <ConnectionStatus />
      </div>

      <!-- Selector de fecha con diseño profesional mejorado -->
      <div class="mb-10">
        <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div class="mb-4 sm:mb-0">
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900">Selección de Período</h2>
              </div>
              <p class="text-sm text-gray-600">Consulte los datos de cierre para la fecha seleccionada</p>
            </div>
            <div class="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="text-xs text-gray-600 hidden sm:inline">Última actualización: {{ lastUpdate }}</span>
              <span class="text-xs text-gray-600 sm:hidden">{{ lastUpdate }}</span>
            </div>
          </div>
          <DateSelector @fecha-seleccionada="onFechaSeleccionada" />
        </div>
      </div>

      <!-- Panel de Totales Consolidados -->
      <div class="mb-10">
        <TotalsView 
          :fecha-seleccionada="fechaSeleccionada?.fechaAPI" 
          @totales-cargados="onTotalesCargados"
        />
      </div>

      <!-- Grid de Plantas - Diseño Ejecutivo Mejorado -->
      <div class="mb-10">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div class="mb-4 sm:mb-0">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Centros de Distribución</h2>
            </div>
            <p class="text-sm text-gray-600">Acceda a los detalles operativos de cada planta</p>
          </div>
          <div class="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.2s;"></div>
              <div class="w-2 h-2 bg-green-300 rounded-full animate-pulse" style="animation-delay: 0.4s;"></div>
            </div>
            <span class="text-sm font-medium text-green-700">3 plantas activas</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          <!-- Ciudadela -->
          <router-link 
            to="/jumillano" 
            class="group bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 hover:border-blue-300/70 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
          >
            <div class="p-6 sm:p-8">
              <!-- Header de la card mejorado -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Ciudadela</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>

              <!-- Métricas mejoradas -->
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span class="text-sm font-medium text-blue-700">Estado operativo</span>
                  <span class="font-bold text-blue-800">Óptimo</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900 text-sm">{{ lastSync }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <span class="text-sm font-medium text-blue-700">Rendimiento</span>
                  <div class="flex items-center space-x-1">
                    <div class="w-16 bg-blue-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" style="width: 92%"></div>
                    </div>
                    <span class="font-bold text-blue-800 text-sm">92%</span>
                  </div>
                </div>
              </div>

              <!-- Acción principal mejorada -->
              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    <span>Ver detalles completos</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="text-xs text-gray-500">Clic para acceder</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>

          <!-- La Plata -->
          <router-link 
            to="/laplata" 
            class="group bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 hover:border-emerald-300/70 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
          >
            <div class="p-6 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">La Plata</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span class="text-sm font-medium text-emerald-700">Estado operativo</span>
                  <span class="font-bold text-emerald-800">Óptimo</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900 text-sm">{{ lastSync }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                  <span class="text-sm font-medium text-emerald-700">Rendimiento</span>
                  <div class="flex items-center space-x-1">
                    <div class="w-16 bg-emerald-200 rounded-full h-2">
                      <div class="bg-emerald-600 h-2 rounded-full" style="width: 96%"></div>
                    </div>
                    <span class="font-bold text-emerald-800 text-sm">96%</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                    <span>Ver detalles completos</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="text-xs text-gray-500">Clic para acceder</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>

          <!-- NAFA -->
          <router-link 
            to="/nafa" 
            class="group bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 hover:border-purple-300/70 hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-[1.02]"
          >
            <div class="p-6 sm:p-8">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg class="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">NAFA</h3>
                    <div class="flex items-center space-x-2 mt-1">
                      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span class="text-sm font-medium text-purple-700">Estado operativo</span>
                  <span class="font-bold text-purple-800">Óptimo</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900 text-sm">{{ lastSync }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                  <span class="text-sm font-medium text-purple-700">Rendimiento</span>
                  <div class="flex items-center space-x-1">
                    <div class="w-16 bg-purple-200 rounded-full h-2">
                      <div class="bg-purple-600 h-2 rounded-full" style="width: 88%"></div>
                    </div>
                    <span class="font-bold text-purple-800 text-sm">88%</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                    <span>Ver detalles completos</span>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </div>
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span class="text-xs text-gray-500">Clic para acceder</span>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Gráficos de Comparación entre Plantas -->
      <div class="mb-10">
        <PlantComparison 
          :fecha-seleccionada="fechaSeleccionada?.fechaAPI" 
          :totales-data="totalesData"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TotalsView from '../components/TotalsView.vue'
import DateSelector from '../components/DateSelector.vue'
import NotificationCenter from '../components/NotificationCenter.vue'
import ConnectionStatus from '../components/ConnectionStatus.vue'
import PlantComparison from '../components/PlantComparison.vue'

// Estado reactivo
const fechaSeleccionada = ref(null)
const totalesData = ref(null)
const currentTimeValue = ref(new Date())
const notificationCenter = ref(null)

// Actualizar tiempo cada segundo
let timeInterval = null

onMounted(() => {
  timeInterval = setInterval(() => {
    currentTimeValue.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Computed properties para formateo de fechas
const currentTime = computed(() => {
  return currentTimeValue.value.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  })
})

const currentDate = computed(() => {
  return currentTimeValue.value.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const lastUpdate = computed(() => {
  return currentTimeValue.value.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
})

const lastSync = computed(() => {
  // Simular último sync hace unos minutos
  const syncTime = new Date(currentTimeValue.value.getTime() - (Math.floor(Math.random() * 10) + 1) * 60000)
  return syncTime.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit'
  })
})

// Función para manejar cambios de fecha
const onFechaSeleccionada = (fecha) => {
  console.log('📅 Fecha seleccionada en Dashboard:', fecha)
  
  // Evitar bucle recursivo comparando fechas
  if (fechaSeleccionada.value?.fechaAPI !== fecha.fechaAPI) {
    fechaSeleccionada.value = { ...fecha } // Crear una copia del objeto
    
    // Mostrar notificación
    if (notificationCenter.value) {
      notificationCenter.value.showInfo(
        'Fecha actualizada',
        `Consultando datos para ${fecha.fechaDisplay}`
      )
    }
  }
}

// Función para recibir los totales cargados desde TotalsView
const onTotalesCargados = (totales) => {
  console.log('📊 Totales recibidos en Dashboard:', totales)
  totalesData.value = totales
}
</script>

<style scoped>
/* Estilos adicionales para las cards de navegación */
.router-link-active {
  border: 2px solid #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  background-color: rgba(59, 130, 246, 0.05);
}

/* Animaciones personalizadas */
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
