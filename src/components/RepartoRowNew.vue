<template>
  <tr 
    :class="getRowClass(reparto.estado || 'PENDIENTE')"
    class="group transition-all duration-500 ease-out hover:bg-gradient-to-r hover:from-blue-50/50 hover:via-transparent hover:to-purple-50/50 hover:shadow-xl hover:shadow-blue-500/10 relative border-b border-gray-100 hover:border-transparent"
  >
    
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <img 
              src="@/assets/entrega.png" 
              alt="Entrega" 
              class="w-5 h-5 object-contain filter brightness-0 invert"
            >
          </div>
          
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm" 
               :class="getStatusIndicatorClass(reparto.estado || 'PENDIENTE')">
          </div>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
            #{{ reparto.idReparto }}
          </div>
          <div class="text-xs text-gray-500 font-medium">
            ID: {{ reparto.idReparto.toString().padStart(6, '0') }}
          </div>
        </div>
      </div>
    </td>

    
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-sm font-semibold text-gray-900">{{ formatDate(reparto.fechaReparto) }}</div>
          <div class="text-xs text-gray-500 font-medium">{{ getRelativeDate(reparto.fechaReparto) }}</div>
        </div>
      </div>
    </td>

    <!-- Depósito Esperado con estilo premium -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="relative bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-3 border border-gray-200 group-hover:border-blue-200 transition-all duration-300">
        <div class="text-sm font-semibold text-gray-900 font-mono">
          {{ formatCurrency(reparto.depositoEsperado) }}
        </div>
        <div class="text-xs text-gray-500 font-medium">
          Esperado
        </div>
        
        <!-- Indicador visual en la esquina -->
        <div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-gray-400"></div>
      </div>
    </td>

    <!-- Depósito Real con indicador de estado -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 group-hover:border-blue-300 transition-all duration-300">
        <div class="text-sm font-semibold text-blue-900 font-mono">
          {{ formatCurrency(reparto.depositoReal) }}
        </div>
        <div class="text-xs text-blue-600 font-medium">
          Real
        </div>
        
        <!-- Indicador de estado del monto real -->
        <div class="absolute top-1 right-1 w-2 h-2 rounded-full" 
             :class="getRealAmountIndicatorClass(reparto.estado || 'PENDIENTE')">
        </div>
      </div>
    </td>

    <!-- Diferencia con diseño destacado -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right">
      <div class="relative rounded-lg p-3 border transition-all duration-300 group-hover:shadow-lg" 
           :class="getDifferenceBgClass(reparto.estado || 'PENDIENTE')">
        <div class="flex items-center justify-end space-x-2">
          <!-- Icono de estado -->
          <svg class="w-4 h-4 flex-shrink-0" 
               :class="getDifferenceIconClass(reparto.estado || 'PENDIENTE')" 
               fill="currentColor" viewBox="0 0 20 20">
            <path v-if="reparto.diferencia === 0" fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            <path v-else-if="reparto.diferencia > 0" fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            <path v-else fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
          </svg>
          
          <!-- Monto de diferencia -->
          <div class="text-sm font-bold font-mono" 
               :class="getDifferenceIconClass(reparto.estado || 'PENDIENTE')">
            {{ formatCurrency(Math.abs(reparto.diferencia || 0)) }}
          </div>
        </div>
        
        <!-- Etiqueta descriptiva -->
        <div class="text-xs font-medium mt-1" 
             :class="getDifferenceIconClass(reparto.estado || 'PENDIENTE')">
          {{ getDifferenceLabel(reparto.estado || 'PENDIENTE') }}
        </div>
        
        <!-- Indicador de prioridad -->
        <div class="absolute top-1 right-1 w-2 h-2 rounded-full" 
             :class="getDifferenceIndicatorClass(reparto.estado || 'PENDIENTE')">
        </div>
      </div>
    </td>

    <!-- Estado con badge premium y funcionalidad de edición -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex justify-center">
        <EstadoSelector
          :estado="reparto.estado || 'PENDIENTE'"
          :editable="true"
          tipo-entidad="reparto"
          :servicio="getServicioParaPlanta()"
          :entity-data="reparto"
          @estado-cambiado="manejarCambioEstado"
          @error="manejarErrorEstado"
        />
      </div>
    </td>

    <!-- Movimiento Financiero con diseño mejorado -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200 group-hover:border-blue-200 transition-all duration-300">
        <MovimientoFinanciero :movimiento="reparto.movimientoFinanciero" />
      </div>
    </td>

    <!-- Comprobantes -->
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
      <div class="flex items-center justify-center">
        <button 
          @click="toggleComprobantes"
          :disabled="loadingComprobantes"
          class="relative inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-center">
      <!-- Botones para cuando existe movimiento financiero -->
      <div v-if="reparto.movimientoFinanciero" class="flex justify-center space-x-2">
        <!-- Botón Editar Premium -->
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Editar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <!-- Botón Eliminar Premium -->
        <button 
          @click="$emit('delete-movement', reparto)"
          class="group relative inline-flex items-center justify-center w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title="Eliminar movimiento"
        >
          <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
      
      <!-- Botones para crear movimiento cuando no existe -->
      <div v-else-if="needsMovement(reparto)" class="flex justify-center space-x-2">
        <!-- Botón Crear Genérico -->
        <button 
          @click="$emit('edit', reparto)"
          class="group relative inline-flex items-center px-3 py-2 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Crear movimiento"
        >
          <svg class="w-4 h-4 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="font-semibold">Crear</span>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <!-- Botón Crear Cheque -->
        <button 
          @click="$emit('edit', { reparto: reparto, movimientoTipo: 'cheque' })"
          class="group relative inline-flex items-center px-3 py-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Crear cheque"
        >
          <svg class="w-4 h-4 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="font-semibold">Cheque</span>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
        
        <!-- Botón Crear Retención -->
        <button 
          @click="$emit('edit', { reparto: reparto, movimientoTipo: 'retencion' })"
          class="group relative inline-flex items-center px-3 py-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Crear retención"
        >
          <svg class="w-4 h-4 mr-1 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4m16 0l-4 4m4-4l-4-4"></path>
          </svg>
          <span class="font-semibold">Retención</span>
          <div class="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      </div>
      
      <!-- Indicador de reparto listo para cerrar -->
      <div v-else class="flex justify-center">
        <div class="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-xl shadow-sm">
          <div class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-2 shadow-md">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <span class="text-green-700 font-semibold text-sm">Completado</span>
        </div>
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

const emit = defineEmits(['edit', 'delete-movement', 'toggle-comprobantes', 'estado-actualizado'])

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

// Función para obtener el servicio apropiado según la planta
const getServicioParaPlanta = () => {
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
}

// Función para manejar el cambio de estado
const manejarCambioEstado = (evento) => {
  console.log('✅ Estado cambiado exitosamente:', evento)
  
  // Emitir evento hacia el componente padre para actualizar la lista
  emit('estado-actualizado', {
    repartoId: props.reparto.id,
    reparto: props.reparto,
    estadoAnterior: evento.estadoAnterior,
    estadoNuevo: evento.estadoNuevo,
    resultado: evento.resultado
  })
}

// Función para manejar errores en el cambio de estado
const manejarErrorEstado = (error) => {
  console.error('❌ Error al cambiar estado:', error)
  // Aquí podrías mostrar un toast/notification
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
  return reparto.diferencia !== 0 && !reparto.movimientoFinanciero
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
  const today = new Date()
  const targetDate = new Date(date)
  const diffTime = today - targetDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return 'Hace más de una semana'
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
