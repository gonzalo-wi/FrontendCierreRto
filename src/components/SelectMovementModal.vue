<template>
  <teleport to="body">
    <div v-if="isVisible" class="modal-backdrop" @click="closeModal">
      <div class="modal-container" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <div class="header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div class="header-text">
              <h2 class="modal-title">Editar Movimiento</h2>
              <p class="modal-subtitle">Selecciona el movimiento que deseas editar</p>
            </div>
          </div>
          <button @click="closeModal" class="close-button">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="modal-body">
          <!-- Información del reparto -->
          <div class="reparto-info">
            <div class="info-item">
              <span class="info-label">Reparto:</span>
              <span class="info-value">#{{ reparto?.idReparto }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Cliente:</span>
              <span class="info-value">{{ reparto?.cliente || 'No especificado' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total movimientos:</span>
              <span class="info-value">{{ totalMovimientos }}</span>
            </div>
          </div>

          <!-- Lista de movimientos para seleccionar -->
          <div class="movements-list">
            <!-- Cheques -->
            <div v-if="cheques && cheques.length > 0" class="movement-group">
              <div class="group-header">
                <div class="group-icon cheques-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 class="group-title">Cheques ({{ cheques.length }})</h3>
              </div>
              
              <div class="movement-items">
                <div v-for="(cheque, index) in cheques" :key="`cheque-${index}`" 
                     class="movement-item" @click="selectMovement('CHEQUE', cheque, index)">
                  <div class="item-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  
                  <div class="item-content">
                    <div class="item-header">
                      <span class="item-title">Cheque N° {{ cheque.nro_cheque || cheque.numero || 'S/N' }}</span>
                      <span class="item-amount">{{ formatCurrency(cheque.importe || cheque.monto || 0) }}</span>
                    </div>
                    
                    <div class="item-details">
                      <div class="detail-item">
                        <span class="detail-label">Banco:</span>
                        <span class="detail-value">{{ cheque.banco || 'No especificado' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Titular:</span>
                        <span class="detail-value">{{ cheque.titular || 'No especificado' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">{{ formatDate(cheque.fecha) || 'No especificada' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="item-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Retenciones -->
            <div v-if="retenciones && retenciones.length > 0" class="movement-group">
              <div class="group-header">
                <div class="group-icon retenciones-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                  </svg>
                </div>
                <h3 class="group-title">Retenciones ({{ retenciones.length }})</h3>
              </div>
              
              <div class="movement-items">
                <div v-for="(retencion, index) in retenciones" :key="`retencion-${index}`" 
                     class="movement-item" @click="selectMovement('RETENCION', retencion, index)">
                  <div class="item-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                    </svg>
                  </div>
                  
                  <div class="item-content">
                    <div class="item-header">
                      <span class="item-title">{{ retencion.concepto || 'Retención' }} N° {{ retencion.nro_retencion || retencion.numero || 'S/N' }}</span>
                      <span class="item-amount">{{ formatCurrency(retencion.importe || retencion.monto || 0) }}</span>
                    </div>
                    
                    <div class="item-details">
                      <div class="detail-item">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">{{ formatDate(retencion.fecha) || 'No especificada' }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Cliente:</span>
                        <span class="detail-value">{{ retencion.nrocta || 'No especificado' }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="item-arrow">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Estado sin movimientos -->
            <div v-if="totalMovimientos === 0" class="no-movements">
              <div class="no-movements-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="no-movements-content">
                <h4>Sin movimientos para editar</h4>
                <p>Este reparto no tiene movimientos financieros registrados</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button @click="closeModal" class="footer-button secondary">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  reparto: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'select-movement'])

// Computadas para extraer movimientos
const cheques = computed(() => props.reparto?.movimientoFinanciero?.cheques || [])
const retenciones = computed(() => props.reparto?.movimientoFinanciero?.retenciones || [])
const totalMovimientos = computed(() => cheques.value.length + retenciones.value.length)

// Funciones
const closeModal = () => {
  console.log('🔒 [SelectMovementModal] Cerrando modal de selección')
  emit('close')
}

const selectMovement = (tipo, movimiento, index) => {
  console.log('✏️ [SelectMovementModal] ============ MOVIMIENTO SELECCIONADO ============')
  console.log('✏️ [SelectMovementModal] tipo:', tipo)
  console.log('✏️ [SelectMovementModal] movimiento:', JSON.stringify(movimiento, null, 2))
  console.log('✏️ [SelectMovementModal] index:', index)
  console.log('✏️ [SelectMovementModal] reparto:', props.reparto?.idReparto)
  
  // Emitir evento con los datos del movimiento seleccionado
  const selectedData = {
    tipo,
    movimiento,
    index,
    reparto: props.reparto
  }
  
  console.log('✏️ [SelectMovementModal] Emitiendo select-movement con:', JSON.stringify(selectedData, null, 2))
  emit('select-movement', selectedData)
  
  // Cerrar el modal
  closeModal()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 640px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.modal-header {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 16px 16px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.header-icon svg {
  width: 24px;
  height: 24px;
}

.header-text {
  flex: 1;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #374151;
}

.close-button svg {
  width: 20px;
  height: 20px;
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.reparto-info {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

/* Movements List */
.movements-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.movement-group {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
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
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Movement Items */
.movement-items {
  display: flex;
  flex-direction: column;
}

.movement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.movement-item:hover {
  background: #f8fafc;
}

.movement-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
}

.item-icon svg {
  width: 18px;
  height: 18px;
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

.item-title {
  font-size: 14px;
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

.item-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 4px 12px;
}

.detail-item {
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

.item-arrow {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;
}

.movement-item:hover .item-arrow {
  background: #cbd5e1;
  color: #374151;
}

.item-arrow svg {
  width: 14px;
  height: 14px;
}

/* No movements */
.no-movements {
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
}

.no-movements-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-movements-icon svg {
  width: 32px;
  height: 32px;
  color: #94a3b8;
}

.no-movements-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.no-movements-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Footer */
.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #fafbfc;
  border-radius: 0 0 16px 16px;
}

.footer-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-button.secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.footer-button.secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.footer-button svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    margin: 16px;
    width: calc(100% - 32px);
    max-height: calc(100vh - 32px);
  }
  
  .reparto-info {
    flex-direction: column;
    gap: 12px;
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
