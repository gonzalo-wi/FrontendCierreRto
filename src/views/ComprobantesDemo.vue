<template>
  <div class="demo-comprobantes p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Demo - Comprobantes de Repartos</h1>
      <p class="text-gray-600">
        Prueba la funcionalidad de visualización de comprobantes (cheques, retenciones) subidos por los repartidores.
      </p>
    </div>

    <!-- Controles de prueba -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Probar con datos específicos</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Reparto (Username)</label>
          <input 
            v-model="repartoTest"
            type="text"
            placeholder="ej: 122"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
          <input 
            v-model="fechaTest"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button 
            @click="cargarComprobantesTest"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            :disabled="loading"
          >
            {{ loading ? 'Cargando...' : 'Buscar Comprobantes' }}
          </button>
        </div>
      </div>

      <!-- Información de la API -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Información de la API:</h3>
        <div class="text-sm text-gray-600 space-y-1">
          <p><strong>Endpoint:</strong> GET http://192.168.0.58/api/reparto-comprobantes?reparto={{ repartoTest }}&fecha={{ fechaTest }}</p>
          <p><strong>Imágenes:</strong> http://192.168.0.58/api/reparto-comprobantes/{id}/file</p>
          <p><strong>Modo actual:</strong> {{ config.DEV_MODE ? 'Desarrollo (datos simulados)' : 'Producción' }}</p>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Resultados</h2>
        <div v-if="!config.DEV_MODE" class="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
          ✓ Conectado a API real
        </div>
        <div v-else class="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
          🧪 Usando datos simulados
        </div>
      </div>

      <!-- Viewer de comprobantes -->
      <ComprobantesViewer 
        v-if="mostrarViewer"
        :reparto="repartoTest"
        :fecha="fechaTest"
        :auto-load="false"
        ref="viewer"
        @comprobantes-loaded="onComprobantesLoaded"
        @error="onError"
      />

      <!-- Estado inicial -->
      <div v-else class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Buscar Comprobantes</h3>
        <p class="text-gray-600">Ingresa un reparto y fecha para buscar comprobantes</p>
      </div>
    </div>

    <!-- Información sobre la integración -->
    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-blue-900 mb-3">📋 Cómo funciona la integración</h3>
      <div class="space-y-3 text-blue-800">
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">1</div>
          <div>
            <strong>Obtener lista de comprobantes:</strong>
            <br>
            <code class="text-sm bg-blue-100 px-2 py-1 rounded">GET /api/reparto-comprobantes?reparto={username}&fecha={YYYY-MM-DD}</code>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">2</div>
          <div>
            <strong>Mostrar imágenes por ID:</strong>
            <br>
            <code class="text-sm bg-blue-100 px-2 py-1 rounded">GET /api/reparto-comprobantes/{id}/file</code>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <div class="w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">3</div>
          <div>
            <strong>En la tabla de repartos:</strong> Cada fila tiene un botón para ver comprobantes con badge que muestra la cantidad
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import ComprobantesViewer from '../components/ComprobantesViewer.vue'
import { config } from '../config/config.js'

// Estado
const repartoTest = ref('122')
const fechaTest = ref(new Date().toISOString().split('T')[0])
const mostrarViewer = ref(false)
const loading = ref(false)
const viewer = ref(null)

// Cargar comprobantes de prueba
const cargarComprobantesTest = async () => {
  if (!repartoTest.value) {
    alert('Por favor ingresa un reparto')
    return
  }

  loading.value = true
  mostrarViewer.value = true
  
  // Esperar un tick para que el componente se monte
  await nextTick()
  
  try {
    if (viewer.value) {
      await viewer.value.cargarComprobantes()
    }
  } catch (error) {
    console.error('Error cargando comprobantes:', error)
  } finally {
    loading.value = false
  }
}

// Handlers de eventos
const onComprobantesLoaded = (comprobantes) => {
  console.log('Comprobantes cargados en demo:', comprobantes)
}

const onError = (error) => {
  console.error('Error en demo:', error)
  loading.value = false
}

onMounted(() => {
  console.log('Demo de comprobantes cargado')
  console.log('Modo de desarrollo:', config.DEV_MODE)
})
</script>

<style scoped>
.demo-comprobantes {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

code {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}
</style>
