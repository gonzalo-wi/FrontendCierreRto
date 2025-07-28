<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">Crear Nuevo Usuario</h3>
            <p class="text-sm text-gray-500 mt-1">Completa la información del nuevo usuario</p>
          </div>
          <button
            @click="handleClose"
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

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
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

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña *
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Repite la contraseña"
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
              @click="handleClose"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!loading">Crear Usuario</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import userService from '../services/UserService'

// Props
const props = defineProps({
  show: Boolean
})

// Emits
const emit = defineEmits(['close', 'created'])

// Estado reactivo
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const form = ref({
  username: '',
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  is_active: true
})

// Resetear formulario cuando se abre el modal
watch(() => props.show, (newValue) => {
  if (newValue) {
    // Cuando se abre, resetear el formulario
    resetForm()
    error.value = ''
    loading.value = false
  } else {
    // Cuando se cierra, también resetear para la próxima vez
    setTimeout(() => {
      resetForm()
    }, 300) // Delay para que no interfiera con la animación de cierre
  }
})

// Métodos
const resetForm = () => {
  form.value = {
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    is_active: true
  }
  error.value = ''
  showPassword.value = false
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const validateForm = () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return false
  }

  if (form.value.password.length < 8) {
    error.value = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }

  return true
}

const handleSubmit = async () => {
  error.value = ''

  if (!validateForm()) return

  loading.value = true

  try {
    const userData = {
      username: form.value.username,
      full_name: form.value.full_name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
      is_active: form.value.is_active
    }

    const result = await userService.createUser(userData)

    if (result.success) {
      resetForm() // Resetear inmediatamente después de crear
      emit('created')
      alert('✅ Usuario creado correctamente')
    } else {
      error.value = result.error
    }
  } catch (err) {
    console.error('Error:', err)
    error.value = 'Error inesperado al crear usuario'
  } finally {
    loading.value = false
  }
}

// Asegurarse de que el formulario esté limpio al montar
onMounted(() => {
  resetForm()
})
</script>

<style scoped>
select option {
  background-color: white;
  color: #374151;
}
</style>
