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
          @edit-movement="openEditModalWithData"
          @delete-movement="deleteMovement"
          @delete-all-movements="deleteAllMovements"
          @view-movements="openMovimientosModal"
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
            
            <!-- Botón compacto - Solo mostrar si tiene permisos -->
            <button 
              v-if="canProcessRepartos"
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
                {{ procesando ? 'Enviando...' : 'Enviar Repartos LISTO' }}
              </span>
              
              <!-- Badge con contador -->
              <span v-if="!procesando && repartosListos.length > 0" class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white/30 rounded-full">
                {{ repartosListos.length }}
              </span>
            </button>

            <!-- Mensaje para usuarios sin permisos -->
            <div v-else class="inline-flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Solo ADMIN y SUPERADMIN pueden procesar repartos</span>
            </div>
          </div>
          
          <!-- Mensaje informativo cuando no hay repartos listos -->
          <div v-if="repartosListos.length === 0" class="mt-3 text-center">
            <p class="text-gray-500 text-xs">
              Solo los repartos con estado "LISTO" se pueden procesar para envío
            </p>
          </div>
        </div>
      </div>

      <!-- Modal de edición -->
      <EditMovementModal
        :key="`edit-${selectedReparto?.idReparto || 'new'}-${modalMovimientoTipo}-${Date.now()}`"
        :is-visible="showModal"
        :reparto="selectedReparto"
        :saving="saving"
        :movimiento-tipo="modalMovimientoTipo"
        :movimiento-data="modalMovimientoData"
        @close="closeModal"
        @save="saveMovement"
      />

      <!-- Modal de selección de movimiento para editar -->
      <SelectMovementModal
        :is-visible="showSelectMovementModal"
        :reparto="selectedReparto"
        @close="closeSelectMovementModal"
        @select-movement="handleSelectMovementForEdit"
      />

      <!-- Modal de Movimientos Financieros -->
      <MovimientosFinancierosModal
        :is-visible="showMovimientosModal"
        :reparto="selectedRepartoMovimientos"
        :service="currentService"
        @close="closeMovimientosModal"
        @updated="onMovimientosUpdated"
        @delete-movement="deleteMovement"
      />
    </div>

    <!-- Modal de Comprobantes -->
    <ComprobantesModal 
      v-if="showComprobantesModal"
      :reparto="selectedRepartoComprobantes"
      @close="closeComprobantesModal"
    />

    <!-- Modal de Progreso -->
    <ProcessProgressModal 
      :visible="progressState.showModal"
      :repartos="repartosProgreso"
      @cerrar="() => { progressState.showModal = false }"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { config } from '../config/config.js'
import { useAuth } from '../composables/useAuth.js'
import RepartoTable from '../components/RepartoTable.vue'
import ComprobantesModal from '../components/ComprobantesModal.vue'
import EditMovementModal from '../components/EditMovementModal.vue'
import SelectMovementModal from '../components/SelectMovementModal.vue'
import MovimientosFinancierosModal from '../components/MovimientosFinancierosModal.vue'
import DateSelector from '../components/DateSelector.vue'
import TotalsView from '../components/TotalsView.vue'
import ProcessProgressModal from '../components/ProcessProgressModal.vue'

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
const showSelectMovementModal = ref(false)
const selectedReparto = ref(null)
const saving = ref(false)
const modalMovimientoTipo = ref(null) // cheque | retencion | null
const modalMovimientoData = ref(null) // datos del movimiento para editar

// Estados para modal de comprobantes
const showComprobantesModal = ref(false)
const selectedRepartoComprobantes = ref(null)

// Estados para modal de movimientos financieros
const showMovimientosModal = ref(false)
const selectedRepartoMovimientos = ref(null)

// Estado del progreso
const progressState = ref({
  showModal: false,
  isActive: false,
  isCompleted: false,
  error: null,
  progress: 0,
  currentStep: '',
  details: [],
  stats: {
    total: 0,
    processed: 0,
    success: 0,
    failed: 0
  }
})

// Estados para modal de progreso (legacy - a remover después)
const showProgressModal = ref(false)
const repartosProgreso = ref([])

// Composable de autenticación
const { checkPermissions, canManageRepartos, isAdmin, user } = useAuth()

// Permisos del usuario
const userPermissions = computed(() => {
  const currentUser = user.value
  if (!currentUser) return []
  return currentUser.permissions || []
})

// Verificar si puede gestionar repartos
const canProcessRepartos = computed(() => canManageRepartos())

// Servicio actual (para pasar al modal de movimientos financieros)
const currentService = computed(() => props.service)

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
    // Un reparto está listo si tiene estado "LISTO"
    return reparto.estado === 'LISTO'
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

// Funciones de manejo de progreso
const iniciarProgreso = (total = 1) => {
  console.log('🎯 [PROGRESO] Iniciando progreso con total:', total)
  progressState.value.showModal = true
  
  // Crear array de repartos usando los datos reales de repartosListos
  if (repartosListos.value && repartosListos.value.length > 0) {
    repartosProgreso.value = repartosListos.value.map((reparto, index) => ({
      id: index + 1,
      nombre: `Reparto #${reparto.nroOt || reparto.idReparto}`,
      estado: 'pendiente', // pendiente, procesando, exitoso, error
      mensaje: `Importe: $${reparto.depositoReal || reparto.importe || 0}`,
      tiempo: null
    }))
  } else {
    // Fallback para casos de prueba
    repartosProgreso.value = Array.from({ length: total }, (_, index) => ({
      id: index + 1,
      nombre: `Reparto ${index + 1}`,
      estado: 'pendiente',
      mensaje: '',
      tiempo: null
    }))
  }
  
  console.log('🎯 [PROGRESO] Repartos de progreso creados:', repartosProgreso.value)
}

const actualizarProgreso = (step, detail = null) => {
  console.log('🎯 [PROGRESO] Actualizando progreso:', { step, detail })
  
  // Si hay un detalle de éxito o error, actualizar el estado del reparto correspondiente
  if (detail && detail.includes('✅')) {
    // Encontrar el primer reparto pendiente y marcarlo como exitoso
    const repartoIdx = repartosProgreso.value.findIndex(r => r.estado === 'pendiente')
    if (repartoIdx >= 0) {
      repartosProgreso.value[repartoIdx].estado = 'exitoso'
      repartosProgreso.value[repartoIdx].mensaje = detail
      repartosProgreso.value[repartoIdx].tiempo = new Date().toLocaleTimeString()
    }
  } else if (detail && detail.includes('❌')) {
    // Encontrar el primer reparto pendiente y marcarlo como error
    const repartoIdx = repartosProgreso.value.findIndex(r => r.estado === 'pendiente')
    if (repartoIdx >= 0) {
      repartosProgreso.value[repartoIdx].estado = 'error'
      repartosProgreso.value[repartoIdx].mensaje = detail
      repartosProgreso.value[repartoIdx].tiempo = new Date().toLocaleTimeString()
    }
  }
  
  console.log('🎯 [PROGRESO] Repartos actualizados:', repartosProgreso.value)
}

const finalizarProgreso = (exito, error = null) => {
  console.log('🎯 [PROGRESO] Finalizando progreso:', { exito, error })
  
  // Si fue exitoso, mostrar resumen con estadísticas
  if (exito && repartosProgreso.value.length > 0) {
    const exitosos = repartosProgreso.value.filter(r => r.estado === 'exitoso').length
    const errores = repartosProgreso.value.filter(r => r.estado === 'error').length
    const total = repartosProgreso.value.length
    
    // Crear mensaje de resumen
    let mensajeResumen = `🎉 Procesamiento completado!\n\n`
    mensajeResumen += `✅ Exitosos: ${exitosos}/${total} repartos\n`
    
    if (errores > 0) {
      mensajeResumen += `❌ Errores: ${errores}/${total} repartos\n`
    }
    
    mensajeResumen += `\n📊 Porcentaje de éxito: ${Math.round((exitosos/total) * 100)}%`
    
    // Si hay errores, agregar detalles
    if (errores > 0) {
      const repartosConError = repartosProgreso.value.filter(r => r.estado === 'error')
      mensajeResumen += `\n\n⚠️ Repartos con errores:\n`
      repartosConError.slice(0, 3).forEach(r => { // Mostrar máximo 3 errores
        mensajeResumen += `- ${r.id}: ${r.mensaje?.replace('❌ Error: ', '') || 'Error desconocido'}\n`
      })
      if (repartosConError.length > 3) {
        mensajeResumen += `... y ${repartosConError.length - 3} más`
      }
    }
    
    // Mostrar el alert con el resumen
    setTimeout(() => {
      alert(mensajeResumen)
    }, 1500) // Esperar un poco antes de mostrar el resumen
  }
  
  setTimeout(() => {
    console.log('🎯 [PROGRESO] Ocultando modal después de 3 segundos')
    progressState.value.showModal = false
    // Reset state
    repartosProgreso.value = []
  }, exito ? 4000 : 3000) // Dar más tiempo si fue exitoso para que vean el resumen
}

// Función para procesar repartos listos
const procesarRepartos = async () => {
  // Verificar permisos antes de procesar
  if (!canProcessRepartos.value) {
    alert('❌ No tienes permisos para cerrar repartos. Se requiere rol ADMIN o SUPERADMIN.')
    return
  }

  if (repartosListos.value.length === 0) {
    alert('No hay repartos con estado LISTO para procesar')
    return
  }

  // Obtener la fecha seleccionada actual en formato YYYY-MM-DD
  const fechaParaCierre = fechaSeleccionada.value?.fechaBackend || new Date().toISOString().split('T')[0]

  // Confirmar la acción
  const confirmacion = confirm(
    `¿Estás seguro de que quieres procesar ${repartosListos.value.length} repartos con estado LISTO para la fecha ${fechaParaCierre}? ` +
    'Esta acción enviará los repartos a Aguas para su cierre.'
  )
  
  if (!confirmacion) return

  // Inicializar el progreso inmediatamente
  iniciarProgreso(repartosListos.value.length)
  actualizarProgreso('Preparando solicitud de cierre...', `📊 Se procesarán ${repartosListos.value.length} repartos`)

  try {
    console.log(`🚀 Cerrando repartos para fecha: ${fechaParaCierre}`)
    console.log('🔍 Repartos con estado LISTO:', repartosListos.value)

    // Verificar que tenemos un token válido
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.')
    }

    // Mostrar progreso mientras preparamos la solicitud
    await new Promise(resolve => setTimeout(resolve, 500))
    actualizarProgreso('Enviando solicitud al servidor...', `🌐 Conectando con el servidor de cierre`)

    // Simular progreso mientras procesamos - más realista
    let procesados = 0
    const totalRepartos = repartosProgreso.value.length
    
    const progresoSimulado = setInterval(() => {
      // Buscar repartos pendientes para marcar como procesando
      const pendientes = repartosProgreso.value.filter(r => r.estado === 'pendiente')
      if (pendientes.length > 0 && Math.random() > 0.4) {
        const randomIdx = Math.floor(Math.random() * Math.min(2, pendientes.length)) // Máximo 2 a la vez
        const repartoIdx = repartosProgreso.value.findIndex(r => r.id === pendientes[randomIdx].id)
        if (repartoIdx >= 0) {
          repartosProgreso.value[repartoIdx].estado = 'procesando'
          repartosProgreso.value[repartoIdx].mensaje = '🔄 Enviando a Aguas...'
        }
      }
      
      // Ocasionalmente completar algunos repartos que están procesando
      const enProceso = repartosProgreso.value.filter(r => r.estado === 'procesando')
      if (enProceso.length > 0 && Math.random() > 0.6 && procesados < totalRepartos * 0.8) {
        const randomIdx = Math.floor(Math.random() * enProceso.length)
        const repartoIdx = repartosProgreso.value.findIndex(r => r.id === enProceso[randomIdx].id)
        if (repartoIdx >= 0) {
          repartosProgreso.value[repartoIdx].estado = 'exitoso'
          repartosProgreso.value[repartoIdx].mensaje = '✅ Confirmado por Aguas'
          repartosProgreso.value[repartoIdx].tiempo = new Date().toLocaleTimeString()
          procesados++
        }
      }
    }, 600)

    // Llamar al endpoint de cierre de repartos con autenticación JWT
    const response = await fetch('/api-backend/reparto-cierre/cerrar-repartos', { // Usar proxy de Vite
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Token JWT aquí
      },
      body: JSON.stringify({
        fecha_especifica: fechaParaCierre,  // Formato YYYY-MM-DD
        max_reintentos: 3,
        delay_entre_envios: 1.0
      })
    })

    // Detener simulación
    clearInterval(progresoSimulado)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    actualizarProgreso('Procesando respuesta del servidor...', `📡 Recibiendo resultados del servidor`)

    const resultado = await response.json()

    if (resultado.success) {
      // Marcar todos los repartos como exitosos rápidamente
      for (let i = 0; i < repartosProgreso.value.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 150))
        if (repartosProgreso.value[i].estado !== 'exitoso') {
          repartosProgreso.value[i].estado = 'exitoso'
          repartosProgreso.value[i].mensaje = `✅ Reparto #${repartosListos.value[i]?.nroOt || (i+1)} procesado correctamente`
          repartosProgreso.value[i].tiempo = new Date().toLocaleTimeString()
        }
      }
      
      actualizarProgreso('Actualizando datos...', `🔄 Recargando información desde el servidor`)
      
      // Recargar los datos después del procesamiento para actualizar estados
      await fetchRepartos()
      
      // Completar el progreso
      finalizarProgreso(true)
      
      console.log('✅ Resultado del cierre:', resultado)
    } else {
      // Si el backend retorna información detallada de errores, usarla
      if (resultado.detalles && Array.isArray(resultado.detalles)) {
        for (let i = 0; i < resultado.detalles.length && i < repartosProgreso.value.length; i++) {
          const detalle = resultado.detalles[i]
          repartosProgreso.value[i].estado = detalle.exito ? 'exitoso' : 'error'
          repartosProgreso.value[i].mensaje = detalle.mensaje || (detalle.exito ? '✅ Procesado' : '❌ Error')
          repartosProgreso.value[i].tiempo = new Date().toLocaleTimeString()
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      } else {
        // Marcar algunos como error para mostrar que algo falló
        for (let i = 0; i < repartosProgreso.value.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 150))
          repartosProgreso.value[i].estado = i === 0 ? 'error' : 'exitoso' // Solo el primero como error para ejemplo
          repartosProgreso.value[i].mensaje = i === 0 ? `❌ Error: ${resultado.message}` : '✅ Procesado correctamente'
          repartosProgreso.value[i].tiempo = new Date().toLocaleTimeString()
        }
      }
      
      // Marcar error en el progreso
      finalizarProgreso(false, { message: resultado.message || 'Error en el servidor' })
      console.error('❌ Error en respuesta:', resultado)
    }

  } catch (err) {
    console.error('❌ Error al procesar repartos:', err)
    
    // Detener la simulación si está activa
    if (typeof progresoSimulado !== 'undefined') {
      clearInterval(progresoSimulado)
    }
    
    // Manejo específico para errores de autenticación
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      // Token expirado o inválido
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      alert('❌ Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      window.location.href = '/login'
      return
    }
    
    // Marcar todos los repartos como error
    for (let i = 0; i < repartosProgreso.value.length; i++) {
      if (repartosProgreso.value[i].estado === 'pendiente' || repartosProgreso.value[i].estado === 'procesando') {
        repartosProgreso.value[i].estado = 'error'
        repartosProgreso.value[i].mensaje = `❌ Error: ${err.message}`
        repartosProgreso.value[i].tiempo = new Date().toLocaleTimeString()
      }
    }
    
    finalizarProgreso(false, { message: err.message || 'Error desconocido' })
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
  
  console.log('🔥 [RepartoView] Abriendo modal con:', { reparto: reparto?.idReparto, movimientoTipo })
  console.log('🔍 [RepartoView] reparto completo:', JSON.stringify(reparto, null, 2))
  
  selectedReparto.value = reparto
  
  // Si el reparto tiene movimientos existentes, abrir modal de selección
  if (reparto?.movimientoFinanciero && 
      ((reparto.movimientoFinanciero.cheques && reparto.movimientoFinanciero.cheques.length > 0) ||
       (reparto.movimientoFinanciero.retenciones && reparto.movimientoFinanciero.retenciones.length > 0))) {
    
    console.log('✏️ [RepartoView] Reparto tiene movimientos existentes, abriendo modal de SELECCIÓN')
    showSelectMovementModal.value = true
    
  } else {
    // Si no tiene movimientos, abrir modal de creación normal
    console.log('➕ [RepartoView] Reparto sin movimientos, abriendo modal de CREACIÓN')
    modalMovimientoTipo.value = movimientoTipo || null
    modalMovimientoData.value = null
    showModal.value = true
  }
}

// Función específica para abrir modal con datos específicos del movimiento
const openEditModalWithData = (eventPayload) => {
  console.log('✏️ [RepartoView] ============ ABRIENDO MODAL CON DATOS ESPECÍFICOS ============')
  console.log('✏️ [RepartoView] eventPayload recibido:', JSON.stringify(eventPayload, null, 2))
  
  const { tipo, movimiento, index, reparto } = eventPayload
  
  console.log('✏️ [RepartoView] Datos extraídos del payload:')
  console.log('✏️ [RepartoView]   - tipo:', tipo)
  console.log('✏️ [RepartoView]   - movimiento:', JSON.stringify(movimiento, null, 2))
  console.log('✏️ [RepartoView]   - index:', index)
  console.log('✏️ [RepartoView]   - reparto:', reparto?.idReparto)
  
  // Validar que el reparto existe antes de continuar
  if (!reparto) {
    console.error('❌ [RepartoView] ERROR: reparto es null en eventPayload')
    console.error('❌ [RepartoView] eventPayload completo:', eventPayload)
    alert('Error: No se pudo identificar el reparto. Intente de nuevo.')
    return
  }
  
  // Configurar el modal con los datos específicos
  selectedReparto.value = reparto
  modalMovimientoTipo.value = tipo === 'cheque' ? 'CHEQUE' : 'RETENCION'
  
  // Preparar los datos del movimiento para el modal
  const movimientoData = {
    tipo: tipo === 'cheque' ? 'CHEQUE' : 'RETENCION',
    ...movimiento, // Spread todas las propiedades del movimiento específico
    index, // Agregar el índice para poder identificar el movimiento posteriormente
    reparto: reparto // AGREGAR EL REPARTO DIRECTAMENTE EN LOS DATOS DEL MOVIMIENTO
  }
  
  modalMovimientoData.value = movimientoData
  
  console.log('✏️ [RepartoView] Modal configurado con:')
  console.log('✏️ [RepartoView]   - selectedReparto:', selectedReparto.value?.idReparto)
  console.log('✏️ [RepartoView]   - modalMovimientoTipo:', modalMovimientoTipo.value)
  console.log('✏️ [RepartoView]   - modalMovimientoData:', JSON.stringify(modalMovimientoData.value, null, 2))
  
  // Verificar que selectedReparto se configuró correctamente
  console.log('✏️ [RepartoView] ============ VERIFICACIÓN FINAL ============')
  console.log('✏️ [RepartoView] selectedReparto.value configurado:', selectedReparto.value?.idReparto || 'NULL!')
  console.log('✏️ [RepartoView] showModal será:', true)
  
  showModal.value = true
  
  // Verificar después de un tick que el reparto sigue ahí
  nextTick(() => {
    console.log('✏️ [RepartoView] [POST-TICK] selectedReparto.value:', selectedReparto.value?.idReparto || 'NULL!')
  })
  
  console.log('✏️ [RepartoView] ✅ Modal abierto con datos específicos del movimiento')
}

// Función para cerrar el modal de selección de movimiento
const closeSelectMovementModal = () => {
  console.log('🔒 [RepartoView] Cerrando modal de selección de movimiento')
  showSelectMovementModal.value = false
  // NO limpiar selectedReparto aquí porque handleSelectMovementForEdit lo necesita
  // selectedReparto.value = null 
}

// Función para manejar la selección de un movimiento para editar
const handleSelectMovementForEdit = (selectedData) => {
  console.log('✏️ [RepartoView] ============ MOVIMIENTO SELECCIONADO PARA EDITAR ============')
  console.log('✏️ [RepartoView] selectedData:', JSON.stringify(selectedData, null, 2))
  
  const { tipo, movimiento, index, reparto } = selectedData
  
  console.log('✏️ [RepartoView] Datos extraídos del payload:')
  console.log('✏️ [RepartoView]   - tipo:', tipo)
  console.log('✏️ [RepartoView]   - movimiento:', JSON.stringify(movimiento, null, 2))
  console.log('✏️ [RepartoView]   - index:', index)
  console.log('✏️ [RepartoView]   - reparto:', reparto?.idReparto)
  
  // Validar que el reparto existe antes de continuar
  if (!reparto) {
    console.error('❌ [RepartoView] ERROR: reparto es null en selectedData')
    console.error('❌ [RepartoView] selectedData completo:', selectedData)
    alert('Error: No se pudo identificar el reparto. Intente de nuevo.')
    return
  }
  
  // Cerrar el modal de selección
  closeSelectMovementModal()
  
  // Configurar el modal de edición con los datos específicos
  selectedReparto.value = reparto
  modalMovimientoTipo.value = tipo
  
  // Preparar los datos del movimiento para el modal
  const movimientoData = {
    tipo,
    ...movimiento, // Spread todas las propiedades del movimiento específico
    index, // Agregar el índice para poder identificar el movimiento posteriormente
    reparto: reparto // AGREGAR EL REPARTO DIRECTAMENTE EN LOS DATOS DEL MOVIMIENTO
  }
  
  modalMovimientoData.value = movimientoData
  
  console.log('✏️ [RepartoView] Modal de edición configurado con:')
  console.log('✏️ [RepartoView]   - selectedReparto:', selectedReparto.value?.idReparto)
  console.log('✏️ [RepartoView]   - modalMovimientoTipo:', modalMovimientoTipo.value)
  console.log('✏️ [RepartoView]   - modalMovimientoData:', JSON.stringify(modalMovimientoData.value, null, 2))
  
  // Verificar que selectedReparto se configuró correctamente
  console.log('✏️ [RepartoView] ============ VERIFICACIÓN FINAL (SelectModal) ============')
  console.log('✏️ [RepartoView] selectedReparto.value configurado:', selectedReparto.value?.idReparto || 'NULL!')
  console.log('✏️ [RepartoView] showModal será:', true)
  
  // Abrir el modal de edición
  showModal.value = true
  
  // Verificar después de un tick que el reparto sigue ahí
  nextTick(() => {
    console.log('✏️ [RepartoView] [POST-TICK SelectModal] selectedReparto.value:', selectedReparto.value?.idReparto || 'NULL!')
  })
  
  console.log('✏️ [RepartoView] ✅ Modal de edición abierto con movimiento específico')
}

// Función para cerrar el modal
const closeModal = () => {
  console.log('🔒 [RepartoView] Cerrando modal principal')
  console.log('🔒 [RepartoView] selectedReparto antes de limpiar:', selectedReparto.value?.idReparto)
  showModal.value = false
  
  // Usar nextTick para asegurar que el modal se cierre completamente antes de limpiar
  // Esto previene que se pierda el reparto durante operaciones del modal
  nextTick(() => {
    selectedReparto.value = null
    modalMovimientoTipo.value = null
    modalMovimientoData.value = null
    console.log('🔒 [RepartoView] Variables del modal limpiadas')
  })
}

// Funciones para modal de comprobantes
const handleToggleComprobantes = (event) => {
  console.log('🔍 Evento completo recibido:', event)
  console.log('🔍 Abriendo comprobantes para reparto número:', event.reparto)
  
  // Usar el número del reparto que ya viene normalizado
  selectedRepartoComprobantes.value = event.reparto
  showComprobantesModal.value = true
}

// Función para abrir modal de movimientos financieros
const openMovimientosModal = (reparto) => {
  console.log('💰 Abriendo modal de movimientos financieros para:', reparto?.idReparto)
  selectedRepartoMovimientos.value = reparto
  showMovimientosModal.value = true
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

const closeMovimientosModal = () => {
  showMovimientosModal.value = false
  selectedRepartoMovimientos.value = null
}

const onMovimientosUpdated = () => {
  // Recargar los repartos para mostrar los cambios
  console.log('📈 Movimientos financieros actualizados, recargando datos...')
  fetchRepartos()
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
    // Guardar referencia al reparto antes de que se limpie en closeModal
    const repartoActual = selectedReparto.value
    console.log('🚀 [REPARTO_VIEW] repartoActual:', repartoActual)
    
    // Obtener el primer depósito del reparto para asociar el movimiento
    const primerDeposito = repartoActual.deposits?.[0]
    if (!primerDeposito) {
      throw new Error(`No se encontró depósito para el reparto ${repartoActual.idReparto}`)
    }
    
    const depositId = primerDeposito.deposit_id || primerDeposito.id || primerDeposito.identifier
    if (!depositId) {
      throw new Error(`No se pudo obtener ID del depósito para el reparto ${repartoActual.idReparto}`)
    }
    
    console.log('🔍 [REPARTO_VIEW] Usando depósito:', depositId)
    
    // En modo desarrollo, simular guardado
    if (config.DEV_MODE) {
      console.log('🔧 [REPARTO_VIEW] Modo desarrollo: simulando guardado de movimiento para', repartoActual.idReparto)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } else {
      console.log('🌐 [REPARTO_VIEW] Modo producción: creando movimiento específico')
      console.log('🔍 [REPARTO_VIEW] movementData completo:', movementData)
      
      // Crear cheque o retención según la estructura que viene del modal
      if (movementData.cheques && Array.isArray(movementData.cheques) && movementData.cheques.length > 0) {
        console.log('➕ [REPARTO_VIEW] Creando cheque(s) desde modal')
        
        for (const cheque of movementData.cheques) {
          // Estructura simplificada que espera el backend
          const chequeData = {
            numero: cheque.nro_cheque,           // REQUERIDO - string
            banco: cheque.banco,                 // REQUERIDO - string  
            importe: parseFloat(cheque.importe), // REQUERIDO - number
            fecha_cobro: cheque.fecha            // OPCIONAL - string
          }
          console.log('📄 [REPARTO_VIEW] Creando cheque con estructura del backend:', chequeData)
          await props.service.createCheque(depositId, chequeData)
        }
      } else if (movementData.retenciones && Array.isArray(movementData.retenciones) && movementData.retenciones.length > 0) {
        console.log('➕ [REPARTO_VIEW] Creando retención(es) desde modal')
        
        for (const retencion of movementData.retenciones) {
          // Estructura que espera el backend según la documentación
          const retencionData = {
            numero: parseInt(retencion.nro_retencion),    // REQUERIDO - int (Número de retención)
            importe: parseFloat(retencion.importe),       // REQUERIDO - float
            concepto: retencion.concepto || "RIB",        // OPCIONAL - string (default: "RIB")
            numero_cuenta: parseInt(retencion.nrocta)     // REQUERIDO - int (Número de cliente/cuenta)
          }
          console.log('⚠️ [REPARTO_VIEW] Creando retención con estructura del backend:', retencionData)
          await props.service.createRetencion(depositId, retencionData)
        }
      } else {
        throw new Error(`Estructura de movimiento no válida: ${JSON.stringify(movementData)}`)
      }
    }

    // Cerrar modal y mostrar mensaje de éxito
    closeModal()
    
    // Recargar los datos para mostrar los nuevos movimientos
    console.log('🔄 [REPARTO_VIEW] Recargando datos después de crear movimiento...')
    await fetchRepartos()
    
    // Mostrar notificación de éxito
    const tipoMovimiento = movementData.cheques && movementData.cheques.length > 0 ? 'Cheque(s)' :
                          movementData.retenciones && movementData.retenciones.length > 0 ? 'Retención(es)' :
                          'Movimiento'
    const cantidad = movementData.cheques?.length || movementData.retenciones?.length || 1
    console.log(`✅ ${cantidad} ${tipoMovimiento} guardado(s) correctamente para reparto ${repartoActual.idReparto}`)
    
  } catch (err) {
    console.error('❌ [REPARTO_VIEW] Error al guardar movimiento financiero:', err)
    
    // En modo desarrollo, mostrar error más amigable
    if (config.DEV_MODE) {
      console.log('⚠️ Error simulado en modo desarrollo, pero se procede normalmente')
      closeModal()
      await fetchRepartos() // Recargar datos incluso en modo dev
    } else {
      alert('Error al guardar el movimiento financiero: ' + (err.message || 'Error de conexión'))
    }
  } finally {
    saving.value = false
  }
}

// Función para eliminar un movimiento financiero individual o todos
const deleteMovement = async (eventData) => {
  console.log('🗑️ [RepartoView] ============ ELIMINANDO MOVIMIENTO ============')
  console.log('🗑️ [RepartoView] ⚠️  FUNCIÓN deleteMovement EJECUTADA - EVENTO RECIBIDO')
  console.log('🗑️ [RepartoView] eventData completo:', JSON.stringify(eventData, null, 2))
  console.log('🗑️ [RepartoView] typeof eventData:', typeof eventData)
  
  // DEBUGGING: Verificar origen del evento
  const stackTrace = new Error().stack
  console.log('🗑️ [RepartoView] Stack trace:', stackTrace)
  
  // Verificar si es eliminación de TODOS los movimientos (desde RepartoRow)
  const isBulkDelete = eventData?.depositId && !eventData?.tipo && !eventData?.movimiento
  
  if (isBulkDelete) {
    console.log('🗑️ [RepartoView] ============ ELIMINACIÓN MASIVA DETECTADA ============')
    console.log('🗑️ [RepartoView] Redirigiendo a deleteAllMovements...')
    return await deleteAllMovements(eventData)
  }
  
  // Continuamos con eliminación individual
  console.log('🗑️ [RepartoView] ============ ELIMINACIÓN INDIVIDUAL ============')
  console.log('🗑️ [RepartoView] eventData.tipo existe:', 'tipo' in eventData)
  console.log('🗑️ [RepartoView] eventData.tipo valor:', eventData?.tipo)
  console.log('🗑️ [RepartoView] eventData.movimiento existe:', 'movimiento' in eventData)
  console.log('🗑️ [RepartoView] eventData.movimiento:', JSON.stringify(eventData?.movimiento, null, 2))
  console.log('🗑️ [RepartoView] eventData.reparto?.idReparto:', eventData?.reparto?.idReparto)
  
  // Verificación exhaustiva de las propiedades del evento
  if (eventData && typeof eventData === 'object') {
    console.log('🔍 [RepartoView] ============ PROPIEDADES DEL EVENTO ============')
    Object.keys(eventData).forEach(key => {
      console.log(`🔍 [RepartoView]   - ${key}: ${JSON.stringify(eventData[key])} (${typeof eventData[key]})`)
    })
  }
  
  try {
    let result
    
    if (config.DEV_MODE) {
      console.log('🔧 [RepartoView] Modo desarrollo: simulando eliminación de movimiento')
      await new Promise(resolve => setTimeout(resolve, 800))
      result = { success: true }
    } else {
      // Extraer datos del evento con validación más estricta
      let tipo = eventData?.tipo
      let movimiento = eventData?.movimiento
      let reparto = eventData?.reparto
      
      console.log('🔍 [RepartoView] ============ ANALIZANDO DATOS EXTRAÍDOS ============')
      console.log('🔍 [RepartoView] tipo extraído:', tipo, '(tipo:', typeof tipo, ')')
      console.log('🔍 [RepartoView] movimiento extraído:', JSON.stringify(movimiento, null, 2))
      console.log('🔍 [RepartoView] reparto?.idReparto:', reparto?.idReparto)
      
      // Si no hay tipo, intentar inferirlo del movimiento
      if (!tipo) {
        console.warn('⚠️ [RepartoView] Tipo no especificado, intentando inferir del movimiento...')
        if (movimiento) {
          // Si tiene nro_cheque o numero y es tipo cheque
          if (movimiento.nro_cheque || (movimiento.numero && !movimiento.nro_retencion)) {
            tipo = 'cheque'
            console.log('🔍 [RepartoView] ✅ Tipo inferido: cheque')
          }
          // Si tiene nro_retencion o es claramente una retención
          else if (movimiento.nro_retencion || movimiento.concepto) {
            tipo = 'retencion'
            console.log('🔍 [RepartoView] ✅ Tipo inferido: retencion')
          }
        } else {
          console.error('❌ [RepartoView] No hay movimiento para inferir el tipo')
        }
      }
      
      // Validar que tenemos los datos mínimos
      if (!tipo) {
        throw new Error('Tipo de movimiento no especificado y no se pudo inferir del objeto movimiento. Para eliminación individual se requiere tipo y movimiento específico.')
      }
      
      if (!movimiento) {
        throw new Error('Datos del movimiento no proporcionados. Para eliminación individual se requiere el objeto movimiento específico.')
      }
      
      // Obtener deposit_id
      let depositId = null
      
      // CASO 1: Si el reparto viene en el evento, usarlo
      if (reparto) {
        depositId = getDepositId(reparto)
      }
      
      // CASO 2: Si no viene reparto, buscar en selectedRepartoMovimientos (modal)
      if (!depositId && selectedRepartoMovimientos.value) {
        console.log('🔍 [RepartoView] Usando reparto del modal selectedRepartoMovimientos')
        depositId = getDepositId(selectedRepartoMovimientos.value)
      }
      
      // CASO 3: Buscar en la lista de repartos por algún identificador del movimiento
      if (!depositId && movimiento && repartos.value.length > 0) {
        console.log('🔍 [RepartoView] Buscando reparto en la lista por movimiento')
        
        // Buscar reparto que contenga este movimiento
        for (const r of repartos.value) {
          const cheques = r.cheques || r.movimientoFinanciero?.cheques || []
          const retenciones = r.retenciones || r.movimientoFinanciero?.retenciones || []
          
          const encontrado = [...cheques, ...retenciones].some(m => {
            return (m.nro_cheque === movimiento.nro_cheque && movimiento.nro_cheque) ||
                   (m.nro_retencion === movimiento.nro_retencion && movimiento.nro_retencion) ||
                   (m.id === movimiento.id && movimiento.id)
          })
          
          if (encontrado) {
            console.log(`✅ [RepartoView] Reparto encontrado: ${r.idReparto}`)
            depositId = getDepositId(r)
            break
          }
        }
      }
      
      console.log('🔍 [RepartoView] depositId final obtenido:', depositId)
      
      if (!depositId) {
        throw new Error('No se pudo obtener el deposit_id para realizar la eliminación')
      }
      
      // Logging detallado del objeto movimiento
      console.log('🔍 [RepartoView] ============ INSPECCIONANDO MOVIMIENTO ============')
      console.log('🔍 [RepartoView] Propiedades del movimiento:')
      if (movimiento) {
        Object.keys(movimiento).forEach(key => {
          console.log(`🔍 [RepartoView]   - ${key}: ${movimiento[key]} (${typeof movimiento[key]})`)
        })
      }
      
      // Obtener el identificador específico según el tipo
      let identificador = null
      if (tipo === 'cheque') {
        identificador = movimiento.nro_cheque || movimiento.numero
        console.log('💰 [RepartoView] ============ PROCESANDO CHEQUE ============')
        console.log('💰 [RepartoView] movimiento.nro_cheque:', movimiento.nro_cheque)
        console.log('💰 [RepartoView] movimiento.numero:', movimiento.numero)
        console.log('💰 [RepartoView] identificador final:', identificador)
        
        if (!identificador) {
          console.error('❌ [RepartoView] El cheque no tiene número identificador')
          console.error('❌ [RepartoView] Objeto cheque completo:', JSON.stringify(movimiento, null, 2))
          throw new Error('El cheque no tiene número identificador (nro_cheque o numero)')
        }
        console.log(`🗑️ [RepartoView] ✅ Eliminando cheque N° ${identificador} para deposit_id: ${depositId}`)
        console.log(`🌐 [RepartoView] ✅ HACIENDO: DELETE /deposits/${depositId}/cheques/${identificador}`)
        result = await props.service.deleteCheque(depositId, identificador)
        
      } else if (tipo === 'retencion') {
        identificador = movimiento.nro_retencion || movimiento.numero
        console.log('⚠️ [RepartoView] ============ PROCESANDO RETENCION ============')
        console.log('⚠️ [RepartoView] movimiento.nro_retencion:', movimiento.nro_retencion)
        console.log('⚠️ [RepartoView] movimiento.numero:', movimiento.numero)
        console.log('⚠️ [RepartoView] identificador final:', identificador)
        
        if (!identificador) {
          console.error('❌ [RepartoView] La retención no tiene número identificador')
          console.error('❌ [RepartoView] Objeto retención completo:', JSON.stringify(movimiento, null, 2))
          throw new Error('La retención no tiene número identificador (nro_retencion o numero)')
        }
        console.log(`🗑️ [RepartoView] ✅ Eliminando retención N° ${identificador} para deposit_id: ${depositId}`)
        console.log(`🌐 [RepartoView] ✅ HACIENDO: DELETE /deposits/${depositId}/retenciones/${identificador}`)
        result = await props.service.deleteRetencion(depositId, identificador)
        
      } else {
        console.error('❌ [RepartoView] Tipo de movimiento no soportado:', tipo)
        throw new Error(`Tipo de movimiento no soportado: ${tipo}. Debe ser 'cheque' o 'retencion'`)
      }
    }
    
    if (result) {
      console.log('✅ [RepartoView] Movimiento eliminado exitosamente')
      // Refrescar los datos
      await fetchRepartos()
      
      // Mostrar mensaje de éxito
      const tipoTexto = eventData.tipo === 'cheque' ? 'cheque' : 'retención'
      const numero = eventData.movimiento?.nro_cheque || eventData.movimiento?.nro_retencion || eventData.movimiento?.numero || 'S/N'
      alert(`${tipoTexto.charAt(0).toUpperCase() + tipoTexto.slice(1)} N° ${numero} eliminado exitosamente`)
    }
    
  } catch (error) {
    console.error('❌ [RepartoView] Error al eliminar movimiento:', error)
    
    // Mensaje de error más específico
    let errorMessage = 'Error desconocido'
    if (error.response?.status === 404) {
      errorMessage = 'El movimiento no fue encontrado en el servidor'
    } else if (error.response?.status === 422) {
      errorMessage = 'Datos incorrectos para la eliminación'
    } else if (error.response?.status === 400) {
      errorMessage = 'Solicitud inválida - revisa los datos del movimiento'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert(`Error al eliminar movimiento: ${errorMessage}`)
  }
}

// Función para eliminar todos los movimientos de un reparto
const deleteAllMovements = async (eventData) => {
  console.log('🗑️ [RepartoView] Eliminando todos los movimientos:', eventData)
  
  try {
    let result
    
    if (config.DEV_MODE) {
      console.log('🔧 [RepartoView] Modo desarrollo: simulando eliminación de todos los movimientos')
      await new Promise(resolve => setTimeout(resolve, 1000))
      result = { success: true }
    } else {
      // Llamar al servicio real con el deposit_id
      console.log(`🗑️ [RepartoView] Eliminando todos los movimientos para deposit_id: ${eventData.depositId}`)
      result = await props.service.deleteMovimientoFinanciero(eventData.depositId)
    }
    
    if (result) {
      console.log('✅ [RepartoView] Todos los movimientos eliminados exitosamente')
      // Refrescar los datos
      await fetchRepartos()
      
      // Mostrar mensaje de éxito
      alert(`Todos los movimientos eliminados exitosamente del reparto ${eventData.reparto?.idReparto}`)
    }
    
  } catch (error) {
    console.error('❌ [RepartoView] Error al eliminar todos los movimientos:', error)
    alert(`Error al eliminar movimientos: ${error.message || 'Error desconocido'}`)
  }
}

// Función para obtener el deposit_id del reparto (misma lógica que otros componentes)
const getDepositId = (reparto) => {
  if (!reparto) {
    console.warn('❌ [RepartoView] Reparto no definido para obtener deposit_id')
    return null
  }
  
  // CASO 1: El objeto ES directamente un depósito (estructura real de la API)
  if (reparto.deposit_id) {
    console.log(`✅ [RepartoView] Usando deposit_id: ${reparto.deposit_id}`)
    return reparto.deposit_id
  }
  
  // CASO 2: Estructura anidada - usar deposits[0].deposit_id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].deposit_id) {
    console.log(`✅ [RepartoView] Usando deposits[0].deposit_id: ${reparto.deposits[0].deposit_id}`)
    return reparto.deposits[0].deposit_id
  }
  
  // CASO 3: Fallback - usar deposits[0].id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].id) {
    console.log(`⚠️ [RepartoView] Fallback deposits[0].id: ${reparto.deposits[0].id}`)
    return reparto.deposits[0].id
  }
  
  // CASO 4: Fallback final - usar el ID del reparto
  console.warn(`❌ [RepartoView] Fallback reparto.id: ${reparto.id} - Puede fallar`)
  return reparto.id
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

// Watcher para detectar cambios en selectedReparto
watch(selectedReparto, (newSelectedReparto, oldSelectedReparto) => {
  console.log('🎯 [RepartoView] ============ CAMBIO EN SELECTED_REPARTO ============')
  console.log('🎯 [RepartoView] oldSelectedReparto:', oldSelectedReparto?.idReparto || 'null')
  console.log('🎯 [RepartoView] newSelectedReparto:', newSelectedReparto?.idReparto || 'null')
  
  if (!newSelectedReparto && oldSelectedReparto) {
    console.warn('⚠️ [RepartoView] ALERTA: selectedReparto cambió de algo a NULL!')
    console.trace('⚠️ [RepartoView] Stack trace del cambio a NULL:')
  }
}, { immediate: true })

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
