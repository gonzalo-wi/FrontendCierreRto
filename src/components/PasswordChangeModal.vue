<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Cambiar Contraseña</h3>
            <p class="text-sm text-gray-500 mt-1">Define una nueva contraseña para el usuario</p>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Información del usuario -->
        <div v-if="user" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ user.full_name?.charAt(0) || user.username?.charAt(0) }}
            </div>
            <div>
              <div class="text-gray-900 font-medium">{{ user.full_name }}</div>
              <div class="text-gray-500 text-sm">@{{ user.username }}</div>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nueva contraseña -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Nueva contraseña *
            </label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirmar nueva contraseña -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar nueva contraseña *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <!-- Requisitos de contraseña -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="text-blue-800 font-medium mb-2">Requisitos de contraseña:</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Mínimo 8 caracteres</span>
              </li>
              <li class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Recomendado: mayúsculas, minúsculas y números</span>
              </li>
            </ul>
          </div>

          <!-- Error message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ error }}
            </div>
          </div>

          <!-- Botones -->
          <div class="flex space-x-3 pt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Cambiar Contraseña</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cambiando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import userService from '../services/UserService'

// Props
const props = defineProps({
  show: Boolean,
  user: Object
})

// Emits
const emit = defineEmits(['close', 'changed'])

// Estado reactivo
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = ref({
  newPassword: '',
  confirmPassword: ''
})

// Resetear formulario cuando se abre el modal
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm()
  }
})

// Métodos
const resetForm = () => {
  form.value = {
    newPassword: '',
    confirmPassword: ''
  }
  error.value = ''
  showPassword.value = false
}

const validateForm = () => {
  if (form.value.newPassword !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return false
  }

  if (form.value.newPassword.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }

  return true
}

const handleSubmit = async () => {
  error.value = ''

  if (!validateForm()) return

  if (!props.user?.id) {
    error.value = 'ID de usuario no válido'
    return
  }

  loading.value = true

  try {
    const passwordData = {
      user_id: props.user.id,
      new_password: form.value.newPassword
    }

    const result = await userService.changePassword(passwordData)

    if (result.success) {
      emit('changed')
      alert('✅ Contraseña cambiada correctamente')
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error inesperado al cambiar contraseña'
  } finally {
    loading.value = false
  }
}
</script>
