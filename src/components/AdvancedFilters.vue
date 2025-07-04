<template>
  <div class="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-lg border border-slate-200/60 backdrop-blur-sm overflow-hidden">
    <!-- Header con gradiente -->
    <div class="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 p-6 border-b border-slate-200/60">
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Filtros Avanzados
              </h3>
              <p class="text-sm text-slate-600">Personalice la visualización de datos</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- Indicador de filtros activos -->
          <div v-if="activeFiltersCount > 0" 
               class="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full shadow-lg animate-pulse">
            <div class="w-2 h-2 bg-white rounded-full"></div>
            <span>{{ activeFiltersCount }} activo{{ activeFiltersCount > 1 ? 's' : '' }}</span>
          </div>
          
          <button 
            @click="toggleFilters"
            class="group flex items-center space-x-2 px-4 py-2.5 bg-white/70 hover:bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 backdrop-blur-sm"
          >
            <span class="text-sm">{{ showFilters ? 'Ocultar' : 'Mostrar' }} filtros</span>
            <svg 
              :class="{ 'rotate-180': showFilters }"
              class="w-4 h-4 transition-all duration-300 group-hover:scale-110" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido de filtros con animación -->
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="showFilters" class="overflow-hidden">
        <div class="p-6 space-y-8">
          <!-- Sección de Rango de Fechas -->
          <div class="group">
            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-4">
              <div class="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              <span>Rango de Fechas</span>
            </label>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-600 uppercase tracking-wide">Fecha Inicio</label>
                <div class="relative">
                  <input
                    v-model="filters.fechaInicio"
                    @change="validateDates"
                    type="date"
                    class="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': dateValidation.startDateError }"
                  >
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <transition name="error" mode="out-in">
                  <p v-if="dateValidation.startDateError" class="text-xs text-red-500 mt-1 flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ dateValidation.startDateError }}</span>
                  </p>
                </transition>
              </div>
              
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-600 uppercase tracking-wide">Fecha Fin</label>
                <div class="relative">
                  <input
                    v-model="filters.fechaFin"
                    @change="validateDates"
                    type="date"
                    class="w-full pl-10 pr-4 py-3 bg-white/70 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': dateValidation.endDateError }"
                  >
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <transition name="error" mode="out-in">
                  <p v-if="dateValidation.endDateError" class="text-xs text-red-500 mt-1 flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ dateValidation.endDateError }}</span>
                  </p>
                </transition>
              </div>
            </div>
          </div>

          <!-- Sección de Plantas -->
          <div class="group">
            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-4">
              <div class="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
              <span>Plantas</span>
              <span v-if="selectedPlantsCount > 0" class="text-xs text-slate-500">({{ selectedPlantsCount }} seleccionada{{ selectedPlantsCount > 1 ? 's' : '' }})</span>
            </label>
            
            <div class="space-y-3">
              <!-- Controles de selección rápida -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  @click="selectAllPlants"
                  class="group px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Todas</span>
                  </span>
                </button>
                <button
                  @click="clearAllPlants"
                  class="group px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span class="flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span>Limpiar</span>
                  </span>
                </button>
              </div>
              
              <!-- Lista de plantas con checkboxes animados -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label 
                  v-for="planta in plantas" 
                  :key="planta.id"
                  class="group cursor-pointer"
                >
                  <div class="flex items-center p-4 bg-white/50 hover:bg-white border border-slate-200 hover:border-blue-300 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 backdrop-blur-sm"
                       :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md': filters.plantasSeleccionadas.includes(planta.id) }">
                    <div class="relative flex items-center">
                      <input
                        :id="`planta-${planta.id}`"
                        v-model="filters.plantasSeleccionadas"
                        :value="planta.id"
                        type="checkbox"
                        class="sr-only"
                        @change="onFilterChange"
                      >
                      <div class="flex items-center justify-center w-5 h-5 border-2 rounded-md transition-all duration-300"
                           :class="filters.plantasSeleccionadas.includes(planta.id) 
                             ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500' 
                             : 'border-slate-300 group-hover:border-blue-400 bg-white'">
                        <svg v-if="filters.plantasSeleccionadas.includes(planta.id)" 
                             class="w-3 h-3 text-white animate-scale-in" 
                             fill="none" 
                             stroke="currentColor" 
                             viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-3 flex-1">
                      <div class="flex items-center space-x-2">
                        <div 
                          :class="planta.color"
                          class="w-3 h-3 rounded-full"
                        ></div>
                        <div class="text-sm font-medium text-slate-700 group-hover:text-slate-900">{{ planta.nombre }}</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Sección de Tipos de Movimiento -->
          <div class="group">
            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-4">
              <div class="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"></div>
              <span>Tipos de Movimiento</span>
              <span v-if="selectedTypesCount > 0" class="text-xs text-slate-500">({{ selectedTypesCount }} seleccionado{{ selectedTypesCount > 1 ? 's' : '' }})</span>
            </label>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label 
                v-for="tipo in tiposMovimiento" 
                :key="tipo.id"
                class="group cursor-pointer"
              >
                <div class="flex items-center p-3 bg-white/50 hover:bg-white border border-slate-200 hover:border-purple-300 rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105 backdrop-blur-sm"
                     :class="{ 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-md': filters.tiposSeleccionados.includes(tipo.id) }">
                  <div class="relative flex items-center">
                    <input
                      v-model="filters.tiposSeleccionados"
                      :value="tipo.id"
                      type="checkbox"
                      class="sr-only"
                      @change="onFilterChange"
                    >
                    <div class="flex items-center justify-center w-4 h-4 border-2 rounded transition-all duration-300"
                         :class="filters.tiposSeleccionados.includes(tipo.id) 
                           ? 'bg-gradient-to-r from-purple-500 to-pink-600 border-purple-500' 
                           : 'border-slate-300 group-hover:border-purple-400 bg-white'">
                      <svg v-if="filters.tiposSeleccionados.includes(tipo.id)" 
                           class="w-2.5 h-2.5 text-white animate-scale-in" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <span class="ml-2 text-xs font-medium text-slate-700 group-hover:text-slate-900">{{ tipo.nombre }}</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Sección de Filtros de Monto -->
          <div class="group">
            <label class="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-4">
              <div class="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"></div>
              <span>Filtros de Monto</span>
            </label>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-600 uppercase tracking-wide">Monto Mínimo</label>
                <div class="relative">
                  <input
                    v-model.number="filters.montoMinimo"
                    @input="validateAmounts"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full pl-8 pr-4 py-3 bg-white/70 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': amountValidation.minAmountError }"
                  >
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">$</div>
                </div>
                <transition name="error" mode="out-in">
                  <p v-if="amountValidation.minAmountError" class="text-xs text-red-500 mt-1 flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ amountValidation.minAmountError }}</span>
                  </p>
                </transition>
              </div>
              
              <div class="space-y-2">
                <label class="text-xs font-medium text-slate-600 uppercase tracking-wide">Monto Máximo</label>
                <div class="relative">
                  <input
                    v-model.number="filters.montoMaximo"
                    @input="validateAmounts"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Sin límite"
                    class="w-full pl-8 pr-4 py-3 bg-white/70 border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': amountValidation.maxAmountError }"
                  >
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">$</div>
                </div>
                <transition name="error" mode="out-in">
                  <p v-if="amountValidation.maxAmountError" class="text-xs text-red-500 mt-1 flex items-center space-x-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                    </svg>
                    <span>{{ amountValidation.maxAmountError }}</span>
                  </p>
                </transition>
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <button
              @click="applyFilters"
              :disabled="!isValid || isApplying"
              class="group flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <div v-if="isApplying" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <svg v-else class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              <span>{{ isApplying ? 'Aplicando...' : 'Aplicar Filtros' }}</span>
            </button>
            
            <button
              @click="resetFilters"
              class="group flex items-center justify-center space-x-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-medium rounded-xl transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Reiniciar</span>
            </button>
            
            <button 
              @click="exportFilters"
              :disabled="activeFiltersCount === 0"
              class="group flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props y Emits
const emit = defineEmits(['filters-changed', 'filters-applied', 'filters-reset'])

// Estado reactivo
const showFilters = ref(false)
const isApplying = ref(false)
const filters = ref({
  fechaInicio: '',
  fechaFin: '',
  plantasSeleccionadas: ['jumillano', 'laplata', 'nafa'],
  tiposSeleccionados: [],
  montoMinimo: null,
  montoMaximo: null
})

// Estados de validación
const dateValidation = ref({
  startDateError: '',
  endDateError: ''
})

const amountValidation = ref({
  minAmountError: '',
  maxAmountError: ''
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
  if (filters.value.montoMinimo !== null && filters.value.montoMinimo !== '' && filters.value.montoMinimo > 0) count++
  if (filters.value.montoMaximo !== null && filters.value.montoMaximo !== '' && filters.value.montoMaximo > 0) count++
  
  return count
})

const selectedPlantsCount = computed(() => {
  return filters.value.plantasSeleccionadas.length
})

const selectedTypesCount = computed(() => {
  return filters.value.tiposSeleccionados.length
})

const isValid = computed(() => {
  return !dateValidation.value.startDateError && 
         !dateValidation.value.endDateError && 
         !amountValidation.value.minAmountError && 
         !amountValidation.value.maxAmountError
})

// Métodos de validación
const validateDates = () => {
  dateValidation.value.startDateError = ''
  dateValidation.value.endDateError = ''

  if (filters.value.fechaInicio && filters.value.fechaFin) {
    const startDate = new Date(filters.value.fechaInicio)
    const endDate = new Date(filters.value.fechaFin)
    const today = new Date()
    
    if (startDate > today) {
      dateValidation.value.startDateError = 'La fecha de inicio no puede ser futura'
    }
    
    if (endDate > today) {
      dateValidation.value.endDateError = 'La fecha de fin no puede ser futura'
    }
    
    if (startDate > endDate) {
      dateValidation.value.endDateError = 'La fecha de fin debe ser posterior a la de inicio'
    }
    
    // Validar que el rango no sea superior a 1 año
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 365) {
      dateValidation.value.endDateError = 'El rango no puede ser superior a 1 año'
    }
  }
  
  onFilterChange()
}

const validateAmounts = () => {
  amountValidation.value.minAmountError = ''
  amountValidation.value.maxAmountError = ''

  if (filters.value.montoMinimo !== null && filters.value.montoMinimo !== '') {
    if (filters.value.montoMinimo < 0) {
      amountValidation.value.minAmountError = 'El monto no puede ser negativo'
    }
  }

  if (filters.value.montoMaximo !== null && filters.value.montoMaximo !== '') {
    if (filters.value.montoMaximo < 0) {
      amountValidation.value.maxAmountError = 'El monto no puede ser negativo'
    }
  }

  if (filters.value.montoMinimo && filters.value.montoMaximo) {
    if (parseFloat(filters.value.montoMinimo) > parseFloat(filters.value.montoMaximo)) {
      amountValidation.value.maxAmountError = 'El monto máximo debe ser mayor al mínimo'
    }
  }
  
  onFilterChange()
}

// Métodos principales
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const onFilterChange = () => {
  emit('filters-changed', { 
    ...filters.value,
    isValid: isValid.value,
    activeCount: activeFiltersCount.value
  })
}

const selectAllPlants = () => {
  filters.value.plantasSeleccionadas = plantas.map(p => p.id)
  onFilterChange()
}

const clearAllPlants = () => {
  filters.value.plantasSeleccionadas = []
  onFilterChange()
}

const resetFilters = async () => {
  // Resetear filtros con animación
  const originalValues = { ...filters.value }
  
  filters.value = {
    fechaInicio: '',
    fechaFin: '',
    plantasSeleccionadas: ['jumillano', 'laplata', 'nafa'],
    tiposSeleccionados: [],
    montoMinimo: null,
    montoMaximo: null
  }
  
  // Limpiar validaciones
  dateValidation.value = {
    startDateError: '',
    endDateError: ''
  }
  
  amountValidation.value = {
    minAmountError: '',
    maxAmountError: ''
  }
  
  // Inicializar fechas por defecto
  initDefaultDates()
  
  emit('filters-reset', { 
    previous: originalValues,
    current: filters.value
  })
  
  onFilterChange()
}

const applyFilters = async () => {
  if (!isValid.value) return
  
  isApplying.value = true
  
  try {
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 800))
    
    emit('filters-applied', { 
      ...filters.value,
      timestamp: new Date().toISOString(),
      activeCount: activeFiltersCount.value
    })
    
    // Cerrar filtros después de aplicar en mobile
    if (window.innerWidth < 768) {
      showFilters.value = false
    }
    
  } catch (error) {
    console.error('Error al aplicar filtros:', error)
  } finally {
    isApplying.value = false
  }
}

const exportFilters = async () => {
  if (activeFiltersCount.value === 0) return
  
  try {
    const exportData = {
      filters: filters.value,
      applied: new Date().toISOString(),
      activeFiltersCount: activeFiltersCount.value,
      summary: {
        fechas: filters.value.fechaInicio && filters.value.fechaFin ? 
          `${filters.value.fechaInicio} a ${filters.value.fechaFin}` : null,
        plantas: filters.value.plantasSeleccionadas.map(id => 
          plantas.find(p => p.id === id)?.nombre
        ).join(', '),
        tipos: filters.value.tiposSeleccionados.map(id => 
          tiposMovimiento.find(t => t.id === id)?.nombre
        ).join(', '),
        montos: filters.value.montoMinimo || filters.value.montoMaximo ? 
          `$${filters.value.montoMinimo || 0} - $${filters.value.montoMaximo || '∞'}` : null
      }
    }
    
    // Crear y descargar archivo JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `filtros-avanzados-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('🎯 Filtros exportados:', exportData)
    
  } catch (error) {
    console.error('Error al exportar filtros:', error)
  }
}

// Inicializar fechas por defecto
const initDefaultDates = () => {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  filters.value.fechaFin = today.toISOString().split('T')[0]
  filters.value.fechaInicio = thirtyDaysAgo.toISOString().split('T')[0]
}

// Watchers para validación en tiempo real
watch(() => filters.value.fechaInicio, validateDates)
watch(() => filters.value.fechaFin, validateDates)
watch(() => filters.value.montoMinimo, validateAmounts)
watch(() => filters.value.montoMaximo, validateAmounts)

// Escuchar cambios en plantasSeleccionadas y tiposSeleccionados
watch(() => filters.value.plantasSeleccionadas, onFilterChange, { deep: true })
watch(() => filters.value.tiposSeleccionados, onFilterChange, { deep: true })

// Inicializar
initDefaultDates()
onFilterChange()
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.animate-pulse-glow {
  animation: pulse-glow 2s infinite;
}

/* Transiciones de error */
.error-enter-active {
  transition: all 0.3s ease-out;
}

.error-leave-active {
  transition: all 0.2s ease-in;
}

.error-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* Efectos de glassmorphism mejorados */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Efectos hover para grupos */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:text-slate-900 {
  color: rgb(15 23 42);
}

.group:hover .group-hover\:text-blue-700 {
  color: rgb(29 78 216);
}

.group:hover .group-hover\:text-red-700 {
  color: rgb(185 28 28);
}

.group:hover .group-hover\:bg-blue-50 {
  background-color: rgb(239 246 255);
}

.group:hover .group-hover\:bg-red-50 {
  background-color: rgb(254 242 242);
}

.group:hover .group-hover\:border-blue-300 {
  border-color: rgb(147 197 253);
}

.group:hover .group-hover\:border-red-300 {
  border-color: rgb(252 165 165);
}

.group:hover .group-hover\:border-blue-400 {
  border-color: rgb(96 165 250);
}

.group:hover .group-hover\:border-purple-400 {
  border-color: rgb(196 181 253);
}

/* Animaciones para checkboxes */
input[type="checkbox"]:checked + .checkbox-custom {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: #3b82f6;
}

/* Transiciones suaves para todos los elementos interactivos */
button, input, .cursor-pointer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efectos de focus mejorados */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Efectos de loading */
.loading-dots::after {
  content: '';
  animation: loading-dots 1.5s infinite;
}

@keyframes loading-dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}

/* Mejoras de responsividad */
@media (max-width: 640px) {
  .group {
    margin-bottom: 1.5rem;
  }
  
  .grid.grid-cols-2.md\:grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.75rem;
  }
  
  .grid.grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Efectos de hover para botones */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Gradientes animados */
.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Efectos de selección */
.selected-item {
  position: relative;
}

.selected-item::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
  border-radius: inherit;
  z-index: -1;
  animation: gradient-shift 2s ease infinite;
  background-size: 200% 200%;
}

/* Microinteracciones */
.micro-bounce:hover {
  animation: micro-bounce 0.6s ease;
}

@keyframes micro-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

/* Efectos de tipo escritura para placeholders */
.typing-placeholder::placeholder {
  opacity: 0.7;
  animation: typing 2s infinite;
}

@keyframes typing {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.3;
  }
}
</style>
