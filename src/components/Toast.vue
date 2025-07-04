<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="toast-container"
      :class="toastClasses"
      @click="onToastClick"
    >
      <!-- Icono -->
      <div class="toast-icon">
        <div class="icon-wrapper" :class="iconClasses">
          <component :is="iconComponent" class="w-5 h-5" />
        </div>
      </div>

      <!-- Contenido -->
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div v-if="message" class="toast-message">{{ message }}</div>
        
        <!-- Acciones -->
        <div v-if="showActions" class="toast-actions">
          <button
            v-if="confirmText"
            @click="onConfirm"
            class="action-btn primary"
          >
            {{ confirmText }}
          </button>
          <button
            v-if="cancelText"
            @click="onCancel"
            class="action-btn secondary"
          >
            {{ cancelText }}
          </button>
        </div>
      </div>

      <!-- Botón cerrar -->
      <button
        v-if="dismissible"
        @click="close"
        class="toast-close"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Barra de progreso para auto-dismiss -->
      <div
        v-if="autoClose && duration > 0"
        class="toast-progress"
        :style="{ animationDuration: duration + 'ms' }"
      ></div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 5000 // 5 segundos
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    default: 'top-right' // top-right, top-left, bottom-right, bottom-left, top-center, bottom-center
  }
})

const emit = defineEmits(['close', 'confirm', 'cancel'])

const visible = ref(true)

const showActions = computed(() => props.confirmText || props.cancelText)

const toastClasses = computed(() => [
  'toast-base',
  `toast-${props.type}`,
  `toast-${props.position}`
])

const iconClasses = computed(() => [
  'icon-base',
  `icon-${props.type}`
])

const iconComponent = computed(() => {
  const icons = {
    success: 'CheckIcon',
    error: 'XIcon',
    warning: 'ExclamationIcon',
    info: 'InfoIcon'
  }
  return icons[props.type] || 'InfoIcon'
})

// Componentes de iconos
const CheckIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `
}

const XIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `
}

const ExclamationIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `
}

// Métodos
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 100)
}

const onConfirm = () => {
  emit('confirm')
  close()
}

const onCancel = () => {
  emit('cancel')
  close()
}

const onToastClick = () => {
  // Cerrar al hacer clic si no hay acciones
  if (!showActions.value && props.dismissible) {
    close()
  }
}

// Auto close
onMounted(() => {
  if (props.autoClose && props.duration > 0) {
    setTimeout(() => {
      if (visible.value) {
        close()
      }
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-base {
  @apply flex items-start p-4 mb-4 rounded-xl shadow-lg border backdrop-blur-lg max-w-sm w-full relative overflow-hidden cursor-pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-base:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Tipos de toast */
.toast-success {
  @apply bg-green-50/90 border-green-200 text-green-800;
}

.toast-error {
  @apply bg-red-50/90 border-red-200 text-red-800;
}

.toast-warning {
  @apply bg-yellow-50/90 border-yellow-200 text-yellow-800;
}

.toast-info {
  @apply bg-blue-50/90 border-blue-200 text-blue-800;
}

/* Iconos */
.toast-icon {
  @apply flex-shrink-0 mr-3;
}

.icon-base {
  @apply w-8 h-8 rounded-full flex items-center justify-center;
}

.icon-success {
  @apply bg-green-100 text-green-600;
}

.icon-error {
  @apply bg-red-100 text-red-600;
}

.icon-warning {
  @apply bg-yellow-100 text-yellow-600;
}

.icon-info {
  @apply bg-blue-100 text-blue-600;
}

/* Contenido */
.toast-content {
  @apply flex-1 min-w-0;
}

.toast-title {
  @apply font-semibold text-sm leading-5;
}

.toast-message {
  @apply mt-1 text-xs opacity-90 leading-4;
}

/* Acciones */
.toast-actions {
  @apply flex space-x-2 mt-3;
}

.action-btn {
  @apply px-3 py-1 text-xs font-medium rounded-lg transition-colors duration-200;
}

.action-btn.primary {
  @apply bg-current text-white opacity-90 hover:opacity-100;
}

.action-btn.secondary {
  @apply bg-transparent border border-current opacity-70 hover:opacity-100;
}

/* Botón cerrar */
.toast-close {
  @apply flex-shrink-0 ml-3 text-current opacity-60 hover:opacity-100 transition-opacity duration-200;
}

/* Barra de progreso */
.toast-progress {
  @apply absolute bottom-0 left-0 h-1 bg-current opacity-30;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Posiciones */
.toast-top-right {
  @apply fixed top-4 right-4 z-50;
}

.toast-top-left {
  @apply fixed top-4 left-4 z-50;
}

.toast-bottom-right {
  @apply fixed bottom-4 right-4 z-50;
}

.toast-bottom-left {
  @apply fixed bottom-4 left-4 z-50;
}

.toast-top-center {
  @apply fixed top-4 left-1/2 transform -translate-x-1/2 z-50;
}

.toast-bottom-center {
  @apply fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50;
}

/* Responsive */
@media (max-width: 640px) {
  .toast-base {
    @apply max-w-none mx-4;
  }
  
  .toast-top-right,
  .toast-top-left {
    @apply top-4 left-4 right-4;
  }
  
  .toast-bottom-right,
  .toast-bottom-left {
    @apply bottom-4 left-4 right-4;
  }
  
  .toast-top-center,
  .toast-bottom-center {
    @apply left-4 right-4 transform-none;
  }
}
</style>
