<template>
  <!-- Usar el nuevo componente de lista cuando hay múltiples movimientos -->
  <MovimientosFinancierosList
    v-if="tieneMultiplesMovimientos"
    :movimientos="movimiento"
    :cheques="cheques"
    :retenciones="retenciones"
    :reparto="reparto"
    :service="service"
    :compact="true"
    @delete-movement="handleDeleteMovement"
  />

  <!-- Vista tradicional para un solo movimiento o movimiento legacy -->
  <div v-else-if="movimiento && !tieneMultiplesMovimientos" class="movement-container">
    <!-- Header con tipo y estado -->
    <div class="movement-header">
      <div class="movement-type-badge" :class="getTypeClass(movimiento.tipo)">
        <component :is="getTypeIcon(movimiento.tipo)" class="w-3 h-3" />
        <span class="movement-type-text">{{ getTypeDisplayName(movimiento.tipo) }}</span>
      </div>
      <div class="movement-amount">
        <span class="currency-symbol">$</span>
        <span class="amount-value">{{ formatCurrency(movimiento.importe || movimiento.montoTotal) }}</span>
      </div>
    </div>

    <!-- Detalles del movimiento -->
    <div class="movement-details">
      <div class="detail-row">
        <div class="detail-icon">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <span class="detail-text">{{ movimiento.concepto || getConceptoFromTipo(movimiento.tipo) }}</span>
      </div>
      
      <div v-if="movimiento.idCliente || movimiento.totalCheques || movimiento.totalRetenciones" class="detail-row">
        <div class="detail-icon">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <span class="detail-text">
          {{ movimiento.idCliente || getResumenMovimientos(movimiento) }}
        </span>
      </div>
      
      <div v-if="movimiento.fecha" class="detail-row">
        <div class="detail-icon">
          <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <span class="detail-text">{{ formatDate(movimiento.fecha) }}</span>
      </div>
    </div>

    <!-- Indicador de prioridad -->
    <div class="priority-indicator" :class="getPriorityClass(movimiento.importe || movimiento.montoTotal)">
      <div class="priority-dot"></div>
    </div>
  </div>

  <!-- Estado sin movimiento -->
  <div v-else class="no-movement-container">
    <div class="success-icon">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
      </svg>
    </div>
    <div class="success-content">
      <span class="success-title">Sin movimientos</span>
      <span class="success-subtitle">Depósito exacto</span>
    </div>
    <div class="success-pulse"></div>
  </div>
</template>

<script setup>
import { h, computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'
import MovimientosFinancierosList from './MovimientosFinancierosList.vue'

const props = defineProps({
  movimiento: {
    type: Object,
    default: null
  },
  reparto: {
    type: Object,
    default: null
  },
  service: {
    type: Object,
    required: true
  }
})

// Definir emits
const emit = defineEmits(['delete-movement'])

// Handler para reenviar eventos de eliminación al padre
const handleDeleteMovement = (eventData) => {
  console.log('🗑️ [MovFinanciero] Reenviando evento delete-movement al padre:', eventData)
  emit('delete-movement', eventData)
}

// Computadas para detectar múltiples movimientos
const cheques = computed(() => props.movimiento?.cheques || [])
const retenciones = computed(() => props.movimiento?.retenciones || [])
const tieneMultiplesMovimientos = computed(() => {
  const totalCheques = cheques.value.length
  const totalRetenciones = retenciones.value.length
  const total = totalCheques + totalRetenciones
  
  // Usar la nueva vista si hay múltiples movimientos O si es de tipo MIXTO
  return total > 1 || props.movimiento?.tipo === 'MIXTO' || total === 1
})

// Función para obtener la clase CSS según el tipo de movimiento
const getTypeClass = (tipo) => {
  const classes = {
    'CONTADO': 'type-contado',
    'CUENTA_CORRIENTE': 'type-cuenta-corriente', 
    'CHEQUE': 'type-cheque',
    'RETENCION': 'type-retencion',
    'MIXTO': 'type-mixto'
  }
  return classes[tipo] || 'type-default'
}

// Función para obtener el nombre de display del tipo
const getTypeDisplayName = (tipo) => {
  const names = {
    'CONTADO': 'Contado',
    'CUENTA_CORRIENTE': 'Cta. Corriente',
    'CHEQUE': 'Cheque',
    'RETENCION': 'Retención',
    'MIXTO': 'Mixto'
  }
  return names[tipo] || tipo
}

// Función para obtener el icono según el tipo
const getTypeIcon = (tipo) => {
  const icons = {
    'CONTADO': () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
      })
    ]),
    'CUENTA_CORRIENTE': () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      })
    ]),
    'CHEQUE': () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
      })
    ]),
    'RETENCION': () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z'
      })
    ]),
    'MIXTO': () => h('svg', {
      class: 'w-3 h-3',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, [
      h('path', {
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': '2',
        d: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
      })
    ])
  }
  return icons[tipo] || icons['CONTADO']
}

// Función para obtener la clase de prioridad según el importe
const getPriorityClass = (importe) => {
  if (importe > 100000) return 'priority-high'
  if (importe > 50000) return 'priority-medium'
  return 'priority-low'
}

// Función para obtener concepto desde tipo
const getConceptoFromTipo = (tipo) => {
  const conceptos = {
    'CHEQUE': 'Pago con cheque',
    'RETENCION': 'Retención aplicada',
    'MIXTO': 'Movimientos múltiples',
    'CONTADO': 'Pago en efectivo',
    'CUENTA_CORRIENTE': 'Cuenta corriente'
  }
  return conceptos[tipo] || 'Movimiento financiero'
}

// Función para obtener resumen de movimientos
const getResumenMovimientos = (movimiento) => {
  const parts = []
  if (movimiento.totalCheques > 0) {
    parts.push(`${movimiento.totalCheques} cheque${movimiento.totalCheques !== 1 ? 's' : ''}`)
  }
  if (movimiento.totalRetenciones > 0) {
    parts.push(`${movimiento.totalRetenciones} retención${movimiento.totalRetenciones !== 1 ? 'es' : ''}`)
  }
  return parts.join(', ') || 'Sin detalles'
}
</script>

<style scoped>
/* Contenedor principal del movimiento */
.movement-container {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.movement-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

/* Header del movimiento */
.movement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

/* Badge del tipo de movimiento */
.movement-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

.movement-type-text {
  line-height: 1;
}

/* Estilos específicos por tipo */
.type-contado {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 1px solid #86efac;
}

.type-cuenta-corriente {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.type-cheque {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #fcd34d;
}

.type-retencion {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #be185d;
  border: 1px solid #f9a8d4;
}

.type-mixto {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  border: 1px solid #a5b4fc;
}

.type-default {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  border: 1px solid #cbd5e1;
}

/* Monto */
.movement-amount {
  display: flex;
  align-items: baseline;
  gap: 1px;
  font-weight: 700;
  color: #1e293b;
}

.currency-symbol {
  font-size: 10px;
  color: #64748b;
}

.amount-value {
  font-size: 13px;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
}

/* Detalles del movimiento */
.movement-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Indicador de prioridad */
.priority-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0.7;
}

.priority-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse-priority 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.priority-high .priority-dot {
  background: #ef4444;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
}

.priority-medium .priority-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
}

.priority-low .priority-dot {
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
}

/* Estado sin movimiento */
.no-movement-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border: 1px solid #86efac;
  border-radius: 10px;
  padding: 8px 12px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.no-movement-container:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.2);
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.success-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.success-title {
  font-size: 12px;
  font-weight: 600;
  color: #065f46;
  line-height: 1;
}

.success-subtitle {
  font-size: 10px;
  color: #059669;
  font-weight: 500;
}

.success-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  border-radius: 10px;
  animation: pulse-success 3s ease-in-out infinite;
}

/* Animaciones */
@keyframes pulse-priority {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 currentColor;
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 4px transparent;
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 transparent;
  }
}

@keyframes pulse-success {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .movement-container {
    padding: 10px;
  }
  
  .movement-type-badge {
    padding: 3px 6px;
    font-size: 10px;
  }
  
  .amount-value {
    font-size: 12px;
  }
  
  .detail-text {
    font-size: 10px;
  }
}

/* Estados hover para interactividad */
.movement-type-badge:hover {
  transform: scale(1.05);
}

.success-icon:hover {
  transform: rotate(5deg) scale(1.1);
}

/* Efecto glassmorphism sutil */
.movement-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
}
</style>
