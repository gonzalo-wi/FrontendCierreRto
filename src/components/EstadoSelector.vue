<template>
  <div class="estado-selector" :class="{ 'compact': compact }">
    <!-- Badge actual del estado con dropdown -->
    <div class="estado-badge-container">
      <!-- Badge del estado actual -->
      <div 
        class="estado-badge" 
        :class="getEstadoBadgeClass(currentState)"
        @click="toggleDropdown"
        :title="`Cambiar estado desde ${currentState}`"
      >
        <span class="estado-text">{{ currentState }}</span>
        <svg 
          class="dropdown-arrow" 
          :class="{ 'rotated': showDropdown }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      
      <!-- Dropdown de opciones -->
      <div v-if="showDropdown" class="dropdown-menu">
        <div 
          v-for="estado in estadosDisponibles.filter(e => (e.value || e) !== currentState)" 
          :key="estado.value || estado"
          class="dropdown-item"
          :class="getEstadoBadgeClass(estado.value || estado)"
          @click="cambiarEstado(estado.value || estado)"
        >
          {{ estado.label || estado }}
        </div>
        
        <!-- Mostrar mensaje si no hay estados -->
        <div v-if="!estadosDisponibles.length" class="dropdown-item disabled">
          {{ loading ? 'Cargando...' : 'Sin estados' }}
        </div>
      </div>
    </div>
    
    <!-- Indicador de actualización -->
    <div v-if="updating" class="loading-overlay">
      <span class="spinner">⟳</span>
    </div>
    
    <!-- Debug info (solo en desarrollo y si está habilitado) -->
    <div v-if="showDebug && debug" class="debug-info">
      <small>
        Estados: {{ estadosDisponibles.length }}, 
        Current: {{ currentState }}, 
        Loading: {{ loading }}, 
        Updating: {{ updating }},
        DepositoId: {{ depositoId }},
        Planta: {{ planta }}
      </small>
    </div>
  </div>
</template>

<script>
import { getEstadosConCache } from '../utils/estadosCache.js'

export default {
  name: 'EstadoSelector',
  props: {
    // Estado actual del depósito/reparto
    estado: {
      type: String,
      default: 'PENDIENTE'
    },
    // ID del depósito/reparto
    depositoId: {
      type: [String, Number],
      required: true
    },
    // Tipo de planta para usar el servicio correcto
    planta: {
      type: String,
      required: true,
      validator: (value) => ['jumi', 'nafa', 'laplata'].includes(value)
    },
    // Modo compacto
    compact: {
      type: Boolean,
      default: false
    },
    // Debug mode
    debug: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      currentState: this.estado,
      estadosDisponibles: [],
      loading: false,
      updating: false,
      errorMessage: null,
      estadosCargados: false, // Flag para evitar recargas innecesarias
      showDropdown: false
    }
  },
  
  computed: {
    showDebug() {
      return this.debug || process.env.NODE_ENV === 'development'
    },
    
    // Servicio a usar según la planta
    serviceModule() {
      switch(this.planta.toLowerCase()) {
        case 'jumi':
          return () => import('../services/RtoJumiService.js')
        case 'nafa':
          return () => import('../services/RtoNafaService.js')
        case 'laplata':
          return () => import('../services/RtoLaPlataService.js')
        default:
          console.error(`Planta no válida: ${this.planta}`)
          return null
      }
    }
  },
  
  watch: {
    estado(newValue) {
      this.currentState = newValue
    },
    
    planta() {
      // Recargar estados si cambia la planta (resetear flag)
      this.estadosCargados = false
      this.loadEstadosDisponibles()
    }
  },
  
  async mounted() {
    console.log('[EstadoSelector] Mounted with props:', {
      estado: this.estado,
      depositoId: this.depositoId,
      planta: this.planta
    })
    
    await this.loadEstadosDisponibles()
  },
  
  methods: {
    async loadEstadosDisponibles() {
      // Evitar múltiples cargas simultáneas
      if (this.loading || this.estadosCargados) return
      
      this.loading = true
      this.errorMessage = null
      
      try {
        console.log(`[EstadoSelector] Cargando estados para planta: ${this.planta}`)
        
        const serviceModule = this.serviceModule
        if (!serviceModule) {
          throw new Error(`No se pudo cargar el servicio para la planta: ${this.planta}`)
        }
        
        const module = await serviceModule()
        const service = module.default || module
        
        // Usar cache para obtener estados
        const estados = await getEstadosConCache(service)
        console.log(`[EstadoSelector] Estados obtenidos (con cache):`, estados)
        this.estadosDisponibles = estados
        
        this.estadosCargados = true
        
      } catch (error) {
        console.error('[EstadoSelector] Error cargando estados:', error)
        this.errorMessage = error.message
        
        // Fallback: estados básicos
        this.estadosDisponibles = [
          { value: 'PENDIENTE', label: 'PENDIENTE' },
          { value: 'LISTO', label: 'LISTO' }
        ]
        this.estadosCargados = true
      } finally {
        this.loading = false
      }
    },
    
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    
    async cambiarEstado(newState) {
      if (newState === this.currentState) {
        console.log('[EstadoSelector] Estado no cambió')
        this.showDropdown = false
        return
      }
      
      console.log(`[EstadoSelector] Cambiando estado de ${this.currentState} a ${newState}`)
      
      this.updating = true
      this.errorMessage = null
      this.showDropdown = false
      
      try {
        const serviceModule = this.serviceModule
        if (!serviceModule) {
          throw new Error(`No se pudo cargar el servicio para la planta: ${this.planta}`)
        }
        
        const module = await serviceModule()
        const service = module.default || module
        
        // Verificar si el servicio tiene el método cambiarEstadoDeposito
        if (typeof service.cambiarEstadoDeposito === 'function') {
          console.log(`[EstadoSelector] Llamando a cambiarEstadoDeposito(${this.depositoId}, ${newState})`)
          
          const result = await service.cambiarEstadoDeposito(this.depositoId, newState)
          console.log('[EstadoSelector] Resultado del cambio:', result)
          
          // Actualizar estado local
          this.currentState = newState
          
          // Emitir evento para notificar al padre
          this.$emit('estado-changed', {
            depositoId: this.depositoId,
            estadoAnterior: this.estado,
            estadoNuevo: newState,
            success: true
          })
          
        } else {
          throw new Error('El servicio no soporta cambio de estado')
        }
        
      } catch (error) {
        console.error('[EstadoSelector] Error cambiando estado:', error)
        this.errorMessage = error.message
        
        // Emitir evento de error
        this.$emit('estado-changed', {
          depositoId: this.depositoId,
          estadoAnterior: this.currentState,
          estadoNuevo: newState,
          success: false,
          error: error.message
        })
        
      } finally {
        this.updating = false
      }
    },
    
    getEstadoBadgeClass(estado) {
      const baseClasses = 'estado-badge-base'
      
      switch(estado) {
        case 'PENDIENTE':
          return `${baseClasses} estado-pendiente`
        case 'LISTO':
          return `${baseClasses} estado-listo`
        default:
          return `${baseClasses} estado-default`
      }
    },
    
    // Cerrar dropdown si se hace click fuera
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    }
  },
  
  async mounted() {
    console.log('[EstadoSelector] Mounted with props:', {
      estado: this.estado,
      depositoId: this.depositoId,
      planta: this.planta
    })
    
    document.addEventListener('click', this.handleClickOutside)
    await this.loadEstadosDisponibles()
  },
  
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.estado-selector {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

/* Estilos del badge con dropdown */
.estado-badge-container {
  position: relative;
}

.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
}

.estado-badge:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.estado-pendiente {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #f59e0b;
}

.estado-pendiente:hover {
  background-color: #fde68a;
  border-color: #d97706;
}

.estado-listo {
  background-color: #d1fae5;
  color: #065f46;
  border-color: #10b981;
}

.estado-listo:hover {
  background-color: #a7f3d0;
  border-color: #059669;
}

.estado-default {
  background-color: #f3f4f6;
  color: #374151;
  border-color: #9ca3af;
}

.estado-default:hover {
  background-color: #e5e7eb;
  border-color: #6b7280;
}

.dropdown-arrow {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-top: 0.25rem;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  text-align: left;
}

.dropdown-item:hover:not(.disabled) {
  background-color: #f9fafb;
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #9ca3af;
}

/* Loading overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  right: -2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
  font-size: 1rem;
  color: #3b82f6;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Debug info (solo visible en desarrollo si está habilitado) */
.debug-info {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 2000;
  max-width: 300px;
  opacity: 0.9;
  border: 1px solid #4b5563;
}

/* Modo compacto */
.estado-selector.compact .estado-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  gap: 0.25rem;
}

.estado-selector.compact .dropdown-arrow {
  width: 0.75rem;
  height: 0.75rem;
}

.estado-selector.compact .dropdown-item {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}
</style>
