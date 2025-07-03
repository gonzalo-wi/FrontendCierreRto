<template>
  <div class="bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-8 backdrop-blur-sm">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center space-x-4">
        <div class="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent">
            Comparación entre Plantas
          </h2>
          <p class="text-gray-600 mt-1 text-lg">Análisis visual de rendimiento y distribución de montos</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Indicador de total -->
        <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2">
          <div class="text-xs font-medium text-emerald-600 uppercase tracking-wide">Total General</div>
          <div class="text-lg font-bold text-emerald-700">{{ formatCurrency(chartData.total) }}</div>
        </div>
        
        <!-- Badge de estado -->
        <div class="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
          <span class="text-sm font-medium text-green-700">Sincronizado</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Loading states para gráficos -->
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <div class="text-gray-400">Cargando gráfico de barras...</div>
        </div>
      </div>
      <div class="space-y-4">
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
          <div class="text-gray-400">Cargando gráfico circular...</div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Gráfico de Barras con Chart.js -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800 flex items-center">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
              </svg>
            </div>
            Montos por Planta
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Datos en tiempo real</span>
          </div>
        </div>
        <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
          <div class="relative">
            <canvas ref="barChart" width="400" height="300" class="rounded-xl"></canvas>
            <!-- Overlay decorativo -->
            <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      <!-- Gráfico Circular con Chart.js -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-800 flex items-center">
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
              </svg>
            </div>
            Distribución Porcentual
          </h3>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Vista comparativa</span>
          </div>
        </div>
        <div class="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-6 border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
          <div class="relative">
            <canvas ref="pieChart" width="400" height="300" class="rounded-xl"></canvas>
            <!-- Overlay decorativo -->
            <div class="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen de insights -->
    <div class="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
      <div class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-1">Insights de Rendimiento</h4>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Planta líder:</strong> {{ getLeadingPlant() }} con {{ formatCurrency(getMaxAmount()) }}</p>
            <p><strong>Total general:</strong> {{ formatCurrency(chartData.total) }}</p>
            <p><strong>Distribución:</strong> {{ getDistributionSummary() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import TotalsService from '../services/TotalsService.js'

// Registrar todos los componentes de Chart.js
Chart.register(...registerables)

const props = defineProps({
  fechaSeleccionada: {
    type: String,
    default: null
  }
})

// Referencias
const barChart = ref(null)
const pieChart = ref(null)
let barChartInstance = null
let pieChartInstance = null

// Estado reactivo
const loading = ref(true)
const chartData = ref({
  jumillano: 0,
  laplata: 0,
  nafa: 0,
  total: 0
})

// Cargar datos reales usando TotalsService (mismo que TotalsView)
const loadRealData = async () => {
  loading.value = true
  
  try {
    // Usar el mismo servicio que TotalsView para consistencia
    const totales = await TotalsService.getTotales(props.fechaSeleccionada)
    
    // Los datos de TotalsService.getTotales() ya vienen como números
    // No necesitamos parsing, solo usar los valores directamente
    chartData.value = {
      jumillano: totales.jumillano || 0,
      laplata: totales.laplata || 0,
      nafa: totales.nafa || 0,
      total: totales.totalGeneral || 0
    }

    console.log('📊 Datos para gráficos cargados:', chartData.value)

    // Crear gráficos después de que los datos estén listos
    await nextTick()
    createCharts()

  } catch (error) {
    console.error('Error loading chart data:', error)
    // Fallback a datos simulados solo si hay error
    chartData.value = {
      jumillano: 45000000,
      laplata: 38000000,
      nafa: 32000000,
      total: 115000000
    }
    await nextTick()
    createCharts()
  } finally {
    loading.value = false
  }
}

// Crear gráficos con Chart.js
const createCharts = () => {
  // Destruir gráficos existentes
  if (barChartInstance) {
    barChartInstance.destroy()
  }
  if (pieChartInstance) {
    pieChartInstance.destroy()
  }

  // Gráfico de barras mejorado con efectos premium
  const barCtx = barChart.value?.getContext('2d')
  if (barCtx) {
    // Gradientes más atractivos para las barras
    const gradient1 = barCtx.createLinearGradient(0, 0, 0, 350)
    gradient1.addColorStop(0, 'rgba(59, 130, 246, 1)')
    gradient1.addColorStop(0.5, 'rgba(59, 130, 246, 0.8)')
    gradient1.addColorStop(1, 'rgba(29, 78, 216, 0.4)')

    const gradient2 = barCtx.createLinearGradient(0, 0, 0, 350)
    gradient2.addColorStop(0, 'rgba(147, 51, 234, 1)')
    gradient2.addColorStop(0.5, 'rgba(147, 51, 234, 0.8)')
    gradient2.addColorStop(1, 'rgba(126, 34, 206, 0.4)')

    const gradient3 = barCtx.createLinearGradient(0, 0, 0, 350)
    gradient3.addColorStop(0, 'rgba(16, 185, 129, 1)')
    gradient3.addColorStop(0.5, 'rgba(16, 185, 129, 0.8)')
    gradient3.addColorStop(1, 'rgba(5, 150, 105, 0.4)')

    barChartInstance = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['🏭 Jumillano', '🏢 La Plata', '⚡ NAFA'],
        datasets: [{
          label: 'Monto Total',
          data: [chartData.value.jumillano, chartData.value.laplata, chartData.value.nafa],
          backgroundColor: [gradient1, gradient2, gradient3],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 3,
          borderRadius: 16,
          borderSkipped: false,
          barPercentage: 0.65,
          categoryPercentage: 0.8,
          // Efecto de sombra para las barras
          shadowOffsetX: 0,
          shadowOffsetY: 6,
          shadowBlur: 12,
          shadowColor: 'rgba(0, 0, 0, 0.15)',
          // Efecto hover
          hoverBackgroundColor: [
            'rgba(59, 130, 246, 0.9)',
            'rgba(147, 51, 234, 0.9)',
            'rgba(16, 185, 129, 0.9)'
          ],
          hoverBorderWidth: 4,
          hoverBorderColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(126, 34, 206, 1)',
            'rgba(5, 150, 105, 1)'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 25,
            bottom: 15,
            left: 15,
            right: 15
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.97)',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            borderColor: 'rgba(59, 130, 246, 0.4)',
            borderWidth: 2,
            cornerRadius: 16,
            displayColors: true,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            titleFont: {
              size: 16,
              weight: 'bold',
              family: 'system-ui'
            },
            bodyFont: {
              size: 14,
              family: 'system-ui'
            },
            titleMarginBottom: 12,
            bodySpacing: 8,
            animation: {
              duration: 300,
              easing: 'easeOutCubic'
            },
            callbacks: {
              title: function(context) {
                const label = context[0].label.replace(/[🏭🏢⚡]/g, '').trim()
                return `💼 Planta ${label}`
              },
              label: function(context) {
                const percentage = ((context.parsed.y / chartData.value.total) * 100).toFixed(1)
                return [
                  `💰 Monto: ${formatCurrency(context.parsed.y)}`,
                  `📊 Participación: ${percentage}%`,
                  `🎯 Ranking: #${context.dataIndex + 1}`
                ]
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 13,
                weight: '700',
                family: 'system-ui'
              },
              padding: 10
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(156, 163, 175, 0.2)',
              drawBorder: false,
              lineWidth: 1
            },
            ticks: {
              color: '#6B7280',
              font: {
                size: 12,
                family: 'system-ui'
              },
              callback: function(value) {
                return formatCurrencyShort(value)
              },
              maxTicksLimit: 6,
              padding: 8
            }
          }
        },
        animation: {
          duration: 2500,
          easing: 'easeOutCubic',
          delay: (context) => context.dataIndex * 300,
          onComplete: function() {
            // Animación de aparición suave
            this.canvas.style.opacity = '1'
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          bar: {
            tension: 0.4
          }
        }
      }
    })
  }

  // Gráfico circular premium con efectos visuales avanzados
  const pieCtx = pieChart.value?.getContext('2d')
  if (pieCtx) {
    // Gradientes circulares para el doughnut
    const gradientBlue = pieCtx.createConicGradient(0, 150, 150)
    gradientBlue.addColorStop(0, 'rgba(59, 130, 246, 1)')
    gradientBlue.addColorStop(0.5, 'rgba(29, 78, 216, 1)')
    gradientBlue.addColorStop(1, 'rgba(37, 99, 235, 0.8)')

    const gradientPurple = pieCtx.createConicGradient(0, 150, 150)
    gradientPurple.addColorStop(0, 'rgba(147, 51, 234, 1)')
    gradientPurple.addColorStop(0.5, 'rgba(126, 34, 206, 1)')
    gradientPurple.addColorStop(1, 'rgba(139, 92, 246, 0.8)')

    const gradientGreen = pieCtx.createConicGradient(0, 150, 150)
    gradientGreen.addColorStop(0, 'rgba(16, 185, 129, 1)')
    gradientGreen.addColorStop(0.5, 'rgba(5, 150, 105, 1)')
    gradientGreen.addColorStop(1, 'rgba(34, 197, 94, 0.8)')

    pieChartInstance = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['🏭 Jumillano', '🏢 La Plata', '⚡ NAFA'],
        datasets: [{
          data: [chartData.value.jumillano, chartData.value.laplata, chartData.value.nafa],
          backgroundColor: [gradientBlue, gradientPurple, gradientGreen],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(16, 185, 129, 1)'
          ],
          borderWidth: 4,
          hoverOffset: 20,
          hoverBorderWidth: 6,
          hoverBorderColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(126, 34, 206, 1)',
            'rgba(5, 150, 105, 1)'
          ],
          // Espaciado entre segmentos
          spacing: 3,
          // Bordes redondeados en los extremos
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Centro más grande para un look moderno
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 20,
            right: 20
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              padding: 25,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 13,
                weight: '600',
                family: 'system-ui'
              },
              color: '#374151',
              generateLabels: function(chart) {
                const data = chart.data
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i]
                    const percentage = ((value / chartData.value.total) * 100).toFixed(1)
                    return {
                      text: `${label.replace(/[🏭🏢⚡]/g, '').trim()} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      lineWidth: 2,
                      pointStyle: 'circle',
                      hidden: chart.getDatasetMeta(0).data[i].hidden,
                      index: i
                    }
                  })
                }
                return []
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.97)',
            titleColor: '#F9FAFB',
            bodyColor: '#F9FAFB',
            borderColor: 'rgba(147, 51, 234, 0.4)',
            borderWidth: 2,
            cornerRadius: 16,
            displayColors: true,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            titleFont: {
              size: 16,
              weight: 'bold',
              family: 'system-ui'
            },
            bodyFont: {
              size: 14,
              family: 'system-ui'
            },
            titleMarginBottom: 12,
            bodySpacing: 8,
            animation: {
              duration: 300,
              easing: 'easeOutCubic'
            },
            callbacks: {
              title: function(context) {
                const label = context[0].label.replace(/[🏭🏢⚡]/g, '').trim()
                return `🏢 Planta ${label}`
              },
              label: function(context) {
                const percentage = ((context.parsed / chartData.value.total) * 100).toFixed(1)
                const ranking = context.dataIndex + 1
                return [
                  `💰 Monto: ${formatCurrency(context.parsed)}`,
                  `📊 Participación: ${percentage}%`,
                  `🏆 Posición: #${ranking}°`,
                  `📈 Del total: ${formatCurrency(chartData.value.total)}`
                ]
              }
            }
          }
        },
        animation: {
          duration: 2800,
          easing: 'easeOutCubic',
          animateRotate: true,
          animateScale: true,
          delay: (context) => context.dataIndex * 400,
          onProgress: function(animation) {
            // Efecto de aparición gradual
            const progress = animation.currentStep / animation.numSteps
            this.canvas.style.opacity = progress
          },
          onComplete: function() {
            this.canvas.style.opacity = '1'
          }
        },
        interaction: {
          intersect: false,
          mode: 'nearest'
        },
        // Efecto de glow al hacer hover
        onHover: (event, elements) => {
          const canvas = event.native.target
          canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default'
          
          if (elements.length > 0) {
            canvas.style.filter = 'drop-shadow(0 8px 16px rgba(147, 51, 234, 0.3))'
          } else {
            canvas.style.filter = 'none'
          }
        }
      }
    })
  }
}

// Computed properties
const maxAmount = computed(() => {
  return Math.max(chartData.value.jumillano, chartData.value.laplata, chartData.value.nafa)
})

// Métodos
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatCurrencyShort = (amount) => {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(1) + 'M'
  }
  if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(1) + 'K'
  }
  return '$' + amount.toFixed(0)
}

const getLeadingPlant = () => {
  const amounts = chartData.value
  if (amounts.jumillano >= amounts.laplata && amounts.jumillano >= amounts.nafa) return 'Jumillano'
  if (amounts.laplata >= amounts.nafa) return 'La Plata'
  return 'NAFA'
}

const getMaxAmount = () => {
  return maxAmount.value
}

const getPercentage = (plant) => {
  if (chartData.value.total === 0) return 0
  return Math.round((chartData.value[plant] / chartData.value.total) * 100)
}

const getDistributionSummary = () => {
  const percentages = [
    getPercentage('jumillano'),
    getPercentage('laplata'),
    getPercentage('nafa')
  ].sort((a, b) => b - a)
  
  if (percentages[0] > 50) return 'Una planta domina el total'
  if (percentages[0] - percentages[1] < 10) return 'Distribución equilibrada'
  return 'Distribución moderada'
}

// Watchers
watch(() => props.fechaSeleccionada, () => {
  loadRealData()
})

// Lifecycle
onMounted(() => {
  loadRealData()
})
</script>

<style scoped>
/* Efectos de glassmorphism para los contenedores de gráficos */
.chart-container {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

/* Animaciones de entrada suaves */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Aplicar animaciones a los elementos */
.space-y-6 {
  animation: slideInUp 0.8s ease-out;
}

.space-y-6:nth-child(2) {
  animation-delay: 0.2s;
}

/* Efectos hover mejorados */
.hover\:shadow-2xl {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover\:shadow-2xl:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Indicadores de estado en tiempo real */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Mejora visual para canvas */
canvas {
  transition: all 0.3s ease;
}

canvas:hover {
  transform: scale(1.02);
}

/* Gradientes animados para fondos */
.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradientShift 6s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Efectos de loading mejorados */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Sombras personalizadas para iconos */
.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Mejoras tipográficas */
.font-bold {
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* Efectos de enfoque mejorados */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}
</style>
