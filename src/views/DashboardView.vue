<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Centro de Notificaciones -->
    <NotificationCenter ref="notificationCenter" />
    <!-- Header Ejecutivo -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo y título -->
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Dashboard Ejecutivo</h1>
              <p class="text-sm text-gray-500">Control Central de Repartos</p>
            </div>
          </div>

          <!-- Indicadores de tiempo -->
          <div class="flex items-center space-x-4">
            <!-- Hora actual -->
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">{{ currentTime }}</div>
              <div class="text-xs text-gray-500">{{ currentDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estado de Conexión a Plantas -->
      <div class="mb-8">
        <ConnectionStatus />
      </div>

      <!-- Selector de fecha con diseño profesional -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Selección de Período</h2>
              <p class="text-sm text-gray-600">Consulte los datos de cierre para la fecha seleccionada</p>
            </div>
            <div class="flex items-center space-x-2 text-xs text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Última actualización: {{ lastUpdate }}</span>
            </div>
          </div>
          <DateSelector @fecha-seleccionada="onFechaSeleccionada" />
        </div>
      </div>

      <!-- Panel de Totales Consolidados -->
      <div class="mb-8">
        <TotalsView :fecha-seleccionada="fechaSeleccionada?.fechaAPI" />
      </div>

      <!-- Grid de Plantas - Diseño Ejecutivo -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Centros de Distribución</h2>
            <p class="text-sm text-gray-600">Acceda a los detalles operativos de cada planta</p>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>3 plantas activas</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Jumillano -->
          <router-link 
            to="/jumillano" 
            class="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-6">
              <!-- Header de la card -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Jumillano</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              <!-- Métricas rápidas -->
              <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Estado operativo</span>
                  <span class="font-medium text-green-600">Óptimo</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900">{{ lastSync }}</span>
                </div>
              </div>

              <!-- Acción principal -->
              <div class="pt-4 border-t border-gray-100">
                <div class="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  <span>Ver detalles completos</span>
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <!-- La Plata -->
          <router-link 
            to="/laplata" 
            class="group bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">La Plata</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Estado operativo</span>
                  <span class="font-medium text-green-600">Óptimo</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900">{{ lastSync }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <div class="flex items-center text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                  <span>Ver detalles completos</span>
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <!-- NAFA -->
          <router-link 
            to="/nafa" 
            class="group bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">NAFA</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>

              <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Estado operativo</span>
                  <span class="font-medium text-green-600">Óptimo</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Última sincronización</span>
                  <span class="font-medium text-gray-900">{{ lastSync }}</span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <div class="flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700">
                  <span>Ver detalles completos</span>
                  <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Gráficos de Comparación entre Plantas -->
      <div class="mb-8">
        <PlantComparison :fecha-seleccionada="fechaSeleccionada?.fechaAPI" />
      </div>

      <!-- Footer con información relevante -->
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6">
        <div class="flex items-start space-x-4">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Notas Operativas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <ul class="space-y-2">
                  <li class="flex items-start space-x-2">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Los totales se actualizan automáticamente con cada consulta</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Conexión directa con APIs de producción</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul class="space-y-2">
                  <li class="flex items-start space-x-2">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Monitoreo continuo de rendimiento del sistema</span>
                  </li>
                  <li class="flex items-start space-x-2">
                    <div class="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reportes ejecutivos disponibles bajo demanda</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
  fechaSeleccionada.value = fecha
  
  // Mostrar notificación
  if (notificationCenter.value) {
    notificationCenter.value.showInfo(
      'Fecha actualizada',
      `Consultando datos para ${fecha.fechaDisplay}`
    )
  }
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
