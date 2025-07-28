<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
            <p class="text-gray-600 text-lg">Administra usuarios, roles y permisos del sistema</p>
          </div>
          <button
            @click="showCreateModal = true"
            class="action-button inline-flex items-center px-8 py-3 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Nuevo Usuario</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="stat-card bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Total Usuarios</p>
                <p class="text-3xl font-bold text-gray-900">{{ users.length }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Activos</p>
                <p class="text-3xl font-bold text-gray-900">{{ activeUsers }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">Administradores</p>
                <p class="text-3xl font-bold text-gray-900">{{ adminUsers }}</p>
              </div>
            </div>
          </div>

          <div class="stat-card bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-500">SuperAdmins</p>
                <p class="text-3xl font-bold text-gray-900">{{ superAdminUsers }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar usuarios por nombre, email o username..."
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
          <div class="flex gap-3">
            <select
              v-model="roleFilter"
              class="block px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="" style="color: #374151;">Todos los roles</option>
              <option value="SUPERADMIN" style="color: #374151;">SuperAdmin</option>
              <option value="ADMIN" style="color: #374151;">Admin</option>
              <option value="USUARIO" style="color: #374151;">Usuario</option>
            </select>
            <select
              v-model="statusFilter"
              class="block px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="" style="color: #374151;">Todos los estados</option>
              <option value="active" style="color: #374151;">Activos</option>
              <option value="inactive" style="color: #374151;">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabla de usuarios -->
      <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <div 
                        class="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg"
                        :class="getAvatarGradient(user.id)"
                      >
                        {{ user.full_name?.charAt(0) || user.username?.charAt(0) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.full_name }}</div>
                      <div class="text-sm text-gray-500">@{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getRoleClass(user.role)"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ user.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.last_login) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-1">
                    <!-- Botón editar -->
                    <button
                      @click="editUser(user)"
                      class="action-button inline-flex items-center p-2 border border-transparent rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-200"
                      title="Editar usuario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    
                    <!-- Botón cambiar contraseña -->
                    <button
                      @click="changePassword(user)"
                      class="action-button inline-flex items-center p-2 border border-transparent rounded-lg text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-500 transition-all duration-200"
                      title="Cambiar contraseña"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2L4.257 10.257a6 6 0 115.986-5.986L16 9.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                      </svg>
                    </button>
                    
                    <!-- Botón toggle estado -->
                    <button
                      @click="toggleStatus(user)"
                      :class="user.is_active ? 'text-orange-600 hover:bg-orange-50 hover:text-orange-700 focus:ring-orange-500' : 'text-green-600 hover:bg-green-50 hover:text-green-700 focus:ring-green-500'"
                      class="action-button inline-flex items-center p-2 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200"
                      :title="user.is_active ? 'Desactivar usuario' : 'Activar usuario'"
                    >
                      <svg v-if="user.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </button>
                    
                    <!-- Botón eliminar -->
                    <button
                      @click="deleteUser(user)"
                      class="action-button inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-all duration-200"
                      title="Eliminar usuario"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
          <p class="mt-1 text-sm text-gray-500">No se encontraron usuarios que coincidan con los filtros.</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
          <div class="flex items-center space-x-4">
            <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-900 text-lg font-medium">Cargando...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <UserCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleUserCreated"
    />

    <UserEditModal
      :show="showEditModal"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />

    <PasswordChangeModal
      :show="showPasswordModal"
      :user="selectedUser"
      @close="showPasswordModal = false"
      @changed="handlePasswordChanged"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import userService from '../services/UserService'
import UserCreateModal from '../components/UserCreateModal.vue'
import UserEditModal from '../components/UserEditModal.vue'
import PasswordChangeModal from '../components/PasswordChangeModal.vue'

// Estados reactivos
const users = ref([])
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null)

// Composable de autenticación
const { isSuperAdmin } = useAuth()

// Computed properties
const activeUsers = computed(() => users.value.filter(u => u.is_active).length)
const adminUsers = computed(() => users.value.filter(u => u.role === 'ADMIN').length)
const superAdminUsers = computed(() => users.value.filter(u => u.role === 'SUPERADMIN').length)

const filteredUsers = computed(() => {
  let filtered = users.value

  // Filtro por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.username?.toLowerCase().includes(query) ||
      user.full_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }

  // Filtro por rol
  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Filtro por estado
  if (statusFilter.value) {
    filtered = filtered.filter(user => 
      statusFilter.value === 'active' ? user.is_active : !user.is_active
    )
  }

  return filtered
})

// Métodos
const loadUsers = async () => {
  if (!isSuperAdmin()) {
    alert('❌ No tienes permisos para acceder a esta sección')
    return
  }

  loading.value = true
  try {
    const result = await userService.getUsers()
    if (result.success) {
      users.value = result.data
    } else {
      alert('❌ Error al cargar usuarios: ' + result.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error inesperado al cargar usuarios')
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  selectedUser.value = user
  showEditModal.value = true
}

const changePassword = (user) => {
  selectedUser.value = user
  showPasswordModal.value = true
}

const toggleStatus = async (user) => {
  const action = user.is_active ? 'desactivar' : 'activar'
  if (!confirm(`¿Estás seguro de que quieres ${action} a ${user.full_name}?`)) return

  loading.value = true
  try {
    const result = await userService.toggleUserStatus(user.id)
    if (result.success) {
      await loadUsers() // Recargar lista
      alert(`✅ Usuario ${action}do correctamente`)
    } else {
      alert('❌ Error: ' + result.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error inesperado')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (user) => {
  if (!confirm(`¿Estás seguro de que quieres eliminar a ${user.full_name}? Esta acción no se puede deshacer.`)) return

  loading.value = true
  try {
    const result = await userService.deleteUser(user.id)
    if (result.success) {
      await loadUsers() // Recargar lista
      alert('✅ Usuario eliminado correctamente')
    } else {
      alert('❌ Error: ' + result.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('❌ Error inesperado')
  } finally {
    loading.value = false
  }
}

const handleUserCreated = () => {
  showCreateModal.value = false
  loadUsers()
}

const handleUserUpdated = () => {
  showEditModal.value = false
  loadUsers()
}

const handlePasswordChanged = () => {
  showPasswordModal.value = false
}

// Utilidades
const getRoleClass = (role) => {
  const classes = {
    'SUPERADMIN': 'bg-purple-100 text-purple-800',
    'ADMIN': 'bg-blue-100 text-blue-800',
    'USUARIO': 'bg-gray-100 text-gray-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getAvatarGradient = (userId) => {
  const gradients = [
    'avatar-gradient-1',
    'avatar-gradient-2', 
    'avatar-gradient-3',
    'avatar-gradient-4',
    'avatar-gradient-5'
  ]
  return gradients[userId % gradients.length]
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
/* Estilos personalizados */
select option {
  background-color: white;
  color: #374151;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

/* Animaciones suaves para las tarjetas */
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Efectos de botones mejorados */
.action-button {
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: scale(1.05);
}

/* Gradientes para avatares */
.avatar-gradient-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.avatar-gradient-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.avatar-gradient-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.avatar-gradient-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.avatar-gradient-5 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
</style>
