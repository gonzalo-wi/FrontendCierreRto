<template>
  <div class="mb-8">
    <div class="flex items-center space-x-3 mb-6">
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Totales por Planta</h2>
        <p class="text-gray-600">Resumen consolidado de depósitos reales</p>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Skeleton para Jumillano -->
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
        <div>
          <h3 class="text-lg font-semibold text-red-800">Error al cargar totales</h3>
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
      <button @click="fetchTotales" class="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
        Reintentar
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="totals-card bg-gradient-to-br from-blue-500 to-blue-600">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white text-lg font-semibold mb-1">Jumillano</h3>
            <p class="text-blue-100 text-sm">Total depósitos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ totalesFormateados?.jumillano || '$0' }}</p>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-purple-500 to-purple-600">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white text-lg font-semibold mb-1">La Plata</h3>
            <p class="text-purple-100 text-sm">Total depósitos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ totalesFormateados?.laplata || '$0' }}</p>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-indigo-500 to-indigo-600">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white text-lg font-semibold mb-1">NAFA</h3>
            <p class="text-indigo-100 text-sm">Total depósitos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ totalesFormateados?.nafa || '$0' }}</p>
          </div>
        </div>
      </div>

      <div class="totals-card bg-gradient-to-br from-emerald-500 to-emerald-600">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-white text-lg font-semibold mb-1">Total General</h3>
            <p class="text-emerald-100 text-sm">Todas las plantas</p>
            <p class="text-2xl font-bold text-white mt-2">{{ totalesFormateados?.totalGeneral || '$0' }}</p>
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

const loading = ref(false)
const error = ref(null)
const totalesFormateados = ref(null)

const fetchTotales = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('Cargando totales para fecha:', props.fechaSeleccionada)
    const totales = await TotalsService.getTotales(props.fechaSeleccionada)
    totalesFormateados.value = TotalsService.formatearTotales(totales)
    console.log('Totales cargados:', totalesFormateados.value)
  } catch (err) {
    console.error('Error al cargar totales:', err)
    error.value = err.message || 'Error al cargar los totales'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTotales()
})

watch(() => props.fechaSeleccionada, (newFecha) => {
  if (newFecha) {
    fetchTotales()
  }
})
</script>

<style scoped>
.totals-card {
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.totals-card:hover {
  box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);
  transform: scale(1.05);
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
</style>
