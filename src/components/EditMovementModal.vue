<template>
  <!-- Modal mejorado con backdrop blur y animaciones -->
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isVisible" class="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div v-if="isVisible" class="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-lg mx-auto">
            <!-- Header mejorado con gradiente -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white">
                      Movimiento Financiero
                    </h3>
                    <p class="text-blue-100 text-sm">Editar detalles del movimiento</p>
                  </div>
                </div>
                <button 
                  @click="$emit('close')" 
                  class="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-6">
              <!-- Información del reparto mejorada -->
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl mb-6 border border-gray-200/50">
                <div class="flex items-center space-x-3 mb-3">
                  <div class="bg-blue-100 p-2 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-lg">{{ reparto?.idReparto }}</h4>
                    <p class="text-sm text-gray-600">{{ formatDate(reparto?.fechaReparto) }}</p>
                  </div>
                </div>
                <div class="bg-white p-3 rounded-lg border border-gray-200/50">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600">Diferencia:</span>
                    <span :class="getDifferenceClass(reparto)" class="font-bold text-lg">
                      {{ formatCurrency(reparto ? reparto.depositoReal - reparto.depositoEsperado : 0) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Formulario mejorado -->
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Tipo de movimiento con icono -->
                <div class="form-group">
                  <label class="form-label">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Tipo de Movimiento
                  </label>
                  <select 
                    v-model="formData.tipo" 
                    required 
                    class="form-input"
                    :class="{ 'border-red-300 bg-red-50': errors.tipo }"
                    @change="onTipoChange"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="RETENCION">⚠️ RETENCIÓN</option>
                    <option value="CHEQUE">📄 CHEQUE</option>
                  </select>
                  <p v-if="errors.tipo" class="error-message">{{ errors.tipo }}</p>
                </div>

                <!-- Campos comunes -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Número de cuenta -->
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      Número de Cliente
                    </label>
                    <input 
                      v-model="formData.nrocta" 
                      type="text" 
                      required 
                      class="form-input"
                      :class="{ 'border-red-300 bg-red-50': errors.nrocta }"
                      placeholder="Ej: 1234567890"
                    >
                    <p v-if="errors.nrocta" class="error-message">{{ errors.nrocta }}</p>
                  </div>

                  <!-- Concepto -->
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      Concepto
                    </label>
                    <input 
                      v-model="formData.concepto" 
                      type="text" 
                      required 
                      class="form-input"
                      :class="{ 'border-red-300 bg-red-50': errors.concepto }"
                      placeholder="Descripción del movimiento"
                    >
                    <p v-if="errors.concepto" class="error-message">{{ errors.concepto }}</p>
                  </div>
                </div>

                <!-- Campos específicos para RETENCIÓN -->
                <div v-if="formData.tipo === 'RETENCION'" class="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <h5 class="font-semibold text-orange-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    Datos de Retención
                  </h5>
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                      </svg>
                      Número de Retención
                    </label>
                    <input 
                      v-model="formData.nro_retencion" 
                      type="text" 
                      required 
                      class="form-input"
                      :class="{ 'border-red-300 bg-red-50': errors.nro_retencion }"
                      placeholder="Ej: RET001"
                    >
                    <p v-if="errors.nro_retencion" class="error-message">{{ errors.nro_retencion }}</p>
                  </div>
                </div>

                <!-- Campos específicos para CHEQUE -->
                <div v-if="formData.tipo === 'CHEQUE'" class="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h5 class="font-semibold text-blue-800 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Datos del Cheque
                  </h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Banco -->
                    <div class="form-group">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Banco
                      </label>
                      <input 
                        v-model="formData.banco" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.banco }"
                        placeholder="Ej: Banco Nación"
                      >
                      <p v-if="errors.banco" class="error-message">{{ errors.banco }}</p>
                    </div>

                    <!-- Sucursal -->
                    <div class="form-group">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Sucursal
                      </label>
                      <input 
                        v-model="formData.sucursal" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.sucursal }"
                        placeholder="Ej: Centro"
                      >
                      <p v-if="errors.sucursal" class="error-message">{{ errors.sucursal }}</p>
                    </div>

                    <!-- Localidad -->
                    <div class="form-group">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Localidad
                      </label>
                      <input 
                        v-model="formData.localidad" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.localidad }"
                        placeholder="Ej: Buenos Aires"
                      >
                      <p v-if="errors.localidad" class="error-message">{{ errors.localidad }}</p>
                    </div>

                    <!-- Número de cheque -->
                    <div class="form-group">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                        </svg>
                        Número de Cheque
                      </label>
                      <input 
                        v-model="formData.nro_cheque" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.nro_cheque }"
                        placeholder="Ej: 12345678"
                      >
                      <p v-if="errors.nro_cheque" class="error-message">{{ errors.nro_cheque }}</p>
                    </div>

                    <!-- Número de cuenta del cheque -->
                    <div class="form-group">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        Cuenta del Cheque
                      </label>
                      <input 
                        v-model="formData.nro_cuenta" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.nro_cuenta }"
                        placeholder="Ej: 987654321"
                      >
                      <p v-if="errors.nro_cuenta" class="error-message">{{ errors.nro_cuenta }}</p>
                    </div>

                    <!-- Titular -->
                    <div class="form-group md:col-span-2">
                      <label class="form-label">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Titular
                      </label>
                      <input 
                        v-model="formData.titular" 
                        type="text" 
                        required 
                        class="form-input"
                        :class="{ 'border-red-300 bg-red-50': errors.titular }"
                        placeholder="Nombre completo del titular"
                      >
                      <p v-if="errors.titular" class="error-message">{{ errors.titular }}</p>
                    </div>
                  </div>
                </div>

                <!-- Campos comunes al final -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Fecha -->
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Fecha
                    </label>
                    <input 
                      v-model="formData.fecha" 
                      type="date" 
                      required 
                      class="form-input"
                      :class="{ 'border-red-300 bg-red-50': errors.fecha }"
                    >
                    <p v-if="errors.fecha" class="error-message">{{ errors.fecha }}</p>
                  </div>

                  <!-- Importe -->
                  <div class="form-group">
                    <label class="form-label">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      Importe
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input 
                        v-model.number="formData.importe" 
                        type="number" 
                        step="0.01" 
                        required 
                        class="form-input pl-8"
                        :class="{ 'border-red-300 bg-red-50': errors.importe }"
                        placeholder="0.00"
                      >
                    </div>
                    <p v-if="errors.importe" class="error-message">{{ errors.importe }}</p>
                  </div>
                </div>

                <!-- Loading state mejorado -->
                <div v-if="saving" class="flex items-center justify-center py-4">
                  <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span class="text-blue-600 font-medium">Guardando cambios...</span>
                  </div>
                </div>

                <!-- Botones mejorados -->
                <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button 
                    type="button" 
                    @click="$emit('close')"
                    class="btn-secondary"
                    :disabled="saving"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    class="btn-primary"
                    :disabled="saving || !isFormValid"
                  >
                    <svg v-if="!saving" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { formatDate, formatCurrency } from '../utils/formatters.js'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  reparto: {
    type: Object,
    default: null
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  tipo: '',
  nrocta: '',
  concepto: '',
  fecha: '',
  importe: 0,
  // Campos específicos para RETENCION
  nro_retencion: '',
  // Campos específicos para CHEQUE  
  banco: '',
  sucursal: '',
  localidad: '',
  nro_cheque: '',
  nro_cuenta: '',
  titular: ''
})

const errors = ref({})

// Función para limpiar campos según el tipo
const onTipoChange = () => {
  // Limpiar errores del tipo anterior
  clearSpecificErrors()
  
  // Limpiar campos específicos según el tipo
  if (formData.value.tipo === 'RETENCION') {
    // Limpiar campos de cheque
    formData.value.banco = ''
    formData.value.sucursal = ''
    formData.value.localidad = ''
    formData.value.nro_cheque = ''
    formData.value.nro_cuenta = ''
    formData.value.titular = ''
    
    // Configurar concepto por defecto
    if (!formData.value.concepto) {
      formData.value.concepto = 'Retención'
    }
  } else if (formData.value.tipo === 'CHEQUE') {
    // Limpiar campos de retención
    formData.value.nro_retencion = ''
    
    // Configurar concepto por defecto
    if (!formData.value.concepto) {
      formData.value.concepto = 'Pago con cheque'
    }
  }
}

const clearSpecificErrors = () => {
  // Limpiar errores de campos específicos
  delete errors.value.nro_retencion
  delete errors.value.banco
  delete errors.value.sucursal
  delete errors.value.localidad
  delete errors.value.nro_cheque
  delete errors.value.nro_cuenta
  delete errors.value.titular
}

// Validación en tiempo real
const validateField = (field, value) => {
  errors.value = { ...errors.value }
  
  switch (field) {
    case 'tipo':
      if (!value) {
        errors.value.tipo = 'Debe seleccionar un tipo de movimiento'
      } else {
        delete errors.value.tipo
      }
      break
    case 'nrocta':
      if (!value || value.length < 4) {
        errors.value.nrocta = 'El número de cuenta debe tener al menos 4 caracteres'
      } else {
        delete errors.value.nrocta
      }
      break
    case 'concepto':
      if (!value || value.length < 3) {
        errors.value.concepto = 'El concepto debe tener al menos 3 caracteres'
      } else {
        delete errors.value.concepto
      }
      break
    case 'fecha':
      if (!value) {
        errors.value.fecha = 'La fecha es requerida'
      } else {
        delete errors.value.fecha
      }
      break
    case 'importe':
      if (!value || value <= 0) {
        errors.value.importe = 'El importe debe ser mayor a 0'
      } else {
        delete errors.value.importe
      }
      break
    // Campos específicos para RETENCION
    case 'nro_retencion':
      if (formData.value.tipo === 'RETENCION') {
        if (!value || value.length < 3) {
          errors.value.nro_retencion = 'El número de retención debe tener al menos 3 caracteres'
        } else {
          delete errors.value.nro_retencion
        }
      }
      break
    // Campos específicos para CHEQUE
    case 'banco':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 3) {
          errors.value.banco = 'El banco debe tener al menos 3 caracteres'
        } else {
          delete errors.value.banco
        }
      }
      break
    case 'sucursal':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 2) {
          errors.value.sucursal = 'La sucursal debe tener al menos 2 caracteres'
        } else {
          delete errors.value.sucursal
        }
      }
      break
    case 'localidad':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 2) {
          errors.value.localidad = 'La localidad debe tener al menos 2 caracteres'
        } else {
          delete errors.value.localidad
        }
      }
      break
    case 'nro_cheque':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 4) {
          errors.value.nro_cheque = 'El número de cheque debe tener al menos 4 caracteres'
        } else {
          delete errors.value.nro_cheque
        }
      }
      break
    case 'nro_cuenta':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 6) {
          errors.value.nro_cuenta = 'El número de cuenta debe tener al menos 6 caracteres'
        } else {
          delete errors.value.nro_cuenta
        }
      }
      break
    case 'titular':
      if (formData.value.tipo === 'CHEQUE') {
        if (!value || value.length < 3) {
          errors.value.titular = 'El titular debe tener al menos 3 caracteres'
        } else {
          delete errors.value.titular
        }
      }
      break
  }
}

// Validar formulario completo
const isFormValid = computed(() => {
  const hasBasicErrors = Object.keys(errors.value).length === 0
  const hasBasicFields = formData.value.tipo && 
                        formData.value.nrocta && 
                        formData.value.concepto && 
                        formData.value.fecha && 
                        formData.value.importe > 0

  // Validar campos específicos según el tipo
  if (formData.value.tipo === 'RETENCION') {
    return hasBasicErrors && hasBasicFields && formData.value.nro_retencion
  } else if (formData.value.tipo === 'CHEQUE') {
    return hasBasicErrors && hasBasicFields && 
           formData.value.banco && 
           formData.value.sucursal && 
           formData.value.localidad && 
           formData.value.nro_cheque && 
           formData.value.nro_cuenta && 
           formData.value.titular
  }
  
  return hasBasicErrors && hasBasicFields
})

// Función para obtener la clase CSS de la diferencia
const getDifferenceClass = (reparto) => {
  if (!reparto) return 'text-gray-600'
  const difference = reparto.depositoReal - reparto.depositoEsperado
  if (difference > 0) return 'text-green-600'
  if (difference < 0) return 'text-red-600'
  return 'text-gray-600'
}

// Watchers para validación en tiempo real
watch(() => formData.value.tipo, (newVal) => validateField('tipo', newVal))
watch(() => formData.value.nrocta, (newVal) => validateField('nrocta', newVal))
watch(() => formData.value.concepto, (newVal) => validateField('concepto', newVal))
watch(() => formData.value.fecha, (newVal) => validateField('fecha', newVal))
watch(() => formData.value.importe, (newVal) => validateField('importe', newVal))
// Watchers para campos específicos
watch(() => formData.value.nro_retencion, (newVal) => validateField('nro_retencion', newVal))
watch(() => formData.value.banco, (newVal) => validateField('banco', newVal))
watch(() => formData.value.sucursal, (newVal) => validateField('sucursal', newVal))
watch(() => formData.value.localidad, (newVal) => validateField('localidad', newVal))
watch(() => formData.value.nro_cheque, (newVal) => validateField('nro_cheque', newVal))
watch(() => formData.value.nro_cuenta, (newVal) => validateField('nro_cuenta', newVal))
watch(() => formData.value.titular, (newVal) => validateField('titular', newVal))

// Llenar formulario cuando se abre el modal
watch(() => props.reparto, (newReparto) => {
  if (newReparto && newReparto.movimientoFinanciero) {
    // Editando un movimiento existente
    const mov = newReparto.movimientoFinanciero
    formData.value = {
      tipo: mov.tipo || '',
      nrocta: mov.nrocta || '',
      concepto: mov.concepto || '',
      fecha: mov.fecha || '',
      importe: mov.importe || 0,
      // Campos específicos para RETENCION
      nro_retencion: mov.nro_retencion || '',
      // Campos específicos para CHEQUE
      banco: mov.banco || '',
      sucursal: mov.sucursal || '',
      localidad: mov.localidad || '',
      nro_cheque: mov.nro_cheque || '',
      nro_cuenta: mov.nro_cuenta || '',
      titular: mov.titular || ''
    }
  } else if (newReparto) {
    // Creando un nuevo movimiento
    const diferencia = Math.abs(newReparto.depositoReal - newReparto.depositoEsperado)
    formData.value = {
      tipo: '',
      nrocta: '',
      concepto: '',
      fecha: new Date().toISOString().split('T')[0],
      importe: diferencia > 0 ? diferencia : 0,
      // Campos específicos para RETENCION
      nro_retencion: '',
      // Campos específicos para CHEQUE
      banco: '',
      sucursal: '',
      localidad: '',
      nro_cheque: '',
      nro_cuenta: '',
      titular: ''
    }
  }
  // Limpiar errores cuando se abre el modal
  errors.value = {}
}, { immediate: true })

const handleSubmit = () => {
  // Validar todos los campos básicos
  validateField('tipo', formData.value.tipo)
  validateField('nrocta', formData.value.nrocta)
  validateField('concepto', formData.value.concepto)
  validateField('fecha', formData.value.fecha)
  validateField('importe', formData.value.importe)
  
  // Validar campos específicos según el tipo
  if (formData.value.tipo === 'RETENCION') {
    validateField('nro_retencion', formData.value.nro_retencion)
  } else if (formData.value.tipo === 'CHEQUE') {
    validateField('banco', formData.value.banco)
    validateField('sucursal', formData.value.sucursal)
    validateField('localidad', formData.value.localidad)
    validateField('nro_cheque', formData.value.nro_cheque)
    validateField('nro_cuenta', formData.value.nro_cuenta)
    validateField('titular', formData.value.titular)
  }
  
  if (isFormValid.value) {
    // Crear objeto con solo los campos necesarios según el tipo
    const movimientoData = {
      tipo: formData.value.tipo,
      nrocta: formData.value.nrocta,
      concepto: formData.value.concepto,
      fecha: formData.value.fecha,
      importe: formData.value.importe
    }
    
    // Añadir campos específicos según el tipo
    if (formData.value.tipo === 'RETENCION') {
      movimientoData.nro_retencion = formData.value.nro_retencion
    } else if (formData.value.tipo === 'CHEQUE') {
      movimientoData.banco = formData.value.banco
      movimientoData.sucursal = formData.value.sucursal
      movimientoData.localidad = formData.value.localidad
      movimientoData.nro_cheque = formData.value.nro_cheque
      movimientoData.nro_cuenta = formData.value.nro_cuenta
      movimientoData.titular = formData.value.titular
    }
    
    emit('save', movimientoData)
  }
}
</script>

<style scoped>
/* Formulario mejorado */
.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Estados de error */
.form-input.border-red-300 {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.error-message {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message::before {
  content: "⚠️";
  font-size: 10px;
}

/* Botones mejorados */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
  min-width: 140px;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.15);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Animaciones personalizadas */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.form-group {
  animation: slideInUp 0.3s ease-out;
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }
.form-group:nth-child(4) { animation-delay: 0.4s; }
.form-group:nth-child(5) { animation-delay: 0.5s; }

/* Mejoras para select */
select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
  appearance: none;
}

/* Efectos de glassmorphism */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .btn-primary, .btn-secondary {
    flex: 1;
    min-width: auto;
  }
  
  .form-input {
    padding: 10px 14px;
    font-size: 16px; /* Evita zoom en iOS */
  }
}

/* Loading spinner mejorado */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects para los iconos */
.form-label svg {
  transition: transform 0.2s ease;
}

.form-group:hover .form-label svg {
  transform: scale(1.1);
}
</style>
