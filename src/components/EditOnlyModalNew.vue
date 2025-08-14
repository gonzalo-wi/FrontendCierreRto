<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all duration-300">
      <!-- Header con gradiente -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-bold">
                Editar {{ movimientoData?.tipo === 'CHEQUE' ? 'Cheque' : 'Retención' }}
              </h3>
              <p class="text-blue-100 text-sm">
                {{ movimientoData?.tipo === 'CHEQUE' ? 'Nº ' + (movimientoData?.nro_cheque || 'N/A') : 'Nº ' + (movimientoData?.nro_retencion || 'N/A') }}
              </p>
            </div>
          </div>
          <button 
            @click="closeModal"
            class="text-white hover:text-blue-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Formulario -->
      <div class="p-6">
        <form @submit.prevent="updateMovimiento" class="space-y-5">
          <!-- Campo Número -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                </svg>
                <span>{{ movimientoData?.tipo === 'CHEQUE' ? 'Número de Cheque' : 'Número de Retención' }}</span>
              </span>
            </label>
            <input
              v-model="formData.numero"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              placeholder="Ingrese el número"
            />
          </div>

          <!-- Campo Banco (solo para cheques) -->
          <div v-if="movimientoData?.tipo === 'CHEQUE'" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span>Banco</span>
              </span>
            </label>
            <input
              v-model="formData.banco"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              placeholder="Nombre del banco"
            />
          </div>

          <!-- Campo Importe -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span>Importe</span>
              </span>
            </label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-500 font-medium">$</span>
              <input
                v-model="formData.importe"
                type="number"
                step="0.01"
                required
                class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <!-- Campo Fecha -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Fecha</span>
              </span>
            </label>
            <input
              v-model="formData.fecha"
              type="date"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
            />
          </div>

          <!-- Campo Concepto -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-800">
              <span class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                </svg>
                <span>Concepto</span>
              </span>
            </label>
            
            <!-- Dropdown para retenciones -->
            <div v-if="movimientoData?.tipo === 'RETENCION'">
              <select
                v-model="formData.concepto"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="">Seleccionar concepto</option>
                <option 
                  v-for="concepto in CONCEPTOS_RETENCIONES" 
                  :key="concepto.codigo" 
                  :value="`${concepto.codigo} - ${concepto.descripcion}`"
                >
                  {{ concepto.codigo }} - {{ concepto.descripcion }}
                </option>
              </select>
            </div>
            
            <!-- Dropdown para cheques -->
            <div v-else>
              <select
                v-model="formData.concepto"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
              >
                <option value="">Seleccionar concepto</option>
                <option 
                  v-for="concepto in CONCEPTOS_CHEQUES" 
                  :key="concepto.codigo" 
                  :value="`${concepto.codigo} - ${concepto.descripcion}`"
                >
                  {{ concepto.codigo }} - {{ concepto.descripcion }}
                </option>
              </select>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

// Conceptos predefinidos para cheques
const CONCEPTOS_CHEQUES = [
  { codigo: 'CHE', descripcion: 'CHEQUE COMUN' },
  { codigo: 'CNO', descripcion: 'CHEQUE NO A LA ORDEN' },
  { codigo: 'CTJ', descripcion: 'BCO CIUDAD CTAS JUDICIALES' },
  { codigo: 'DBF', descripcion: 'BCO. FRANCES 1382/2' },
  { codigo: 'DF2', descripcion: 'BBVA 0579/9 (JUMI)' },
  { codigo: 'DF3', descripcion: 'NACION 3275/1 (JUMI)' },
  { codigo: 'DF5', descripcion: 'SUPERVIELLE 5121/2 (LUFRAN)' },
  { codigo: 'ECH', descripcion: 'E-CHECK' },
  { codigo: 'EF2', descripcion: 'EFECTIVO CAJA 02' },
  { codigo: 'EFE', descripcion: 'EFECTIVO' },
  { codigo: 'GRP', descripcion: 'GROUPON' },
  { codigo: 'PMC', descripcion: 'PAGOMISCUENTAS' }
]

// Conceptos predefinidos para retenciones
const CONCEPTOS_RETENCIONES = [
  { codigo: 'RCI', descripcion: 'RETENCION TISH CIUDA.' },
  { codigo: 'RGA', descripcion: 'RETENCION GANANCIAS' },
  { codigo: 'RIB', descripcion: 'RETENCION IIBB BS.AS' },
  { codigo: 'RIC', descripcion: 'RETENCION IIBB CABA' },
  { codigo: 'RIV', descripcion: 'RETENCION DE IVA' },
  { codigo: 'RLP', descripcion: 'RETENCION TISH LP' },
  { codigo: 'RMI', descripcion: 'RETENCIONES IB MISIONES' },
  { codigo: 'RSU', descripcion: 'RETENCION SUSS' },
  { codigo: 'CTJ', descripcion: 'BCO CIUDAD CTAS JUDICIALES' },
  { codigo: 'DBF', descripcion: 'BCO. FRANCES 1382/2' },
  { codigo: 'DF2', descripcion: 'BBVA 0579/9 (JUMI)' },
  { codigo: 'DF3', descripcion: 'NACION 3275/1 (JUMI)' },
  { codigo: 'DF5', descripcion: 'SUPERVIELLE 5121/2 (LUFRAN)' },
  { codigo: 'ECH', descripcion: 'E-CHECK' },
  { codigo: 'EF2', descripcion: 'EFECTIVO CAJA 02' },
  { codigo: 'EFE', descripcion: 'EFECTIVO' },
  { codigo: 'GRP', descripcion: 'GROUPON' },
  { codigo: 'PMC', descripcion: 'PAGOMISCUENTAS' },
  { codigo: 'CHC', descripcion: 'RETENCION TISH CIUDA' }
]

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  movimientoData: {
    type: Object,
    default: () => ({})
  },
  service: {
    type: Object,
    required: true
  },
  depositId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const loading = ref(false)

const formData = reactive({
  numero: '',
  banco: '',
  importe: '',
  fecha: '',
  concepto: ''
})

const serviceName = computed(() => {
  return props.service?.constructor?.name || 'Unknown Service'
})

// Watch para cuando se abra el modal y cargar los datos
watch(() => props.show, (newVal) => {
  console.log('👁️ [EditOnlyModal] Watch activado - show cambió a:', newVal)
  console.log('👁️ [EditOnlyModal] props.movimientoData:', JSON.stringify(props.movimientoData, null, 2))
  
  if (newVal && props.movimientoData) {
    console.log('🔧 [EditOnlyModal] ========== MODAL ABIERTO PARA EDICIÓN ==========')
    console.log('🔧 [EditOnlyModal] Datos recibidos:', JSON.stringify(props.movimientoData, null, 2))
    console.log('🔧 [EditOnlyModal] Servicio:', serviceName.value)
    
    loadDataIntoForm()
  } else {
    console.log('👁️ [EditOnlyModal] Modal cerrado o sin datos')
  }
})

const loadDataIntoForm = () => {
  const data = props.movimientoData
  
  formData.numero = data.nro_cheque || data.nro_retencion || data.numero || ''
  formData.banco = data.banco || ''
  formData.importe = data.importe || ''
  formData.fecha = data.fecha || ''
  formData.concepto = data.concepto || ''
  
  console.log('🔧 [EditOnlyModal] Formulario cargado:', JSON.stringify(formData, null, 2))
}

const updateMovimiento = async () => {
  console.log('🔄 [EditOnlyModal] ========== INICIANDO PUT ==========')
  console.log('🔄 [EditOnlyModal] props.movimientoData completo:', JSON.stringify(props.movimientoData, null, 2))
  console.log('🔄 [EditOnlyModal] Tipo:', props.movimientoData?.tipo)
  console.log('🔄 [EditOnlyModal] Campo ID disponible?', 'id' in (props.movimientoData || {}), props.movimientoData?.id)
  console.log('🔄 [EditOnlyModal] Datos del formulario:', JSON.stringify(formData, null, 2))
  
  // Seleccionar SIEMPRE el ID real de BD si existe
  let movimientoId = null
  if (typeof props.movimientoData?.id !== 'undefined' && props.movimientoData?.id !== null) {
    movimientoId = Number(props.movimientoData.id)
    console.log('✅ [EditOnlyModal] Usando ID de BD:', movimientoId)
  } else {
    // Fallback ONLY si no vino id (no debería pasar ya)
    if (props.movimientoData?.tipo === 'CHEQUE') {
      movimientoId = Number(props.movimientoData?.cheque_id || props.movimientoData?.nro_cheque)
      console.log('⚠️ [EditOnlyModal] Fallback cheque. ID usado:', movimientoId)
    } else if (props.movimientoData?.tipo === 'RETENCION') {
      movimientoId = Number(props.movimientoData?.retencion_id || props.movimientoData?.nro_retencion)
      console.log('⚠️ [EditOnlyModal] Fallback retención. ID usado:', movimientoId)
    }
  }
  console.log('🔎 [EditOnlyModal] Resumen IDs:', {
    id: props.movimientoData?.id,
    cheque_id: props.movimientoData?.cheque_id,
    retencion_id: props.movimientoData?.retencion_id,
    nro_cheque: props.movimientoData?.nro_cheque,
    nro_retencion: props.movimientoData?.nro_retencion,
    movimientoIdSeleccionado: movimientoId
  })
  
  if (!movimientoId || isNaN(movimientoId)) {
    console.error('❌ [EditOnlyModal] ERROR: No hay ID válido para editar')
    console.error('❌ [EditOnlyModal] Estructura del objeto:', Object.keys(props.movimientoData || {}))
    console.error('❌ [EditOnlyModal] ID final inválido:', movimientoId)
    alert('ERROR: No se puede editar sin ID válido. Revisa la consola para más detalles.')
    return
  }

  loading.value = true

  try {
    const updateData = {
      importe: parseFloat(formData.importe),
      fecha: formData.fecha,
      concepto: formData.concepto
    }

    let updatedEntity = null
    if (props.movimientoData.tipo === 'CHEQUE') {
      updateData.nro_cheque = formData.numero
      updateData.banco = formData.banco
      
      console.log('🔄 [EditOnlyModal] Llamando service.updateCheque con depositId:', props.depositId, 'chequeId:', movimientoId)
      console.log('🔄 [EditOnlyModal] Datos para actualizar cheque:', JSON.stringify(updateData, null, 2))
      
      const response = await props.service.updateCheque(props.depositId, movimientoId, updateData)
      updatedEntity = response
      console.log('✅ [EditOnlyModal] Respuesta del PUT cheque:', response)
      
    } else if (props.movimientoData.tipo === 'RETENCION') {
      updateData.nro_retencion = formData.numero
      
      console.log('🔄 [EditOnlyModal] Llamando service.updateRetencion con depositId:', props.depositId, 'retencionId:', movimientoId)
      console.log('🔄 [EditOnlyModal] Datos para actualizar retención:', JSON.stringify(updateData, null, 2))
      
      const response = await props.service.updateRetencion(props.depositId, movimientoId, updateData)
      updatedEntity = response
      console.log('✅ [EditOnlyModal] Respuesta del PUT retención:', response)
    }

    console.log('✅ [EditOnlyModal] PUT exitoso, emitiendo evento y cerrando modal')
    
    // Emitir evento con los datos actualizados para refresco inmediato
    console.log('📡 [EditOnlyModal] Emitiendo evento updated con datos:', {
      id: movimientoId,
      tipo: props.movimientoData.tipo,
      data: updateData,
      depositId: props.depositId
    })
    
    emit('updated', {
      id: movimientoId,
      tipo: props.movimientoData.tipo,
      data: updateData,
      depositId: props.depositId,
      updatedEntity
    })
    
    console.log('✅ [EditOnlyModal] Evento updated emitido, cerrando modal...')
    closeModal()

    // FORZAR REFRESH COMPLETO DE LA PÁGINA (requerido por el usuario)
    // Pequeño delay para permitir que Vue procese eventos antes del reload
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        console.log('🔃 [EditOnlyModal] Forzando recarga completa de la página')
        window.location.reload()
      }
    }, 200)
    
  } catch (error) {
    console.error('❌ [EditOnlyModal] ERROR en PUT:', error)
    console.error('❌ [EditOnlyModal] Detalles del error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    })
    
    alert(`ERROR al actualizar: ${error.response?.data?.detail || error.message}`)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  console.log('🔧 [EditOnlyModal] Cerrando modal')
  emit('close')
}
</script>
