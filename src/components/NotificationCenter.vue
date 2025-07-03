<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
          getNotificationClass(notification.type)
        ]"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <!-- Icono basado en el tipo -->
              <svg 
                v-if="notification.type === 'success'"
                class="h-6 w-6 text-green-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg 
                v-else-if="notification.type === 'error'"
                class="h-6 w-6 text-red-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg 
                v-else-if="notification.type === 'warning'"
                class="h-6 w-6 text-yellow-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <svg 
                v-else
                class="h-6 w-6 text-blue-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p v-if="notification.message" class="mt-1 text-sm text-gray-500">
                {{ notification.message }}
              </p>
              <div v-if="notification.timestamp" class="mt-1 text-xs text-gray-400">
                {{ formatTimestamp(notification.timestamp) }}
              </div>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Barra de progreso para auto-dismiss -->
          <div 
            v-if="notification.autoDismiss && notification.duration"
            class="mt-3 bg-gray-200 rounded-full h-1 overflow-hidden"
          >
            <div 
              :class="getProgressBarClass(notification.type)"
              class="h-full rounded-full transition-all duration-100 ease-linear"
              :style="{ width: getProgressWidth(notification) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Estado reactivo
const notifications = ref([])
let nextId = 1
let progressInterval = null

// Métodos
const addNotification = ({ type = 'info', title, message, duration = 5000, autoDismiss = true }) => {
  const notification = {
    id: nextId++,
    type,
    title,
    message,
    timestamp: new Date(),
    duration,
    autoDismiss,
    progress: 100
  }
  
  notifications.value.push(notification)
  
  if (autoDismiss && duration > 0) {
    // Iniciar countdown para auto-dismiss
    const startTime = Date.now()
    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      notification.progress = (remaining / duration) * 100
      
      if (remaining <= 0) {
        removeNotification(notification.id)
      }
    }
    
    // Actualizar progreso cada 100ms
    const interval = setInterval(updateProgress, 100)
    notification.interval = interval
  }
  
  return notification.id
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    const notification = notifications.value[index]
    if (notification.interval) {
      clearInterval(notification.interval)
    }
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  notifications.value.forEach(notification => {
    if (notification.interval) {
      clearInterval(notification.interval)
    }
  })
  notifications.value = []
}

const getNotificationClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-l-4 border-green-400'
    case 'error':
      return 'bg-red-50 border-l-4 border-red-400'
    case 'warning':
      return 'bg-yellow-50 border-l-4 border-yellow-400'
    default:
      return 'bg-blue-50 border-l-4 border-blue-400'
  }
}

const getProgressBarClass = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-400'
    case 'error':
      return 'bg-red-400'
    case 'warning':
      return 'bg-yellow-400'
    default:
      return 'bg-blue-400'
  }
}

const getProgressWidth = (notification) => {
  return notification.progress || 0
}

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Funciones de utilidad para tipos específicos
const showSuccess = (title, message, options = {}) => {
  return addNotification({ type: 'success', title, message, ...options })
}

const showError = (title, message, options = {}) => {
  return addNotification({ type: 'error', title, message, ...options })
}

const showWarning = (title, message, options = {}) => {
  return addNotification({ type: 'warning', title, message, ...options })
}

const showInfo = (title, message, options = {}) => {
  return addNotification({ type: 'info', title, message, ...options })
}

// Lifecycle
onMounted(() => {
  // Mostrar notificación inicial de bienvenida después de un momento
  setTimeout(() => {
    addNotification({
      type: 'success',
      title: 'Sistema de Cierre de Repartos',
      message: 'Todas las plantas están operativas y disponibles',
      duration: 4000
    })
  }, 1500)
  
  // Escuchar eventos de cambio de conexión
  window.addEventListener('plant-connection-change', handleConnectionChange)
})

// Manejar cambios de conexión
const handleConnectionChange = (event) => {
  const { plantName, isConnected, wasConnected } = event.detail
  
  if (wasConnected && !isConnected) {
    addNotification({
      type: 'error',
      title: `${plantName} desconectada`,
      message: 'No se puede acceder a los datos de esta planta',
      duration: 10000
    })
  } else if (!wasConnected && isConnected) {
    addNotification({
      type: 'success',
      title: `${plantName} reconectada`,
      message: 'La conexión se ha restablecido correctamente',
      duration: 5000
    })
  }
}

onUnmounted(() => {
  clearAllNotifications()
  window.removeEventListener('plant-connection-change', handleConnectionChange)
})

// Exponer métodos para uso externo
defineExpose({
  addNotification,
  removeNotification,
  clearAllNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
