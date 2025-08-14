<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">
          ✏️ Editar {{ movimientoData?.tipo === 'CHEQUE' ? 'Cheque' : 'Retención' }}
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p class="text-sm text-blue-800 font-medium">
          ✏️ Editar {{ movimientoData?.tipo === 'CHEQUE' ? 'Cheque' : 'Retención' }}
        </p>
        <p class="text-xs text-blue-600 mt-1">
          {{ movimientoData?.tipo === 'CHEQUE' ? 'Número: ' + (movimientoData?.nro_cheque || 'N/A') : 'Número: ' + (movimientoData?.nro_retencion || 'N/A') }}
        </p>
      </div>

      <form @submit.prevent="updateMovimiento" class="space-y-4">
        <!-- Campo Número -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            {{ movimientoData?.tipo === 'CHEQUE' ? 'Número de Cheque' : 'Número de Retención' }}
          </label>
          <input
            v-model="formData.numero"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Banco (solo para cheques) -->
        <div v-if="movimientoData?.tipo === 'CHEQUE'">
          <label class="block text-sm font-medium text-gray-700">Banco</label>
          <input
            v-model="formData.banco"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Tipo (solo para retenciones) -->
        <div v-if="movimientoData?.tipo === 'RETENCION'">
          <label class="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            v-model="formData.tipoRetencion"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="IIBB">IIBB</option>
            <option value="IVA">IVA</option>
            <option value="GANANCIAS">GANANCIAS</option>
          </select>
        </div>

        <!-- Campo Importe -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Importe</label>
          <input
            v-model="formData.importe"
            type="number"
            step="0.01"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Fecha -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha</label>
          <input
            v-model="formData.fecha"
            type="date"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Campo Concepto -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Concepto</label>
          <input
            v-model="formData.concepto"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
          >
            <span v-if="loading" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              � Guardar Cambios
            </span>
          </button>
        </div>
      </form>


    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

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
  tipoRetencion: 'IIBB',
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
  formData.tipoRetencion = data.tipo || 'IIBB'
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
  console.log('� [EditOnlyModal] Resumen IDs:', {
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
      updateData.tipo = formData.tipoRetencion
      
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
