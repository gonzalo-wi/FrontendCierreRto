<template>
  <div class="flex items-center justify-center">
    <!-- Botón principal con semáforo -->
    <button 
      @click="$emit('toggle-docs')"
      :disabled="loading"
      class="relative inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      :class="buttonClass"
      :title="tooltipText"
    >
      <!-- Spinner de carga -->
      <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Icono del documento -->
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      
      <!-- Indicadores de semáforo -->
      <div v-if="!loading" class="absolute -top-1 -right-1 flex space-x-0.5">
        <!-- Indicador de cheques -->
        <div v-if="semaforo.cheques_esperados" 
             :class="chequeIndicatorClass"
             class="w-2 h-2 rounded-full border border-white shadow-sm"
             title="Cheques">
        </div>
        
        <!-- Indicador de retenciones -->  
        <div v-if="semaforo.retenciones_esperadas"
             :class="retencionIndicatorClass" 
             class="w-2 h-2 rounded-full border border-white shadow-sm"
             title="Retenciones">
        </div>
        
        <!-- Indicador global cuando no hay documentos específicos esperados -->
        <div v-if="!semaforo.tiene_docs_esperados && totalDocumentos > 0"
             class="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm flex items-center justify-center"
             title="Documentos cargados">
          <span class="text-white text-xs font-bold">{{ totalDocumentos }}</span>
        </div>
      </div>
      
      <!-- Badge de contador total cuando hay documentos y todo está completo -->
      <div v-if="semaforo.docs_completos && totalDocumentos > 0 && !loading" 
           class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg">
        {{ totalDocumentos }}
      </div>
      
      <!-- Indicador de carga -->
      <div v-if="loading" 
           class="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping">
      </div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Datos del semáforo del backend
  semaforo: {
    type: Object,
    default: () => ({
      cheques_esperados: false,
      retenciones_esperadas: false,
      cheques_cargados: false,
      retenciones_cargadas: false,
      cheques_pendientes: false,
      retenciones_pendientes: false,
      docs_completos: false,
      tiene_docs_esperados: false
    })
  },
  // Contadores de documentos
  totalCheques: {
    type: Number,
    default: 0
  },
  totalRetenciones: {
    type: Number,
    default: 0
  },
  // Estado de carga
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-docs'])

// Computed para el total de documentos
const totalDocumentos = computed(() => {
  return props.totalCheques + props.totalRetenciones
})

// Computed para la clase del botón principal
const buttonClass = computed(() => {
  if (props.loading) {
    return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white cursor-wait'
  }
  
  if (!props.semaforo.tiene_docs_esperados) {
    // Sin documentos esperados - estilo neutro
    return 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
  }
  
  if (props.semaforo.docs_completos) {
    // Documentos completos - verde
    return 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
  }
  
  // Documentos pendientes - amarillo/naranja
  return 'bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
})

// Computed para la clase del indicador de cheques
const chequeIndicatorClass = computed(() => {
  if (props.semaforo.cheques_cargados) {
    return 'bg-green-500'  // Verde si están cargados
  } else if (props.semaforo.cheques_pendientes) {
    return 'bg-red-500'    // Rojo si están pendientes
  }
  return 'bg-gray-400'     // Gris por defecto
})

// Computed para la clase del indicador de retenciones
const retencionIndicatorClass = computed(() => {
  if (props.semaforo.retenciones_cargadas) {
    return 'bg-green-500'  // Verde si están cargadas
  } else if (props.semaforo.retenciones_pendientes) {
    return 'bg-red-500'    // Rojo si están pendientes
  }
  return 'bg-gray-400'     // Gris por defecto
})

// Computed para el texto del tooltip
const tooltipText = computed(() => {
  if (props.loading) {
    return 'Cargando documentos...'
  }
  
  if (!props.semaforo.tiene_docs_esperados) {
    if (totalDocumentos.value > 0) {
      return `Ver documentos (${totalDocumentos.value} cargados)`
    }
    return 'Ver documentos - No se esperan documentos específicos'
  }
  
  if (props.semaforo.docs_completos) {
    const detalles = []
    if (props.semaforo.cheques_esperados) {
      detalles.push(`✅ Cheques (${props.totalCheques})`)
    }
    if (props.semaforo.retenciones_esperadas) {
      detalles.push(`✅ Retenciones (${props.totalRetenciones})`)
    }
    return `Documentos completos: ${detalles.join(', ')}`
  }
  
  // Documentos pendientes
  const pendientes = []
  if (props.semaforo.cheques_pendientes) {
    pendientes.push('📄 Cheques')
  }
  if (props.semaforo.retenciones_pendientes) {
    pendientes.push('🧾 Retenciones')
  }
  
  const completados = []
  if (props.semaforo.cheques_esperados && !props.semaforo.cheques_pendientes) {
    completados.push(`✅ Cheques (${props.totalCheques})`)
  }
  if (props.semaforo.retenciones_esperadas && !props.semaforo.retenciones_pendientes) {
    completados.push(`✅ Retenciones (${props.totalRetenciones})`)
  }
  
  let tooltip = 'Documentos pendientes: ' + pendientes.join(', ')
  if (completados.length > 0) {
    tooltip += ' | Completos: ' + completados.join(', ')
  }
  
  return tooltip
})
</script>

<style scoped>
/* Animaciones adicionales para los indicadores */
.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efecto de brillo para documentos completos */
.shadow-green {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

/* Efecto de advertencia para documentos pendientes */
.shadow-yellow {
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}
</style>
