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
          <div v-if="isVisible" class="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
            <!-- Header mejorado con gradiente -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-t-2xl flex-shrink-0">
              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                  <div class="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-white">
                      {{ modalTitle }}
                    </h3>
                    <p class="text-blue-100 text-sm">Completa todos los campos requeridos</p>
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

            <div class="flex-1 overflow-y-auto p-6">
              <!-- Información del reparto compacta -->
              <div class="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl mb-4 border border-gray-200/50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="bg-blue-100 p-2 rounded-lg">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="font-semibold text-gray-800 text-sm">{{ reparto?.idReparto }}</span>
                      <span class="text-xs text-gray-600 ml-2">{{ formatDate(reparto?.fechaReparto) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xs text-gray-600">Diferencia:</span>
                    <span :class="getDifferenceClass(reparto)" class="font-bold text-sm ml-1">
                      {{ formatCurrency(reparto ? reparto.depositoReal - reparto.depositoEsperado : 0) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Formulario mejorado -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
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

                <!-- Sección para múltiples cheques -->
              <div v-if="formData.tipo === 'CHEQUE'" class="mt-6">
                <h4 class="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                  Cheques
                  <button 
                    @click.prevent="agregarCheque" 
                    class="ml-auto bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Agregar
                  </button>
                </h4>
                
                <div v-for="(cheque, index) in formData.cheques" :key="index" class="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-semibold text-gray-800 text-sm">Cheque #{{ index + 1 }}</span>
                    <button 
                      v-if="formData.cheques.length > 1"
                      @click="eliminarCheque(index)" 
                      class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Grid compacto de 3 columnas -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- Número de cuenta -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        N° Cliente
                      </label>
                      <input 
                        v-model="cheque.nrocta" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.nrocta }"
                        placeholder="1234567890"
                      >
                      <p v-if="errors.nrocta" class="error-message text-xs">{{ errors.nrocta }}</p>
                    </div>

                    <!-- Concepto -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Concepto
                      </label>
                      <select
                        v-model="cheque.concepto" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.concepto }"
                      >
                        <option value="">Seleccionar...</option>
                        <option v-for="concepto in CONCEPTOS_CHEQUES" :key="concepto.codigo" :value="concepto.codigo">
                          {{ concepto.codigo }} - {{ concepto.descripcion }}
                        </option>
                      </select>
                      <p v-if="errors.concepto" class="error-message text-xs">{{ errors.concepto }}</p>
                    </div>

                    <!-- Importe -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        Importe
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input 
                          v-model.number="cheque.importe" 
                          type="number" 
                          step="0.01" 
                          required 
                          class="form-input pl-8 text-sm py-2"
                          :class="{ 'border-red-300 bg-red-50': errors.importe }"
                          placeholder="0.00"
                        >
                      </div>
                      <p v-if="errors.importe" class="error-message text-xs">{{ errors.importe }}</p>
                    </div>

                    <!-- Banco -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Banco
                      </label>
                      <input 
                        v-model="cheque.banco" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.banco }"
                        placeholder="Banco Nación"
                      >
                      <p v-if="errors.banco" class="error-message text-xs">{{ errors.banco }}</p>
                    </div>

                    <!-- Sucursal -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        </svg>
                        Sucursal
                      </label>
                      <input 
                        v-model="cheque.sucursal" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.sucursal }"
                        placeholder="Centro"
                      >
                      <p v-if="errors.sucursal" class="error-message text-xs">{{ errors.sucursal }}</p>
                    </div>

                    <!-- Localidad -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Localidad
                      </label>
                      <input 
                        v-model="cheque.localidad" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.localidad }"
                        placeholder="Buenos Aires"
                      >
                      <p v-if="errors.localidad" class="error-message text-xs">{{ errors.localidad }}</p>
                    </div>

                    <!-- Número de cheque -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                        </svg>
                        N° Cheque
                      </label>
                      <input 
                        v-model="cheque.nro_cheque" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.nro_cheque }"
                        placeholder="12345678"
                      >
                      <p v-if="errors.nro_cheque" class="error-message text-xs">{{ errors.nro_cheque }}</p>
                    </div>

                    <!-- Número de cuenta del cheque -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        N° Cuenta
                      </label>
                      <input 
                        v-model="cheque.nro_cuenta" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.nro_cuenta }"
                        placeholder="987654321"
                      >
                      <p v-if="errors.nro_cuenta" class="error-message text-xs">{{ errors.nro_cuenta }}</p>
                    </div>

                    <!-- Fecha -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Fecha
                      </label>
                      <input 
                        v-model="cheque.fecha" 
                        type="date" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.fecha }"
                      >
                      <p v-if="errors.fecha" class="error-message text-xs">{{ errors.fecha }}</p>
                    </div>

                    <!-- Titular - Span completo -->
                    <div class="form-group lg:col-span-2">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Titular
                      </label>
                      <input 
                        v-model="cheque.titular" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.titular }"
                        placeholder="Nombre completo del titular"
                      >
                      <p v-if="errors.titular" class="error-message text-xs">{{ errors.titular }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sección para múltiples retenciones -->
              <div v-if="formData.tipo === 'RETENCION'" class="mt-6">
                <h4 class="font-semibold text-gray-900 text-lg mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Retenciones
                  <button 
                    @click.prevent="agregarRetencion" 
                    class="ml-auto bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Agregar
                  </button>
                </h4>
                
                <div v-for="(retencion, index) in formData.retenciones" :key="index" class="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200">
                  <div class="flex justify-between items-center mb-3">
                    <span class="font-semibold text-gray-800 text-sm">Retención #{{ index + 1 }}</span>
                    <button 
                      v-if="formData.retenciones.length > 1"
                      @click="eliminarRetencion(index)" 
                      class="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <!-- Número de cuenta -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                        </svg>
                        N° Cliente
                      </label>
                      <input 
                        v-model="retencion.nrocta" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.nrocta }"
                        placeholder="1234567890"
                      >
                      <p v-if="errors.nrocta" class="error-message text-xs">{{ errors.nrocta }}</p>
                    </div>

                    <!-- Concepto -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Concepto
                      </label>
                      <select
                        v-model="retencion.concepto" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.concepto }"
                      >
                        <option value="">Seleccionar...</option>
                        <option v-for="concepto in CONCEPTOS_RETENCIONES" :key="concepto.codigo" :value="concepto.codigo">
                          {{ concepto.codigo }} - {{ concepto.descripcion }}
                        </option>
                      </select>
                      <p v-if="errors.concepto" class="error-message text-xs">{{ errors.concepto }}</p>
                    </div>

                    <!-- Número de Retención -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                        </svg>
                        N° Retención
                      </label>
                      <input 
                        v-model="retencion.nro_retencion" 
                        type="text" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.nro_retencion }"
                        placeholder="RET001"
                      >
                      <p v-if="errors.nro_retencion" class="error-message text-xs">{{ errors.nro_retencion }}</p>
                    </div>

                    <!-- Fecha -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Fecha
                      </label>
                      <input 
                        v-model="retencion.fecha" 
                        type="date" 
                        required 
                        class="form-input text-sm py-2"
                        :class="{ 'border-red-300 bg-red-50': errors.fecha }"
                      >
                      <p v-if="errors.fecha" class="error-message text-xs">{{ errors.fecha }}</p>
                    </div>

                    <!-- Importe -->
                    <div class="form-group">
                      <label class="form-label text-xs">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                        Importe
                      </label>
                      <div class="relative">
                        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                        <input 
                          v-model.number="retencion.importe" 
                          type="number" 
                          step="0.01" 
                          required 
                          class="form-input pl-8 text-sm py-2"
                          :class="{ 'border-red-300 bg-red-50': errors.importe }"
                          placeholder="0.00"
                        >
                      </div>
                      <p v-if="errors.importe" class="error-message text-xs">{{ errors.importe }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loading state mejorado -->
              <div v-if="saving" class="flex items-center justify-center py-4">
                <div class="flex items-center space-x-3">
                  <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                  <span class="text-blue-600 font-medium">Guardando cambios...</span>
                </div>
              </div>

              <!-- Botones dentro del formulario -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
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
                  :disabled="props.saving || !isFormValid"
                >
                  <svg v-if="!props.saving" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <div v-if="props.saving" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  {{ buttonText }}
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

// Conceptos predefinidos para cheques
const CONCEPTOS_CHEQUES = [
  { codigo: 'CHE', descripcion: 'CHEQUE COMUN' },
  { codigo: 'CNO', descripcion: 'CHEQUE NO A LA ORDEN' },
  { codigo: 'CTJ', descripcion: 'BCO CIUDAD CTAS JUDICIALES' },
  { codigo: 'DBF', descripcion: 'BCO. FRANCES 1382/2' },
  { codigo: 'DF2', descripcion: 'BBVA 0579/9 (JUMI)' },
  { codigo: 'DF3', descripcion: 'NACION 3275/1 (JUMI)' },
  { codigo: 'DF5', descripcion: 'SUPERVIELLE 5121/2 (LUFRAN)' },
  { codigo: 'ECH', descripcion: 'E-CHECK' },
  { codigo: 'EF2', descripcion: 'EFECTIVO CAJA 02' },
  { codigo: 'EFE', descripcion: 'EFECTIVO' },
  { codigo: 'GRP', descripcion: 'GROUPON' },
  { codigo: 'PMC', descripcion: 'PAGOMISCUENTAS' }
]

// Conceptos predefinidos para retenciones
const CONCEPTOS_RETENCIONES = [
  { codigo: 'RCI', descripcion: 'RETENCION TISH CIUDA.' },
  { codigo: 'RGA', descripcion: 'RETENCION GANANCIAS' },
  { codigo: 'RIB', descripcion: 'RETENCION IIBB BS.AS' },
  { codigo: 'RIC', descripcion: 'RETENCION IIBB CABA' },
  { codigo: 'RIV', descripcion: 'RETENCION DE IVA' },
  { codigo: 'RLP', descripcion: 'RETENCION TISH LP' },
  { codigo: 'RMI', descripcion: 'RETENCIONES IB MISIONES' },
  { codigo: 'RSU', descripcion: 'RETENCION SUSS' },
  { codigo: 'CTJ', descripcion: 'BCO CIUDAD CTAS JUDICIALES' },
  { codigo: 'DBF', descripcion: 'BCO. FRANCES 1382/2' },
  { codigo: 'DF2', descripcion: 'BBVA 0579/9 (JUMI)' },
  { codigo: 'DF3', descripcion: 'NACION 3275/1 (JUMI)' },
  { codigo: 'DF5', descripcion: 'SUPERVIELLE 5121/2 (LUFRAN)' },
  { codigo: 'ECH', descripcion: 'E-CHECK' },
  { codigo: 'EF2', descripcion: 'EFECTIVO CAJA 02' },
  { codigo: 'EFE', descripcion: 'EFECTIVO' },
  { codigo: 'GRP', descripcion: 'GROUPON' },
  { codigo: 'PMC', descripcion: 'PAGOMISCUENTAS' },
  { codigo: 'CHC', descripcion: 'RETENCION TISH CIUDA' }
]

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
  },
  movimientoTipo: {
    type: String,
    default: null,
    validator: (value) => !value || ['CHEQUE', 'RETENCION', 'cheque', 'retencion'].includes(value)
  },
  movimientoData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// Computed property para detectar si estamos editando
const isEditing = computed(() => {
  return props.movimientoData && Object.keys(props.movimientoData).length > 0
})

// Computed property para el título del modal
const modalTitle = computed(() => {
  const action = isEditing.value ? 'Editar' : 'Nuevo'
  const type = formData.value.tipo === 'CHEQUE' ? 'Cheque' : 
               formData.value.tipo === 'RETENCION' ? 'Retención' : 
               'Movimiento Financiero'
  return formData.value.tipo ? `${action} ${type}` : 'Movimiento Financiero'
})

// Computed property para el texto del botón
const buttonText = computed(() => {
  if (props.saving) return 'Guardando...'
  return isEditing.value ? 'Actualizar Cambios' : 'Guardar Cambios'
})

// Funciones para obtener descripción de conceptos
const getConceptoDescripcion = (codigo, esCheque = true) => {
  const conceptos = esCheque ? CONCEPTOS_CHEQUES : CONCEPTOS_RETENCIONES
  const concepto = conceptos.find(c => c.codigo === codigo)
  return concepto ? `${codigo} - ${concepto.descripcion}` : codigo
}

const getConceptoCodigo = (codigoCompleto) => {
  // Extraer solo el código antes del " - "
  return codigoCompleto ? codigoCompleto.split(' - ')[0] : ''
}

const formData = ref({
  tipo: '',
  // Arrays para múltiples cheques y retenciones
  cheques: [],
  retenciones: []
})

const errors = ref({})

// Función para limpiar campos según el tipo
const onTipoChange = () => {
  // Limpiar errores del tipo anterior
  clearSpecificErrors()
  
  // Inicializar arrays según el tipo
  if (formData.value.tipo === 'RETENCION') {
    // Inicializar con una retención vacía
    formData.value.retenciones = [crearRetencionVacia()]
    formData.value.cheques = []
    
    // Configurar concepto por defecto (usar código, no descripción)
    if (!formData.value.concepto) {
      formData.value.concepto = 'RGA' // RETENCION GANANCIAS como defecto
    }
  } else if (formData.value.tipo === 'CHEQUE') {
    // Inicializar con un cheque vacío
    formData.value.cheques = [crearChequeVacio()]
    formData.value.retenciones = []
    
    // Configurar concepto por defecto (usar código, no descripción)
    if (!formData.value.concepto) {
      formData.value.concepto = 'CHE' // CHEQUE COMUN como defecto
    }
  }
}

const clearSpecificErrors = () => {
  // Limpiar todos los errores excepto el tipo
  Object.keys(errors.value).forEach(key => {
    if (key !== 'tipo') {
      delete errors.value[key]
    }
  })
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
  }
}

// Validar formulario completo
const isFormValid = computed(() => {
  const hasBasicErrors = Object.keys(errors.value).length === 0
  
  // Validar arrays según el tipo
  if (formData.value.tipo === 'RETENCION') {
    const retencionesValidas = formData.value.retenciones.every(retencion => 
      retencion.nrocta && 
      retencion.concepto && 
      retencion.nro_retencion && 
      retencion.fecha && 
      retencion.importe > 0
    )
    return hasBasicErrors && formData.value.tipo && retencionesValidas && formData.value.retenciones.length > 0
  } else if (formData.value.tipo === 'CHEQUE') {
    const chequesValidos = formData.value.cheques.every(cheque => 
      cheque.nrocta && 
      cheque.concepto && 
      cheque.banco && 
      cheque.sucursal && 
      cheque.localidad && 
      cheque.nro_cheque && 
      cheque.nro_cuenta && 
      cheque.titular && 
      cheque.fecha && 
      cheque.importe > 0
    )
    return hasBasicErrors && formData.value.tipo && chequesValidos && formData.value.cheques.length > 0
  }
  
  return hasBasicErrors && formData.value.tipo
})

// Función para obtener la clase CSS de la diferencia
const getDifferenceClass = (reparto) => {
  if (!reparto) return 'text-gray-600'
  const difference = reparto.depositoReal - reparto.depositoEsperado
  if (difference > 0) return 'text-green-600'
  if (difference < 0) return 'text-red-600'
  return 'text-gray-600'
}

// Funciones para manejar múltiples cheques/retenciones
const agregarCheque = () => {
  formData.value.cheques.push(crearChequeVacio())
}

const eliminarCheque = (index) => {
  if (formData.value.cheques.length > 1) {
    formData.value.cheques.splice(index, 1)
  }
}

const agregarRetencion = () => {
  formData.value.retenciones.push(crearRetencionVacia())
}

const eliminarRetencion = (index) => {
  if (formData.value.retenciones.length > 1) {
    formData.value.retenciones.splice(index, 1)
  }
}

// Watchers para validación en tiempo real
watch(() => formData.value.tipo, (newVal) => validateField('tipo', newVal))

// Llenar formulario cuando se abre el modal
watch(() => props.movimientoData, (newData) => {
  if (newData) {
    // Editando un movimiento existente
    console.log('🔄 Cargando datos existentes:', newData)
    
    formData.value = {
      tipo: newData.tipo || '',
      cheques: [],
      retenciones: []
    }
    
    if (newData.tipo === 'CHEQUE') {
      formData.value.cheques = [{
        id: newData.id || newData.cheque_id, // PRESERVAR ID DEL BACKEND
        nrocta: newData.nrocta || '',
        concepto: newData.concepto || '',
        banco: newData.banco || '',
        sucursal: newData.sucursal || '',
        localidad: newData.localidad || '',
        nro_cheque: newData.nro_cheque || '',
        nro_cuenta: newData.nro_cuenta || '',
        titular: newData.titular || '',
        fecha: newData.fecha || '',
        importe: newData.importe || 0
      }]
    } else if (newData.tipo === 'RETENCION') {
      formData.value.retenciones = [{
        id: newData.id || newData.retencion_id, // PRESERVAR ID DEL BACKEND
        nrocta: newData.nrocta || '',
        concepto: newData.concepto || '',
        nro_retencion: newData.nro_retencion || '',
        fecha: newData.fecha || '',
        importe: newData.importe || 0
      }]
    }
  } else if (props.reparto && !props.movimientoData) {
    // Creando un nuevo movimiento
    formData.value = {
      tipo: '',
      cheques: [],
      retenciones: []
    }
  }
  // Limpiar errores cuando se abre el modal
  errors.value = {}
}, { immediate: true })

// Watcher para movimientoTipo - aplicar tipo inicial
watch(() => props.movimientoTipo, (nuevoTipo) => {
  console.log('🎯 MovimientoTipo recibido:', nuevoTipo)
  if (nuevoTipo && props.reparto && !props.movimientoData) {
    // Solo aplicar si estamos creando un nuevo movimiento (no editando)
    const tipoFinal = nuevoTipo.toUpperCase()
    if (['CHEQUE', 'RETENCION'].includes(tipoFinal)) {
      console.log('🎯 Aplicando tipo inicial:', tipoFinal)
      formData.value.tipo = tipoFinal
      
      // Inicializar arrays según el tipo
      if (tipoFinal === 'CHEQUE') {
        formData.value.cheques = [crearChequeVacio()]
        formData.value.retenciones = []
      } else if (tipoFinal === 'RETENCION') {
        formData.value.retenciones = [crearRetencionVacia()]
        formData.value.cheques = []
      }
      
      validateField('tipo', tipoFinal)
    }
  }
}, { immediate: true })

// Funciones auxiliares para crear elementos vacíos
const crearChequeVacio = () => {
  // Intentar obtener nrocta del reparto o de sus depósitos
  let nrocta = ''
  if (props.reparto) {
    // Intentar obtener de diferentes ubicaciones en el reparto
    nrocta = props.reparto.nrocta || 
            (props.reparto.deposits && props.reparto.deposits[0] && props.reparto.deposits[0].nrocta) ||
            ''
  }
  
  return {
    nrocta: nrocta,
    concepto: 'CHE', // CHEQUE COMUN como defecto
    banco: '',
    sucursal: '',
    localidad: '',
    nro_cheque: '',
    nro_cuenta: '',
    titular: '',
    fecha: new Date().toISOString().split('T')[0],
    importe: 0
  }
}

const crearRetencionVacia = () => {
  // Intentar obtener nrocta del reparto o de sus depósitos
  let nrocta = ''
  if (props.reparto) {
    // Intentar obtener de diferentes ubicaciones en el reparto
    nrocta = props.reparto.nrocta || 
            (props.reparto.deposits && props.reparto.deposits[0] && props.reparto.deposits[0].nrocta) ||
            ''
  }
  
  return {
    nrocta: nrocta,
    concepto: 'RGA', // RETENCION GANANCIAS como defecto
    nro_retencion: '',
    fecha: new Date().toISOString().split('T')[0],
    importe: 0
  }
}

const handleSubmit = () => {
  console.log('🚀 [MODAL] ============ INICIANDO SUBMIT ============')
  console.log('🚀 [MODAL] formData.value:', formData.value)
  console.log('🚀 [MODAL] props.reparto:', props.reparto)
  
  // Validar todos los campos de todos los elementos del array
  let allValid = true
  
  if (formData.value.tipo === 'CHEQUE') {
    console.log('🔍 [MODAL] Validando CHEQUES, cantidad:', formData.value.cheques.length)
    formData.value.cheques.forEach((cheque, index) => {
      console.log(`🔍 [MODAL] Validando cheque ${index + 1}:`, cheque)
      if (!cheque.nrocta || !cheque.concepto || !cheque.banco || 
          !cheque.sucursal || !cheque.localidad || !cheque.nro_cheque || 
          !cheque.nro_cuenta || !cheque.titular || !cheque.fecha || !cheque.importe) {
        allValid = false
        console.error(`❌ Cheque ${index + 1} tiene campos incompletos`)
      }
    })
  } else if (formData.value.tipo === 'RETENCION') {
    console.log('🔍 [MODAL] Validando RETENCIONES, cantidad:', formData.value.retenciones.length)
    formData.value.retenciones.forEach((retencion, index) => {
      console.log(`🔍 [MODAL] Validando retención ${index + 1}:`, retencion)
      if (!retencion.nrocta || !retencion.concepto || !retencion.nro_retencion || 
          !retencion.fecha || !retencion.importe) {
        allValid = false
        console.error(`❌ Retención ${index + 1} tiene campos incompletos`)
      }
    })
  }
  
  console.log('🔍 [MODAL] Resultado de validación allValid:', allValid)
  
  if (allValid) {
    // Obtener deposit_id del reparto (usando la misma lógica que RepartoRow)
    const depositId = getDepositId(props.reparto)
    console.log('🏗️ [MODAL] deposit_id obtenido:', depositId)
    
    if (!depositId) {
      console.error('❌ [MODAL] No se pudo obtener deposit_id del reparto')
      alert('Error: No se pudo identificar el reparto. Por favor, intenta de nuevo.')
      return
    }
    
    // Crear estructura EXACTA que espera tu backend
    const movimientoData = {
      tipo_concepto: formData.value.tipo === 'CHEQUE' ? 'CHE' : 'RIB',
      deposit_id: depositId
    }
    
    console.log('🏗️ [MODAL] Estructura base creada:', movimientoData)
    
    if (formData.value.tipo === 'CHEQUE') {
      // Enviar array de cheques según la estructura esperada por el backend
      movimientoData.cheques = formData.value.cheques.map(cheque => ({
        nrocta: parseInt(cheque.nrocta),
        concepto: cheque.concepto,
        banco: cheque.banco,
        sucursal: cheque.sucursal,
        localidad: cheque.localidad,
        nro_cheque: cheque.nro_cheque,
        nro_cuenta: parseInt(cheque.nro_cuenta),
        titular: cheque.titular,
        fecha: cheque.fecha,
        importe: parseFloat(cheque.importe)
      }))
    } else if (formData.value.tipo === 'RETENCION') {
      // Enviar array de retenciones según la estructura esperada por el backend
      movimientoData.retenciones = formData.value.retenciones.map(retencion => ({
        nrocta: parseInt(retencion.nrocta),
        concepto: retencion.concepto,
        nro_retencion: parseInt(retencion.nro_retencion),
        fecha: retencion.fecha,
        importe: parseFloat(retencion.importe)
      }))
    }
    
    console.log('📤 Enviando al backend (estructura exacta esperada):', movimientoData)
    console.log('�️ Estructura del payload:', {
      tipo_concepto: movimientoData.tipo_concepto,
      deposit_id: movimientoData.deposit_id,
      cheques_count: movimientoData.cheques?.length || 0,
      retenciones_count: movimientoData.retenciones?.length || 0
    })
    console.log('📤 [MODAL] A punto de emitir evento save...')
    emit('save', movimientoData)
    console.log('✅ [MODAL] Evento save emitido correctamente')
  } else {
    console.error('❌ [MODAL] Validación falló, no se puede enviar')
  }
}

// Función para obtener el deposit_id del reparto (misma lógica que RepartoRow)
const getDepositId = (reparto) => {
  if (!reparto) {
    console.warn('❌ [EditModal] Reparto no definido para obtener deposit_id')
    return null
  }
  
  // CASO 1: El objeto ES directamente un depósito (estructura real de la API)
  if (reparto.deposit_id) {
    console.log(`✅ [EditModal] Usando deposit_id: ${reparto.deposit_id}`)
    return reparto.deposit_id
  }
  
  // CASO 2: Estructura anidada - usar deposits[0].deposit_id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].deposit_id) {
    console.log(`✅ [EditModal] Usando deposits[0].deposit_id: ${reparto.deposits[0].deposit_id}`)
    return reparto.deposits[0].deposit_id
  }
  
  // CASO 3: Fallback - usar deposits[0].id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].id) {
    console.log(`⚠️ [EditModal] Fallback deposits[0].id: ${reparto.deposits[0].id}`)
    return reparto.deposits[0].id
  }
  
  // CASO 4: Fallback final - usar el ID del reparto
  console.warn(`❌ [EditModal] Fallback reparto.id: ${reparto.id} - Puede fallar`)
  return reparto.id
}
</script>

<style scoped>
/* Formulario más compacto */
.form-group {
  position: relative;
  margin-bottom: 0.75rem; /* Reducido de 1rem */
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px; /* Reducido de 8px */
  font-size: 12px; /* Reducido de 14px */
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px; /* Reducido de 6px */
}

.form-input {
  width: 100%;
  padding: 8px 12px; /* Reducido de 12px 16px */
  border: 2px solid #e5e7eb;
  border-radius: 8px; /* Reducido de 12px */
  font-size: 13px; /* Reducido de 14px */
  transition: all 0.2s ease;
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); /* Reducido de 3px a 2px */
  transform: translateY(-0.5px); /* Reducido de -1px */
}

.form-input:hover {
  border-color: #d1d5db;
}

.form-input::placeholder {
  color: #9ca3af;
  font-size: 12px;
}

/* Estados de error */
.form-input.border-red-300 {
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.error-message {
  color: #dc2626;
  font-size: 11px; /* Reducido de 12px */
  margin-top: 2px; /* Reducido de 4px */
  display: flex;
  align-items: center;
  gap: 3px; /* Reducido de 4px */
}

.error-message::before {
  content: "⚠️";
  font-size: 9px; /* Reducido de 10px */
}

/* Botones más compactos */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px; /* Reducido de 12px 24px */
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-weight: 600;
  font-size: 13px; /* Reducido de 14px */
  border: none;
  border-radius: 10px; /* Reducido de 12px */
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 5px rgba(59, 130, 246, 0.25); /* Reducido */
  min-width: 120px; /* Reducido de 140px */
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
  transform: translateY(-0.5px); /* Reducido de -1px */
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.35); /* Reducido */
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 3px rgba(59, 130, 246, 0.15); /* Reducido */
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px; /* Reducido de 12px 24px */
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  font-size: 13px; /* Reducido de 14px */
  border: 2px solid #e5e7eb;
  border-radius: 10px; /* Reducido de 12px */
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 90px; /* Reducido de 100px */
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-0.5px); /* Reducido de -1px */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Reducido */
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Animaciones más sutiles */
@keyframes slideInUp {
  from {
    transform: translateY(15px); /* Reducido de 20px */
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
  animation: slideInUp 0.2s ease-out; /* Reducido de 0.3s */
}

.form-group:nth-child(1) { animation-delay: 0.05s; }
.form-group:nth-child(2) { animation-delay: 0.1s; }
.form-group:nth-child(3) { animation-delay: 0.15s; }
.form-group:nth-child(4) { animation-delay: 0.2s; }
.form-group:nth-child(5) { animation-delay: 0.25s; }

/* Select más compacto */
select.form-input {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 10px center; /* Reducido de 12px */
  background-repeat: no-repeat;
  background-size: 14px; /* Reducido de 16px */
  padding-right: 35px; /* Reducido de 40px */
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
    padding: 8px 16px; /* Más compacto en móvil */
  }
  
  .form-input {
    padding: 8px 12px;
    font-size: 16px; /* Evita zoom en iOS */
  }
  
  .form-label {
    font-size: 11px;
  }
}

/* Loading spinner */
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

/* Hover effects para los iconos más suaves */
.form-label svg {
  transition: transform 0.15s ease; /* Reducido de 0.2s */
}

.form-group:hover .form-label svg {
  transform: scale(1.05); /* Reducido de 1.1 */
}

/* Espacios más compactos */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-3 > * + * {
  margin-top: 0.75rem;
}

/* Grid gaps más pequeños */
.gap-3 {
  gap: 0.75rem;
}
</style>
