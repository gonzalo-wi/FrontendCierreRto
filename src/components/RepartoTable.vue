<template>
  <div class="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-slate-200/60 relative">
    <!-- Efectos decorativos de fondo -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30"></div>
    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
    
    <!-- Header de la tabla ultra premium -->
    <div class="relative bg-gradient-to-r from-slate-50/80 via-blue-50/80 to-slate-50/80 backdrop-blur-sm px-8 py-8 border-b border-slate-200/60">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <!-- Título principal con badges -->
        <div class="flex items-start space-x-5">
          <!-- Icono principal mejorado -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-300"></div>
            <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
              </svg>
            </div>
          </div>
          
          <div class="flex-1">
            <div class="flex items-center space-x-3 mb-3">
              <h2 class="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {{ title }}
              </h2>
            </div>
            
            <!-- Badges informativos mejorados -->
            <div class="flex flex-wrap gap-2">
              <div class="bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ filteredRepartos.length }} repartos</span>
              </div>
              
              <!-- Badge de faltantes -->
              <div v-if="contadorFaltantes > 0" class="bg-gradient-to-r from-red-100 to-red-200 border border-red-300 px-3 py-1.5 rounded-lg text-sm font-medium text-red-700 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                <span>{{ contadorFaltantes }} faltantes</span>
              </div>
              
              <!-- Badge de sobrantes -->
              <div v-if="contadorSobrantes > 0" class="bg-gradient-to-r from-green-100 to-green-200 border border-green-300 px-3 py-1.5 rounded-lg text-sm font-medium text-green-700 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <span>{{ contadorSobrantes }} sobrantes</span>
              </div>
              
              <!-- Badge de exactos -->
              <div v-if="contadorExactos > 0" class="bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-700 flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ contadorExactos }} exactos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de acción mejorados -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Botón de actualizar premium -->
          <button 
            @click="$emit('refresh')" 
            class="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-500 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50"
          >
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 transition-transform group-hover:rotate-180 duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Actualizar Datos</span>
            </div>
            <!-- Efecto de shimmer mejorado -->
            <div class="absolute inset-0 -top-full bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:top-full transition-all duration-1000"></div>
          </button>
        </div>
      </div>

      <!-- Barra de filtros simplificada -->
      <div class="mt-8 flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
        <!-- Filtros principales -->
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-end flex-1">
          <!-- Búsqueda por RTO -->
          <div class="relative group w-full sm:w-auto sm:min-w-[280px]">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Buscar RTO</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="searchRTO"
                type="text"
                placeholder="Buscar número de RTO..."
                class="w-full pl-12 pr-4 py-3.5 bg-white/70 backdrop-blur border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-sm font-medium placeholder-slate-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
              >
            </div>
          </div>

          <!-- Filtro por estado -->
          <div class="relative group w-full sm:w-auto sm:min-w-[200px]">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
            <select
              v-model="estadoFilter"
              class="w-full px-4 py-3.5 bg-white/70 backdrop-blur border border-slate-200 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
            >
              <option value="">Todos los estados</option>
              <option value="EXACTO">✅ Exactos</option>
              <option value="DIFERENCIA">⚠️ Con diferencias</option>
              <option value="PENDIENTE">🔄 Pendientes</option>
            </select>
          </div>

          <!-- Filtro por tipo de diferencia -->
          <div class="relative group w-full sm:w-auto sm:min-w-[180px]">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Tipo</label>
            <select
              v-model="tipoFilter"
              class="w-full px-4 py-3.5 bg-white/70 backdrop-blur border border-slate-200 hover:border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
            >
              <option value="">Todos los tipos</option>
              <option value="FALTANTE">📉 Faltantes</option>
              <option value="SOBRANTE">📈 Sobrantes</option>
              <option value="EXACTO">🎯 Exactos</option>
            </select>
          </div>
        </div>

        <!-- Filtros rápidos y acciones -->
        <div class="flex flex-wrap gap-3">
          <!-- Toggle Solo Diferencias -->
          <label class="flex items-center space-x-3 bg-white/70 backdrop-blur border border-slate-200 hover:border-amber-300 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md group">
            <input
              v-model="soloDiferencias"
              type="checkbox"
              class="sr-only"
            >
            <div class="relative">
              <div class="w-6 h-6 border-2 border-slate-300 rounded-md transition-all duration-300 group-hover:border-amber-400"
                   :class="{ 'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500': soloDiferencias }">
                <svg v-if="soloDiferencias" class="w-4 h-4 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <span class="text-sm font-medium text-slate-700 group-hover:text-amber-700">Solo Diferencias</span>
          </label>



          <!-- Limpiar filtros -->
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="group bg-white/70 backdrop-blur border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-700 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md flex items-center space-x-2"
          >
            <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Controles y estadísticas -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <!-- Información de resultados -->
      <div class="flex items-center space-x-4">
        <div class="text-sm text-gray-600">
          Mostrando <span class="font-medium text-gray-900">{{ startIndex + 1 }}</span> a 
          <span class="font-medium text-gray-900">{{ endIndex }}</span> de 
          <span class="font-medium text-gray-900">{{ filteredRepartos.length }}</span> repartos
        </div>
      </div>

      <!-- Controles de paginación y vista -->
      <div class="flex items-center space-x-3">
        <!-- Selector de elementos por página -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">Mostrar:</span>
          <select
            v-model="itemsPerPage"
            class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="filteredRepartos.length">Todos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla responsive mejorada con scroll horizontal suave -->
    <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <table class="min-w-full table-auto">
        <thead class="bg-gradient-to-r from-gray-50 to-slate-50 sticky top-0 z-10">
          <tr>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <img src="@/assets/entrega.png" alt="ID Reparto" class="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity">
                <span class="text-xs">ID Reparto</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs">Fecha</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <span class="text-xs">Esperado</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2 2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                <span class="text-xs">Real</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
                <span class="text-xs">Diferencia</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-xs">Estado</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span class="text-xs">Movimiento</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <span class="text-xs">Docs</span>
              </div>
            </th>
            <th class="table-header-compact group">
              <div class="flex items-center space-x-1">
                <svg class="w-3 h-3 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
                <span class="text-xs">Acciones</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-50">
          <RepartoRow 
            v-for="(reparto, index) in paginatedRepartos" 
            :key="reparto.idReparto" 
            :reparto="reparto"
            :service="service"
            :class="{ 'animate-row': true }"
            :style="{ animationDelay: `${index * 50}ms` }"
            @edit="$emit('edit', $event)"
            @delete-movement="handleDeleteMovement"
            @view-movements="handleViewMovements"
            @toggle-comprobantes="handleToggleComprobantes"
            @estado-actualizado="handleEstadoActualizado"
          />
        </tbody>
      </table>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <!-- Información de paginación -->
          <div class="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {{ startIndex + 1 }} - {{ endIndex }} de {{ filteredRepartos.length }} resultados
            </span>
          </div>

          <!-- Controles de paginación -->
          <div class="flex items-center space-x-2">
            <!-- Botón anterior -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <!-- Números de página -->
            <template v-for="page in visiblePages" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="{
                  'bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                }"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200"
              >
                {{ page }}
              </button>
              <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
            </template>

            <!-- Botón siguiente -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state mejorado -->
      <div v-if="loading" class="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-md mx-auto">
          <!-- Spinner mejorado -->
          <div class="mb-6 relative">
            <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center animate-pulse">
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Cargando repartos...</h3>
          <p class="text-gray-500">Obteniendo los datos más recientes...</p>
        </div>
      </div>

      <!-- Empty state mejorado -->
      <div v-else-if="filteredRepartos.length === 0" class="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
        <div class="max-w-md mx-auto">
          <!-- Icono animado -->
          <div class="mb-6 relative">
            <div class="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-blue-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
              </svg>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold text-gray-700 mb-2">
            {{ hasActiveFilters ? 'No hay resultados para los filtros aplicados' : 'No hay repartos disponibles' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ hasActiveFilters ? 'Intenta cambiar los criterios de búsqueda.' : 'No se encontraron repartos registrados en el sistema.' }}
          </p>
          
          <!-- Botón de acción -->
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mr-3"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <span>Limpiar filtros</span>
          </button>
          <button 
            @click="$emit('refresh')"
            class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <span>Actualizar datos</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de vista detallada de movimientos -->
    <MovimientosDetailModal
      :isVisible="showMovimientosModal"
      :reparto="selectedReparto"
      :service="service"
      @close="closeMovimientosModal"
      @edit="handleEditFromModal"
      @create="handleCreateFromModal"
      @delete-movement="handleDeleteMovement"
      @delete-all-movements="handleDeleteAllMovements"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import RepartoRow from './RepartoRow.vue'
import MovimientosDetailModal from './MovimientosDetailModal.vue'

const props = defineProps({
  repartos: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Repartos'
  },
  loading: {
    type: Boolean,
    default: false
  },
  service: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['refresh', 'edit', 'delete-movement', 'delete-all-movements', 'toggle-comprobantes', 'estado-actualizado'])

// Estados para el modal de movimientos
const showMovimientosModal = ref(false)
const selectedReparto = ref(null)

// Función para manejar toggle de comprobantes
const handleToggleComprobantes = (event) => {
  console.log('🟢 RepartoTable - Evento recibido:', event)
  emit('toggle-comprobantes', event)
  console.log('🟢 RepartoTable - Evento enviado a padre')
}

// Función para manejar actualización de estado
const handleEstadoActualizado = (event) => {
  console.log('🔄 RepartoTable - Estado actualizado:', event)
  emit('estado-actualizado', event)
  console.log('🔄 RepartoTable - Evento de estado enviado a padre')
}

// Funciones para el modal de movimientos
const handleViewMovements = (reparto) => {
  console.log('👁️ RepartoTable - Ver movimientos para reparto:', reparto.idReparto)
  selectedReparto.value = reparto
  showMovimientosModal.value = true
}

const closeMovimientosModal = () => {
  showMovimientosModal.value = false
  selectedReparto.value = null
}

const handleEditFromModal = (reparto) => {
  console.log('✏️ RepartoTable - Editar desde modal:', reparto.idReparto)
  closeMovimientosModal()
  emit('edit', reparto)
}

const handleCreateFromModal = (reparto) => {
  console.log('➕ RepartoTable - Crear desde modal:', reparto.idReparto)
  closeMovimientosModal()
  emit('edit', reparto) // Reutilizar el mismo evento para crear
}

// Función para manejar eliminación de movimiento individual
const handleDeleteMovement = async (eventData) => {
  console.log('🗑️ [RepartoTable] Eliminando movimiento individual:', eventData)
  
  try {
    // Verificar que venga el depositId del RepartoRow
    if (!eventData.depositId) {
      // Si no viene, intentar obtenerlo como fallback
      const depositId = getDepositId(eventData.reparto)
      if (!depositId) {
        throw new Error('No se pudo obtener el deposit_id del reparto')
      }
      eventData.depositId = depositId
    }
    
    console.log(`🗑️ [RepartoTable] Usando deposit_id: ${eventData.depositId}`)
    
    // Emitir evento al componente padre con el depositId correcto
    emit('delete-movement', eventData)
    
  } catch (error) {
    console.error('❌ [RepartoTable] Error al preparar eliminación de movimiento:', error)
    alert(`Error al eliminar movimiento: ${error.message}`)
  }
}

// Función para manejar eliminación de todos los movimientos
const handleDeleteAllMovements = async (reparto) => {
  console.log('🗑️ [RepartoTable] Eliminando todos los movimientos:', reparto?.idReparto)
  
  try {
    // Obtener el deposit_id del reparto
    const depositId = getDepositId(reparto)
    
    if (!depositId) {
      throw new Error('No se pudo obtener el deposit_id del reparto')
    }
    
    console.log(`🗑️ [RepartoTable] Usando deposit_id: ${depositId}`)
    
    // Llamar al servicio para eliminar todos los movimientos
    emit('delete-all-movements', {
      reparto,
      depositId
    })
    
    // Cerrar el modal después de la eliminación
    closeMovimientosModal()
    
  } catch (error) {
    console.error('❌ [RepartoTable] Error al preparar eliminación de todos los movimientos:', error)
    alert(`Error al eliminar movimientos: ${error.message}`)
  }
}

// Función helper para obtener deposit_id (misma lógica que RepartoRow)
const getDepositId = (reparto) => {
  if (!reparto) {
    console.warn('❌ [RepartoTable] Reparto no definido para obtener deposit_id')
    return null
  }
  
  // CASO 1: El objeto ES directamente un depósito (estructura real de la API)
  if (reparto.deposit_id) {
    console.log(`✅ [RepartoTable] Usando deposit_id: ${reparto.deposit_id}`)
    return reparto.deposit_id
  }
  
  // CASO 2: Estructura anidada - usar deposits[0].deposit_id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].deposit_id) {
    console.log(`✅ [RepartoTable] Usando deposits[0].deposit_id: ${reparto.deposits[0].deposit_id}`)
    return reparto.deposits[0].deposit_id
  }
  
  // CASO 3: Fallback - usar deposits[0].id si existe
  if (reparto.deposits && reparto.deposits.length > 0 && reparto.deposits[0].id) {
    console.log(`⚠️ [RepartoTable] Fallback deposits[0].id: ${reparto.deposits[0].id}`)
    return reparto.deposits[0].id
  }
  
  // CASO 4: Fallback final - usar el ID del reparto
  console.warn(`❌ [RepartoTable] Fallback reparto.id: ${reparto.id} - Puede fallar`)
  return reparto.id
}

// Estados para filtros
const searchRTO = ref('')
const estadoFilter = ref('')
const tipoFilter = ref('')
const soloDiferencias = ref(false)

// Estados para paginación
const currentPage = ref(1)
const itemsPerPage = ref(25)

// Filtros computados
const filteredRepartos = computed(() => {
  let filtered = [...props.repartos]

  // Filtro por RTO
  if (searchRTO.value.trim()) {
    const searchTerm = searchRTO.value.toLowerCase().trim()
    filtered = filtered.filter(reparto => 
      reparto.idReparto?.toLowerCase().includes(searchTerm) ||
      reparto.id?.toLowerCase().includes(searchTerm)
    )
  }

  // Filtro por estado
  if (estadoFilter.value) {
    filtered = filtered.filter(reparto => reparto.estado === estadoFilter.value)
  }

  // Filtro por tipo de diferencia
  if (tipoFilter.value) {
    filtered = filtered.filter(reparto => {
      const diferencia = reparto.depositoReal - reparto.depositoEsperado
      switch (tipoFilter.value) {
        case 'FALTANTE':
          return diferencia < 0
        case 'SOBRANTE':
          return diferencia > 0
        case 'EXACTO':
          return diferencia === 0
        default:
          return true
      }
    })
  }

  // Filtro solo diferencias
  if (soloDiferencias.value) {
    filtered = filtered.filter(reparto => reparto.depositoReal !== reparto.depositoEsperado)
  }

  return filtered
})

// Contadores dinámicos para badges
const contadorFaltantes = computed(() => {
  return props.repartos.filter(reparto => reparto.depositoReal < reparto.depositoEsperado).length
})

const contadorSobrantes = computed(() => {
  return props.repartos.filter(reparto => reparto.depositoReal > reparto.depositoEsperado).length
})

const contadorExactos = computed(() => {
  return props.repartos.filter(reparto => reparto.depositoReal === reparto.depositoEsperado).length
})

// Paginación computada
const totalPages = computed(() => {
  if (itemsPerPage.value >= filteredRepartos.value.length) return 1
  return Math.ceil(filteredRepartos.value.length / itemsPerPage.value)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredRepartos.value.length))

const paginatedRepartos = computed(() => {
  if (itemsPerPage.value >= filteredRepartos.value.length) {
    return filteredRepartos.value
  }
  return filteredRepartos.value.slice(startIndex.value, endIndex.value)
})

// Páginas visibles para la paginación
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    // Mostrar todas las páginas si son pocas
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Lógica para mostrar páginas con elipsis
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

// Verificar si hay filtros activos
const hasActiveFilters = computed(() => {
  return searchRTO.value.trim() !== '' || 
         estadoFilter.value !== '' || 
         tipoFilter.value !== '' ||
         soloDiferencias.value
})

// Funciones para manejar filtros
const clearFilters = () => {
  searchRTO.value = ''
  estadoFilter.value = ''
  tipoFilter.value = ''
  soloDiferencias.value = false
  currentPage.value = 1
}

// Funciones para manejar paginación
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Watchers para resetear página cuando cambian los filtros
watch([searchRTO, estadoFilter, tipoFilter, soloDiferencias, itemsPerPage], () => {
  currentPage.value = 1
})

// Watcher para asegurarse de que la página actual sea válida
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal && newTotal > 0) {
    currentPage.value = newTotal
  }
})
</script>

<style scoped>
/* Estilos profesionales para la tabla */

/* Header de tabla mejorado */
.table-header {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  position: relative;
}

.table-header:hover {
  background-color: #f3f4f6;
  border-bottom-color: #3b82f6;
}

.table-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.table-header:hover::after {
  width: 100%;
}

/* Header de tabla compacto para mejor densidad */
.table-header-compact {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.625rem;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  position: relative;
  white-space: nowrap;
}

.table-header-compact:hover {
  background-color: #f3f4f6;
  border-bottom-color: #3b82f6;
}

.table-header-compact::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
}

.table-header-compact:hover::after {
  width: 100%;
}

/* Scrollbar personalizada para mejor UX */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(209, 213, 219) rgb(243, 244, 246);
}

.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgb(243, 244, 246);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgb(209, 213, 219);
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgb(156, 163, 175);
}

/* Animación para las filas */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-row {
  animation: slideInUp 0.5s ease-out both;
}

/* Efectos hover para la tabla */
tbody tr {
  transition: all 0.2s ease;
}

tbody tr:hover {
  background: linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: scale(1.01);
  border-left: 4px solid #3b82f6;
}

/* Estilos responsive mejorados */
@media (max-width: 768px) {
  .table-header {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* Transiciones suaves para todos los elementos */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Efecto de enfoque mejorado */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Efectos adicionales para mejorar la experiencia visual */
.table-header svg {
  transition: transform 0.3s ease, color 0.3s ease;
}

.table-header:hover svg {
  transform: scale(1.1);
}
</style>
