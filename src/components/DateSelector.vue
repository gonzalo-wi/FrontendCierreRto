<template>
  <div class="date-selector-container">
    <div class="date-selector">
      <label for="fecha-consulta" class="date-label">
        📅 Fecha de consulta:
      </label>
      <input
        id="fecha-consulta"
        type="date"
        v-model="fechaSeleccionada"
        @change="onFechaChange"
        class="date-input"
        :max="fechaMaxima"
      />
      <button
        @click="establecerFechaHoy"
        class="btn-today"
        title="Seleccionar fecha de hoy"
      >
        📅 Hoy
      </button>
      <div v-if="fechaFormateada" class="date-info">
        Consultando datos del: <strong>{{ fechaFormateada }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateSelector',
  emits: ['fecha-seleccionada'],
  
  data() {
    return {
      fechaSeleccionada: this.getFechaHoy()
    }
  },
  
  computed: {
    /**
     * Fecha máxima seleccionable (hoy)
     */
    fechaMaxima() {
      return this.getFechaHoy()
    },
    
    /**
     * Fecha formateada para mostrar al usuario
     */
    fechaFormateada() {
      if (!this.fechaSeleccionada) return ''
      
      const fecha = new Date(this.fechaSeleccionada + 'T00:00:00')
      return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  },
  
  mounted() {
    // Emitir la fecha inicial
    this.emitirFecha()
  },
  
  methods: {
    /**
     * Obtiene la fecha de hoy en formato YYYY-MM-DD
     */
    getFechaHoy() {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    /**
     * Convierte fecha YYYY-MM-DD a MM-DD-YYYY para la API
     */
    convertirFechaParaAPI(fechaYYYYMMDD) {
      if (!fechaYYYYMMDD) return this.getFechaHoyParaAPI()
      
      const [year, month, day] = fechaYYYYMMDD.split('-')
      return `${month}-${day}-${year}`
    },
    
    /**
     * Obtiene la fecha de hoy en formato MM-DD-YYYY para la API
     */
    getFechaHoyParaAPI() {
      const today = new Date()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      const year = today.getFullYear()
      return `${month}-${day}-${year}`
    },
    
    /**
     * Maneja el cambio de fecha
     */
    onFechaChange() {
      this.emitirFecha()
    },
    
    /**
     * Establece la fecha de hoy
     */
    establecerFechaHoy() {
      this.fechaSeleccionada = this.getFechaHoy()
      this.emitirFecha()
    },
    
    /**
     * Emite la fecha seleccionada al componente padre
     */
    emitirFecha() {
      const fechaAPI = this.convertirFechaParaAPI(this.fechaSeleccionada)
      this.$emit('fecha-seleccionada', {
        fechaInput: this.fechaSeleccionada,      // YYYY-MM-DD
        fechaAPI: fechaAPI,                      // MM-DD-YYYY
        fechaDisplay: this.fechaFormateada       // Formato legible
      })
    }
  }
}
</script>

<style scoped>
.date-selector-container {
  margin-bottom: 20px;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.date-label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
  font-size: 14px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #495057;
  min-width: 140px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.date-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.btn-today {
  padding: 8px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  white-space: nowrap;
}

.btn-today:hover {
  background: #0056b3;
}

.btn-today:active {
  background: #004085;
}

.date-info {
  color: #6c757d;
  font-size: 13px;
  font-style: italic;
  margin-left: auto;
}

/* Responsivo */
@media (max-width: 768px) {
  .date-selector {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .date-label {
    text-align: center;
  }
  
  .date-info {
    margin-left: 0;
    text-align: center;
    margin-top: 4px;
  }
}

@media (max-width: 480px) {
  .date-selector {
    padding: 12px;
  }
  
  .date-input {
    width: 100%;
  }
  
  .btn-today {
    width: 100%;
  }
}
</style>
