<template>
  <div class="comprobantes-modal-overlay" @click="cerrarModal">
    <div class="comprobantes-modal-container" @click.stop>
      <!-- Header del modal -->
      <div class="modal-header">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Comprobantes - Reparto {{ reparto }}</h2>
            <p class="text-sm text-gray-600">Reparto #{{ reparto?.idReparto }}</p>
          </div>
        </div>
        <button 
          @click="cerrarModal"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Controles de fecha -->
      <div class="modal-controls">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Fecha:</label>
            <input 
              v-model="fechaSeleccionada"
              type="date"
              class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              @change="cargarComprobantesFecha"
            />
          </div>
          <button 
            @click="cargarComprobantesHoy"
            class="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm font-medium transition-colors"
          >
            Hoy
          </button>
          <button 
            @click="recargarComprobantes"
            class="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors"
          >
            Actualizar
          </button>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="modal-content">
        <ComprobantesViewer 
          v-if="reparto"
          :reparto="reparto.toString()"
          :fecha="fechaSeleccionada"
          :auto-load="false"
          ref="comprobantesViewer"
          @comprobantes-loaded="onComprobantesLoaded"
          @error="onError"
        />
      </div>

      <!-- Footer con información -->
      <div class="modal-footer">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4 text-sm text-gray-600">
            <span>{{ totalComprobantes }} comprobante{{ totalComprobantes !== 1 ? 's' : '' }}</span>
            <span v-if="ultimaActualizacion">
              Actualizado: {{ formatTime(ultimaActualizacion) }}
            </span>
          </div>
          <button 
            @click="cerrarModal"
            class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import ComprobantesViewer from './ComprobantesViewer.vue'

const props = defineProps({
  reparto: {
    type: [String, Number],
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

// Estado local
const fechaSeleccionada = ref(new Date().toISOString().split('T')[0])
const totalComprobantes = ref(0)
const ultimaActualizacion = ref(null)
const comprobantesViewer = ref(null)

// Cerrar modal
const cerrarModal = () => {
  emit('close')
}

// Cargar comprobantes para una fecha específica
const cargarComprobantesFecha = async () => {
  if (comprobantesViewer.value) {
    await comprobantesViewer.value.cargarComprobantes()
    ultimaActualizacion.value = new Date()
  }
}

// Cargar comprobantes de hoy
const cargarComprobantesHoy = () => {
  fechaSeleccionada.value = new Date().toISOString().split('T')[0]
  cargarComprobantesFecha()
}

// Recargar comprobantes
const recargarComprobantes = () => {
  cargarComprobantesFecha()
}

// Handlers de eventos
const onComprobantesLoaded = (comprobantes) => {
  totalComprobantes.value = comprobantes.length
  ultimaActualizacion.value = new Date()
}

const onError = (error) => {
  console.error('Error en modal de comprobantes:', error)
}

// Formatear tiempo
const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar automáticamente al montar
onMounted(() => {
  cargarComprobantesFecha()
})

// Manejar tecla Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    cerrarModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.comprobantes-modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
}

.comprobantes-modal-container {
  @apply w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  @apply flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50;
}

.modal-controls {
  @apply p-4 border-b border-gray-200 bg-gray-50;
}

.modal-content {
  @apply p-6 overflow-y-auto;
  max-height: calc(90vh - 200px);
}

.modal-footer {
  @apply p-4 border-t border-gray-200 bg-gray-50;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .comprobantes-modal-container {
    @apply max-w-full m-2 max-h-[95vh];
  }
  
  .modal-header {
    @apply p-4;
  }
  
  .modal-content {
    @apply p-4;
    max-height: calc(95vh - 180px);
  }
  
  .modal-controls {
    @apply p-3;
  }
  
  .modal-controls .flex {
    @apply flex-col space-x-0 space-y-3;
  }
  
  .modal-controls .flex > div:first-child {
    @apply flex-col space-x-0 space-y-2;
  }
}
</style>
