<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Editar Usuario</h3>
            <p class="text-sm text-gray-500 mt-1">Actualiza la información del usuario</p>
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

        <!-- Formulario -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre de usuario *
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: jdoe"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              id="fullName"
              v-model="form.full_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: juan@empresa.com"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              id="role"
              v-model="form.role"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled style="color: #6b7280;">Seleccionar rol</option>
              <option value="USUARIO" style="color: #374151;">Usuario</option>
              <option value="ADMIN" style="color: #374151;">Administrador</option>
              <option value="SUPERADMIN" style="color: #374151;">Super Administrador</option>
            </select>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              id="isActive"
              v-model="form.is_active"
              type="checkbox"
              class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="isActive" class="ml-2 text-sm text-gray-700">
              Usuario activo
            </label>
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
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Actualizar Usuario</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Actualizando...
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
const emit = defineEmits(['close', 'updated'])

// Estado reactivo
const loading = ref(false)
const error = ref('')

const form = ref({
  username: '',
  full_name: '',
  email: '',
  role: '',
  is_active: true
})

// Cargar datos del usuario cuando se abre el modal
watch(() => props.show, (newValue) => {
  if (newValue && props.user) {
    loadUserData()
  }
})

// Métodos
const loadUserData = () => {
  if (props.user) {
    form.value = {
      username: props.user.username || '',
      full_name: props.user.full_name || '',
      email: props.user.email || '',
      role: props.user.role || '',
      is_active: props.user.is_active ?? true
    }
  }
  error.value = ''
}

const handleSubmit = async () => {
  error.value = ''

  if (!props.user?.id) {
    error.value = 'ID de usuario no válido'
    return
  }

  loading.value = true

  try {
    const userData = {
      username: form.value.username,
      full_name: form.value.full_name,
      email: form.value.email,
      role: form.value.role,
      is_active: form.value.is_active
    }

    const result = await userService.updateUser(props.user.id, userData)

    if (result.success) {
      emit('updated')
      alert('✅ Usuario actualizado correctamente')
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error inesperado al actualizar usuario'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
select option {
  background-color: white;
  color: #374151;
}
</style>
