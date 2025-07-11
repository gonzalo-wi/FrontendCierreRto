<template>
  <div class="comprobantes-viewer">
    <!-- Header con información -->
    <div class="mb-6 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-xl font-bold text-slate-900 mb-1">
            Comprobantes de Depósito
          </h3>
          <p class="text-sm text-slate-600">
            Reparto {{ reparto }} • {{ comprobantes.length }} comprobante{{ comprobantes.length !== 1 ? 's' : '' }} encontrado{{ comprobantes.length !== 1 ? 's' : '' }}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-slate-700">En línea</span>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <LoadingSpinner />
      <div class="mt-4 text-center">
        <p class="text-lg font-medium text-slate-700 mb-2">Cargando comprobantes...</p>
        <p class="text-sm text-slate-500">Esta operación puede tardar unos momentos si hay muchos comprobantes</p>
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-blue-700">Tiempo límite: 60 segundos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-xl">
      <div class="flex items-start">
        <svg class="w-6 h-6 text-red-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar comprobantes</h3>
          <p class="text-red-700 text-sm mb-4 leading-relaxed">{{ error }}</p>
          
          <!-- Consejos específicos para timeout -->
          <div v-if="error.includes('60 segundos') || error.includes('timeout')" class="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-amber-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="text-sm text-amber-800">
                <p class="font-medium mb-1">Carga lenta detectada</p>
                <p>Este reparto puede tener muchos comprobantes. Puedes:</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Intentar de nuevo (puede tomar hasta 60 segundos)</li>
                  <li>Verificar tu conexión a internet</li>
                  <li>Contactar soporte si el problema persiste</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button 
            @click="cargarComprobantes"
            class="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Reintentar carga
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="comprobantes.length === 0" class="text-center py-8">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Sin comprobantes</h3>
      <p class="text-gray-600">No se encontraron comprobantes para esta fecha</p>
    </div>

    <!-- Grid de comprobantes -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="(comprobante, index) in comprobantes" 
        :key="comprobante.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-slate-200"
      >
        <!-- Header del comprobante -->
        <div class="p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-bold text-slate-900 text-lg">Comprobante {{ index + 1 }}</h4>
              <p class="text-xs text-slate-500 mt-1">{{ formatDateTime(comprobante.created_at) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Badge de tipo si está disponible -->
              <span v-if="comprobante.tipo" 
                    :class="getTipoBadgeClass(comprobante.tipo)"
                    class="px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide">
                {{ comprobante.tipo }}
              </span>
              <!-- Botón de descarga -->
              <button 
                @click="descargarImagen(comprobante.id)"
                class="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Descargar comprobante"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Imagen del comprobante -->
        <div class="relative aspect-[4/3] bg-slate-100">
          <img 
            :src="getImageUrl(comprobante.id)"
            :alt="`Comprobante de depósito ${index + 1}`"
            class="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
            @click="abrirImagenModal(comprobante, index)"
            @error="onImageError($event, comprobante.id)"
            @load="onImageLoad(comprobante.id)"
          />
          
          <!-- Overlay con acciones -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button 
              @click="abrirImagenModal(comprobante, index)"
              class="px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors transform scale-95 group-hover:scale-100"
            >
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Ver detalles
            </button>
          </div>

          <!-- Loading overlay para imágenes -->
          <div v-if="loadingImages.has(comprobante.id)" 
               class="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>

          <!-- Error overlay -->
          <div v-if="errorImages.has(comprobante.id)"
               class="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <p class="text-xs text-gray-500">Error al cargar</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para ver imagen completa -->
    <div v-if="imagenModal.visible" 
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm"
         @click="cerrarImagenModal">
      <div class="relative max-w-5xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl" @click.stop>
        <!-- Header del modal -->
        <div class="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900">
                Comprobante {{ imagenModal.index + 1 }}
              </h3>
              <p class="text-sm text-slate-600">Reparto {{ reparto }}</p>
            </div>
          </div>
          <button 
            @click="cerrarImagenModal"
            class="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Imagen del modal -->
        <div class="p-6 bg-slate-50">
          <div class="relative bg-white rounded-lg shadow-inner p-4">
            <img 
              :src="getImageUrl(imagenModal.comprobante?.id)"
              :alt="`Comprobante de depósito ${imagenModal.index + 1}`"
              class="w-full h-auto max-h-[60vh] object-contain mx-auto"
            />
          </div>
        </div>

        <!-- Acciones del modal -->
        <div class="flex items-center justify-between p-6 border-t border-slate-200 bg-white">
          <div class="text-sm text-slate-600">
            <span class="font-medium">Fecha:</span> {{ formatDateTime(imagenModal.comprobante?.created_at) }}
          </div>
          <div class="flex items-center space-x-3">
            <button 
              @click="descargarImagen(imagenModal.comprobante?.id)"
              class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Descargar</span>
            </button>
            <button 
              @click="cerrarImagenModal"
              class="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import comprobantesService from '../services/ComprobantesService.js'
import LoadingSpinner from './LoadingSpinner.vue'
import { config } from '../config/config.js'

const props = defineProps({
  reparto: {
    type: String,
    required: true
  },
  fecha: {
    type: String,
    default: () => new Date().toISOString().split('T')[0] // YYYY-MM-DD
  },
  autoLoad: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['comprobantes-loaded', 'error'])

// Estado reactivo
const comprobantes = ref([])
const loading = ref(false)
const error = ref(null)
const loadingImages = reactive(new Set())
const errorImages = reactive(new Set())

// Modal para imagen completa
const imagenModal = reactive({
  visible: false,
  comprobante: null,
  index: 0
})

// Cargar comprobantes
const cargarComprobantes = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Usar función con fallback actualizada (solo comprobantes reales, sin simulados)
    const data = await comprobantesService.getComprobantesConFallback(props.reparto, props.fecha)
    comprobantes.value = data
    emit('comprobantes-loaded', data)
  } catch (err) {
    error.value = err.message
    emit('error', err)
  } finally {
    loading.value = false
  }
}

// Obtener URL de imagen
const getImageUrl = (id) => {
  // Siempre intentar primero la imagen real de la API externa
  return comprobantesService.getComprobanteImageUrl(id, true)
}

// Función asíncrona para obtener URL segura (opcional, para uso futuro)
const getSafeImageUrl = async (id) => {
  try {
    return await comprobantesService.getSafeImageUrl(id)
  } catch (error) {
    console.warn(`Error obteniendo URL segura para ${id}:`, error)
    return comprobantesService.getMockImageUrl(id)
  }
}

// Handlers para imágenes
const onImageLoad = (id) => {
  loadingImages.delete(id)
  errorImages.delete(id)
  console.log(`✅ Imagen REAL ${id} cargada correctamente desde la API`)
}

const onImageError = (event, id) => {
  loadingImages.delete(id)
  console.warn(`⚠️ Imagen real ${id} no encontrada, aplicando fallback SVG`)
  
  // Usar fallback SVG inline generado por el servicio
  const fallbackUrl = comprobantesService.getMockImageUrl(id)
  
  // Solo cambiar la URL si es diferente para evitar loops infinitos
  if (event.target.src !== fallbackUrl) {
    event.target.src = fallbackUrl
    console.log(`🔄 Fallback aplicado para imagen ${id}`)
  }
  
  // Remover del set de errores después de aplicar el fallback
  setTimeout(() => {
    errorImages.delete(id)
  }, 100)
}

// Modal de imagen
const abrirImagenModal = (comprobante, index) => {
  imagenModal.comprobante = comprobante
  imagenModal.index = index
  imagenModal.visible = true
  document.body.style.overflow = 'hidden'
}

const cerrarImagenModal = () => {
  imagenModal.visible = false
  imagenModal.comprobante = null
  imagenModal.index = 0
  document.body.style.overflow = 'auto'
}

// Descargar imagen
const descargarImagen = (id) => {
  const url = getImageUrl(id)
  const link = document.createElement('a')
  link.href = url
  link.download = `comprobante-${id}.jpg`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Funciones de formato
const formatDate = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (fechaHora) => {
  return new Date(fechaHora).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTipoBadgeClass = (tipo) => {
  const classes = {
    'cheque': 'bg-blue-100 text-blue-800',
    'retencion': 'bg-green-100 text-green-800',
    'efectivo': 'bg-yellow-100 text-yellow-800'
  }
  return classes[tipo] || 'bg-gray-100 text-gray-800'
}

// Watchers
watch([() => props.reparto, () => props.fecha], () => {
  if (props.autoLoad) {
    cargarComprobantes()
  }
})

// Lifecycle
onMounted(() => {
  if (props.autoLoad) {
    cargarComprobantes()
  }
})

// Exponer funciones para uso externo
defineExpose({
  cargarComprobantes,
  comprobantes: computed(() => comprobantes.value),
  loading: computed(() => loading.value),
  error: computed(() => error.value)
})
</script>

<style scoped>
/* Estilos adicionales */
.comprobantes-viewer {
  width: 100%;
}

/* Efectos de hover suaves */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Animación para el modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Mejores sombras y efectos */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
