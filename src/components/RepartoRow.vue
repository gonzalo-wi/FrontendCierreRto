<template>
  <tr 
    :class="getRowClass(getEstadoEfectivo())"
    class="group transition-all duration-300 ease-out hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-transparent hover:to-purple-50/30 hover:shadow-lg relative border-b border-gray-100 hover:border-transparent"
  >
    
    <!-- Reparto ID - Más compacto -->
    <td class="px-2 py-1.5 whitespace-nowrap">
      <div class="flex items-center space-x-2">
        <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-sm">
          <span class="text-white text-xs font-bold">{{ reparto.numeroReparto }}</span>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-semibold text-gray-900">{{ reparto.idReparto }}</div>
        </div>
      </div>
    </td>

    <!-- Fecha - Más compacto -->
    <td class="px-2 py-1.5 whitespace-nowrap">
      <div class="text-xs text-gray-900">{{ formatDate(reparto.fechaReparto) }}</div>
      <div class="text-xs text-gray-500">{{ getRelativeDate(reparto.fechaReparto) }}</div>
    </td>

    <!-- Depósito Esperado - Compacto -->
    <td class="px-2 py-1.5 whitespace-nowrap text-right">
      <div class="text-xs font-semibold text-gray-900 font-mono">
        {{ formatCurrency(reparto.depositoEsperado) }}
      </div>
      <div class="text-xs text-gray-500">Esperado</div>
      <!-- Composición esperada -->
      <div v-if="reparto.composicionEsperadoDescripcion" class="text-xs text-indigo-600 font-medium mt-1 flex items-center justify-end space-x-1">
        <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <span :title="`Composición: ${reparto.composicionEsperado || 'No especificada'}`">
          {{ reparto.composicionEsperadoDescripcion }}
        </span>
      </div>
    </td>

    <!-- Depósito Real - Compacto -->
    <td class="px-2 py-1.5 whitespace-nowrap text-right">
      <div class="text-xs font-semibold text-blue-900 font-mono">
        {{ formatCurrency(reparto.depositoReal) }}
      </div>
      <div class="text-xs text-blue-600">Real</div>
    </td>

    <!-- Diferencia - Compacto -->
    <td class="px-2 py-1.5 whitespace-nowrap text-right">
      <div class="flex items-center justify-end space-x-1">
        <svg class="w-3 h-3 flex-shrink-0" 
             :class="getDifferenceIconClass(getEstadoEfectivo())" 
             fill="currentColor" viewBox="0 0 20 20">
          <path v-if="diferenciaActual === 0" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          <path v-else-if="diferenciaActual > 0" fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          <path v-else fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
        </svg>
        <div class="text-xs font-bold font-mono" 
             :class="getDifferenceIconClass(getEstadoEfectivo())">
          {{ formatCurrency(Math.abs(diferenciaActual || 0)) }}
        </div>
      </div>
      <div class="text-xs font-medium" 
           :class="getDifferenceIconClass(getEstadoEfectivo())">
        {{ getDifferenceLabel(getEstadoEfectivo()) }}
      </div>
    </td>

    <!-- Estado con badge premium y funcionalidad de edición -->
    <td class="px-2 py-1.5 whitespace-nowrap">
      <div class="flex justify-center">
        <EstadoSelector
          :estado="getEstadoEfectivo()"
          :deposito-id="getDepositId(reparto)"
          :planta="getPlantaName(reparto)"
          :compact="true"
          :debug="false"
          @estado-changed="manejarCambioEstado"
        />
      </div>
    </td>

    <!-- Movimiento Financiero con diseño mejorado -->
    <td class="px-2 py-1.5 whitespace-nowrap">
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2 border border-gray-200 group-hover:border-blue-200 transition-all duration-300">
        <MovimientoFinanciero 
          :movimiento="reparto.movimientoFinanciero" 
          :reparto="reparto" 
          @delete-movement="(eventData) => $emit('delete-movement', eventData)"
        />
      </div>
    </td>

    <!-- Comprobantes -->
    <td class="px-2 py-1.5 whitespace-nowrap">
      <div class="flex items-center justify-center">
        <button 
          @click="toggleComprobantes"
          :disabled="loadingComprobantes"
          class="relative inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          :title="getComprobantesTooltip()"
        >
          <!-- Spinner de carga -->
          <svg v-if="loadingComprobantes" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          
          <!-- Icono normal -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          
          <!-- Badge de contador -->
          <div v-if="comprobantesCount > 0 && !loadingComprobantes && comprobantesVerificados" 
               class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            {{ comprobantesCount }}
          </div>
          
          <!-- Indicador de carga -->
          <div v-if="loadingComprobantes" 
               class="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping">
          </div>
        </button>
      </div>
    </td>

    <!-- Acciones con diseño premium -->
    <td class="px-2 py-1.5 whitespace-nowrap text-center">
      <!-- Botones para cuando existe movimiento financiero -->
      <div v-if="reparto.movimientoFinanciero" class="flex justify-center space-x-1">
        <!-- Botón Ver Movimientos -->
        <button 
          @click="$emit('view-movements', reparto)"
          class="group relative inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Ver todos los movimientos en detalle"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </button>
        
        <!-- Botón Editar Premium -->
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Editar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
        
        <!-- Botón Eliminar Premium -->
        <button 
          @click="handleDeleteMovement"
          class="group relative inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Eliminar todos los movimientos financieros"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Botón para crear movimiento cuando no existe movimiento financiero -->
      <div v-else class="flex justify-center space-x-1">
        <!-- Botón Ver/Crear Movimientos -->
        <button 
          @click="$emit('view-movements', reparto)"
          class="group relative inline-flex items-center px-2 py-1.5 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Ver detalles del reparto y crear movimientos"
        >
          <svg class="w-3 h-3 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
          <span class="font-semibold">Ver Detalles</span>
        </button>
        
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center px-2 py-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          title="Crear movimiento"
        >
          <svg class="w-3 h-3 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="font-semibold">Crear</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MovimientoFinanciero from './MovimientoFinanciero.vue'
import EstadoSelector from './EstadoSelector.vue'
import { 
  formatDate, 
  formatCurrency, 
  getDifferenceClass, 
  getStatusClass, 
  getStatus, 
  getRowClass 
} from '../utils/formatters.js'
import { useComprobantes } from '../composables/useComprobantes.js'

// Importar servicios para cada planta
import RtoNafaService from '../services/RtoNafaService.js'
import RtoJumiService from '../services/RtoJumiService.js'
import RtoLaPlataService from '../services/RtoLaPlataService.js'

const props = defineProps({
  reparto: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete-movement', 'view-movements', 'toggle-comprobantes', 'estado-actualizado'])

// Función para calcular el estado dinámicamente basado en la diferencia actual
const getEstadoDinamico = computed(() => {
  const diferencia = props.reparto.depositoReal - props.reparto.depositoEsperado
  
  if (diferencia === 0) {
    return 'EXACTO'
  } else if (diferencia > 0) {
    return 'SOBRANTE'
  } else {
    return 'FALTANTE'
  }
})

// Función para obtener el estado efectivo (dinámico o del backend)
const getEstadoEfectivo = () => {
  // Estados finales que no deben cambiar automáticamente
  const estadosFinales = ['LISTO', 'ENVIADO']
  
  if (props.reparto.estado && estadosFinales.includes(props.reparto.estado)) {
    return props.reparto.estado
  }
  
  // Para todos los demás casos (incluyendo FALTANTE, SOBRANTE, EXACTO, PENDIENTE)
  // calcular dinámicamente según la diferencia actual
  return getEstadoDinamico.value
}

// Computed para obtener la diferencia actual (calculada dinámicamente)
const diferenciaActual = computed(() => {
  return props.reparto.depositoReal - props.reparto.depositoEsperado
})

// Composable para comprobantes
const { 
  comprobantes, 
  loading: loadingComprobantes, 
  cargarComprobantesHoy,
  cargarComprobantes 
} = useComprobantes()

// Estado reactivo para comprobantes
const comprobantesCount = ref(0)
const comprobantesVerificados = ref(false)
const mostrandoComprobantes = ref(false)

// Computed para obtener el servicio apropiado según la planta
const servicioPlanta = computed(() => {
  // Determinar la planta basándose en el ID del reparto
  const repartoId = props.reparto.id || ''
  
  if (repartoId.includes('nafa') || props.reparto.planta === 'nafa') {
    return RtoNafaService
  } else if (repartoId.includes('jumillano') || repartoId.includes('jumi') || props.reparto.planta === 'jumillano') {
    return RtoJumiService
  } else if (repartoId.includes('plata') || props.reparto.planta === 'plata') {
    return RtoLaPlataService
  }
  
  // Fallback por defecto (puede ajustarse según la lógica de negocio)
  return RtoNafaService
})

// Función para manejar el cambio de estado
const manejarCambioEstado = (evento) => {
  console.log('✅ Estado cambiado exitosamente:', evento)
  
  if (evento.success) {
    // Emitir evento hacia el componente padre para actualizar la lista
    emit('estado-actualizado', {
      repartoId: props.reparto.id,
      reparto: props.reparto,
      estadoAnterior: evento.estadoAnterior,
      estadoNuevo: evento.estadoNuevo,
      resultado: evento
    })
  } else {
    console.error('❌ Error al cambiar estado:', evento.error)
  }
}

// Función para obtener el ID del depósito desde el reparto
const getDepositId = (reparto) => {
  // CASO 1: El objeto ES directamente un depósito (estructura real de la API)
  if (reparto.deposit_id) {
    console.log(`✅ [RepartoRow] Usando deposit_id: ${reparto.deposit_id}`)
    return reparto.deposit_id
  }
  
  // CASO 2: Estructura anidada - usar deposits[0].deposit_id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].deposit_id) {
    console.log(`✅ [RepartoRow] Usando deposits[0].deposit_id: ${reparto.deposits[0].deposit_id}`)
    return reparto.deposits[0].deposit_id
  }
  
  // CASO 3: Fallback - usar deposits[0].id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].id) {
    console.log(`⚠️ [RepartoRow] Fallback deposits[0].id: ${reparto.deposits[0].id}`)
    return reparto.deposits[0].id
  }
  
  // CASO 4: Fallback final - usar el ID del reparto
  console.warn(`❌ [RepartoRow] Fallback reparto.id: ${reparto.id} - Puede fallar`)
  return reparto.id
}

// Función para obtener el nombre de la planta
const getPlantaName = (reparto) => {
  // Detectar planta por el ID del reparto
  const repartoId = reparto.id || reparto.idReparto || ''
  
  if (repartoId.includes('nafa') || reparto.planta === 'nafa') {
    return 'nafa'
  } else if (repartoId.includes('jumillano') || repartoId.includes('jumi') || reparto.planta === 'jumillano') {
    return 'jumi'
  } else if (repartoId.includes('plata') || reparto.planta === 'laplata') {
    return 'laplata'
  }
  
  // Fallback por defecto
  console.warn('[RepartoRow] No se pudo detectar la planta, usando jumi como fallback')
  return 'jumi'
}

// Función para manejar errores en el cambio de estado (para retrocompatibilidad)
const manejarErrorEstado = (error) => {
  console.error('❌ Error al cambiar estado (retrocompatibilidad):', error)
}

// Función para toggle de comprobantes
const toggleComprobantes = async () => {
  mostrandoComprobantes.value = !mostrandoComprobantes.value
  
  if (mostrandoComprobantes.value && !comprobantesVerificados.value) {
    try {
      const repartoNumber = extractRepartoNumber(props.reparto.idReparto)
      const comprobantesData = await cargarComprobantesHoy(repartoNumber)
      
      comprobantesCount.value = comprobantesData.length
      comprobantesVerificados.value = true
      
    } catch (error) {
      console.error(`❌ [RepartoRow] Error cargando comprobantes:`, error)
      comprobantesVerificados.value = true
    }
  }
  
  emit('toggle-comprobantes', {
    reparto: extractRepartoNumber(props.reparto.idReparto),
    repartoCompleto: props.reparto,
    mostrar: mostrandoComprobantes.value
  })
}

// Función para extraer número de reparto
const extractRepartoNumber = (idReparto) => {
  if (!idReparto) return '000'
  const match = idReparto.match(/(\d+)/)
  return match ? match[1].padStart(3, '0') : '000'
}

// Función para determinar si un reparto necesita movimiento financiero
const needsMovement = (reparto) => {
  const diferencia = reparto.depositoReal - reparto.depositoEsperado
  return diferencia !== 0 && !reparto.movimientoFinanciero
}

// Funciones para el diseño premium basadas en estado del backend

// Indicador de estado principal
const getStatusIndicatorClass = (estado) => {
  switch (estado) {
    case 'LISTO':
    case 'EXACTO':
      return 'bg-gradient-to-br from-green-400 to-green-500'
    case 'ENVIADO':
      return 'bg-gradient-to-br from-blue-400 to-blue-500'
    case 'SOBRANTE':
      return 'bg-gradient-to-br from-orange-400 to-orange-500'
    case 'FALTANTE':
      return 'bg-gradient-to-br from-red-400 to-red-500'
    case 'PENDIENTE':
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-500'
  }
}

// Indicador para monto real
const getRealAmountIndicatorClass = (estado) => {
  switch (estado) {
    case 'LISTO':
    case 'EXACTO':
      return 'bg-green-400'
    case 'ENVIADO':
      return 'bg-blue-400'
    case 'SOBRANTE':
      return 'bg-orange-400'
    case 'FALTANTE':
      return 'bg-red-400'
    case 'PENDIENTE':
    default:
      return 'bg-gray-400'
  }
}

// Clases para iconos de diferencia
const getDifferenceIconClass = (estado) => {
  switch (estado) {
    case 'LISTO':
    case 'EXACTO':
      return 'text-green-600'
    case 'ENVIADO':
      return 'text-blue-600'
    case 'SOBRANTE':
      return 'text-orange-600'
    case 'FALTANTE':
      return 'text-red-600'
    case 'PENDIENTE':
    default:
      return 'text-gray-600'
  }
}

// Clases para fondo de diferencia
const getDifferenceBgClass = (estado) => {
  switch (estado) {
    case 'LISTO':
    case 'EXACTO':
      return 'bg-green-100 border-green-200'
    case 'ENVIADO':
      return 'bg-blue-100 border-blue-200'
    case 'SOBRANTE':
      return 'bg-orange-100 border-orange-200'
    case 'FALTANTE':
      return 'bg-red-100 border-red-200'
    case 'PENDIENTE':
    default:
      return 'bg-gray-100 border-gray-200'
  }
}

// Indicador para diferencia
const getDifferenceIndicatorClass = (estado) => {
  switch (estado) {
    case 'LISTO':
    case 'EXACTO':
      return 'bg-green-400'
    case 'ENVIADO':
      return 'bg-blue-400'
    case 'SOBRANTE':
      return 'bg-orange-400'
    case 'FALTANTE':
      return 'bg-red-400'
    case 'PENDIENTE':
    default:
      return 'bg-gray-400'
  }
}

// Etiqueta para diferencia
const getDifferenceLabel = (estado) => {
  switch (estado) {
    case 'EXACTO':
      return 'Exacto'
    case 'SOBRANTE':
      return 'Sobrante'
    case 'FALTANTE':
      return 'Faltante'
    case 'LISTO':
      return 'Listo'
    case 'ENVIADO':
      return 'Enviado'
    case 'PENDIENTE':
    default:
      return 'Pendiente'
  }
}

// Fecha relativa
const getRelativeDate = (date) => {
  try {
    // Obtener fechas sin componente de tiempo para comparación exacta
    const today = new Date()
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    // Manejar diferentes formatos de fecha
    let targetDate
    if (typeof date === 'string') {
      // Si es string, puede ser YYYY-MM-DD o DD/MM/YYYY
      if (date.includes('/')) {
        // Formato DD/MM/YYYY
        const [day, month, year] = date.split('/')
        targetDate = new Date(year, month - 1, day)
      } else if (date.includes('-')) {
        // Formato YYYY-MM-DD
        targetDate = new Date(date + 'T00:00:00')
      } else {
        targetDate = new Date(date)
      }
    } else {
      targetDate = new Date(date)
    }
    
    const targetDateOnly = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
    
    const diffTime = todayDateOnly - targetDateOnly
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    console.log('📅 [FECHA_RELATIVA] Debug comparación de fechas:', {
      fechaOriginal: date,
      tipoFecha: typeof date,
      fechaHoy: today.toDateString(),
      fechaTarget: targetDate.toDateString(),
      fechaHoySoloFecha: todayDateOnly.toDateString(),
      fechaTargetSoloFecha: targetDateOnly.toDateString(),
      diffDays: diffDays,
      resultado: diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Ayer' : `${diffDays} días`
    })
    
    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays === -1) return 'Mañana'
    if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < -1 && diffDays > -7) return `En ${Math.abs(diffDays)} días`
    if (diffDays >= 7) return 'Hace más de una semana'
    if (diffDays <= -7) return 'En más de una semana'
    return 'Fecha inválida'
  } catch (error) {
    console.error('❌ [FECHA_RELATIVA] Error procesando fecha:', { date, error: error.message })
    return 'Fecha inválida'
  }
}

// Función para manejar eliminación de movimientos con deposit_id correcto
const handleDeleteMovement = () => {
  console.log('🗑️ [RepartoRow] Manejando eliminación de movimiento para:', props.reparto.idReparto)
  
  // Obtener el deposit_id usando la misma lógica que otros métodos
  const depositId = getDepositId(props.reparto)
  
  if (!depositId) {
    console.error('❌ [RepartoRow] No se pudo obtener deposit_id para eliminar movimiento')
    alert('Error: No se pudo identificar el depósito para eliminar el movimiento.')
    return
  }
  
  console.log(`🗑️ [RepartoRow] Emitiendo evento delete-movement con deposit_id: ${depositId}`)
  
  // Emitir evento con toda la información necesaria
  emit('delete-movement', {
    reparto: props.reparto,
    depositId: depositId
  })
}

// Tooltip dinámico para comprobantes
const getComprobantesTooltip = () => {
  if (loadingComprobantes.value) {
    return 'Cargando detalles de comprobantes...'
  }
  
  if (comprobantesCount.value === 0) {
    return comprobantesVerificados.value ? 
      'Este reparto no tiene comprobantes' : 
      'Haga click para verificar comprobantes'
  }
  
  if (comprobantesCount.value > 0 && !comprobantesVerificados.value) {
    return `${comprobantesCount.value} comprobante${comprobantesCount.value !== 1 ? 's' : ''} - Click para ver detalles`
  }
  
  return `Ver ${comprobantesCount.value} comprobante${comprobantesCount.value !== 1 ? 's' : ''}`
}
</script>

<style scoped>
/* Variables CSS para consistencia */
:root {
  --transition-duration: 300ms;
  --shadow-premium: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-hover: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --border-radius-lg: 12px;
}

/* Fuente monoespaciada premium */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-feature-settings: 'calt' 1, 'liga' 1;
}

/* Estilos base para la fila */
tr {
  position: relative;
  transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
}

/* Efectos hover premium */
tr:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-left-color: #3b82f6;
  z-index: 10;
}

/* Estados de fila según el estado del backend */
tr.bg-green-50 {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  border-left-color: #10b981;
}

tr.bg-green-50:hover {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border-left-color: #059669;
}

tr.bg-red-50 {
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
  border-left-color: #ef4444;
}

tr.bg-red-50:hover {
  background: linear-gradient(135deg, #fef2f2 0%, #fef2f2 100%);
  border-left-color: #dc2626;
}

tr.bg-blue-50 {
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  border-left-color: #3b82f6;
}

tr.bg-blue-50:hover {
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border-left-color: #2563eb;
}

tr.bg-orange-50 {
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
  border-left-color: #f97316;
}

tr.bg-orange-50:hover {
  background: linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%);
  border-left-color: #ea580c;
}

tr.bg-gray-50 {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
  border-left-color: #6b7280;
}

tr.bg-gray-50:hover {
  background: linear-gradient(135deg, #f3f4f6 0%, #f9fafb 100%);
  border-left-color: #4b5563;
}
</style>
