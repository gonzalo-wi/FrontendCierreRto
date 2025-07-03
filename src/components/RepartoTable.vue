<template>
  <div class="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm">
    <!-- Header de la tabla mejorado -->
    <div class="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6 border-b border-gray-200/60">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-4">
          <!-- Icono decorativo -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
            </svg>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ title }}</h2>
            <div class="flex items-center space-x-2">
              <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ filteredRepartos.length }} de {{ repartos.length }} registros
              </div>
              <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Actualizado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de actualizar mejorado -->
        <button 
          @click="$emit('refresh')" 
          class="refresh-btn group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
        >
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Actualizar</span>
          </div>
          <!-- Efecto de shimmer -->
          <div class="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/20 to-transparent group-hover:top-full transition-all duration-1000"></div>
        </button>
      </div>

      <!-- Barra de filtros y búsqueda -->
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <!-- Filtros de búsqueda -->
        <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <!-- Búsqueda por RTO -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchRTO"
              type="text"
              placeholder="Buscar por RTO..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
            />
          </div>

          <!-- Filtro por estado -->
          <select
            v-model="estadoFilter"
            class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Todos los estados</option>
            <option value="EXACTO">Exactos</option>
            <option value="DIFERENCIA">Con diferencias</option>
            <option value="PENDIENTE">Pendientes</option>
          </select>

          <!-- Botón limpiar filtros -->
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Limpiar
          </button>
        </div>

        <!-- Controles de paginación y vista -->
        <div class="flex items-center space-x-3">
          <!-- Selector de elementos por página -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-700">Mostrar:</span>
            <select
              v-model="itemsPerPage"
              class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="filteredRepartos.length">Todos</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla responsive mejorada -->
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gradient-to-r from-gray-50 to-slate-50">
          <tr>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                </svg>
                <span>ID Reparto</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Fecha</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span>Depósito Esperado</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                <span>Depósito Real</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                <span>Diferencia</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Estado</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Movimiento</span>
              </div>
            </th>
            <th class="table-header group">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
                <span>Acciones</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
          <RepartoRow 
            v-for="(reparto, index) in paginatedRepartos" 
            :key="reparto.idReparto" 
            :reparto="reparto"
            :class="{ 'animate-row': true }"
            :style="{ animationDelay: `${index * 50}ms` }"
            @edit="$emit('edit', $event)"
            @delete-movement="$emit('delete-movement', $event)"
          />
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <!-- Información de paginación -->
          <div class="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredRepartos.length }} resultados
            </span>
          </div>

          <!-- Controles de paginación -->
          <div class="flex items-center space-x-2">
            <!-- Botón anterior -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Números de página -->
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                ...
              </span>
            </template>

            <!-- Botón siguiente -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state bonito -->
      <div v-if="loading" class="px-8 py-12">
        <div class="text-center mb-8">
          <div class="inline-flex items-center space-x-3">
            <!-- Spinner animado -->
            <div class="relative">
              <div class="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div class="absolute inset-0 w-8 h-8 border-4 border-transparent border-b-blue-400 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
            </div>
            <span class="text-lg font-semibold text-gray-700">Cargando repartos...</span>
          </div>
        </div>
        
        <!-- Skeleton de la tabla -->
        <div class="overflow-hidden">
          <!-- Header skeleton -->
          <div class="grid grid-cols-6 gap-4 py-4 px-6 bg-gray-50 border-b">
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          <!-- Rows skeleton -->
          <div v-for="i in 8" :key="i" class="grid grid-cols-6 gap-4 py-4 px-6 border-b border-gray-100">
            <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-100 rounded animate-pulse"></div>
            <div class="flex space-x-2">
              <div class="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
              <div class="h-6 w-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state mejorado -->
      <div v-else-if="filteredRepartos.length === 0" class="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-md mx-auto">
          <!-- Icono animado -->
          <div class="mb-6 relative">
            <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-blue-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <!-- Anillos decorativos -->
            <div class="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-20"></div>
            <div class="absolute inset-2 rounded-full border-2 border-blue-300 animate-pulse opacity-30"></div>
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ hasActiveFilters ? 'No hay resultados para los filtros aplicados' : 'No hay repartos disponibles' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ hasActiveFilters ? 'Intenta cambiar los criterios de búsqueda.' : 'No se encontraron repartos registrados en el sistema.' }}
          </p>
          
          <!-- Botón de acción -->
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mr-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Limpiar filtros</span>
          </button>
          <button 
            @click="$emit('refresh')"
            class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Actualizar datos</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import RepartoRow from './RepartoRow.vue'

const props = defineProps({
  repartos: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Repartos'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['refresh', 'edit', 'delete-movement'])

// Estados para filtros
const searchRTO = ref('')
const estadoFilter = ref('')

// Estados para paginación
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Filtros computados
const filteredRepartos = computed(() => {
  let filtered = [...props.repartos]

  // Filtro por RTO
  if (searchRTO.value.trim()) {
    const searchTerm = searchRTO.value.toLowerCase().trim()
    filtered = filtered.filter(reparto => 
      reparto.idReparto?.toLowerCase().includes(searchTerm) ||
      reparto.id?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtro por estado
  if (estadoFilter.value) {
    filtered = filtered.filter(reparto => reparto.estado === estadoFilter.value)
  }

  return filtered
})

// Paginación computada
const totalPages = computed(() => {
  if (itemsPerPage.value >= filteredRepartos.value.length) return 1
  return Math.ceil(filteredRepartos.value.length / itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRepartos.value.length))

const paginatedRepartos = computed(() => {
  if (itemsPerPage.value >= filteredRepartos.value.length) {
    return filteredRepartos.value
  }
  return filteredRepartos.value.slice(startIndex.value, endIndex.value)
})

// Páginas visibles para la paginación
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Mostrar todas las páginas si son pocas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas con elipsis
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return searchRTO.value.trim() !== '' || estadoFilter.value !== ''
})

// Funciones para manejar filtros
const clearFilters = () => {
  searchRTO.value = ''
  estadoFilter.value = ''
  currentPage.value = 1
}

// Funciones para manejar paginación
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Watchers para resetear página cuando cambian los filtros
watch([searchRTO, estadoFilter, itemsPerPage], () => {
  currentPage.value = 1
})

// Watcher para asegurarse de que la página actual sea válida
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal
  }
})
</script>

<style scoped>
/* Estilos profesionales para la tabla */

/* Header de tabla mejorado */
.table-header {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  position: relative;
}

.table-header:hover {
  background-color: #f3f4f6;
  border-bottom-color: #3b82f6;
}

.table-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.table-header:hover::after {
  width: 100%;
}

/* Botón de actualizar con efectos */
.refresh-btn {
  position: relative;
  overflow: hidden;
}

.refresh-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.refresh-btn:hover::before {
  left: 100%;
}

/* Animación para las filas */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-row {
  animation: slideInUp 0.5s ease-out both;
}

/* Efectos hover para la tabla */
tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: scale(1.01);
  border-left: 4px solid #3b82f6;
}

/* Mejoras visuales para bordes y sombras */
.bg-white {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

/* Estados de loading y empty mejorados */
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -10px, 0);
  }
  70% {
    transform: translate3d(0, -5px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

/* Efectos de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Gradientes y sombras modernas */
.shadow-2xl {
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

/* Animación de pulsing para indicadores */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animación de ping para efectos decorativos */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Estilos responsive mejorados */
@media (max-width: 768px) {
  .table-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .refresh-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

/* Transiciones suaves para todos los elementos */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Efecto de enfoque mejorado */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Efectos adicionales para mejorar la experiencia visual */
.table-header svg {
  transition: transform 0.3s ease, color 0.3s ease;
}

.table-header:hover svg {
  transform: scale(1.1);
}

/* Animación de entrada suave para la tabla completa */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.bg-white.shadow-2xl {
  animation: fadeInScale 0.4s ease-out;
}

/* Efectos de hover para badges y elementos interactivos */
.bg-blue-100 {
  transition: all 0.3s ease;
}

.bg-blue-100:hover {
  background-color: #dbeafe;
  transform: scale(1.05);
}

.bg-green-100 {
  transition: all 0.3s ease;
}

.bg-green-100:hover {
  background-color: #dcfce7;
  transform: scale(1.05);
}
</style>
