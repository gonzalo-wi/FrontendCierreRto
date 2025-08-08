<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-white">Movimientos Financieros</h2>
          <p class="text-blue-100 text-sm">{{ reparto?.idReparto }} - Cheques y Retenciones</p>
        </div>
        <button 
          @click="$emit('close')" 
          class="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
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
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
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
                    @click="editMovimiento(cheque, 'cheque')"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="deleteMovimiento(cheque, 'cheque')"
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
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
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
                    @click="editMovimiento(retencion, 'retencion')"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    title="Editar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="deleteMovimiento(retencion, 'retencion')"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import EditMovementModal from './EditMovementModal.vue'

const props = defineProps({
  isVisible: Boolean,
  reparto: Object,
  service: Object
})

const emit = defineEmits(['close', 'updated', 'delete-movement'])

// Estado
const activeTab = ref('cheques')
const showCreateModal = ref(false)
const editingMovimiento = ref(null)
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

          cheques.value.push(...(chequesDeposit || []))
          retenciones.value.push(...(retencionesDeposit || []))
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
  editingMovimiento.value = {
    ...movimiento,
    tipo: tipo.toUpperCase()
  }
  showCreateModal.value = true
}

const deleteMovimiento = async (movimiento, tipo) => {
  console.log('🗑️ [MovFinModal] ============ ELIMINANDO MOVIMIENTO DESDE MODAL ============')
  console.log('🗑️ [MovFinModal] ⚠️  FUNCIÓN deleteMovimiento EJECUTADA EN EL MODAL')
  console.log('🗑️ [MovFinModal] movimiento:', JSON.stringify(movimiento, null, 2))
  console.log('🗑️ [MovFinModal] tipo:', tipo)
  console.log('🗑️ [MovFinModal] reparto:', props.reparto?.idReparto)
  console.log('🗑️ [MovFinModal] reparto completo:', JSON.stringify(props.reparto, null, 2))
  
  // Verificar si el movimiento tiene los campos necesarios
  if (tipo === 'cheque') {
    console.log('🗑️ [MovFinModal] movimiento.nro_cheque:', movimiento?.nro_cheque)
    console.log('🗑️ [MovFinModal] movimiento.numero:', movimiento?.numero)
    if (!movimiento?.nro_cheque && !movimiento?.numero) {
      console.error('❌ [MovFinModal] PROBLEMA: El cheque no tiene nro_cheque ni numero')
    }
  } else if (tipo === 'retencion') {
    console.log('🗑️ [MovFinModal] movimiento.nro_retencion:', movimiento?.nro_retencion)
    console.log('🗑️ [MovFinModal] movimiento.numero:', movimiento?.numero)
    if (!movimiento?.nro_retencion && !movimiento?.numero) {
      console.error('❌ [MovFinModal] PROBLEMA: La retención no tiene nro_retencion ni numero')
    }
  }
  
  // Crear el payload para el evento
  const eventPayload = {
    tipo: tipo,
    movimiento: movimiento,
    reparto: props.reparto, // Pasar el reparto completo
    index: 0 // Dummy index para compatibilidad
  }
  
  console.log('🗑️ [MovFinModal] Payload del evento:', JSON.stringify(eventPayload, null, 2))
  
  // Emitir el evento al componente padre (RepartoView)
  emit('delete-movement', eventPayload)
  console.log('🗑️ [MovFinModal] ✅ Evento delete-movement emitido al componente padre')
}

const saveMovimiento = async (movimientoData) => {
  try {
    // Aquí necesitarías implementar la lógica para guardar
    // usando los nuevos endpoints
    console.log('Guardando movimiento:', movimientoData)

    // Recargar movimientos
    await loadMovimientos()
    emit('updated')
    closeCreateModal()

  } catch (error) {
    console.error('Error guardando movimiento:', error)
    alert(`Error al guardar: ${error.message}`)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingMovimiento.value = null
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
  if (props.isVisible) {
    loadMovimientos()
  }
})

// Observar cambios en la visibilidad
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    loadMovimientos()
  }
})
</script>
