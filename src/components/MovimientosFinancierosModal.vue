<template>
  <!-- {{ console.log('🖼️ [MovFinModal] TEMPLATE RENDERING - isVisible:', isVisible) }} -->
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold">💰 Movimientos Financieros</h2>
          <button 
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div v-if="reparto">
          <p class="text-blue-100 text-sm">{{ reparto?.idReparto }} - Cheques y Retenciones</p>
        </div>
      </div>

      <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
        <!-- Resumen -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200">
            <div class="flex items-center space-x-3">
              <div class="p-3 bg-green-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-green-600 font-medium">Cheques</p>
                <p class="text-2xl font-bold text-green-800">{{ cheques.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-amber-100 p-4 rounded-xl border border-orange-200">
            <div class="flex items-center space-x-3">
              <div class="p-3 bg-orange-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-orange-600 font-medium">Retenciones</p>
                <p class="text-2xl font-bold text-orange-800">{{ retenciones.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-xl border border-blue-200">
            <div class="flex items-center space-x-3">
              <div class="p-3 bg-blue-500 rounded-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm text-blue-600 font-medium">Total</p>
                <p class="text-2xl font-bold text-blue-800">${{ formatMoney(montoTotal) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pestañas -->
        <div class="flex space-x-4 mb-6">
          <button 
            @click="activeTab = 'cheques'"
            :class="activeTab === 'cheques' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Cheques ({{ cheques.length }})</span>
          </button>

          <button 
            @click="activeTab = 'retenciones'"
            :class="activeTab === 'retenciones' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <span>Retenciones ({{ retenciones.length }})</span>
          </button>

          <button 
            @click="showCreateModal = true"
            class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ml-auto"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Agregar Movimiento</span>
          </button>
        </div>

        <!-- Contenido de las pestañas -->
        <div v-if="activeTab === 'cheques'">
          <div v-if="cheques.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p>No hay cheques registrados</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="cheque in cheques" 
              :key="cheque.id"
              @click="editMovimiento(cheque, 'cheque')"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200"
              title="Haz clic para editar este cheque"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <!-- Indicador de que es clickeable -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      CHEQUE
                    </span>
                    <span class="text-xs text-gray-400 italic">Click para editar</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Número de Cheque</p>
                      <p class="font-semibold">{{ cheque.nro_cheque || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Banco</p>
                      <p class="font-semibold">{{ cheque.banco || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Importe</p>
                      <p class="font-semibold text-green-600">${{ formatMoney(cheque.importe) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Fecha</p>
                      <p class="font-semibold">{{ formatDate(cheque.fecha) }}</p>
                    </div>
                  </div>
                  <div v-if="cheque.concepto" class="mt-2">
                    <p class="text-sm text-gray-500">Concepto</p>
                    <p class="text-sm">{{ cheque.concepto }}</p>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button 
                    @click.stop="editMovimiento(cheque, 'cheque')"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click.stop="deleteMovimiento(cheque, 'cheque')"
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'retenciones'">
          <div v-if="retenciones.length === 0" class="text-center py-12 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <p>No hay retenciones registradas</p>
          </div>

          <div v-else class="space-y-4">
            <div 
              v-for="retencion in retenciones" 
              :key="retencion.id"
              @click="editMovimiento(retencion, 'retencion')"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-orange-300 cursor-pointer transition-all duration-200"
              title="Haz clic para editar esta retención"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <!-- Indicador de que es clickeable -->
                  <div class="flex items-center justify-between mb-3">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      RETENCIÓN
                    </span>
                    <span class="text-xs text-gray-400 italic">Click para editar</span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Número de Retención</p>
                      <p class="font-semibold">{{ retencion.nro_retencion || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Tipo</p>
                      <p class="font-semibold">{{ retencion.tipo || 'IIBB' }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Importe</p>
                      <p class="font-semibold text-orange-600">${{ formatMoney(retencion.importe) }}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Fecha</p>
                      <p class="font-semibold">{{ formatDate(retencion.fecha) }}</p>
                    </div>
                  </div>
                  <div v-if="retencion.concepto" class="mt-2">
                    <p class="text-sm text-gray-500">Concepto</p>
                    <p class="text-sm">{{ retencion.concepto }}</p>
                  </div>
                </div>
                <div class="flex space-x-2 ml-4">
                  <button 
                    @click.stop="editMovimiento(retencion, 'retencion')"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click.stop="deleteMovimiento(retencion, 'retencion')"
                    class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    title="Eliminar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DEBUG TEMPORAL - BORRAR DESPUÉS -->
    <div class="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      <p>🐛 DEBUG:</p>
      <p>showEditOnlyModal: {{ showEditOnlyModal }}</p>
      <p>selectedMovimientoToEdit: {{ selectedMovimientoToEdit?.id || 'null' }}</p>
      <p>service: {{ service ? 'OK' : 'NULL' }}</p>
    </div>

    <!-- Modal de crear/editar -->
    <EditMovementModal
      v-if="showCreateModal"
      :is-visible="showCreateModal"
      :reparto="reparto"
      :movimiento-tipo="editingMovimiento?.tipo || 'CHEQUE'"
      :movimiento-data="editingMovimiento"
      @close="closeCreateModal"
      @save="saveMovimiento"
    />

    <!-- Modal EXCLUSIVO para EDICIÓN (PUT) -->
    <EditOnlyModal
      :show="showEditOnlyModal"
      :movimiento-data="selectedMovimientoToEdit"
      :service="service"
      :deposit-id="reparto?.deposits?.[0]?.depositId || reparto?.deposits?.[0]?.id || reparto?.deposits?.[0]?.identifier"
      @close="closeEditOnlyModal"
      @updated="(updateInfo) => onEditComplete(updateInfo)"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import EditMovementModal from './EditMovementModal.vue'
import EditOnlyModal from './EditOnlyModalNew.vue'

const props = defineProps({
  isVisible: Boolean,
  reparto: Object,
  service: Object
})

const emit = defineEmits(['close', 'updated', 'delete-movement'])

// Estado
const activeTab = ref('cheques')
const showCreateModal = ref(false)
const showEditOnlyModal = ref(false)
const editingMovimiento = ref(null)
const selectedMovimientoToEdit = ref(null)
const cheques = ref([])
const retenciones = ref([])
const loading = ref(false)

// Computadas
const montoTotal = computed(() => {
  const totalCheques = cheques.value.reduce((sum, c) => sum + parseFloat(c.importe || 0), 0)
  const totalRetenciones = retenciones.value.reduce((sum, r) => sum + parseFloat(r.importe || 0), 0)
  return totalCheques + totalRetenciones
})

// Métodos
const loadMovimientos = async () => {
  console.log('📊 [MovFinModal] ============ CARGANDO MOVIMIENTOS ============')
  console.log('📊 [MovFinModal] props.reparto:', props.reparto?.idReparto)
  console.log('📊 [MovFinModal] props.service:', !!props.service)
  
  if (!props.reparto || !props.service) {
    console.warn('⚠️ [MovFinModal] No hay reparto o service, abortando carga')
    return
  }

  loading.value = true
  try {
    // Cargar cheques y retenciones desde los depósitos del reparto
    cheques.value = []
    retenciones.value = []

    console.log('📊 [MovFinModal] Deposits disponibles:', props.reparto.deposits?.length || 0)
    
    for (const deposit of props.reparto.deposits || []) {
      const depositId = deposit.depositId || deposit.id || deposit.identifier
      console.log('📊 [MovFinModal] Procesando deposit:', depositId)

      if (depositId) {
        try {
          const [chequesDeposit, retencionesDeposit] = await Promise.all([
            props.service.getCheques(depositId),
            props.service.getRetenciones(depositId)
          ])

          console.log(`📊 [MovFinModal] Deposit ${depositId} - Cheques:`, chequesDeposit?.length || 0)
          console.log(`📊 [MovFinModal] Deposit ${depositId} - Retenciones:`, retencionesDeposit?.length || 0)
          
          if (chequesDeposit?.length > 0) {
            console.log(`📊 [MovFinModal] Primer cheque:`, JSON.stringify(chequesDeposit[0], null, 2))
          }
          
          if (retencionesDeposit?.length > 0) {
            console.log(`📊 [MovFinModal] Primera retención:`, JSON.stringify(retencionesDeposit[0], null, 2))
          }

          // Agregar deposit_id a cada movimiento para futura referencia
          const chequesConDeposito = (chequesDeposit || []).map(cheque => ({
            ...cheque,
            deposit_id: depositId
          }))
          
          const retencionesConDeposito = (retencionesDeposit || []).map(retencion => ({
            ...retencion,
            deposit_id: depositId
          }))

          cheques.value.push(...chequesConDeposito)
          retenciones.value.push(...retencionesConDeposito)
        } catch (error) {
          console.warn(`Error cargando movimientos para depósito ${depositId}:`, error)
        }
      }
    }

    console.log('📊 Movimientos cargados:', {
      cheques: cheques.value.length,
      retenciones: retenciones.value.length,
      montoTotal: montoTotal.value
    })

  } catch (error) {
    console.error('Error cargando movimientos:', error)
  } finally {
    loading.value = false
  }
}

const editMovimiento = (movimiento, tipo) => {
  console.log('� [MovFinModal] ============ CLICK DETECTADO EN TARJETA ============')
  console.log('� [MovFinModal] Función editMovimiento ejecutada')
  console.log('🚨 [MovFinModal] Usuario hizo clic en tarjeta de:', tipo.toUpperCase())
  console.log('� [MovFinModal] movimiento original:', JSON.stringify(movimiento, null, 2))
  console.log('� [MovFinModal] tipo:', tipo)
  
  // USAR EL NUEVO MODAL ESPECÍFICO PARA EDICIÓN
  selectedMovimientoToEdit.value = {
    ...movimiento,
    tipo: tipo.toUpperCase(),
    deposit_id: movimiento.deposit_id // Preservar el deposit_id para actualización específica
  }
  
  console.log('� [MovFinModal] selectedMovimientoToEdit.value:', JSON.stringify(selectedMovimientoToEdit.value, null, 2))
  console.log('🚨 [MovFinModal] Cambiando showEditOnlyModal.value a true...')
  showEditOnlyModal.value = true
  console.log('🚨 [MovFinModal] showEditOnlyModal.value es ahora:', showEditOnlyModal.value)
  console.log('🚨 [MovFinModal] ============ DEBERÍA ABRIR EDITONLYMODAL ============')
}

const editMovimientoOLD = (movimiento, tipo) => {
  console.log('🖱️ [MovFinModal] ============ CLICK EN TARJETA PARA EDITAR (OLD) ============')
  console.log('🖱️ [MovFinModal] Usuario hizo clic en tarjeta de:', tipo.toUpperCase())
  console.log('🖱️ [MovFinModal] movimiento original:', JSON.stringify(movimiento, null, 2))
  console.log('🖱️ [MovFinModal] tipo:', tipo)
  
  // Preparar los datos para el modal de edición
  const movimientoParaEditar = {
    ...movimiento,
    tipo: tipo.toUpperCase(),
    // Normalizar campos para que el modal los reciba correctamente
    numero: movimiento.nro_cheque || movimiento.nro_retencion || movimiento.numero,
    banco: movimiento.banco,
    importe: movimiento.importe,
    fecha: movimiento.fecha,
    concepto: movimiento.concepto || movimiento.tipo,
    // Mantener campos originales para identificación
    id: movimiento.id,
    nro_cheque: movimiento.nro_cheque,
    nro_retencion: movimiento.nro_retencion
  }
  
  console.log('🖱️ [MovFinModal] editingMovimiento después de procesar:', JSON.stringify(movimientoParaEditar, null, 2))
  
  editingMovimiento.value = movimientoParaEditar
  showCreateModal.value = true
  console.log('🖱️ [MovFinModal] Modal abierto para EDITAR, showCreateModal:', showCreateModal.value)
  console.log('🖱️ [MovFinModal] ============ MODAL DE EDICIÓN PREPARADO ============')
}

const deleteMovimiento = async (movimiento, tipo) => {
  console.log('🗑️ [MovFinModal] ============ ELIMINANDO MOVIMIENTO DESDE MODAL ============')
  console.log('🗑️ [MovFinModal] ⚠️  FUNCIÓN deleteMovimiento EJECUTADA EN EL MODAL')
  console.log('🗑️ [MovFinModal] movimiento:', JSON.stringify(movimiento, null, 2))
  console.log('🗑️ [MovFinModal] tipo:', tipo)
  console.log('🗑️ [MovFinModal] reparto:', props.reparto?.idReparto)
  
  // Encontrar el índice real del movimiento en el array correspondiente
  let realIndex = -1
  if (tipo === 'cheque') {
    console.log('🗑️ [MovFinModal] movimiento.nro_cheque:', movimiento?.nro_cheque)
    console.log('🗑️ [MovFinModal] movimiento.numero:', movimiento?.numero)
    
    // Buscar el índice en el array de cheques
    realIndex = cheques.value.findIndex(cheque => {
      const chequeId = cheque.nro_cheque || cheque.numero
      const movimientoId = movimiento.nro_cheque || movimiento.numero
      return chequeId === movimientoId
    })
    
    console.log('🗑️ [MovFinModal] Índice real del cheque:', realIndex)
    if (!movimiento?.nro_cheque && !movimiento?.numero) {
      console.error('❌ [MovFinModal] PROBLEMA: El cheque no tiene nro_cheque ni numero')
    }
  } else if (tipo === 'retencion') {
    console.log('🗑️ [MovFinModal] movimiento.nro_retencion:', movimiento?.nro_retencion)
    console.log('🗑️ [MovFinModal] movimiento.numero:', movimiento?.numero)
    
    // Buscar el índice en el array de retenciones
    realIndex = retenciones.value.findIndex(retencion => {
      const retencionId = retencion.nro_retencion || retencion.numero
      const movimientoId = movimiento.nro_retencion || movimiento.numero
      return retencionId === movimientoId
    })
    
    console.log('🗑️ [MovFinModal] Índice real de la retención:', realIndex)
    if (!movimiento?.nro_retencion && !movimiento?.numero) {
      console.error('❌ [MovFinModal] PROBLEMA: La retención no tiene nro_retencion ni numero')
    }
  }
  
  if (realIndex === -1) {
    console.error('❌ [MovFinModal] PROBLEMA: No se pudo encontrar el índice del movimiento')
    return
  }
  
  // Crear el payload para el evento
  const eventPayload = {
    tipo: tipo,
    movimiento: movimiento,
    reparto: props.reparto, // Pasar el reparto completo
    index: realIndex // Usar el índice real encontrado
  }
  
  console.log('🗑️ [MovFinModal] Payload del evento:', JSON.stringify(eventPayload, null, 2))
  
  // Emitir el evento al componente padre (RepartoView)
  emit('delete-movement', eventPayload)
  console.log('🗑️ [MovFinModal] ✅ Evento delete-movement emitido al componente padre')
}

const saveMovimiento = async (movimientoData) => {
  console.log('💾 [MovFinModal] ============ GUARDANDO MOVIMIENTO ============')
  console.log('💾 [MovFinModal] movimientoData recibido:', JSON.stringify(movimientoData, null, 2))
  console.log('💾 [MovFinModal] editingMovimiento actual:', JSON.stringify(editingMovimiento.value, null, 2))
  
  try {
    // Detectar si estamos editando o creando
    const isEditing = editingMovimiento.value && (
      editingMovimiento.value.id || 
      editingMovimiento.value.nro_cheque || 
      editingMovimiento.value.nro_retencion ||
      editingMovimiento.value.numero
    )
    
    console.log('💾 [MovFinModal] Modo detectado:', isEditing ? 'EDICIÓN' : 'CREACIÓN')

    if (isEditing) {
      // ============ MODO EDICIÓN - Usar PUT ============
      if (movimientoData.tipo === 'CHEQUE' || editingMovimiento.value.tipo === 'CHEQUE') {
        // Obtener el ID del cheque
        const chequeId = editingMovimiento.value.id || 
                        editingMovimiento.value.nro_cheque || 
                        editingMovimiento.value.numero
        
        console.log('💾 [MovFinModal] 🏦 Actualizando CHEQUE con ID:', chequeId)
        
        const chequeUpdateData = {
          nro_cheque: movimientoData.numero || movimientoData.nro_cheque,
          banco: movimientoData.banco,
          importe: parseFloat(movimientoData.importe),
          fecha: movimientoData.fecha || new Date().toISOString().split('T')[0],
          concepto: movimientoData.concepto || ''
        }
        
        console.log('💾 [MovFinModal] Datos para actualizar cheque:', JSON.stringify(chequeUpdateData, null, 2))
        console.log('💾 [MovFinModal] 🌐 Llamando a props.service.updateCheque...')
        
        await props.service.updateCheque(chequeId, chequeUpdateData)
        console.log('✅ [MovFinModal] 🏦 Cheque actualizado exitosamente')
        
      } else if (movimientoData.tipo === 'RETENCION' || editingMovimiento.value.tipo === 'RETENCION') {
        // Obtener el ID de la retención
        const retencionId = editingMovimiento.value.id || 
                           editingMovimiento.value.nro_retencion || 
                           editingMovimiento.value.numero
        
        console.log('💾 [MovFinModal] 📋 Actualizando RETENCIÓN con ID:', retencionId)
        
        const retencionUpdateData = {
          nro_retencion: movimientoData.numero || movimientoData.nro_retencion,
          tipo: movimientoData.concepto || movimientoData.tipo || 'IIBB',
          importe: parseFloat(movimientoData.importe),
          fecha: movimientoData.fecha || new Date().toISOString().split('T')[0],
          concepto: movimientoData.concepto || ''
        }
        
        console.log('💾 [MovFinModal] Datos para actualizar retención:', JSON.stringify(retencionUpdateData, null, 2))
        console.log('💾 [MovFinModal] 🌐 Llamando a props.service.updateRetencion...')
        
        await props.service.updateRetencion(retencionId, retencionUpdateData)
        console.log('✅ [MovFinModal] 📋 Retención actualizada exitosamente')
      }
      
    } else {
      // ============ MODO CREACIÓN - Usar POST ============
      // Obtener el depositId del reparto
      const depositId = props.reparto?.deposits?.[0]?.depositId || 
                       props.reparto?.deposits?.[0]?.id || 
                       props.reparto?.deposits?.[0]?.deposit_id
      
      console.log('💾 [MovFinModal] 🆕 Creando nuevo movimiento en depósito:', depositId)
      
      if (!depositId) {
        throw new Error('No se pudo determinar el ID del depósito para crear el movimiento')
      }
      
      if (movimientoData.tipo === 'CHEQUE') {
        const chequeCreateData = {
          deposit_id: depositId,
          nro_cheque: movimientoData.numero,
          banco: movimientoData.banco,
          importe: parseFloat(movimientoData.importe),
          fecha: movimientoData.fecha || new Date().toISOString().split('T')[0],
          concepto: movimientoData.concepto || ''
        }
        
        console.log('💾 [MovFinModal] Datos para crear cheque:', JSON.stringify(chequeCreateData, null, 2))
        await props.service.createCheque(depositId, chequeCreateData)
        console.log('✅ [MovFinModal] 🏦 Cheque creado exitosamente')
        
      } else if (movimientoData.tipo === 'RETENCION') {
        const retencionCreateData = {
          deposit_id: depositId,
          nro_retencion: movimientoData.numero,
          concepto: movimientoData.concepto || 'IIBB',
          importe: parseFloat(movimientoData.importe),
          fecha: movimientoData.fecha || new Date().toISOString().split('T')[0]
        }
        
        console.log('💾 [MovFinModal] Datos para crear retención:', JSON.stringify(retencionCreateData, null, 2))
        await props.service.createRetencion(depositId, retencionCreateData)
        console.log('✅ [MovFinModal] 📋 Retención creada exitosamente')
      }
    }

    // ============ POST-PROCESAMIENTO ============
    console.log('🔄 [MovFinModal] Recargando movimientos financieros...')
    await loadMovimientos()
    
    console.log('📡 [MovFinModal] Emitiendo evento "updated" al componente padre...')
    emit('updated')
    
    console.log('🚪 [MovFinModal] Cerrando modal de creación/edición...')
    closeCreateModal()
    
    console.log('🎉 [MovFinModal] ============ OPERACIÓN COMPLETADA EXITOSAMENTE ============')

  } catch (error) {
    console.error('❌ [MovFinModal] ============ ERROR EN OPERACIÓN ============')
    console.error('❌ [MovFinModal] Error completo:', error)
    console.error('❌ [MovFinModal] Error message:', error.message)
    console.error('❌ [MovFinModal] Error response:', error.response?.data)
    
    // Mostrar error más detallado al usuario
    let errorMessage = 'Error desconocido'
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert(`Error al guardar movimiento: ${errorMessage}`)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingMovimiento.value = null
}

const closeEditOnlyModal = () => {
  console.log('🔧 [MovFinModal] Cerrando EditOnlyModal')
  showEditOnlyModal.value = false
  selectedMovimientoToEdit.value = null
}

const onEditComplete = async (updateInfo) => {
  console.log('✅ [MovFinModal] Edición completada')
  console.log('🔄 [MovFinModal] Payload recibido:', updateInfo)

  // 1. Patch optimista inmediato
  if (updateInfo && updateInfo.id) {
    const { id, tipo, data, updatedEntity } = updateInfo
    const source = updatedEntity || data
    if (tipo === 'CHEQUE') {
      const idx = cheques.value.findIndex(c => c.id === id)
      if (idx !== -1) cheques.value[idx] = { ...cheques.value[idx], ...source }
    } else if (tipo === 'RETENCION') {
      const idx = retenciones.value.findIndex(r => r.id === id)
      if (idx !== -1) retenciones.value[idx] = { ...retenciones.value[idx], ...source }
    }
    cheques.value = [...cheques.value]
    retenciones.value = [...retenciones.value]
    console.log('⚡ [MovFinModal] Patch optimista aplicado')
  }

  // 2. Emitir al padre inmediatamente
  try { emit('updated') } catch (e) { console.warn('⚠️ emit updated falló', e) }

  // 3. Refetch forzado sin cache
  console.log('🔄 [MovFinModal] Refetch forzado no-cache')
  await loadMovimientos(true)
  console.log('✅ [MovFinModal] Refetch completado')

  // 4. Cerrar modal
  closeEditOnlyModal()
}

const formatMoney = (value) => {
  if (!value) return '0'
  return parseFloat(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-AR')
}

// Cargar datos al montar
onMounted(() => {
  console.log('🌟 [MovFinModal] ========== COMPONENT MOUNTED ==========')
  console.log('🌟 [MovFinModal] props.isVisible:', props.isVisible)
  if (props.isVisible) {
    loadMovimientos()
  }
})

// Observar cambios en la visibilidad
watch(() => props.isVisible, (newValue) => {
  console.log('👁️ [MovFinModal] ========== MODAL VISIBILITY CHANGED ==========')
  console.log('👁️ [MovFinModal] newValue (isVisible):', newValue)
  console.log('👁️ [MovFinModal] props.reparto:', props.reparto?.idReparto || 'NO REPARTO')
  console.log('👁️ [MovFinModal] props.service:', props.service ? 'SERVICE OK' : 'NO SERVICE')
  
  if (newValue) {
    // Modal se está abriendo - cargar datos frescos
    console.log('🔄 [MovFinModal] Modal abriéndose - cargando datos frescos')
    loadMovimientos()
  } else {
    // Modal se está cerrando - limpiar datos para próxima apertura
    console.log('🧹 [MovFinModal] Modal cerrándose - limpiando datos cached')
    cheques.value = []
    retenciones.value = []
  }
})
</script>
