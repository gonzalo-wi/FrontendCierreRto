<template>
  <tr 
    :class="getRowClass(reparto.depositoEsperado, reparto.depositoReal)"
    class="row-hover group transition-all duration-300 ease-in-out hover:shadow-lg hover:z-10 relative"
  >
    <!-- ID Reparto -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <img src="/src/assets/entrega.png" alt="Camión de reparto" class="w-4 h-4 object-contain brightness-0 invert">
        </div>
        <div>
          <div class="text-sm font-bold text-gray-900">#{{ reparto.idReparto }}</div>
          <div class="text-xs text-gray-500">Reparto</div>
        </div>
      </div>
    </td>

    <!-- Fecha -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <div class="text-sm font-medium text-gray-900">{{ formatDate(reparto.fechaReparto) }}</div>
          <div class="text-xs text-gray-500">Fecha reparto</div>
        </div>
      </div>
    </td>

    <!-- Depósito Esperado -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-right">
        <div class="text-sm font-bold text-gray-900 family-mono">{{ formatCurrency(reparto.depositoEsperado) }}</div>
        <div class="text-xs text-gray-500">Esperado</div>
      </div>
    </td>

    <!-- Depósito Real -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-right">
        <div class="text-sm font-bold text-gray-900 family-mono">{{ formatCurrency(reparto.depositoReal) }}</div>
        <div class="text-xs text-gray-500">Real</div>
      </div>
    </td>

    <!-- Diferencia -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-right">
        <div class="flex items-center justify-end space-x-1">
          <svg v-if="reparto.depositoReal - reparto.depositoEsperado > 0" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else-if="reparto.depositoReal - reparto.depositoEsperado < 0" class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span :class="getDifferenceClass(reparto.depositoEsperado, reparto.depositoReal)" class="text-sm font-bold family-mono">
            {{ formatCurrency(Math.abs(reparto.depositoReal - reparto.depositoEsperado)) }}
          </span>
        </div>
        <div class="text-xs text-gray-500">Diferencia</div>
      </div>
    </td>

    <!-- Estado -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex justify-center">
        <span :class="getStatusClass(reparto.depositoEsperado, reparto.depositoReal)" 
              class="status-badge inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm">
          <div class="w-1.5 h-1.5 rounded-full mr-2" 
               :class="getStatusDotClass(reparto.depositoEsperado, reparto.depositoReal)"></div>
          {{ getStatus(reparto.depositoEsperado, reparto.depositoReal) }}
        </span>
      </div>
    </td>

    <!-- Movimiento Financiero -->
    <td class="px-6 py-4 whitespace-nowrap">
      <MovimientoFinanciero :movimiento="reparto.movimientoFinanciero" />
    </td>

    <!-- Acciones -->
    <td class="px-6 py-4 whitespace-nowrap text-center">
      <!-- Botones para cuando existe movimiento financiero -->
      <div v-if="reparto.movimientoFinanciero" class="flex justify-center space-x-2">
        <!-- Botón Editar -->
        <button 
          @click="$emit('edit', reparto)"
          class="action-button edit-button group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200"
          title="Editar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <div class="button-shine"></div>
        </button>
        
        <!-- Botón Eliminar -->
        <button 
          @click="$emit('delete-movement', reparto)"
          class="action-button delete-button group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200"
          title="Eliminar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <div class="button-shine"></div>
        </button>
      </div>
      
      <!-- Botón para crear movimiento cuando no existe -->
      <div v-else-if="needsMovement(reparto)" class="flex justify-center">
        <button 
          @click="$emit('edit', reparto)"
          class="action-button create-button group relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200"
        >
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>Crear</span>
          <div class="button-shine"></div>
        </button>
      </div>
      
      <!-- Indicador de reparto listo para cerrar -->
      <div v-else class="flex justify-center">
        <div class="success-indicator inline-flex items-center px-4 py-2 text-sm font-medium">
          <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-2">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="text-green-700 font-medium">Listo</span>
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
</script>

<style scoped>
/* Estilos profesionales para la fila */
.family-mono {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

.row-hover {
  border-left: 4px solid transparent;
  background: white;
  border-bottom: 1px solid #f1f5f9;
}

.row-hover:hover {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Estado de las filas según diferencias */
.row-hover.bg-green-50 {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.row-hover.bg-red-50 {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

/* Badge de estado profesional */
.status-badge {
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  font-size: 0.75rem;
  transition: all 0.3s ease;
}

.status-badge:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Botón de acción mejorado */
.action-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.action-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Efecto shine en botón */
.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-button:hover .button-shine {
  left: 100%;
}

/* Indicador de éxito */
.success-indicator {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Animaciones suaves */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.row-hover {
  animation: fadeInUp 0.3s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .row-hover:hover {
    transform: none;
    box-shadow: none;
  }
  
  .action-button {
    padding: 8px 12px;
    font-size: 0.75rem;
  }
}

/* Estados de hover para iconos */
.row-hover:hover svg {
  transition: all 0.3s ease;
}

.row-hover:hover .text-gray-400 {
  color: #6b7280;
}

/* Efectos de transición suaves */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

/* Estilos específicos para botones de acción */
.edit-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.edit-button:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

.delete-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.delete-button:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}

.create-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.create-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}
</style>
