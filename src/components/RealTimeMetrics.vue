<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Métricas en Tiempo Real</h3>
        <p class="text-sm text-gray-600">Indicadores de rendimiento operativo</p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-xs text-gray-500">Actualizando</span>
      </div>
    </div>

    <!-- Grid de Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Transacciones por Minuto -->
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="text-xs text-blue-600 font-medium">+12%</span>
        </div>
        <div class="text-2xl font-bold text-blue-900">{{ metrics.transaccionesPorMinuto }}</div>
        <div class="text-sm text-blue-700">Trans/min</div>
      </div>

      <!-- Tiempo de Respuesta -->
      <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-xs text-emerald-600 font-medium">-5ms</span>
        </div>
        <div class="text-2xl font-bold text-emerald-900">{{ metrics.tiempoRespuesta }}ms</div>
        <div class="text-sm text-emerald-700">Tiempo resp.</div>
      </div>

      <!-- Disponibilidad -->
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <span class="text-xs text-purple-600 font-medium">99.9%</span>
        </div>
        <div class="text-2xl font-bold text-purple-900">{{ metrics.disponibilidad }}%</div>
        <div class="text-sm text-purple-700">Disponibilidad</div>
      </div>

      <!-- Volumen de Datos -->
      <div class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
        <div class="flex items-center justify-between mb-2">
          <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
            </svg>
          </div>
          <span class="text-xs text-amber-600 font-medium">+2.1GB</span>
        </div>
        <div class="text-2xl font-bold text-amber-900">{{ metrics.volumenDatos }}</div>
        <div class="text-sm text-amber-700">GB procesados</div>
      </div>
    </div>

    <!-- Gráfico de Tendencias en Tiempo Real -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Tendencia de Transacciones (últimos 10 min)</h4>
      <div class="relative h-20 bg-gray-50 rounded-lg p-3">
        <!-- Mini gráfico SVG -->
        <svg class="w-full h-full" viewBox="0 0 300 60">
          <path 
            :d="chartPath"
            stroke="#3b82f6"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path 
            :d="chartAreaPath"
            fill="url(#gradient)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.5" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0" />
            </linearGradient>
          </defs>
        </svg>
        
        <!-- Etiquetas -->
        <div class="absolute bottom-1 left-3 text-xs text-gray-500">-10min</div>
        <div class="absolute bottom-1 right-3 text-xs text-gray-500">ahora</div>
      </div>
    </div>

    <!-- Estado de las APIs -->
    <div>
      <h4 class="text-sm font-medium text-gray-900 mb-3">Estado de Conexiones</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div 
          v-for="api in apis" 
          :key="api.name"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <div 
              :class="api.status === 'online' ? 'bg-green-500' : 'bg-red-500'"
              class="w-2 h-2 rounded-full"
            ></div>
            <span class="text-sm font-medium text-gray-900">{{ api.name }}</span>
          </div>
          <div class="text-xs text-gray-500">{{ api.latency }}ms</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Estado reactivo
const metrics = ref({
  transaccionesPorMinuto: 0,
  tiempoRespuesta: 0,
  disponibilidad: 99.9,
  volumenDatos: 0
})

const chartData = ref([])
const apis = ref([
  { name: 'Jumillano API', status: 'online', latency: 45 },
  { name: 'La Plata API', status: 'online', latency: 52 },
  { name: 'NAFA API', status: 'online', latency: 38 }
])

// Timer para actualizaciones
let updateInterval = null

// Computed properties
const chartPath = computed(() => {
  if (chartData.value.length < 2) return ''
  
  const points = chartData.value.map((value, index) => {
    const x = (index / (chartData.value.length - 1)) * 280 + 10
    const y = 50 - ((value / 100) * 40)
    return `${x},${y}`
  })
  
  return `M ${points.join(' L ')}`
})

const chartAreaPath = computed(() => {
  if (chartData.value.length < 2) return ''
  
  const points = chartData.value.map((value, index) => {
    const x = (index / (chartData.value.length - 1)) * 280 + 10
    const y = 50 - ((value / 100) * 40)
    return `${x},${y}`
  })
  
  return `M 10,50 L ${points.join(' L ')} L 290,50 Z`
})

// Métodos
const generateRandomData = () => {
  return Math.floor(Math.random() * 50) + 25
}

const updateMetrics = () => {
  // Simular datos en tiempo real
  metrics.value.transaccionesPorMinuto = Math.floor(Math.random() * 200) + 150
  metrics.value.tiempoRespuesta = Math.floor(Math.random() * 100) + 50
  metrics.value.volumenDatos = (Math.random() * 10 + 15).toFixed(1)
  
  // Actualizar datos del gráfico
  chartData.value.push(generateRandomData())
  if (chartData.value.length > 20) {
    chartData.value.shift()
  }
  
  // Simular cambios en latencia de APIs
  apis.value.forEach(api => {
    api.latency = Math.floor(Math.random() * 50) + 30
    // Ocasionalmente simular una API offline
    if (Math.random() < 0.02) {
      api.status = api.status === 'online' ? 'offline' : 'online'
    }
  })
}

// Lifecycle
onMounted(() => {
  // Inicializar datos del gráfico
  for (let i = 0; i < 20; i++) {
    chartData.value.push(generateRandomData())
  }
  
  // Actualizar métricas cada 3 segundos
  updateInterval = setInterval(updateMetrics, 3000)
  
  // Primera actualización inmediata
  updateMetrics()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
