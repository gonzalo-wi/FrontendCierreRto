<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
      </svg>
      Estado de Conexión a Plantas
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Ciudadela -->
      <div class="flex items-center p-3 rounded-lg border-2 transition-all duration-300"
           :class="getConnectionCardClass('jumillano')">
        <div class="flex-shrink-0 mr-3">
          <div class="w-3 h-3 rounded-full"
               :class="plantStatus.jumillano.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'">
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">Ciudadela</h4>
          <p class="text-sm"
             :class="plantStatus.jumillano.connected ? 'text-green-600' : 'text-red-600'">
            {{ plantStatus.jumillano.connected ? 'Conectada' : 'Desconectada' }}
          </p>
          <p class="text-xs text-gray-500">
            Últ. verificación: {{ formatLastCheck(plantStatus.jumillano.lastCheck) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <svg v-if="plantStatus.jumillano.connected" 
               class="w-6 h-6 text-green-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else 
               class="w-6 h-6 text-red-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- La Plata -->
      <div class="flex items-center p-3 rounded-lg border-2 transition-all duration-300"
           :class="getConnectionCardClass('laplata')">
        <div class="flex-shrink-0 mr-3">
          <div class="w-3 h-3 rounded-full"
               :class="plantStatus.laplata.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'">
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">La Plata</h4>
          <p class="text-sm"
             :class="plantStatus.laplata.connected ? 'text-green-600' : 'text-red-600'">
            {{ plantStatus.laplata.connected ? 'Conectada' : 'Desconectada' }}
          </p>
          <p class="text-xs text-gray-500">
            Últ. verificación: {{ formatLastCheck(plantStatus.laplata.lastCheck) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <svg v-if="plantStatus.laplata.connected" 
               class="w-6 h-6 text-green-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else 
               class="w-6 h-6 text-red-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>

      <!-- NAFA -->
      <div class="flex items-center p-3 rounded-lg border-2 transition-all duration-300"
           :class="getConnectionCardClass('nafa')">
        <div class="flex-shrink-0 mr-3">
          <div class="w-3 h-3 rounded-full"
               :class="plantStatus.nafa.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'">
          </div>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-gray-900">NAFA</h4>
          <p class="text-sm"
             :class="plantStatus.nafa.connected ? 'text-green-600' : 'text-red-600'">
            {{ plantStatus.nafa.connected ? 'Conectada' : 'Desconectada' }}
          </p>
          <p class="text-xs text-gray-500">
            Últ. verificación: {{ formatLastCheck(plantStatus.nafa.lastCheck) }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <svg v-if="plantStatus.nafa.connected" 
               class="w-6 h-6 text-green-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else 
               class="w-6 h-6 text-red-500" 
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Resumen general -->
    <div class="mt-4 p-3 rounded-lg"
         :class="getOverallStatusClass()">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" 
               :class="getOverallStatusIconClass()"
               fill="none" 
               stroke="currentColor" 
               viewBox="0 0 24 24">
            <path v-if="connectedPlantsCount === 3"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
            <path v-else-if="connectedPlantsCount === 0"
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
            <path v-else
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z">
            </path>
          </svg>
          <span class="font-medium">{{ getOverallStatusText() }}</span>
        </div>
        <div class="text-sm opacity-75">
          {{ connectedPlantsCount }}/3 plantas operativas
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Estado reactivo - Inicialmente asumimos que están conectadas
const plantStatus = ref({
  jumillano: { connected: true, lastCheck: new Date(), checking: false },
  laplata: { connected: true, lastCheck: new Date(), checking: false },
  nafa: { connected: true, lastCheck: new Date(), checking: false }
})

let connectionCheckInterval = null

// Computadas
const connectedPlantsCount = computed(() => {
  return Object.values(plantStatus.value).filter(plant => plant.connected).length
})

// Métodos
const checkPlantConnections = async () => {
  // Para propósitos de demo, mantenemos todas las plantas como conectadas
  // En producción, estas serían las URLs reales de verificación
  const plants = [
    { key: 'jumillano', name: 'Jumillano' },
    { key: 'laplata', name: 'La Plata' },
    { key: 'nafa', name: 'NAFA' }
  ]

  for (const plant of plants) {
    // Marcar como verificando
    plantStatus.value[plant.key].checking = true
    
    // Simular verificación (en producción sería una llamada real a la API)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Por ahora, mantenemos todas las plantas como conectadas
    // En producción, aquí harías: const response = await fetch(checkUrl)
    const wasConnected = plantStatus.value[plant.key].connected
    const isConnected = true // Cambiar por response.ok en producción
    
    plantStatus.value[plant.key] = {
      connected: isConnected,
      lastCheck: new Date(),
      checking: false
    }
    
    // Emitir evento si hay cambios
    if (wasConnected !== isConnected) {
      emitConnectionChange(plant.name, isConnected, wasConnected)
    }
  }
}

// Emitir eventos de cambio de conexión
const emitConnectionChange = (plantName, isConnected, wasConnected) => {
  const event = new CustomEvent('plant-connection-change', {
    detail: {
      plantName,
      isConnected,
      wasConnected
    }
  })
  window.dispatchEvent(event)
}

const getConnectionCardClass = (plantKey) => {
  const isConnected = plantStatus.value[plantKey].connected
  return isConnected 
    ? 'border-green-200 bg-green-50 hover:bg-green-100' 
    : 'border-red-200 bg-red-50 hover:bg-red-100'
}

const getOverallStatusClass = () => {
  const count = connectedPlantsCount.value
  if (count === 3) return 'bg-green-100 border border-green-200 text-green-800'
  if (count === 0) return 'bg-red-100 border border-red-200 text-red-800'
  return 'bg-yellow-100 border border-yellow-200 text-yellow-800'
}

const getOverallStatusIconClass = () => {
  const count = connectedPlantsCount.value
  if (count === 3) return 'text-green-600'
  if (count === 0) return 'text-red-600'
  return 'text-yellow-600'
}

const getOverallStatusText = () => {
  const count = connectedPlantsCount.value
  if (count === 3) return 'Todas las plantas operativas'
  if (count === 0) return 'Sin conexión a plantas'
  return 'Conexión parcial a plantas'
}

const formatLastCheck = (date) => {
  if (!date) return 'Nunca'
  
  const now = new Date()
  const diffMs = now - date
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  
  if (diffSeconds < 60) return 'Hace unos segundos'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  // Verificación inicial después de 2 segundos
  setTimeout(() => {
    checkPlantConnections()
  }, 2000)
  
  // Verificar conexiones cada 60 segundos (menos frecuente)
  connectionCheckInterval = setInterval(checkPlantConnections, 60000)
})

onUnmounted(() => {
  if (connectionCheckInterval) {
    clearInterval(connectionCheckInterval)
  }
})

// Exponer estado para uso externo
defineExpose({
  plantStatus,
  connectedPlantsCount,
  checkPlantConnections
})
</script>

<style scoped>
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
