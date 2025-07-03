<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <!-- Header de la tabla -->
    <div class="flex items-center justify-between p-6 border-b border-gray-200">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-600">{{ subtitle }}</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Búsqueda -->
        <div class="relative">
          <svg class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            v-model="searchTerm"
            type="text" 
            placeholder="Buscar..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            @input="onSearch"
          />
        </div>
        
        <!-- Selector de elementos por página -->
        <select 
          v-model="itemsPerPage"
          @change="onItemsPerPageChange"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="10">10 por página</option>
          <option value="25">25 por página</option>
          <option value="50">50 por página</option>
          <option value="100">100 por página</option>
        </select>
        
        <!-- Botón de exportar -->
        <button 
          @click="exportData"
          class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span>Exportar</span>
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              @click="sortBy(column.key)"
              :class="[
                'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
              ]"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <svg 
                  v-if="column.sortable && sortColumn === column.key"
                  :class="sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'"
                  class="w-4 h-4 text-gray-400 transition-transform"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
                <svg 
                  v-else-if="column.sortable"
                  class="w-4 h-4 text-gray-300"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="(item, index) in paginatedData" 
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td 
              v-for="column in columns" 
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm"
            >
              <!-- Slot personalizado para cada columna -->
              <slot 
                :name="`cell-${column.key}`" 
                :item="item" 
                :value="getNestedValue(item, column.key)"
              >
                <span 
                  v-if="column.type === 'currency'"
                  :class="getCurrencyClass(getNestedValue(item, column.key))"
                >
                  {{ formatCurrency(getNestedValue(item, column.key)) }}
                </span>
                <span 
                  v-else-if="column.type === 'date'"
                  class="text-gray-900"
                >
                  {{ formatDate(getNestedValue(item, column.key)) }}
                </span>
                <span 
                  v-else-if="column.type === 'badge'"
                  :class="getBadgeClass(getNestedValue(item, column.key))"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ getNestedValue(item, column.key) }}
                </span>
                <span 
                  v-else
                  class="text-gray-900"
                >
                  {{ getNestedValue(item, column.key) }}
                </span>
              </slot>
            </td>
          </tr>
          
          <!-- Estado vacío -->
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center space-y-3">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <div class="text-sm text-gray-500">
                  {{ searchTerm ? 'No se encontraron resultados' : 'No hay datos disponibles' }}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer con paginación -->
    <div class="flex items-center justify-between px-6 py-4 border-t border-gray-200">
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span>Mostrando</span>
        <span class="font-medium text-gray-900">{{ startItem }}</span>
        <span>a</span>
        <span class="font-medium text-gray-900">{{ endItem }}</span>
        <span>de</span>
        <span class="font-medium text-gray-900">{{ totalItems }}</span>
        <span>resultados</span>
      </div>
      
      <div class="flex items-center space-x-2">
        <!-- Botón anterior -->
        <button 
          @click="previousPage"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        
        <!-- Números de página -->
        <div class="flex items-center space-x-1">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <!-- Botón siguiente -->
        <button 
          @click="nextPage"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Tabla de Datos'
  },
  subtitle: {
    type: String,
    default: 'Lista de elementos'
  },
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  }
})

// Emits
const emit = defineEmits(['export', 'search', 'sort'])

// Estado reactivo
const searchTerm = ref('')
const sortColumn = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Computed properties
const filteredData = computed(() => {
  if (!searchTerm.value) return props.data
  
  return props.data.filter(item => {
    return props.columns.some(column => {
      const value = getNestedValue(item, column.key)
      return String(value).toLowerCase().includes(searchTerm.value.toLowerCase())
    })
  })
})

const sortedData = computed(() => {
  if (!sortColumn.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const aValue = getNestedValue(a, sortColumn.value)
    const bValue = getNestedValue(b, sortColumn.value)
    
    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1
    
    return sortDirection.value === 'asc' ? comparison : -comparison
  })
})

const totalItems = computed(() => sortedData.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

const startItem = computed(() => {
  return totalItems.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, totalItems.value)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || ''
}

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '-'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(Number(value))
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getCurrencyClass = (value) => {
  const num = Number(value)
  if (num > 0) return 'text-green-600 font-medium'
  if (num < 0) return 'text-red-600 font-medium'
  return 'text-gray-500'
}

const getBadgeClass = (value) => {
  const status = String(value).toLowerCase()
  switch (status) {
    case 'activo':
    case 'completado':
    case 'aprobado':
      return 'bg-green-100 text-green-800'
    case 'pendiente':
    case 'proceso':
      return 'bg-yellow-100 text-yellow-800'
    case 'rechazado':
    case 'cancelado':
    case 'error':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const onSearch = () => {
  currentPage.value = 1
  emit('search', searchTerm.value)
}

const sortBy = (column) => {
  const columnDef = props.columns.find(col => col.key === column)
  if (!columnDef?.sortable) return
  
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  
  emit('sort', { column, direction: sortDirection.value })
}

const onItemsPerPageChange = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportData = () => {
  emit('export', sortedData.value)
}

// Watchers
watch(() => props.data, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
