<template>
  <div class="movimientos-container">
    <!-- Vista compacta (siempre visible) -->
    <div class="movimientos-summary" @click="toggleExpanded">
      <div class="summary-content">
        <!-- Indicador visual -->
        <div class="summary-indicator">
          <div class="indicator-dot" :class="getIndicatorClass()"></div>
          <span class="indicator-count">{{ totalMovimientos }}</span>
        </div>

        <!-- Resumen de tipos y montos -->
        <div class="summary-info">
          <div class="summary-types">
            <span v-for="(info, tipo) in resumenTipos" :key="tipo" 
                  class="type-chip" :class="getTypeChipClass(tipo)">
              {{ getTipoIcon(tipo) }} {{ info.count }}
            </span>
          </div>
          <div class="summary-total">
            <span class="total-label">Total:</span>
            <span class="total-amount">{{ formatCurrency(montoTotal) }}</span>
          </div>
        </div>

        <!-- Botón expandir/contraer -->
        <div class="expand-button">
          <svg class="expand-icon" :class="{ 'rotated': isExpanded }" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- Vista expandida (detalle de todos los movimientos) -->
    <transition name="expand" appear>
      <div v-if="isExpanded" class="movimientos-detail">
        <div class="detail-header">
          <h4 class="detail-title">Movimientos Registrados</h4>
          <div class="detail-stats">
            <span class="stat-item">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              {{ totalCheques }} cheques
            </span>
            <span class="stat-item">
              <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
              </svg>
              {{ totalRetenciones }} retenciones
            </span>
          </div>
        </div>

        <!-- Lista de cheques -->
        <div v-if="cheques && cheques.length > 0" class="movimientos-group">
          <div class="group-header">
            <div class="group-icon cheques-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h5 class="group-title">Cheques ({{ cheques.length }})</h5>
            <div class="group-total">{{ formatCurrency(montoCheques) }}</div>
          </div>
          
          <div class="movimientos-list">
            <div v-for="(cheque, index) in cheques" :key="`cheque-${index}`" 
                 @click="editMovimiento(cheque, 'cheque')"
                 class="movimiento-item cheque-item clickable-item" 
                 title="Click para editar este cheque">
              <div class="item-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              
              <div class="item-content">
                <div class="item-header">
                  <span class="item-title">Cheque N° {{ cheque.nro_cheque || cheque.numero || 'S/N' }}</span>
                  <div class="item-actions">
                    <span class="item-amount">{{ formatCurrency(cheque.importe || cheque.monto || 0) }}</span>
                    <button 
                      @click.stop="deleteMovement('cheque', cheque, index)" 
                      class="delete-button"
                      title="Eliminar cheque"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="item-details">
                  <div class="detail-row">
                    <span class="detail-label">Banco:</span>
                    <span class="detail-value">{{ cheque.banco || 'No especificado' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Titular:</span>
                    <span class="detail-value">{{ cheque.titular || 'No especificado' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">{{ formatDate(cheque.fecha) || 'No especificada' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Cuenta:</span>
                    <span class="detail-value">{{ cheque.nro_cuenta || 'No especificada' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de retenciones -->
        <div v-if="retenciones && retenciones.length > 0" class="movimientos-group">
          <div class="group-header">
            <div class="group-icon retenciones-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
              </svg>
            </div>
            <h5 class="group-title">Retenciones ({{ retenciones.length }})</h5>
            <div class="group-total">{{ formatCurrency(montoRetenciones) }}</div>
          </div>
          
          <div class="movimientos-list">
            <div v-for="(retencion, index) in retenciones" :key="`retencion-${index}`" 
                 @click="editMovimiento(retencion, 'retencion')"
                 class="movimiento-item retencion-item clickable-item"
                 title="Click para editar esta retención">
              <div class="item-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                </svg>
              </div>
              
              <div class="item-content">
                <div class="item-header">
                  <span class="item-title">{{ retencion.concepto || 'Retención' }} N° {{ retencion.nro_retencion || retencion.numero || 'S/N' }}</span>
                  <div class="item-actions">
                    <span class="item-amount">{{ formatCurrency(retencion.importe || retencion.monto || 0) }}</span>
                    <button 
                      @click.stop="deleteMovement('retencion', retencion, index)" 
                      class="delete-button"
                      title="Eliminar retención"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="item-details">
                  <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">{{ formatDate(retencion.fecha) || 'No especificada' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Cliente:</span>
                    <span class="detail-value">{{ retencion.nrocta || 'No especificado' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado sin movimientos -->
        <div v-if="totalMovimientos === 0" class="no-movimientos">
          <div class="no-movimientos-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div class="no-movimientos-content">
            <h4>Sin movimientos registrados</h4>
            <p>No hay cheques ni retenciones para este reparto</p>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Modal EXCLUSIVO para EDICIÓN (PUT) -->
  <EditOnlyModal
    :show="showEditModal"
    :movimiento-data="selectedMovimientoToEdit"
    :service="service"
    :deposit-id="reparto?.id"
    @close="closeEditModal"
    @updated="onEditComplete"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'
import EditOnlyModal from './EditOnlyModalNew.vue'

const props = defineProps({
  movimientos: {
    type: Object,
    default: null
  },
  cheques: {
    type: Array,
    default: () => []
  },
  retenciones: {
    type: Array,
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  },
  reparto: {
    type: Object,
    default: null
  },
  service: {
    type: Object,
    required: true
  },
  canDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['delete-movement'])

const isExpanded = ref(false)
const showEditModal = ref(false)
const selectedMovimientoToEdit = ref(null)

// Computadas para estadísticas
const totalCheques = computed(() => props.cheques?.length || 0)
const totalRetenciones = computed(() => props.retenciones?.length || 0)
const totalMovimientos = computed(() => totalCheques.value + totalRetenciones.value)

const montoCheques = computed(() => {
  return props.cheques?.reduce((total, cheque) => {
    return total + parseFloat(cheque.importe || cheque.monto || 0)
  }, 0) || 0
})

const montoRetenciones = computed(() => {
  return props.retenciones?.reduce((total, retencion) => {
    return total + parseFloat(retencion.importe || retencion.monto || 0)
  }, 0) || 0
})

const montoTotal = computed(() => montoCheques.value + montoRetenciones.value)

const resumenTipos = computed(() => {
  const resumen = {}
  
  if (totalCheques.value > 0) {
    resumen.CHEQUE = {
      count: totalCheques.value,
      monto: montoCheques.value
    }
  }
  
  if (totalRetenciones.value > 0) {
    resumen.RETENCION = {
      count: totalRetenciones.value,
      monto: montoRetenciones.value
    }
  }
  
  return resumen
})

// Funciones de utilidad
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

// Funciones para edición
const editMovimiento = (movimiento, tipo) => {
  console.log('🖱️ [MovFinList] ========== CLICK EN TARJETA PARA EDITAR ==========')
  console.log('🖱️ [MovFinList] Usuario hizo clic en:', tipo.toUpperCase())
  console.log('🖱️ [MovFinList] Movimiento ORIGINAL del array:', JSON.stringify(movimiento, null, 2))
  console.log('🖱️ [MovFinList] Movimiento tiene id:', movimiento?.id)
  console.log('🖱️ [MovFinList] Todas las claves del movimiento:', Object.keys(movimiento || {}))
  console.log('🖱️ [MovFinList] Props service:', props.service ? 'OK' : 'NO SERVICE')
  
  if (!props.service) {
    console.error('❌ [MovFinList] No hay servicio disponible')
    alert('Error: No hay servicio disponible para editar')
    return
  }
  
  selectedMovimientoToEdit.value = {
    ...movimiento,
    tipo: tipo.toUpperCase()
  }
  
  console.log('🖱️ [MovFinList] selectedMovimientoToEdit después de procesar:', JSON.stringify(selectedMovimientoToEdit.value, null, 2))
  console.log('🖱️ [MovFinList] selectedMovimientoToEdit tiene id:', selectedMovimientoToEdit.value?.id)
  showEditModal.value = true
}

const closeEditModal = () => {
  console.log('🔧 [MovFinList] Cerrando modal de edición')
  showEditModal.value = false
  selectedMovimientoToEdit.value = null
}

const onEditComplete = () => {
  console.log('✅ [MovFinList] Edición completada')
  closeEditModal()
  // El modal padre se encarga de recargar los datos
}

const getIndicatorClass = () => {
  if (totalMovimientos.value === 0) return 'indicator-empty'
  if (totalMovimientos.value <= 2) return 'indicator-low'
  if (totalMovimientos.value <= 5) return 'indicator-medium'
  return 'indicator-high'
}

const getTypeChipClass = (tipo) => {
  const classes = {
    'CHEQUE': 'chip-cheque',
    'RETENCION': 'chip-retencion'
  }
  return classes[tipo] || 'chip-default'
}

const getTipoIcon = (tipo) => {
  const icons = {
    'CHEQUE': '📄',
    'RETENCION': '📋'
  }
  return icons[tipo] || '💼'
}

// Función para manejar eliminación de movimientos
const deleteMovement = async (tipo, movimiento, index) => {
  console.log(`🗑️ [MovFinList] ============ INICIO DELETE MOVEMENT ============`)
  console.log(`🗑️ [MovFinList] tipo recibido:`, tipo)
  console.log(`🗑️ [MovFinList] movimiento recibido:`, JSON.stringify(movimiento, null, 2))
  console.log(`🗑️ [MovFinList] index recibido:`, index)
  console.log(`🗑️ [MovFinList] props.reparto:`, props.reparto?.idReparto)
  console.log(`🗑️ [MovFinList] props.canDelete:`, props.canDelete)
  
  if (!props.canDelete) {
    console.warn('⚠️ [MovFinList] Eliminación deshabilitada')
    return
  }
  
  // Analizar el objeto movimiento en detalle
  console.log(`🔍 [MovFinList] ============ ANALIZANDO MOVIMIENTO ============`)
  if (movimiento) {
    console.log(`🔍 [MovFinList] Propiedades del objeto movimiento:`)
    Object.keys(movimiento).forEach(key => {
      console.log(`🔍 [MovFinList]   - ${key}: ${movimiento[key]} (${typeof movimiento[key]})`)
    })
  } else {
    console.error('❌ [MovFinList] movimiento es null/undefined!')
  }
  
  // Confirmar la eliminación
  const tipoTexto = tipo === 'cheque' ? 'cheque' : 'retención'
  const numero = movimiento.nro_cheque || movimiento.nro_retencion || movimiento.numero || 'S/N'
  const monto = formatCurrency(movimiento.importe || movimiento.monto || 0)
  
  console.log(`🔍 [MovFinList] Datos para confirmación:`)
  console.log(`🔍 [MovFinList]   - tipoTexto: ${tipoTexto}`)
  console.log(`🔍 [MovFinList]   - numero: ${numero}`)
  console.log(`🔍 [MovFinList]   - monto: ${monto}`)
  
  const confirmMessage = `¿Está seguro que desea eliminar el ${tipoTexto} N° ${numero} por ${monto}?`
  
  if (!confirm(confirmMessage)) {
    console.log('🗑️ [MovFinList] Usuario canceló la eliminación')
    return
  }
  
  // Crear el payload del evento
  const eventPayload = {
    tipo,
    movimiento,
    index,
    reparto: props.reparto
  }
  
  console.log(`🗑️ [MovFinList] ============ EMITIENDO EVENTO ============`)
  console.log(`🗑️ [MovFinList] Payload del evento:`, JSON.stringify(eventPayload, null, 2))
  
  // Emitir evento para que el componente padre maneje la eliminación
  emit('delete-movement', eventPayload)
  
  console.log(`🗑️ [MovFinList] ✅ Evento 'delete-movement' emitido correctamente`)
}
</script>

<style scoped>
.movimientos-container {
  width: 100%;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.movimientos-container:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Vista compacta */
.movimientos-summary {
  padding: 12px 16px;
  cursor: pointer;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.movimientos-summary:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #f8fafc 100%);
  border-bottom-color: #e2e8f0;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.indicator-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}

.indicator-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.indicator-empty {
  background: #f1f5f9;
  border: 2px solid #cbd5e1;
}

.indicator-empty::before {
  background: #94a3b8;
}

.indicator-low {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border: 2px solid #86efac;
}

.indicator-low::before {
  background: #16a34a;
}

.indicator-medium {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border: 2px solid #fcd34d;
}

.indicator-medium::before {
  background: #d97706;
}

.indicator-high {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  border: 2px solid #f87171;
}

.indicator-high::before {
  background: #dc2626;
}

.indicator-count {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
}

.summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-types {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.chip-cheque {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

.chip-retencion {
  background: #fce7f3;
  color: #be185d;
  border: 1px solid #f9a8d4;
}

.chip-default {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.summary-total {
  display: flex;
  align-items: center;
  gap: 6px;
}

.total-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.total-amount {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'SF Mono', monospace;
}

.expand-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
}

.expand-button:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.expand-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* Vista expandida */
.movimientos-detail {
  border-top: 1px solid #e2e8f0;
  background: #fafbfc;
}

.detail-header {
  padding: 16px 20px 12px;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.detail-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.detail-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.stat-icon {
  width: 14px;
  height: 14px;
  color: #94a3b8;
}

/* Grupos de movimientos */
.movimientos-group {
  margin: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.movimientos-group:last-child {
  border-bottom: none;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px 12px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #f1f5f9;
}

.group-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.group-icon svg {
  width: 18px;
  height: 18px;
  color: white;
}

.cheques-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.retenciones-icon {
  background: linear-gradient(135deg, #ec4899, #be185d);
}

.group-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.group-total {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'SF Mono', monospace;
}

/* Lista de movimientos */
.movimientos-list {
  padding: 0 20px 16px;
}

.movimiento-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.movimiento-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.clickable-item {
  cursor: pointer;
}

.clickable-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.clickable-item:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.2);
}

.movimiento-item:last-child {
  margin-bottom: 0;
}

.item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cheque-item .item-icon {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.cheque-item .item-icon svg {
  width: 18px;
  height: 18px;
  color: #92400e;
}

.retencion-item .item-icon {
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
}

.retencion-item .item-icon svg {
  width: 18px;
  height: 18px;
  color: #be185d;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 12px;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.item-amount {
  font-size: 14px;
  font-weight: 700;
  color: #059669;
  font-family: 'SF Mono', monospace;
  white-space: nowrap;
}

.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.delete-button:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
  opacity: 1;
  transform: scale(1.05);
}

.delete-button svg {
  width: 14px;
  height: 14px;
}

.item-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 4px 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.detail-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
}

.detail-value {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Estado sin movimientos */
.no-movimientos {
  padding: 32px 20px;
  text-align: center;
  color: #64748b;
}

.no-movimientos-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-movimientos-icon svg {
  width: 24px;
  height: 24px;
  color: #94a3b8;
}

.no-movimientos-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 4px 0;
}

.no-movimientos-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Animaciones */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .summary-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .expand-button {
    align-self: flex-end;
  }
  
  .detail-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .item-details {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
