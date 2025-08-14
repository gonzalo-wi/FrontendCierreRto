<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="modal-backdrop">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isVisible" class="modal-container">
            <!-- Header del modal -->
            <div class="modal-header">
              <div class="header-content">
                <div class="header-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="header-info">
                  <h3 class="modal-title">Movimientos Financieros</h3>
                  <p class="modal-subtitle">{{ reparto?.idReparto }} - {{ formatDate(reparto?.fechaReparto) }}</p>
                </div>
              </div>
              <button @click="$emit('close')" class="close-button">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Stats del reparto -->
            <div class="reparto-stats">
              <div class="stat-card expected">
                <div class="stat-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ formatCurrency(reparto?.depositoEsperado || 0) }}</div>
                  <div class="stat-label">Esperado</div>
                </div>
              </div>

              <div class="stat-card real">
                <div class="stat-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ formatCurrency(reparto?.depositoReal || 0) }}</div>
                  <div class="stat-label">Real</div>
                </div>
              </div>

              <div class="stat-card difference" :class="getDifferenceClass()">
                <div class="stat-icon">
                  <svg v-if="diferencia === 0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg v-else-if="diferencia > 0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ formatCurrency(Math.abs(diferencia)) }}</div>
                  <div class="stat-label">{{ getDifferenceLabel() }}</div>
                </div>
              </div>
            </div>

            <!-- Contenido principal -->
            <div class="modal-body">
              <!-- Resumen de movimientos -->
              <div class="movimientos-summary">
                <h4 class="summary-title">Resumen de Movimientos</h4>
                <div class="summary-grid">
                  <div class="summary-item cheques">
                    <div class="summary-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <div class="summary-count">{{ totalCheques }}</div>
                      <div class="summary-label">Cheques</div>
                      <div class="summary-amount">{{ formatCurrency(montoCheques) }}</div>
                    </div>
                  </div>

                  <div class="summary-item retenciones">
                    <div class="summary-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <div class="summary-count">{{ totalRetenciones }}</div>
                      <div class="summary-label">Retenciones</div>
                      <div class="summary-amount">{{ formatCurrency(montoRetenciones) }}</div>
                    </div>
                  </div>

                  <div class="summary-item total">
                    <div class="summary-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <div class="summary-content">
                      <div class="summary-count">{{ totalMovimientos }}</div>
                      <div class="summary-label">Total Movimientos</div>
                      <div class="summary-amount">{{ formatCurrency(montoTotal) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista detallada usando el componente existente -->
              <div class="movimientos-detail">
                <MovimientosFinancierosList
                  :movimientos="reparto?.movimientoFinanciero"
                  :cheques="cheques"
                  :retenciones="retenciones"
                  :reparto="reparto"
                  :service="service"
                  :compact="false"
                  :can-delete="true"
                  @delete-movement="handleDeleteMovement"
                />
              </div>
            </div>

            <!-- Footer con acciones -->
            <div class="modal-footer">
              <button @click="$emit('close')" class="footer-button secondary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cerrar
              </button>
              
              <button 
                v-if="reparto?.movimientoFinanciero && totalMovimientos > 0"
                @click="handleDeleteAll" 
                class="footer-button danger"
                title="Eliminar todos los movimientos"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Eliminar Todos
              </button>
              
              <button 
                v-if="!reparto?.movimientoFinanciero || totalMovimientos === 0"
                @click="$emit('create', reparto)" 
                class="footer-button primary"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Crear Movimiento
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'
import MovimientosFinancierosList from './MovimientosFinancierosList.vue'

const props = defineProps({
  isVisible: {
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
  }
})

const emit = defineEmits(['close', 'create', 'delete-movement', 'delete-all-movements'])

// Computadas para estadísticas
const cheques = computed(() => props.reparto?.cheques || props.reparto?.movimientoFinanciero?.cheques || [])
const retenciones = computed(() => props.reparto?.retenciones || props.reparto?.movimientoFinanciero?.retenciones || [])

const totalCheques = computed(() => cheques.value.length)
const totalRetenciones = computed(() => retenciones.value.length)
const totalMovimientos = computed(() => totalCheques.value + totalRetenciones.value)

const montoCheques = computed(() => {
  return cheques.value.reduce((total, cheque) => {
    return total + parseFloat(cheque.importe || cheque.monto || 0)
  }, 0)
})

const montoRetenciones = computed(() => {
  return retenciones.value.reduce((total, retencion) => {
    return total + parseFloat(retencion.importe || retencion.monto || 0)
  }, 0)
})

const montoTotal = computed(() => montoCheques.value + montoRetenciones.value)

const diferencia = computed(() => {
  return (props.reparto?.depositoReal || 0) - (props.reparto?.depositoEsperado || 0)
})

const getDifferenceClass = () => {
  if (diferencia.value === 0) return 'exact'
  if (diferencia.value > 0) return 'surplus'
  return 'deficit'
}

const getDifferenceLabel = () => {
  if (diferencia.value === 0) return 'Exacto'
  if (diferencia.value > 0) return 'Sobrante'
  return 'Faltante'
}

// Función para manejar eliminación de movimientos individuales
const handleDeleteMovement = (eventData) => {
  console.log('🗑️ [MovDetailModal] ============ MANEJANDO DELETE MOVEMENT ============')
  console.log('🗑️ [MovDetailModal] eventData recibido:', JSON.stringify(eventData, null, 2))
  console.log('🗑️ [MovDetailModal] props.reparto disponible:', props.reparto?.idReparto)
  
  // Asegurar que el reparto esté en el evento
  const enhancedEventData = {
    ...eventData,
    reparto: eventData.reparto || props.reparto // Usar el reparto del evento o del modal
  }
  
  console.log('🗑️ [MovDetailModal] eventData mejorado:', JSON.stringify(enhancedEventData, null, 2))
  console.log('🗑️ [MovDetailModal] Emitiendo al padre (RepartoTable)...')
  
  emit('delete-movement', enhancedEventData)
}

// Función para manejar eliminación de todos los movimientos
const handleDeleteAll = () => {
  const totalMov = totalMovimientos.value
  const montoTotalMov = montoTotal.value
  
  const confirmMessage = `¿Está seguro que desea eliminar TODOS los movimientos financieros?\n\n` +
    `Se eliminarán:\n` +
    `- ${totalCheques.value} cheques\n` +
    `- ${totalRetenciones.value} retenciones\n` +
    `- Total: ${formatCurrency(montoTotalMov)}\n\n` +
    `Esta acción no se puede deshacer.`
  
  if (confirm(confirmMessage)) {
    console.log('🗑️ [MovDetailModal] Eliminando todos los movimientos para:', props.reparto?.idReparto)
    emit('delete-all-movements', props.reparto)
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  overflow-y: auto;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.5);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.modal-header {
  background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
  padding: 24px 32px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.header-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.header-info {
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: white;
}

.modal-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

/* Stats del reparto */
.reparto-stats {
  padding: 24px 32px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card.expected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

.stat-card.real {
  border-color: #059669;
  background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
}

.stat-card.difference.exact {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%);
}

.stat-card.difference.surplus {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.stat-card.difference.deficit {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.expected .stat-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.stat-card.real .stat-icon {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.stat-card.difference.exact .stat-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stat-card.difference.surplus .stat-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.stat-card.difference.deficit .stat-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  font-family: 'SF Mono', monospace;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
}

/* Resumen de movimientos */
.movimientos-summary {
  margin-bottom: 32px;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.summary-item {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.summary-item.cheques {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.summary-item.retenciones {
  border-color: #ec4899;
  background: linear-gradient(135deg, #fdf2f8 0%, #ffffff 100%);
}

.summary-item.total {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
}

.summary-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-item.cheques .summary-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.summary-item.retenciones .summary-icon {
  background: linear-gradient(135deg, #ec4899, #be185d);
  color: white;
}

.summary-item.total .summary-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.summary-icon svg {
  width: 24px;
  height: 24px;
}

.summary-content {
  flex: 1;
}

.summary-count {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.summary-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.summary-amount {
  font-size: 16px;
  font-weight: 700;
  color: #059669;
  font-family: 'SF Mono', monospace;
}

/* Detail */
.movimientos-detail {
  background: #f8fafc;
  border-radius: 12px;
  padding: 4px;
}

/* Footer */
.modal-footer {
  padding: 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.footer-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 2px solid;
}

.footer-button svg {
  width: 16px;
  height: 16px;
}

.footer-button.secondary {
  background: white;
  color: #64748b;
  border-color: #e2e8f0;
}

.footer-button.secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.footer-button.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-color: #3b82f6;
}

.footer-button.primary:hover {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.footer-button.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-color: #ef4444;
}

.footer-button.danger:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    margin: 8px;
    max-height: calc(100vh - 16px);
  }
  
  .modal-header {
    padding: 20px 24px;
  }
  
  .header-content {
    gap: 12px;
  }
  
  .header-icon {
    width: 40px;
    height: 40px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .reparto-stats {
    padding: 20px 24px;
    grid-template-columns: 1fr;
  }
  
  .modal-body {
    padding: 20px 24px;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-footer {
    padding: 20px 24px;
    flex-direction: column-reverse;
    gap: 8px;
  }
  
  .footer-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
