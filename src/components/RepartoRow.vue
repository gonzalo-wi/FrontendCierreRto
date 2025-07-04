<template>
  <tr 
    :class="getRowClass(reparto.depositoEsperado, reparto.depositoReal)"
    class="group transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-transparent hover:to-purple-50/50 hover:shadow-xl hover:shadow-blue-500/10 relative border-b border-gray-100 hover:border-transparent"
  >
    
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <img 
              src="@/assets/entrega.png" 
              alt="Entrega" 
              class="w-5 h-5 object-contain filter brightness-0 invert"
            >
          </div>
          
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" 
               :class="getStatusIndicatorClass(reparto.depositoEsperado, reparto.depositoReal)">
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
            #{{ reparto.idReparto }}
          </div>
          <div class="text-xs text-gray-500 font-medium">
            ID: {{ reparto.idReparto.toString().padStart(6, '0') }}
          </div>
        </div>
      </div>
    </td>

    
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold text-gray-900">{{ formatDate(reparto.fechaReparto) }}</div>
          <div class="text-xs text-gray-500 font-medium">{{ getRelativeDate(reparto.fechaReparto) }}</div>
        </div>
      </div>
    </td>

    <!-- Depósito Esperado con estilo premium -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="space-y-1">
        <div class="text-sm font-bold text-gray-900 font-mono tracking-wide">
          {{ formatCurrency(reparto.depositoEsperado) }}
        </div>
        <div class="flex items-center justify-end space-x-1">
          <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">Esperado</div>
        </div>
      </div>
    </td>

    <!-- Depósito Real con indicadores visuales -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="space-y-1">
        <div class="text-sm font-bold text-gray-900 font-mono tracking-wide">
          {{ formatCurrency(reparto.depositoReal) }}
        </div>
        <div class="flex items-center justify-end space-x-1">
          <div class="w-2 h-2 rounded-full" :class="getRealAmountIndicatorClass(reparto.depositoEsperado, reparto.depositoReal)"></div>
          <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">Real</div>
        </div>
      </div>
    </td>

    <!-- Diferencia con indicadores visuales premium -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="space-y-1">
        <div class="flex items-center justify-end space-x-2">
          <!-- Icono de tendencia -->
          <div class="flex-shrink-0 p-1 rounded-full" :class="getDifferenceBgClass(reparto.depositoEsperado, reparto.depositoReal)">
            <svg v-if="reparto.depositoReal - reparto.depositoEsperado > 0" class="w-3 h-3" :class="getDifferenceIconClass(reparto.depositoEsperado, reparto.depositoReal)" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else-if="reparto.depositoReal - reparto.depositoEsperado < 0" class="w-3 h-3" :class="getDifferenceIconClass(reparto.depositoEsperado, reparto.depositoReal)" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else class="w-3 h-3" :class="getDifferenceIconClass(reparto.depositoEsperado, reparto.depositoReal)" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <!-- Valor de la diferencia -->
          <span :class="getDifferenceClass(reparto.depositoEsperado, reparto.depositoReal)" class="text-sm font-bold font-mono tracking-wide">
            {{ reparto.depositoReal === reparto.depositoEsperado ? '±' : (reparto.depositoReal > reparto.depositoEsperado ? '+' : '') }}{{ formatCurrency(Math.abs(reparto.depositoReal - reparto.depositoEsperado)) }}
          </span>
        </div>
        <div class="flex items-center justify-end space-x-1">
          <div class="w-2 h-2 rounded-full" :class="getDifferenceIndicatorClass(reparto.depositoEsperado, reparto.depositoReal)"></div>
          <div class="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {{ getDifferenceLabel(reparto.depositoEsperado, reparto.depositoReal) }}
          </div>
        </div>
      </div>
    </td>

    <!-- Estado con badge premium -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex justify-center">
        <div class="relative inline-flex items-center">
          <span :class="getStatusClass(reparto.depositoEsperado, reparto.depositoReal)" 
                class="inline-flex items-center px-3 py-2 text-xs font-bold rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 group-hover:scale-105">
            <!-- Icono de estado -->
            <div class="flex-shrink-0 w-2 h-2 rounded-full mr-2 animate-pulse" 
                 :class="getStatusDotClass(reparto.depositoEsperado, reparto.depositoReal)">
            </div>
            <span class="uppercase tracking-wider">{{ getStatus(reparto.depositoEsperado, reparto.depositoReal) }}</span>
          </span>
          <!-- Indicador de prioridad -->
          <div v-if="getDifferencePriority(reparto.depositoEsperado, reparto.depositoReal) === 'high'" 
               class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse">
          </div>
        </div>
      </div>
    </td>

    <!-- Movimiento Financiero con diseño mejorado -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200 group-hover:border-blue-200 transition-all duration-300">
        <MovimientoFinanciero :movimiento="reparto.movimientoFinanciero" />
      </div>
    </td>

    <!-- Acciones con diseño premium -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
      <!-- Botones para cuando existe movimiento financiero -->
      <div v-if="reparto.movimientoFinanciero" class="flex justify-center space-x-2">
        <!-- Botón Editar Premium -->
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Editar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <!-- Botón Eliminar Premium -->
        <button 
          @click="$emit('delete-movement', reparto)"
          class="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Eliminar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
      
      <!-- Botón para crear movimiento cuando no existe -->
      <div v-else-if="needsMovement(reparto)" class="flex justify-center">
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center px-4 py-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="font-semibold">Crear</span>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
      
      <!-- Indicador de reparto listo para cerrar -->
      <div v-else class="flex justify-center">
        <div class="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-xl shadow-sm">
          <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-2 shadow-md">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="text-green-700 font-semibold text-sm">Completado</span>
        </div>
      </div>
    </td>
  </tr>
</template>

<script setup>
import MovimientoFinanciero from './MovimientoFinanciero.vue'
import { 
  formatDate, 
  formatCurrency, 
  getDifferenceClass, 
  getStatusClass, 
  getStatus, 
  getRowClass 
} from '../utils/formatters.js'

defineProps({
  reparto: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete-movement'])

// Función para determinar si un reparto necesita movimiento financiero
const needsMovement = (reparto) => {
  // Si tiene diferencia (positiva o negativa) pero no tiene movimiento
  return reparto.diferencia !== 0 && !reparto.movimientoFinanciero
}

// Función adicional para el color del punto de estado
const getStatusDotClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'bg-green-400'
  if (Math.abs(difference) <= expected * 0.05) return 'bg-yellow-400'
  return 'bg-red-400'
}

// Nuevas funciones para el diseño premium

// Indicador de estado principal
const getStatusIndicatorClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'bg-gradient-to-br from-green-400 to-green-500'
  if (Math.abs(difference) <= expected * 0.05) return 'bg-gradient-to-br from-yellow-400 to-orange-500'
  return 'bg-gradient-to-br from-red-400 to-red-500'
}

// Indicador para monto real
const getRealAmountIndicatorClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'bg-green-400'
  if (difference > 0) return 'bg-blue-400'
  return 'bg-orange-400'
}

// Clases para iconos de diferencia
const getDifferenceIconClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'text-green-600'
  if (difference > 0) return 'text-green-600'
  return 'text-red-600'
}

// Clases para fondo de diferencia
const getDifferenceBgClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'bg-green-100'
  if (difference > 0) return 'bg-green-100'
  return 'bg-red-100'
}

// Indicador para diferencia
const getDifferenceIndicatorClass = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'bg-green-400'
  if (difference > 0) return 'bg-green-400'
  return 'bg-red-400'
}

// Etiqueta para diferencia
const getDifferenceLabel = (expected, real) => {
  const difference = real - expected
  if (difference === 0) return 'Exacto'
  if (difference > 0) return 'Sobrante'
  return 'Faltante'
}

// Prioridad de diferencia
const getDifferencePriority = (expected, real) => {
  const difference = Math.abs(real - expected)
  const percentage = (difference / expected) * 100
  if (percentage > 10) return 'high'
  if (percentage > 5) return 'medium'
  return 'low'
}

// Fecha relativa
const getRelativeDate = (date) => {
  const today = new Date()
  const targetDate = new Date(date)
  const diffTime = today - targetDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return 'Hace más de una semana'
}
</script>

<style scoped>
/* Variables CSS para consistencia */
:root {
  --transition-duration: 300ms;
  --shadow-premium: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --border-radius-lg: 12px;
}

/* Fuente monoespaciada premium */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-feature-settings: 'calt' 1, 'liga' 1;
}

/* Estilos base para la fila */
tr {
  position: relative;
  transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
}

/* Efectos hover premium */
tr:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-left-color: #3b82f6;
  z-index: 10;
}

/* Estados de fila según diferencias */
tr.bg-green-50 {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border-left-color: #10b981;
}

tr.bg-green-50:hover {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border-left-color: #059669;
}

tr.bg-red-50 {
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
  border-left-color: #ef4444;
}

tr.bg-red-50:hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
  border-left-color: #dc2626;
}

tr.bg-yellow-50 {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  border-left-color: #f59e0b;
}

tr.bg-yellow-50:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  border-left-color: #d97706;
}

/* Celdas con espaciado responsive */
td {
  padding: 1rem 1.5rem;
  vertical-align: middle;
  transition: all var(--transition-duration) ease;
}

@media (max-width: 768px) {
  td {
    padding: 0.75rem 1rem;
  }
}

/* Animaciones de entrada */
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

tr {
  animation: slideInUp 0.6s ease-out;
}

/* Microinteracciones para iconos */
svg {
  transition: all var(--transition-duration) ease;
}

/* Efectos para elementos interactivos */
button {
  transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Badges y indicadores premium */
.status-badge {
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all var(--transition-duration) ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.15);
}

/* Efectos de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Gradientes dinámicos */
.bg-gradient-premium {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Animaciones de pulso para indicadores importantes */
@keyframes pulse-soft {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efectos de brillo para botones */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

button:hover::after {
  left: 100%;
}

/* Sombras personalizadas */
.shadow-premium {
  box-shadow: var(--shadow-premium);
}

.shadow-hover {
  box-shadow: var(--shadow-hover);
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Estados de enfoque para accesibilidad */
button:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

/* Efectos específicos para diferentes tipos de elementos */
.icon-container {
  transition: all var(--transition-duration) ease;
}

.icon-container:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Optimizaciones de rendimiento */
.will-change-transform {
  will-change: transform;
}

/* Mejoras tipográficas */
.text-premium {
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

/* Responsive design mejorado */
@media (max-width: 640px) {
  tr:hover {
    transform: none;
    box-shadow: none;
  }
  
  .group:hover .group-hover\:scale-110 {
    transform: none;
  }
}
</style>
