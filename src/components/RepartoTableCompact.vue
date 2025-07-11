<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Header compacto -->
    <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
            </svg>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
            <p class="text-sm text-gray-500">{{ repartos.length }} repartos</p>
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <!-- Toggle compacto/normal -->
          <button 
            @click="$emit('toggle-view')"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            Vista Normal
          </button>
          
          <!-- Botón refrescar -->
          <button 
            @click="$emit('refresh')"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla ultra compacta -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RTO</th>
            <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Esperado</th>
            <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Real</th>
            <th class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="reparto in repartos" 
            :key="reparto.id"
            class="hover:bg-gray-50 transition-colors duration-150"
            :class="getRowClass(reparto.estado || 'PENDIENTE')"
          >
            <!-- RTO -->
            <td class="px-2 py-1.5 whitespace-nowrap">
              <div class="flex items-center space-x-2">
                <div class="flex-shrink-0 w-5 h-5 bg-blue-500 rounded text-white text-xs font-bold flex items-center justify-center">
                  {{ reparto.numeroReparto }}
                </div>
                <span class="text-xs font-medium text-gray-900">{{ reparto.idReparto }}</span>
              </div>
            </td>

            <!-- Esperado -->
            <td class="px-2 py-1.5 whitespace-nowrap text-right">
              <span class="text-xs font-mono text-gray-900">{{ formatCurrency(reparto.depositoEsperado) }}</span>
            </td>

            <!-- Real -->
            <td class="px-2 py-1.5 whitespace-nowrap text-right">
              <span class="text-xs font-mono text-blue-700 font-semibold">{{ formatCurrency(reparto.depositoReal) }}</span>
            </td>

            <!-- Diferencia -->
            <td class="px-2 py-1.5 whitespace-nowrap text-right">
              <div class="flex items-center justify-end space-x-1">
                <div 
                  class="w-2 h-2 rounded-full flex-shrink-0" 
                  :class="getDifferenceIndicatorClass(reparto.estado || 'PENDIENTE')"
                ></div>
                <span 
                  class="text-xs font-mono font-semibold" 
                  :class="getDifferenceIconClass(reparto.estado || 'PENDIENTE')"
                >
                  {{ formatCurrency(Math.abs(reparto.diferencia || 0)) }}
                </span>
              </div>
            </td>

            <!-- Estado -->
            <td class="px-2 py-1.5 whitespace-nowrap text-center">
              <EstadoSelector
                :estado="reparto.estado || 'PENDIENTE'"
                :deposito-id="getDepositId(reparto)"
                :planta="getPlantaName(reparto)"
                :compact="true"
                :debug="false"
                @estado-changed="manejarCambioEstado"
              />
// ...existing code...
// Función para obtener el ID del depósito desde el reparto
const getDepositId = (reparto) => {
  if (reparto.deposit_id) {
    return reparto.deposit_id
  }
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].deposit_id) {
    return reparto.deposits[0].deposit_id
  }
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].id) {
    return reparto.deposits[0].id
  }
  return reparto.id
}

// Función para obtener el nombre de la planta
const getPlantaName = (reparto) => {
  const repartoId = reparto.id || reparto.idReparto || ''
  if (repartoId.includes('nafa') || reparto.planta === 'nafa') {
    return 'nafa'
  } else if (repartoId.includes('jumillano') || repartoId.includes('jumi') || reparto.planta === 'jumillano') {
    return 'jumi'
  } else if (repartoId.includes('plata') || reparto.planta === 'laplata') {
    return 'laplata'
  }
  return 'jumi'
}
            </td>

            <!-- Acciones -->
            <td class="px-2 py-1.5 whitespace-nowrap text-center">
              <div class="flex items-center justify-center space-x-1">
                <!-- Editar movimiento -->
                <button 
                  v-if="reparto.movimientoFinanciero"
                  @click="$emit('edit', reparto)"
                  class="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors duration-150"
                  title="Editar movimiento"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>

                <!-- Crear movimiento -->
                <div v-else-if="needsMovement(reparto)" class="flex space-x-1">
                  <!-- Botón Crear Genérico -->
                  <button 
                    @click="$emit('edit', reparto)"
                    class="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded flex items-center justify-center transition-colors duration-150"
                    title="Crear movimiento"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                  
                  <!-- Botón Crear Cheque -->
                  <button 
                    @click="$emit('edit', { reparto: reparto, movimientoTipo: 'cheque' })"
                    class="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center transition-colors duration-150"
                    title="Crear cheque"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </button>
                  
                  <!-- Botón Crear Retención -->
                  <button 
                    @click="$emit('edit', { reparto: reparto, movimientoTipo: 'retencion' })"
                    class="w-6 h-6 bg-purple-500 hover:bg-purple-600 text-white rounded flex items-center justify-center transition-colors duration-150"
                    title="Crear retención"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4m16 0l-4 4m4-4l-4-4"></path>
                    </svg>
                  </button>
                </div>

                <!-- Estado OK -->
                <div 
                  v-else
                  class="w-6 h-6 bg-green-100 rounded flex items-center justify-center"
                  title="Completado"
                >
                  <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer con totales -->
    <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>{{ repartos.length }} repartos encontrados</span>
        <span>Total esperado: {{ formatCurrency(totalEsperado) }} | Total real: {{ formatCurrency(totalReal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EstadoSelector from './EstadoSelector.vue'
import { 
  formatCurrency, 
  getRowClass 
} from '../utils/formatters.js'

// Importar servicios para cada planta
import RtoNafaService from '../services/RtoNafaService.js'
import RtoJumiService from '../services/RtoJumiService.js'
import RtoLaPlataService from '../services/RtoLaPlataService.js'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  repartos: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete-movement', 'estado-actualizado', 'refresh', 'toggle-view'])

// Totales computados
const totalEsperado = computed(() => {
  return props.repartos.reduce((sum, reparto) => sum + (reparto.depositoEsperado || 0), 0)
})

const totalReal = computed(() => {
  return props.repartos.reduce((sum, reparto) => sum + (reparto.depositoReal || 0), 0)
})

// Función para obtener el servicio apropiado según la planta
const getServicioParaPlanta = (reparto) => {
  const repartoId = reparto.id || ''
  
  if (repartoId.includes('nafa') || reparto.planta === 'nafa') {
    return RtoNafaService
  } else if (repartoId.includes('jumillano') || repartoId.includes('jumi') || reparto.planta === 'jumillano') {
    return RtoJumiService
  } else if (repartoId.includes('plata') || reparto.planta === 'plata') {
    return RtoLaPlataService
  }
  
  return RtoNafaService
}

// Función para manejar el cambio de estado
const manejarCambioEstado = (evento) => {
  console.log('✅ Estado cambiado exitosamente:', evento)
  emit('estado-actualizado', evento)
}

// Función para manejar errores en el cambio de estado
const manejarErrorEstado = (error) => {
  console.error('❌ Error al cambiar estado:', error)
}

// Función para determinar si un reparto necesita movimiento financiero
const needsMovement = (reparto) => {
  return reparto.diferencia !== 0 && !reparto.movimientoFinanciero
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
</script>

<style scoped>
/* Estilos compactos */
.font-mono {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}

/* Reducir aún más el espaciado en la tabla compacta */
.table-compact td,
.table-compact th {
  padding: 0.25rem 0.5rem;
}

/* Estados de fila más sutiles para vista compacta */
tr.bg-green-50 {
  background-color: rgba(34, 197, 94, 0.05);
}

tr.bg-red-50 {
  background-color: rgba(239, 68, 68, 0.05);
}

tr.bg-blue-50 {
  background-color: rgba(59, 130, 246, 0.05);
}

tr.bg-orange-50 {
  background-color: rgba(249, 115, 22, 0.05);
}

tr.bg-gray-50 {
  background-color: rgba(107, 114, 128, 0.05);
}
</style>
