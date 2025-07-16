<template>
  <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8 hover:shadow-2xl transition-all duration-300">
    <!-- Header del gráfico -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div class="mb-4 sm:mb-0">
        <div class="flex items-center space-x-3 mb-2">
          <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 00-2 2h2a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Evolución Diaria de Recaudación</h2>
        </div>
        <p class="text-sm text-gray-600">{{ subtitle }}</p>
      </div>
      <div class="flex items-center space-x-3">
        <div v-if="isLoading" class="flex items-center space-x-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-200">
          <div class="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span class="text-xs text-blue-600">Cargando...</span>
        </div>
        <div v-else-if="chartData.length > 0" class="flex items-center space-x-2">
          <!-- Indicador de estado de datos -->
          <div :class="[
            'flex items-center space-x-2 rounded-xl px-3 py-2 border',
            isDataRecent ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
          ]">
            <div :class="[
              'w-2 h-2 rounded-full',
              isDataRecent ? 'bg-green-500' : 'bg-amber-500'
            ]"></div>
            <span :class="[
              'text-xs',
              isDataRecent ? 'text-green-600' : 'text-amber-600'
            ]">{{ chartData.length }} días{{ isDataRecent ? '' : ' (datos parciales)' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de líneas -->
    <div class="h-80 w-full">
      <div v-if="isLoading" class="h-full flex items-center justify-center">
        <div class="text-center">
          <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Cargando datos históricos...</p>
        </div>
      </div>
      
      <div v-else-if="error" class="h-full flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-red-600 font-medium">Error al cargar datos</p>
          <p class="text-gray-500 text-sm">{{ error }}</p>
          <button 
            @click="fetchDailyTotals" 
            class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>

      <div v-else-if="chartData.length === 0" class="h-full flex items-center justify-center">
        <div class="text-center">
          <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-gray-600">No hay datos disponibles</p>
          <p class="text-gray-500 text-sm">Para el período seleccionado</p>
        </div>
      </div>

      <!-- Canvas para el gráfico -->
      <canvas 
        v-else
        ref="chartCanvas"
        class="w-full h-full"
      ></canvas>
    </div>

    <!-- Estadísticas resumidas -->
    <div v-if="chartData.length > 0" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div class="text-blue-600 text-sm font-medium">Total Período</div>
        <div class="text-blue-900 text-lg font-bold">{{ formatCurrency(totalPeriod) }}</div>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
        <div class="text-green-600 text-sm font-medium">Promedio Diario</div>
        <div class="text-green-900 text-lg font-bold">{{ formatCurrency(averageDaily) }}</div>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
        <div class="text-purple-600 text-sm font-medium">Día Máximo</div>
        <div class="text-purple-900 text-lg font-bold">{{ formatCurrency(maxDaily) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { formatCurrency } from '../utils/formatters.js'

// Props
const props = defineProps({
  fechaSeleccionada: {
    type: String,
    default: null
  }
})

// Estado reactivo
const chartCanvas = ref(null)
const chartData = ref([])
const isLoading = ref(false)
const error = ref(null)
const chartInstance = ref(null)

// Computed properties para estadísticas
const subtitle = computed(() => {
  if (chartData.value.length === 0) return 'Evolución histórica de recaudación'
  
  // Calcular rango real de fechas
  const fechas = chartData.value.map(item => item.date).sort()
  const fechaInicio = new Date(fechas[0])
  const fechaFin = new Date(fechas[fechas.length - 1])
  
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }
  
  if (chartData.value.length === 1) {
    return `Datos del ${formatearFecha(fechaInicio)}`
  }
  
  if (chartData.value.length <= 7) {
    return `Del ${formatearFecha(fechaInicio)} al ${formatearFecha(fechaFin)} (${chartData.value.length} días)`
  }
  
  if (chartData.value.length <= 31) {
    return `Del ${formatearFecha(fechaInicio)} al ${formatearFecha(fechaFin)} (${chartData.value.length} días)`
  }
  
  return `Del ${formatearFecha(fechaInicio)} al ${formatearFecha(fechaFin)} (${chartData.value.length} días)`
})

const totalPeriod = computed(() => {
  return chartData.value.reduce((sum, item) => sum + item.total_amount, 0)
})

const averageDaily = computed(() => {
  if (chartData.value.length === 0) return 0
  return totalPeriod.value / chartData.value.length
})

const maxDaily = computed(() => {
  if (chartData.value.length === 0) return 0
  return Math.max(...chartData.value.map(item => item.total_amount))
})

// Computed para verificar si los datos son recientes (últimos 2 días)
const isDataRecent = computed(() => {
  if (chartData.value.length === 0) return false
  
  const fechas = chartData.value.map(item => item.date).sort()
  const ultimaFecha = new Date(fechas[fechas.length - 1])
  const hoy = new Date()
  
  // Calcular diferencia en días
  const diffTime = hoy.getTime() - ultimaFecha.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays <= 2 // Considerar reciente si es de hace 2 días o menos
})

// Función para obtener datos de totales diarios
const fetchDailyTotals = async () => {
  try {
    isLoading.value = true
    error.value = null

    // Obtener datos del mes actual completo (desde el día 1 hasta hoy)
    const today = new Date()
    const endDate = today.toISOString().split('T')[0] // Hoy
    
    // Primer día del mes actual
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startDate = startOfMonth.toISOString().split('T')[0]

    console.log('📊 [DAILY CHART] Obteniendo datos históricos del mes:', {
      startDate: startDate,
      endDate: endDate,
      rangoCompleto: `Del ${startDate} al ${endDate}`,
      diasEstimados: Math.ceil((today - startOfMonth) / (1000 * 60 * 60 * 24)) + 1
    })

    const url = `/api-backend/charts/daily-totals?start_date=${startDate}&end_date=${endDate}&plant=total`
    console.log('📊 [DAILY CHART] URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ [DAILY CHART] Datos recibidos:', data)
    console.log('✅ [DAILY CHART] data.totals:', data.totals)
    console.log('✅ [DAILY CHART] Cantidad de registros en totals:', data.totals?.length || 0)

    chartData.value = data.totals || []
    console.log('✅ [DAILY CHART] chartData.value después de asignar:', chartData.value)
    console.log('✅ [DAILY CHART] chartData.value.length:', chartData.value.length)

    // Verificar que cada elemento tenga las propiedades necesarias y mostrar rango de fechas
    if (chartData.value.length > 0) {
      console.log('✅ [DAILY CHART] Primer elemento:', chartData.value[0])
      console.log('✅ [DAILY CHART] Último elemento:', chartData.value[chartData.value.length - 1])
      console.log('✅ [DAILY CHART] Propiedades del primer elemento:', Object.keys(chartData.value[0]))
      
      // Mostrar rango real de fechas recibidas
      const fechas = chartData.value.map(item => item.date).sort()
      console.log('📅 [DAILY CHART] Rango de fechas recibidas:', {
        desde: fechas[0],
        hasta: fechas[fechas.length - 1],
        totalDias: fechas.length,
        fechasSolicitadas: `${startDate} a ${endDate}`,
        diasSolicitados: Math.ceil((today - startOfMonth) / (1000 * 60 * 60 * 24)) + 1
      })
      
      // Verificar que todas las fechas y montos sean válidos
      const invalidItems = chartData.value.filter(item => 
        !item.date || 
        item.total_amount === undefined || 
        item.total_amount === null ||
        isNaN(item.total_amount)
      )
      
      if (invalidItems.length > 0) {
        console.error('❌ [DAILY CHART] Elementos con datos inválidos:', invalidItems)
      } else {
        console.log('✅ [DAILY CHART] Todos los elementos tienen datos válidos')
      }
    } else {
      console.warn('⚠️ [DAILY CHART] No se recibieron datos para el rango solicitado:', {
        startDate,
        endDate,
        url
      })
    }

    // Crear/actualizar el gráfico después de que los datos estén listos
    await nextTick()
    // Esperar un poco más para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      createChart()
    }, 100)

  } catch (err) {
    console.error('❌ [DAILY CHART] Error obteniendo datos:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Función para crear el gráfico con Chart.js (simulado con canvas nativo)
const createChart = () => {
  console.log('🎨 [DAILY CHART] Iniciando createChart con', chartData.value.length, 'datos')
  
  if (!chartCanvas.value || chartData.value.length === 0) {
    console.log('❌ [DAILY CHART] No se puede crear el gráfico - faltan datos o canvas')
    return
  }

  // Destruir gráfico anterior si existe
  if (chartInstance.value) {
    chartInstance.value = null
  }

  const canvas = chartCanvas.value
  const ctx = canvas.getContext('2d')
  
  // Configurar canvas - verificar dimensiones
  const rect = canvas.getBoundingClientRect()
  
  // Si las dimensiones son 0, esperar un poco más
  if (rect.width === 0 || rect.height === 0) {
    console.log('⏳ [DAILY CHART] Canvas sin dimensiones, reintentando en 200ms...')
    setTimeout(() => createChart(), 200)
    return
  }
  
  console.log('📐 [DAILY CHART] Dimensiones del canvas:', {
    width: rect.width,
    height: rect.height
  })
  
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = rect.height * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  
  const width = rect.width
  const height = rect.height
  const padding = { top: 40, right: 40, bottom: 60, left: 80 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Limpiar canvas
  ctx.clearRect(0, 0, width, height)

  // Preparar y ordenar datos por fecha
  const sortedData = [...chartData.value].sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })
  
  const amounts = sortedData.map(item => item.total_amount)
  const dates = sortedData.map(item => {
    const date = new Date(item.date)
    // Sumar un día para corregir el desfase
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })
  })

  console.log('📊 [DAILY CHART] Datos a graficar (ordenados por fecha, con corrección de +1 día):')
  sortedData.forEach((item, i) => {
    console.log(`  ${i}: ${dates[i]} → $${amounts[i].toLocaleString()} (fecha API: ${item.date})`)
  })

  if (amounts.length === 0) {
    console.log('❌ [DAILY CHART] No hay montos para graficar')
    return
  }

  // Calcular escalas
  const minAmount = Math.min(...amounts)
  const maxAmount = Math.max(...amounts)
  const range = maxAmount - minAmount
  const adjustedMin = range > 0 ? minAmount - range * 0.1 : minAmount - minAmount * 0.1
  const adjustedMax = range > 0 ? maxAmount + range * 0.1 : maxAmount + maxAmount * 0.1

  // Funciones de mapeo corregidas para perfecta alineación
  const getX = (index) => {
    // Si solo hay un punto, centrarlo
    if (amounts.length === 1) {
      return padding.left + chartWidth / 2
    }
    // Para múltiples puntos, distribuir uniformemente
    return padding.left + (index * chartWidth) / (amounts.length - 1)
  }
  const getY = (amount) => {
    if (adjustedMax === adjustedMin) {
      return padding.top + chartHeight / 2
    }
    return padding.top + ((adjustedMax - amount) / (adjustedMax - adjustedMin)) * chartHeight
  }

  console.log('📊 [DAILY CHART] Escalas calculadas:', {
    minAmount: minAmount.toLocaleString(),
    maxAmount: maxAmount.toLocaleString(),
    adjustedMin: adjustedMin.toLocaleString(),
    adjustedMax: adjustedMax.toLocaleString(),
    range: range.toLocaleString()
  })

  // Dibujar grilla horizontal
  ctx.strokeStyle = '#f3f4f6'
  ctx.lineWidth = 1
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (i / 5) * chartHeight
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(padding.left + chartWidth, y)
    ctx.stroke()
  }

  // Dibujar grilla vertical (solo algunas líneas para no saturar)
  const maxVerticalLines = Math.min(8, amounts.length)
  const verticalStep = Math.max(1, Math.floor(amounts.length / maxVerticalLines))
  for (let i = 0; i < amounts.length; i += verticalStep) {
    const x = getX(i)
    ctx.beginPath()
    ctx.moveTo(x, padding.top)
    ctx.lineTo(x, padding.top + chartHeight)
    ctx.stroke()
  }

  // Dibujar área bajo la curva (gradiente)
  if (amounts.length > 1) {
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)')
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)')
    
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(getX(0), padding.top + chartHeight)
    
    for (let i = 0; i < amounts.length; i++) {
      ctx.lineTo(getX(i), getY(amounts[i]))
    }
    
    ctx.lineTo(getX(amounts.length - 1), padding.top + chartHeight)
    ctx.closePath()
    ctx.fill()
  }

  // Dibujar línea principal
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  console.log('📊 [DAILY CHART] Dibujando línea principal con coordenadas exactas:')
  ctx.beginPath()
  for (let i = 0; i < amounts.length; i++) {
    const x = getX(i)
    const y = getY(amounts[i])
    
    console.log(`  Línea ${i}: ${dates[i]} → $${amounts[i].toLocaleString()} en coordenadas (${x.toFixed(1)}, ${y.toFixed(1)})`)
    
    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Dibujar puntos
  ctx.fillStyle = '#22c55e'
  console.log('📊 [DAILY CHART] Dibujando puntos con coordenadas exactas:')
  for (let i = 0; i < amounts.length; i++) {
    const x = getX(i)
    const y = getY(amounts[i])
    
    console.log(`  Punto ${i}: ${dates[i]} → $${amounts[i].toLocaleString()} en (${x.toFixed(1)}, ${y.toFixed(1)})`)
    
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
    
    // Borde blanco
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.strokeStyle = '#22c55e' // Restaurar color
    ctx.lineWidth = 3
  }

  // Etiquetas del eje X (fechas) - adaptativo según la cantidad de datos
  ctx.fillStyle = '#6b7280'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  
  const maxLabels = Math.floor(chartWidth / 60) // Aproximadamente cada 60px
  const labelStep = Math.max(1, Math.ceil(dates.length / maxLabels))
  
  console.log('📊 [DAILY CHART] Configuración de etiquetas:', {
    totalDays: dates.length,
    maxLabels: maxLabels,
    labelStep: labelStep,
    chartWidth: chartWidth
  })
  
  // Mostrar etiquetas alineadas exactamente con los puntos de datos
  for (let i = 0; i < dates.length; i += labelStep) {
    const x = getX(i)
    console.log(`  Etiqueta ${i}: fecha=${dates[i]}, x=${x.toFixed(1)}`)
    ctx.fillText(dates[i], x, padding.top + chartHeight + 20)
  }
  
  // Asegurar que primera y última fecha sean visibles para dar contexto
  if (labelStep > 1) {
    // Primera fecha
    const firstX = getX(0)
    ctx.fillText(dates[0], firstX, padding.top + chartHeight + 20)
    
    // Última fecha (solo si no está ya incluida)
    if ((dates.length - 1) % labelStep !== 0) {
      const lastX = getX(dates.length - 1)
      ctx.fillText(dates[dates.length - 1], lastX, padding.top + chartHeight + 20)
    }
  }

  // Etiquetas del eje Y (montos)
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i <= 5; i++) {
    const amount = adjustedMin + (adjustedMax - adjustedMin) * (5 - i) / 5
    const y = padding.top + (i / 5) * chartHeight
    const formattedAmount = amount >= 1000000 ? 
      (amount / 1000000).toFixed(1) + 'M' : 
      (amount / 1000).toFixed(0) + 'K'
    ctx.fillText(formattedAmount, padding.left - 10, y)
  }

  // Título del eje Y
  ctx.save()
  ctx.translate(20, padding.top + chartHeight / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.font = '14px sans-serif'
  ctx.fillStyle = '#374151'
  ctx.fillText('Monto Total (ARS)', 0, 0)
  ctx.restore()

  chartInstance.value = true
  console.log('✅ [DAILY CHART] Gráfico creado exitosamente con', amounts.length, 'puntos')
}

// Función para redimensionar el gráfico
const handleResize = () => {
  if (chartData.value.length > 0) {
    setTimeout(() => createChart(), 100)
  }
}

// Observer para detectar cuando el canvas se hace visible
let resizeObserver = null

// Watcher para redibujar cuando el canvas ref esté disponible
watch(chartCanvas, (newCanvas) => {
  if (newCanvas && chartData.value.length > 0) {
    console.log('📊 [DAILY CHART] Canvas ref disponible, redibujando gráfico')
    setTimeout(() => createChart(), 100)
  }
})

// Lifecycle
onMounted(() => {
  console.log('📊 [DAILY CHART] Componente montado - cargando datos históricos del mes')
  fetchDailyTotals()
  window.addEventListener('resize', handleResize)
  
  // Crear observer para detectar cambios de tamaño del canvas
  if (chartCanvas.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          console.log('👁️ [DAILY CHART] Canvas redimensionado:', entry.contentRect)
          if (chartData.value.length > 0) {
            setTimeout(() => createChart(), 50)
          }
        }
      }
    })
    resizeObserver.observe(chartCanvas.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
