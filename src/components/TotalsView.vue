<template>
  <div class="mb-8">
    <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 sm:p-3 rounded-xl shadow-lg">
        <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Totales por Planta</h2>
        <p class="text-sm sm:text-base text-gray-600">Resumen consolidado de depósitos reales</p>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <!-- Skeleton para Ciudadela -->
      <div class="totals-card bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="w-full">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div class="w-20 h-5 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
            <div class="w-32 h-4 bg-white bg-opacity-20 rounded animate-pulse mb-3"></div>
            <div class="w-24 h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
          </div>
        </div>
        <!-- Efecto de shimmer -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-10 to-transparent shimmer"></div>
      </div>

      <!-- Skeleton para La Plata -->
      <div class="totals-card bg-gradient-to-br from-purple-500 to-purple-600 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="w-full">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div class="w-20 h-5 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
            <div class="w-32 h-4 bg-white bg-opacity-20 rounded animate-pulse mb-3"></div>
            <div class="w-24 h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-10 to-transparent shimmer"></div>
      </div>

      <!-- Skeleton para NAFA -->
      <div class="totals-card bg-gradient-to-br from-emerald-500 to-emerald-600 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="w-full">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div class="w-20 h-5 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
            <div class="w-32 h-4 bg-white bg-opacity-20 rounded animate-pulse mb-3"></div>
            <div class="w-24 h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-10 to-transparent shimmer"></div>
      </div>

      <!-- Skeleton para Total General -->
      <div class="totals-card bg-gradient-to-br from-amber-500 to-amber-600 relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="w-full">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
              <div class="w-24 h-5 bg-white bg-opacity-20 rounded animate-pulse"></div>
            </div>
            <div class="w-32 h-4 bg-white bg-opacity-20 rounded animate-pulse mb-3"></div>
            <div class="w-28 h-8 bg-white bg-opacity-20 rounded animate-pulse"></div>
          </div>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white via-opacity-10 to-transparent shimmer"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-800">Error al cargar totales</h3>
          <p class="text-red-600 text-sm mt-1">{{ error }}</p>
          <p class="text-red-500 text-xs mt-2">
            Verifique la conexión al servidor o intente nuevamente
          </p>
        </div>
      </div>
      <div class="flex space-x-3 mt-4">
        <button 
          @click="retryWithClearCache" 
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Limpiar caché y reintentar
        </button>
        <button 
          @click="fetchTotales" 
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div class="totals-card bg-gradient-to-br from-blue-500 to-blue-600">
        <div class="flex items-center justify-between">
          <div class="w-full text-center sm:text-left">
            <h3 class="text-white text-base sm:text-lg font-semibold mb-1">Ciudadela</h3>
            <p class="text-blue-100 text-xs sm:text-sm">Total depósitos</p>
            <div class="mt-2">
              <!-- Versión completa para pantallas grandes -->
              <p class="hidden sm:block text-lg lg:text-2xl font-bold text-white break-all">
                {{ totalesFormateados?.jumillano || '$0' }}
              </p>
              <!-- Versión compacta para móviles -->
              <p class="sm:hidden text-lg font-bold text-white">
                {{ formatearMontoResponsivo(totalesFormateados?.jumillanoNumerico) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-purple-500 to-purple-600">
        <div class="flex items-center justify-between">
          <div class="w-full text-center sm:text-left">
            <h3 class="text-white text-base sm:text-lg font-semibold mb-1">La Plata</h3>
            <p class="text-purple-100 text-xs sm:text-sm">Total depósitos</p>
            <div class="mt-2">
              <p class="hidden sm:block text-lg lg:text-2xl font-bold text-white break-all">
                {{ totalesFormateados?.laplata || '$0' }}
              </p>
              <p class="sm:hidden text-lg font-bold text-white">
                {{ formatearMontoResponsivo(totalesFormateados?.laplataNumerico) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-indigo-500 to-indigo-600">
        <div class="flex items-center justify-between">
          <div class="w-full text-center sm:text-left">
            <h3 class="text-white text-base sm:text-lg font-semibold mb-1">NAFA</h3>
            <p class="text-indigo-100 text-xs sm:text-sm">Total depósitos</p>
            <div class="mt-2">
              <p class="hidden sm:block text-lg lg:text-2xl font-bold text-white break-all">
                {{ totalesFormateados?.nafa || '$0' }}
              </p>
              <p class="sm:hidden text-lg font-bold text-white">
                {{ formatearMontoResponsivo(totalesFormateados?.nafaNumerico) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-emerald-500 to-emerald-600">
        <div class="flex items-center justify-between">
          <div class="w-full text-center sm:text-left">
            <h3 class="text-white text-base sm:text-lg font-semibold mb-1">Total General</h3>
            <p class="text-emerald-100 text-xs sm:text-sm">Todas las plantas</p>
            <div class="mt-2">
              <p class="hidden sm:block text-lg lg:text-2xl font-bold text-white break-all">
                {{ totalesFormateados?.totalGeneral || '$0' }}
              </p>
              <p class="sm:hidden text-lg font-bold text-white">
                {{ formatearMontoResponsivo(totalesFormateados?.totalGeneralNumerico) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TotalsService from '../services/TotalsService.js'

const props = defineProps({
  fechaSeleccionada: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['totales-cargados'])

const loading = ref(false)
const error = ref(null)
const totalesFormateados = ref(null)

// Control de peticiones concurrentes
let currentRequestId = 0

// Función para formatear montos de manera compacta en móviles
const formatearMontoResponsivo = (monto) => {
  if (!monto || monto === 0) return '$0'
  
  // Usar formato compacto para móviles (se muestra con CSS sm:hidden)
  if (monto >= 1000000000) {
    return '$' + (monto / 1000000000).toFixed(1) + 'B'
  }
  if (monto >= 1000000) {
    return '$' + (monto / 1000000).toFixed(1) + 'M'
  }
  if (monto >= 1000) {
    return '$' + (monto / 1000).toFixed(1) + 'K'
  }
  return '$' + monto.toFixed(0)
}

const fetchTotales = async () => {
  // Prevenir múltiples llamadas simultáneas
  if (loading.value) {
    console.log('⏳ Ya hay una petición de totales en curso, ignorando...')
    return
  }
  
  loading.value = true
  error.value = null
  
  // Asignar ID único a esta petición
  const requestId = ++currentRequestId
  
  try {
    console.log(`🔍 [Request ${requestId}] Cargando totales para fecha:`, props.fechaSeleccionada)
    const totales = await TotalsService.getTotales(props.fechaSeleccionada)
    
    // Verificar si esta respuesta sigue siendo relevante
    if (requestId !== currentRequestId) {
      console.log(`⚠️ [Request ${requestId}] Respuesta descartada, nueva petición en curso`)
      return
    }
    
    // Validar que los datos sean consistentes
    if (!totales || typeof totales !== 'object') {
      throw new Error('Datos de totales inválidos recibidos')
    }
    
    // Validar que los números sean válidos
    const validarNumero = (num, nombre) => {
      if (typeof num !== 'number' || isNaN(num) || num < 0) {
        console.warn(`⚠️ Valor inválido para ${nombre}:`, num)
        return 0
      }
      return num
    }
    
    const totalesValidados = {
      fecha: totales.fecha,
      jumillano: validarNumero(totales.jumillano, 'jumillano'),
      laplata: validarNumero(totales.laplata, 'laplata'),
      nafa: validarNumero(totales.nafa, 'nafa'),
      totalGeneral: validarNumero(totales.totalGeneral, 'totalGeneral')
    }
    
    totalesFormateados.value = TotalsService.formatearTotales(totalesValidados)
    console.log(`✅ [Request ${requestId}] Totales cargados:`, totalesFormateados.value)
    
    // Emitir los datos sin formatear para que los gráficos los usen
    emit('totales-cargados', {
      jumillano: totalesValidados.jumillano,
      laplata: totalesValidados.laplata,
      nafa: totalesValidados.nafa,
      totalGeneral: totalesValidados.totalGeneral,
      fecha: totalesValidados.fecha
    })
  } catch (err) {
    // Solo procesar el error si esta petición sigue siendo relevante
    if (requestId !== currentRequestId) {
      console.log(`⚠️ [Request ${requestId}] Error descartado, nueva petición en curso`)
      return
    }
    
    console.error(`❌ [Request ${requestId}] Error al cargar totales:`, err)
    error.value = err.message || 'Error al cargar los totales'
    
    // Emitir datos vacíos en caso de error
    emit('totales-cargados', {
      jumillano: 0,
      laplata: 0,
      nafa: 0,
      totalGeneral: 0,
      fecha: props.fechaSeleccionada
    })
  } finally {
    // Solo cambiar loading si esta petición sigue siendo relevante
    if (requestId === currentRequestId) {
      loading.value = false
    }
  }
}

// Función para reintentar limpiando el caché
const retryWithClearCache = () => {
  console.log('🔄 Limpiando caché y reintentando...')
  TotalsService.clearCache()
  currentRequestId = 0 // Resetear contador de peticiones
  fetchTotales()
}

onMounted(() => {
  fetchTotales()
})

watch(() => props.fechaSeleccionada, (newFecha, oldFecha) => {
  // Solo cargar si la fecha realmente cambió
  if (newFecha && newFecha !== oldFecha) {
    console.log('📅 Fecha cambió de', oldFecha, 'a', newFecha)
    fetchTotales()
  }
}, { flush: 'post' }) // Ejecutar después del render)
</script>

<style scoped>
.totals-card {
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  align-items: center;
}

/* Responsive padding para las cards */
@media (min-width: 640px) {
  .totals-card {
    padding: 1.5rem;
    min-height: 140px;
  }
}

.totals-card:hover {
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);
  transform: scale(1.02);
}

/* En móviles, reducir el hover effect */
@media (max-width: 640px) {
  .totals-card:hover {
    transform: scale(1.01);
  }
}

/* Animación shimmer para loading */
.shimmer {
  animation: shimmer 2s infinite;
  transform: translateX(-100%);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Asegurar que los números largos se ajusten bien */
.totals-card p {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Mejoras específicas para el texto en móviles */
@media (max-width: 640px) {
  .totals-card {
    text-align: center;
  }
  
  .totals-card h3 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .totals-card p:last-child {
    font-size: 1rem;
    line-height: 1.2;
  }
}
</style>
