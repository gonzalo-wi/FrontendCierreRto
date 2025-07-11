<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 shadow-2xl">
      <div class="container mx-auto px-4 py-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Icono principal con animación -->
            <div class="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
              <svg class="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-4xl font-bold text-white mb-2">
                Gestión de Repartos
                <span class="text-blue-200">{{ title }}</span>
              </h1>
              <p class="text-blue-100 text-lg">Sistema integrado de control y seguimiento</p>
            </div>
          </div>
          
          <!-- Indicadores de estado -->
          <div class="hidden lg:flex items-center space-x-6">
            <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-white font-medium">Sistema Online</span>
              </div>
            </div>
            <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-white font-medium">{{ new Date().toLocaleTimeString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <!-- Selector de fecha -->
      <DateSelector @fecha-seleccionada="onFechaSeleccionada" />
      
      <!-- Totales por Planta - Solo mostrar en vista principal -->
      <TotalsView 
        v-if="showTotals"
        :fecha-seleccionada="props.title.toLowerCase().includes('jumillano') ? fechaSeleccionada?.fechaBackend : fechaSeleccionada?.fechaAPI"
      />
      
      <!-- Estadísticas Dashboard -->
      <div v-if="!loading && !error" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats-card bg-gradient-to-br from-emerald-500 to-emerald-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-sm font-medium">Total Repartos</p>
              <p class="text-3xl font-bold text-white">{{ repartos.length }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <img src="/src/assets/entrega.png" alt="Camión de entrega" class="w-8 h-8 object-contain brightness-0 invert">
            </div>
          </div>
        </div>

        <div class="stats-card bg-gradient-to-br from-blue-500 to-blue-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">Exactos</p>
              <p class="text-3xl font-bold text-white">{{ exactCount }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-gradient-to-br from-amber-500 to-orange-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-orange-100 text-sm font-medium">Con Diferencias</p>
              <p class="text-3xl font-bold text-white">{{ withDifferencesCount }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="stats-card bg-gradient-to-br from-purple-500 to-purple-600">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">Pendientes</p>
              <p class="text-3xl font-bold text-white">{{ pendingCount }}</p>
            </div>
            <div class="bg-white/20 p-3 rounded-xl">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state mejorado -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <!-- Spinner principal -->
          <div class="animate-spin rounded-full h-20 w-20 border-4 border-blue-100"></div>
          <div class="animate-spin rounded-full h-20 w-20 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
          
          <!-- Icono central -->
          <div class="absolute inset-0 flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Cargando Repartos</h3>
          <p class="text-gray-500">Obteniendo los datos más recientes...</p>
          
          <!-- Barra de progreso animada -->
          <div class="w-64 bg-gray-200 rounded-full h-2 mt-4">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" style="width: 70%"></div>
          </div>
        </div>
      </div>

      <!-- Error state mejorado -->
      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 shadow-xl">
          <div class="text-center">
            <!-- Icono de error -->
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            
            <h3 class="text-xl font-bold text-red-800 mb-2">Error al cargar los datos</h3>
            <p class="text-red-600 mb-6">{{ error }}</p>
            
            <button 
              @click="fetchRepartos" 
              class="error-retry-btn"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Reintentar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de repartos con contenedor mejorado -->
      <div v-else class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <RepartoTable 
          :title="`Repartos ${title}`"
          :repartos="repartos"
          @refresh="fetchRepartos"
          @edit="openEditModal"
          @delete-movement="deleteMovement"
          @toggle-comprobantes="handleToggleComprobantes"
          @estado-actualizado="handleEstadoActualizado"
        />
        
        <!-- Botón Procesar debajo de la tabla -->
        <div class="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-t border-gray-200/60">
          <div class="flex justify-between items-center">
            <!-- Información de estado -->
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ repartosListos.length }} de {{ repartos.length }} repartos listos</span>
            </div>
            
            <!-- Botón compacto -->
            <button 
              @click="procesarRepartos"
              :disabled="repartosListos.length === 0 || procesando"
              class="process-btn-compact inline-flex items-center space-x-2 transition-all duration-200"
              :class="{
                'opacity-50 cursor-not-allowed': repartosListos.length === 0 || procesando,
                'hover:shadow-md transform hover:-translate-y-0.5': repartosListos.length > 0 && !procesando
              }"
            >
              <!-- Icono -->
              <svg v-if="!procesando" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <!-- Spinner cuando está procesando -->
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <!-- Texto -->
              <span class="font-medium">
                {{ procesando ? 'Procesando...' : 'Procesar Repartos' }}
              </span>
              
              <!-- Badge con contador -->
              <span v-if="!procesando && repartosListos.length > 0" class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white/30 rounded-full">
                {{ repartosListos.length }}
              </span>
            </button>
          </div>
          
          <!-- Mensaje informativo cuando no hay repartos listos -->
          <div v-if="repartosListos.length === 0" class="mt-3 text-center">
            <p class="text-gray-500 text-xs">
              Los repartos sin diferencias o con movimientos financieros están listos para procesar
            </p>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <EditMovementModal
        :is-visible="showModal"
        :reparto="selectedReparto"
        :saving="saving"
        :movimiento-tipo="modalMovimientoTipo"
        @close="closeModal"
        @save="saveMovement"
      />
    </div>

    <!-- Modal de Comprobantes -->
    <ComprobantesModal 
      v-if="showComprobantesModal"
      :reparto="selectedRepartoComprobantes"
      @close="closeComprobantesModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { config } from '../config/config.js'
import RepartoTable from '../components/RepartoTable.vue'
import ComprobantesModal from '../components/ComprobantesModal.vue'
import EditMovementModal from '../components/EditMovementModal.vue'
import DateSelector from '../components/DateSelector.vue'
import TotalsView from '../components/TotalsView.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  service: {
    type: Object,
    required: true
  },
  showTotals: {
    type: Boolean,
    default: false
  }
})

// Estado reactivo
const repartos = ref([])
const loading = ref(false)
const error = ref(null)
const procesando = ref(false)
const fechaSeleccionada = ref(null) // Fecha seleccionada por el usuario
const isFetching = ref(false) // Flag para prevenir llamadas múltiples

// Estado del modal
const showModal = ref(false)
const selectedReparto = ref(null)
const saving = ref(false)
const modalMovimientoTipo = ref(null) // cheque | retencion | null

// Estados para modal de comprobantes
const showComprobantesModal = ref(false)
const selectedRepartoComprobantes = ref(null)

// Propiedades computadas para estadísticas
const exactCount = computed(() => {
  return repartos.value.filter(r => r.depositoReal === r.depositoEsperado).length
})

const withDifferencesCount = computed(() => {
  return repartos.value.filter(r => r.depositoReal !== r.depositoEsperado).length
})

const pendingCount = computed(() => {
  return repartos.value.filter(r => r.movimientoFinanciero).length
})

// Computed para repartos listos para procesar
const repartosListos = computed(() => {
  return repartos.value.filter(reparto => {
    // Un reparto está listo si:
    // 1. No tiene diferencias (depositoReal === depositoEsperado) O
    // 2. Tiene diferencias pero ya tiene un movimiento financiero asociado
    const sinDiferencias = reparto.depositoReal === reparto.depositoEsperado
    const tieneMovimiento = reparto.movimientoFinanciero && Object.keys(reparto.movimientoFinanciero).length > 0
    
    return sinDiferencias || tieneMovimiento
  })
})

// Función para obtener los repartos
const fetchRepartos = async () => {
  // Prevenir llamadas múltiples simultáneas
  if (isFetching.value) {
    console.log('⚠️ [FETCH] Ya hay una llamada en progreso, ignorando...')
    return
  }
  
  const callId = Math.random().toString(36).substr(2, 9)
  isFetching.value = true
  loading.value = true
  error.value = null
  
  try {
    console.log(`🔄 [FETCH-${callId}] Iniciando carga de datos para`, props.title, 'fecha:', fechaSeleccionada.value?.fechaBackend || fechaSeleccionada.value?.fechaAPI || 'fecha actual')
    console.log(`🔄 [FETCH-${callId}] Estado inicial repartos.value.length:`, repartos.value.length)
    
    // SIEMPRE intentar usar la API real primero
    console.log(`🔌 [FETCH-${callId}] Conectando con API real para`, props.title)
    
    // Todos los servicios ahora usan el nuevo backend, así que usar fechaBackend (YYYY-MM-DD)
    const fechaParaServicio = fechaSeleccionada.value?.fechaBackend
    
    console.log(`📅 [FETCH-${callId}] Fecha a enviar al servicio:`, fechaParaServicio, '(servicio:', props.title, ')')
    
    const data = await props.service.getRepartos(fechaParaServicio)
    
    console.log(`✅ [FETCH-${callId}] Datos recibidos de API real:`, data.length, 'repartos')
    if (data.length > 0) {
      console.log(`✅ [FETCH-${callId}] Primer reparto de ejemplo:`, data[0])
    }
    
    // Asignar los datos y logging detallado
    const prevLength = repartos.value.length
    repartos.value = data
    console.log(`📊 [FETCH-${callId}] Datos asignados - Antes:`, prevLength, 'Después:', repartos.value.length)
    
    console.log(`✅ [FETCH-${callId}] Carga completada exitosamente para`, props.title)
    
  } catch (err) {
    console.error(`❌ [FETCH-${callId}] Error cargando datos de API real:`, err)
    error.value = err.message || 'Error al cargar los repartos'
    
    // En desarrollo, mostrar el error pero NO usar datos simulados
    if (config.DEV_MODE) {
      console.log(`⚠️ [FETCH-${callId}] Error en API real. Mostrando estado de error (no datos simulados)`)
    }
  } finally {
    loading.value = false
    isFetching.value = false
    console.log(`🏁 [FETCH-${callId}] Finalizando carga - loading:`, loading.value, 'repartos:', repartos.value.length)
  }
}

// Función para procesar repartos listos
const procesarRepartos = async () => {
  if (repartosListos.value.length === 0) {
    alert('No hay repartos listos para procesar')
    return
  }

  // Confirmar la acción
  const confirmacion = confirm(
    `¿Estás seguro de que quieres procesar ${repartosListos.value.length} repartos listos? ` +
    'Esta acción enviará los datos al backend.'
  )
  
  if (!confirmacion) return

  procesando.value = true

  try {
    // Preparar los datos para enviar
    const repartosParaEnviar = repartosListos.value.map(reparto => ({
      idReparto: reparto.idReparto,
      fechaReparto: reparto.fechaReparto,
      depositoEsperado: reparto.depositoEsperado,
      depositoReal: reparto.depositoReal,
      diferencia: reparto.depositoReal - reparto.depositoEsperado,
      movimientoFinanciero: reparto.movimientoFinanciero || null,
      estado: 'procesado',
      fechaProcesamiento: new Date().toISOString()
    }))

    console.log('Enviando repartos al backend:', repartosParaEnviar)

    // Aquí puedes agregar la llamada a tu API para enviar los repartos
    // Por ejemplo, si tienes un método en tu servicio:
    // await props.service.procesarRepartos(repartosParaEnviar)
    
    // Por ahora, simularemos el envío con un timeout
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mostrar mensaje de éxito
    alert(`✅ Se procesaron exitosamente ${repartosListos.value.length} repartos`)
    
    // Opcional: recargar los datos después del procesamiento
    await fetchRepartos()

  } catch (err) {
    console.error('Error al procesar repartos:', err)
    alert('❌ Error al procesar los repartos: ' + (err.message || 'Error desconocido'))
  } finally {
    procesando.value = false
  }
}

// Función para abrir modal de edición
// Puede recibir reparto o { reparto, movimientoTipo }
const openEditModal = (repartoOrPayload, movimientoTipoArg) => {
  let reparto = repartoOrPayload
  let movimientoTipo = movimientoTipoArg
  
  // Si viene como objeto { reparto, movimientoTipo }
  if (repartoOrPayload && typeof repartoOrPayload === 'object' && 'reparto' in repartoOrPayload) {
    reparto = repartoOrPayload.reparto
    movimientoTipo = repartoOrPayload.movimientoTipo
  }
  
  console.log('🔥 Abriendo modal con:', { reparto: reparto?.idReparto, movimientoTipo })
  selectedReparto.value = reparto
  modalMovimientoTipo.value = movimientoTipo || null
  showModal.value = true
}

// Función para cerrar el modal
const closeModal = () => {
  showModal.value = false
  selectedReparto.value = null
  modalMovimientoTipo.value = null
}

// Funciones para modal de comprobantes
const handleToggleComprobantes = (event) => {
  console.log('🔍 Evento completo recibido:', event)
  console.log('🔍 Abriendo comprobantes para reparto número:', event.reparto)
  
  // Usar el número del reparto que ya viene normalizado
  selectedRepartoComprobantes.value = event.reparto
  showComprobantesModal.value = true
}

// Función para manejar actualización de estado de repartos
const handleEstadoActualizado = (event) => {
  console.log('🔄 Estado de reparto actualizado:', event)
  
  // Buscar y actualizar el reparto en la lista local
  const repartoIndex = repartos.value.findIndex(r => r.id === event.repartoId)
  if (repartoIndex !== -1) {
    // Actualizar el estado del reparto
    repartos.value[repartoIndex].estado = event.estadoNuevo
    console.log(`✅ Estado del reparto ${event.repartoId} actualizado localmente a ${event.estadoNuevo}`)
  }
  
  // Opcionalmente, refrescar los datos desde el servidor
  // fetchRepartos()
}

const closeComprobantesModal = () => {
  showComprobantesModal.value = false
  selectedRepartoComprobantes.value = null
}

// Función para guardar el movimiento
const saveMovement = async (movementData) => {
  console.log('🚀 [REPARTO_VIEW] ============ SAVE MOVEMENT INICIADO ============')
  console.log('🚀 [REPARTO_VIEW] movementData recibido:', movementData)
  console.log('🚀 [REPARTO_VIEW] selectedReparto.value:', selectedReparto.value)
  
  if (!selectedReparto.value) {
    console.error('❌ [REPARTO_VIEW] selectedReparto.value es null')
    return
  }
  
  saving.value = true
  console.log('🚀 [REPARTO_VIEW] saving.value establecido a true')
  
  try {
    let updatedMovimiento
    
    // Guardar referencia al reparto antes de que se limpie en closeModal
    const repartoActual = selectedReparto.value
    console.log('🚀 [REPARTO_VIEW] repartoActual:', repartoActual)
    
    // En modo desarrollo, simular guardado
    if (config.DEV_MODE) {
      console.log('🔧 [REPARTO_VIEW] Modo desarrollo: simulando guardado de movimiento para', repartoActual.idReparto)
      await new Promise(resolve => setTimeout(resolve, 1000))
      updatedMovimiento = { ...movementData, id: Date.now() }
    } else {
      console.log('🌐 [REPARTO_VIEW] Modo producción: enviando al backend real')
      
      // Por ahora, siempre crear nuevos movimientos (no actualizar)
      // TODO: Implementar lógica de actualización cuando el backend lo soporte
      console.log('➕ [REPARTO_VIEW] Creando movimiento financiero')
      updatedMovimiento = await props.service.createMovimientoFinanciero(
        repartoActual.idReparto, 
        movementData
      )
    }
    
    // Actualizar la lista local
    const index = repartos.value.findIndex(r => r.idReparto === repartoActual.idReparto)
    if (index !== -1) {
      repartos.value[index] = {
        ...repartos.value[index],
        movimientoFinanciero: updatedMovimiento
      }
    }

    // Cerrar modal y mostrar mensaje de éxito
    closeModal()
    
    // Mostrar notificación de éxito más profesional
    const tipoMovimiento = movementData.tipo_concepto === 'RIB' ? 'Retención' : 'Cheque'
    console.log(`✅ ${tipoMovimiento} guardado correctamente para reparto ${repartoActual.idReparto}`)
    
  } catch (err) {
    console.error('Error al guardar movimiento financiero:', err)
    
    // En modo desarrollo, mostrar error más amigable
    if (config.DEV_MODE) {
      console.log('⚠️ Error simulado en modo desarrollo, pero se procede normalmente')
      closeModal()
    } else {
      alert('Error al guardar el movimiento financiero: ' + (err.message || 'Error de conexión'))
    }
  } finally {
    saving.value = false
  }
}

// Función para eliminar un movimiento financiero
const deleteMovement = async (reparto) => {
  if (!reparto || !reparto.movimientoFinanciero) return
  
  // Confirmar eliminación
  const tipoMovimiento = reparto.movimientoFinanciero.tipo === 'RETENCION' ? 'retención' : 'cheque'
  const confirmed = confirm(`¿Estás seguro de que quieres eliminar el movimiento de ${tipoMovimiento} del reparto ${reparto.idReparto}?`)
  
  if (!confirmed) return
  
  try {
    // En modo desarrollo, simular eliminación
    if (config.DEV_MODE) {
      console.log('Modo desarrollo: simulando eliminación de movimiento para', reparto.idReparto)
      await new Promise(resolve => setTimeout(resolve, 800))
    } else {
      // Eliminar del backend
      await props.service.deleteMovimientoFinanciero(reparto.idReparto)
    }
    
    // Actualizar la lista local
    const index = repartos.value.findIndex(r => r.idReparto === reparto.idReparto)
    if (index !== -1) {
      repartos.value[index] = {
        ...repartos.value[index],
        movimientoFinanciero: null
      }
    }

    console.log(`✅ Movimiento financiero eliminado para reparto ${reparto.idReparto}`)
    
  } catch (err) {
    console.error('Error al eliminar movimiento financiero:', err)
    
    if (config.DEV_MODE) {
      console.log('⚠️ Error simulado en modo desarrollo, pero se procede normalmente')
    } else {
      alert('Error al eliminar el movimiento financiero: ' + (err.message || 'Error de conexión'))
    }
  }
}

// Método para manejar el cambio de fecha desde el DateSelector
const onFechaSeleccionada = (fechaData) => {
  console.log('📅 Fecha seleccionada:', fechaData)
  fechaSeleccionada.value = fechaData
  // Recargar datos con la nueva fecha
  fetchRepartos()
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchRepartos()
})

// Watcher para detectar cambios en repartos
watch(repartos, (newRepartos, oldRepartos) => {
  console.log('👀 [WATCHER] Cambio detectado en repartos:')
  console.log('  - Anterior:', oldRepartos?.length || 0, 'repartos')
  console.log('  - Nuevo:', newRepartos?.length || 0, 'repartos')
  
  if (newRepartos?.length > 0) {
    console.log('  - Primer reparto nuevo:', newRepartos[0])
  }
  
  // Detectar si se están reemplazando datos reales con simulados
  if (oldRepartos?.length > 0 && newRepartos?.length > 0) {
    const oldHasRealIds = oldRepartos.some(r => r.idReparto && !r.idReparto.includes('FALLBACK'))
    const newHasSimulatedIds = newRepartos.some(r => r.idReparto && r.idReparto.includes('FALLBACK'))
    
    if (oldHasRealIds && newHasSimulatedIds) {
      console.warn('🚨 [WATCHER] ALERTA: Datos reales reemplazados por simulados!')
    }
  }
}, { deep: true })
</script>

<style scoped>
/* Estilos para las tarjetas de estadísticas */
.stats-card {
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Botón de reintentar mejorado */
.error-retry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4);
}

.error-retry-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(239, 68, 68, 0.5);
}

.error-retry-btn:active {
  transform: translateY(0);
}

/* Animación del gradiente de fondo */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

/* Efectos de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animaciones personalizadas */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Responsive design mejorado */
@media (max-width: 768px) {
  .stats-card {
    padding: 1rem;
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Efectos de hover para las estadísticas */
.stats-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.stats-card:hover::before {
  transform: translateX(100%);
}

/* Mejoras en el loading spinner */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

/* Estilos para el botón de procesar compacto */
.process-btn-compact {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
  cursor: pointer;
}

.process-btn-compact:hover:not(:disabled) {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
  box-shadow: 0 4px 8px rgba(5, 150, 105, 0.3);
}

.process-btn-compact:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(5, 150, 105, 0.2);
}

.process-btn-compact:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  box-shadow: 0 1px 2px rgba(156, 163, 175, 0.1);
  cursor: not-allowed;
}
</style>
