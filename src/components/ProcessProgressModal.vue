<template>
  <!-- Modal de progreso profesional -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop con blur -->
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"></div>
    
    <!-- Modal container -->
    <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="bg-white/20 p-2 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Procesando Repartos</h3>
              <p class="text-blue-100 text-sm">{{ totalRepartos }} repartos en proceso</p>
            </div>
          </div>
          
          <!-- Progress general -->
          <div class="hidden md:flex items-center space-x-4">
            <div class="text-right">
              <div class="text-white font-semibold">{{ completados }}/{{ totalRepartos }}</div>
              <div class="text-blue-100 text-sm">{{ Math.round(porcentajeGeneral) }}% completado</div>
            </div>
            <div class="w-20 h-20 relative">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  stroke-width="2"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="white"
                  stroke-width="2"
                  :stroke-dasharray="`${porcentajeGeneral}, 100`"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-white font-bold text-sm">{{ Math.round(porcentajeGeneral) }}%</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Barra de progreso general (móvil) -->
        <div class="md:hidden mt-4">
          <div class="flex items-center justify-between text-white text-sm mb-2">
            <span>Progreso general</span>
            <span>{{ completados }}/{{ totalRepartos }} ({{ Math.round(porcentajeGeneral) }}%)</span>
          </div>
          <div class="w-full bg-white/20 rounded-full h-2">
            <div 
              class="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${porcentajeGeneral}%` }"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Estadísticas resumen -->
      <div class="bg-gray-50 px-6 py-4 border-b">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ exitosos }}</div>
            <div class="text-sm text-gray-600">Exitosos</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-600">{{ procesandoCount }}</div>
            <div class="text-sm text-gray-600">Procesando</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-red-600">{{ errores }}</div>
            <div class="text-sm text-gray-600">Errores</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-500">{{ pendientes }}</div>
            <div class="text-sm text-gray-600">Pendientes</div>
          </div>
        </div>
      </div>
      
      <!-- Lista de repartos con scroll -->
      <div class="max-h-96 overflow-y-auto">
        <div class="divide-y divide-gray-100">
          <div 
            v-for="reparto in repartos" 
            :key="reparto.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center justify-between">
              <!-- Info del reparto -->
              <div class="flex items-center space-x-4">
                <!-- Icono de estado -->
                <div class="flex-shrink-0">
                  <!-- Pendiente -->
                  <div v-if="reparto.estado === 'pendiente'" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  
                  <!-- Procesando -->
                  <div v-else-if="reparto.estado === 'procesando'" class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  
                  <!-- Exitoso -->
                  <div v-else-if="reparto.estado === 'exitoso'" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <!-- Error -->
                  <div v-else-if="reparto.estado === 'error'" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                
                <!-- Detalles del reparto -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      Reparto #{{ reparto.idReparto }}
                    </p>
                    <span class="text-xs text-gray-500">{{ reparto.cuenta }}</span>
                  </div>
                  <div class="flex items-center space-x-4 mt-1">
                    <p class="text-xs text-gray-500">{{ reparto.nombre }}</p>
                    <span v-if="reparto.mensaje" class="text-xs text-gray-400 truncate max-w-xs">
                      {{ reparto.mensaje }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Estado y tiempo -->
              <div class="flex items-center space-x-4">
                <!-- Badge de estado -->
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-gray-100 text-gray-800': reparto.estado === 'pendiente',
                    'bg-blue-100 text-blue-800': reparto.estado === 'procesando',
                    'bg-green-100 text-green-800': reparto.estado === 'exitoso',
                    'bg-red-100 text-red-800': reparto.estado === 'error'
                  }">
                  {{ estadoTexto(reparto.estado) }}
                </span>
                
                <!-- Tiempo transcurrido para los que están procesando -->
                <span v-if="reparto.estado === 'procesando' && reparto.tiempoInicio" class="text-xs text-gray-500">
                  {{ tiempoTranscurrido(reparto.tiempoInicio) }}s
                </span>
              </div>
            </div>
            
            <!-- Mensaje de error expandido -->
            <div v-if="reparto.estado === 'error' && reparto.error" class="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
              {{ reparto.error }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <!-- Tiempo estimado -->
        <div class="text-sm text-gray-600">
          <span v-if="tiempoEstimado > 0">
            Tiempo estimado: {{ Math.ceil(tiempoEstimado) }}s
          </span>
          <span v-else-if="completado">
            ✅ Proceso completado en {{ tiempoTotal }}s
          </span>
          <span v-else>
            Iniciando proceso...
          </span>
        </div>
        
        <!-- Botones -->
        <div class="flex space-x-3">
          <button 
            @click="cerrarModal"
            :disabled="!puedeOcultar"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
            :class="completado 
              ? 'text-white bg-blue-600 hover:bg-blue-700' 
              : 'text-gray-700 bg-gray-200 hover:bg-gray-300'"
          >
            {{ completado ? 'Finalizar' : 'Ocultar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  repartos: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['cerrar'])

// Estado interno
const tiempoInicio = ref(null)
const pausado = ref(false)
const intervalTimer = ref(null)

// Computed
const totalRepartos = computed(() => props.repartos.length)

const completados = computed(() => 
  props.repartos.filter(r => r.estado === 'exitoso' || r.estado === 'error').length
)

const exitosos = computed(() => 
  props.repartos.filter(r => r.estado === 'exitoso').length
)

const errores = computed(() => 
  props.repartos.filter(r => r.estado === 'error').length
)

const procesandoCount = computed(() => 
  props.repartos.filter(r => r.estado === 'procesando').length
)

const pendientes = computed(() => 
  props.repartos.filter(r => r.estado === 'pendiente').length
)

const porcentajeGeneral = computed(() => 
  totalRepartos.value > 0 ? (completados.value / totalRepartos.value) * 100 : 0
)

const completado = computed(() => 
  completados.value === totalRepartos.value && totalRepartos.value > 0
)

const puedeOcultar = computed(() => 
  completado.value || confirm('¿Estás seguro de que quieres ocultar el progreso? El proceso continuará en segundo plano.')
)

const tiempoTotal = computed(() => {
  if (!tiempoInicio.value || !completado.value) return 0
  return Math.ceil((Date.now() - tiempoInicio.value) / 1000)
})

const tiempoEstimado = computed(() => {
  if (completados.value === 0 || pendientes.value === 0) return 0
  const tiempoTranscurrido = (Date.now() - tiempoInicio.value) / 1000
  const velocidadPromedio = completados.value / tiempoTranscurrido
  return pendientes.value / velocidadPromedio
})

// Funciones
const estadoTexto = (estado) => {
  const estados = {
    'pendiente': 'Pendiente',
    'procesando': 'Procesando',
    'exitoso': 'Exitoso',
    'error': 'Error'
  }
  return estados[estado] || estado
}

const tiempoTranscurrido = (inicio) => {
  if (!inicio) return 0
  return Math.ceil((Date.now() - inicio) / 1000)
}

const cerrarModal = () => {
  if (puedeOcultar.value) {
    emit('cerrar')
  }
}

// Watchers
watch(() => props.visible, (visible) => {
  if (visible && !tiempoInicio.value) {
    tiempoInicio.value = Date.now()
  }
})

// Lifecycle
onMounted(() => {
  // Timer para actualizar tiempos transcurridos
  intervalTimer.value = setInterval(() => {
    // Forzar reactividad para actualizar tiempos
  }, 1000)
})

onUnmounted(() => {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value)
  }
})
</script>

<style scoped>
/* Animaciones suaves para transiciones */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Scroll personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animación del spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
