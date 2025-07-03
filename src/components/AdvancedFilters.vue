<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
        <p class="text-sm text-gray-600">Personalice la visualización de datos</p>
      </div>
      <button 
        @click="toggleFilters"
        class="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        <span>{{ showFilters ? 'Ocultar' : 'Mostrar' }} filtros</span>
        <svg 
          :class="{ 'rotate-180': showFilters }"
          class="w-4 h-4 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>

    <div v-show="showFilters" class="space-y-6">
      <!-- Filtro por Rango de Fechas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
          <input 
            v-model="filters.fechaInicio"
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            @change="onFilterChange"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
          <input 
            v-model="filters.fechaFin"
            type="date" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            @change="onFilterChange"
          />
        </div>
      </div>

      <!-- Filtro por Plantas -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Plantas</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label 
            v-for="planta in plantas" 
            :key="planta.id"
            class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input 
              v-model="filters.plantasSeleccionadas"
              :value="planta.id"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="onFilterChange"
            />
            <div class="flex items-center space-x-2">
              <div 
                :class="planta.color"
                class="w-3 h-3 rounded-full"
              ></div>
              <span class="text-sm font-medium text-gray-900">{{ planta.nombre }}</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Filtro por Tipo de Movimiento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Tipos de Movimiento</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label 
            v-for="tipo in tiposMovimiento" 
            :key="tipo.id"
            class="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input 
              v-model="filters.tiposSeleccionados"
              :value="tipo.id"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              @change="onFilterChange"
            />
            <span class="text-xs font-medium text-gray-700">{{ tipo.nombre }}</span>
          </label>
        </div>
      </div>

      <!-- Filtro por Montos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Monto Mínimo</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
            <input 
              v-model="filters.montoMinimo"
              type="number"
              step="0.01"
              placeholder="0.00"
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @change="onFilterChange"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Monto Máximo</label>
          <div class="relative">
            <span class="absolute left-3 top-2 text-gray-500 text-sm">$</span>
            <input 
              v-model="filters.montoMaximo"
              type="number"
              step="0.01"
              placeholder="999999.99"
              class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              @change="onFilterChange"
            />
          </div>
        </div>
      </div>

      <!-- Acciones de Filtro -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-4">
          <button 
            @click="resetFilters"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Limpiar Filtros
          </button>
          <span class="text-xs text-gray-500">
            {{ activeFiltersCount }} filtro(s) activo(s)
          </span>
        </div>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="exportFilters"
            class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
            </svg>
            <span>Exportar</span>
          </button>
          <button 
            @click="applyFilters"
            class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
            </svg>
            <span>Aplicar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const emit = defineEmits(['filters-changed', 'filters-applied'])

// Estado reactivo
const showFilters = ref(false)
const filters = ref({
  fechaInicio: '',
  fechaFin: '',
  plantasSeleccionadas: ['jumillano', 'laplata', 'nafa'],
  tiposSeleccionados: [],
  montoMinimo: null,
  montoMaximo: null
})

// Datos estáticos
const plantas = [
  { id: 'jumillano', nombre: 'Jumillano', color: 'bg-blue-500' },
  { id: 'laplata', nombre: 'La Plata', color: 'bg-emerald-500' },
  { id: 'nafa', nombre: 'NAFA', color: 'bg-purple-500' }
]

const tiposMovimiento = [
  { id: 'ingreso', nombre: 'Ingresos' },
  { id: 'egreso', nombre: 'Egresos' },
  { id: 'transferencia', nombre: 'Transferencias' },
  { id: 'ajuste', nombre: 'Ajustes' }
]

// Computed properties
const activeFiltersCount = computed(() => {
  let count = 0
  
  if (filters.value.fechaInicio) count++
  if (filters.value.fechaFin) count++
  if (filters.value.plantasSeleccionadas.length < plantas.length) count++
  if (filters.value.tiposSeleccionados.length > 0) count++
  if (filters.value.montoMinimo !== null && filters.value.montoMinimo !== '') count++
  if (filters.value.montoMaximo !== null && filters.value.montoMaximo !== '') count++
  
  return count
})

// Métodos
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const onFilterChange = () => {
  emit('filters-changed', { ...filters.value })
}

const resetFilters = () => {
  filters.value = {
    fechaInicio: '',
    fechaFin: '',
    plantasSeleccionadas: ['jumillano', 'laplata', 'nafa'],
    tiposSeleccionados: [],
    montoMinimo: null,
    montoMaximo: null
  }
  onFilterChange()
}

const applyFilters = () => {
  emit('filters-applied', { ...filters.value })
}

const exportFilters = () => {
  // Implementar lógica de exportación
  console.log('🔄 Exportando con filtros:', filters.value)
}

// Inicializar con fechas por defecto
const initDefaultDates = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  filters.value.fechaFin = today.toISOString().split('T')[0]
  filters.value.fechaInicio = thirtyDaysAgo.toISOString().split('T')[0]
}

// Llamar al inicializar
initDefaultDates()
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
