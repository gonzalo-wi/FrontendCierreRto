/**
 * Servicio de simulación para datos de totales
 * Útil durante el desarrollo cuando no hay servidor backend disponible
 */

export default {
  /**
   * Simula la respuesta de la API de totales con datos realistas
   * @param {string} date - Fecha en formato MM-DD-YYYY
   * @returns {Promise} Promesa con datos simulados
   */
  async getTotales(date = null) {
    // Simular latencia de red (entre 500ms y 2s)
    const delay = Math.random() * 1500 + 500
    await new Promise(resolve => setTimeout(resolve, delay))
    
    const fechaConsulta = date || this.formatearFechaHoy()
    
    // Generar datos consistentes basados en la fecha
    const seed = this.generarSeed(fechaConsulta)
    const datos = this.generarDatosConsistentes(seed, fechaConsulta)
    
    console.log('📊 Datos simulados generados:', datos)
    return datos
  },

  /**
   * Genera una semilla numérica basada en la fecha para datos consistentes
   */
  generarSeed(fecha) {
    return fecha.split('-').reduce((acc, val) => acc + parseInt(val), 0)
  },

  /**
   * Genera datos consistentes basados en una semilla
   */
  generarDatosConsistentes(seed, fecha) {
    // Usar la semilla para generar números consistentes
    const random = this.seededRandom(seed)
    
    // Rangos realistas para cada planta (en pesos colombianos)
    const rangos = {
      jumillano: { min: 800000000, max: 3500000000 },   // 800M - 3.5B
      laplata: { min: 600000000, max: 2800000000 },     // 600M - 2.8B
      nafa: { min: 1000000000, max: 4000000000 }        // 1B - 4B
    }
    
    const jumillano = Math.floor(rangos.jumillano.min + (random() * (rangos.jumillano.max - rangos.jumillano.min)))
    const laplata = Math.floor(rangos.laplata.min + (random() * (rangos.laplata.max - rangos.laplata.min)))
    const nafa = Math.floor(rangos.nafa.min + (random() * (rangos.nafa.max - rangos.nafa.min)))
    
    return {
      fecha,
      jumillano,
      laplata,
      nafa,
      totalGeneral: jumillano + laplata + nafa
    }
  },

  /**
   * Generador de números aleatorios con semilla (para consistencia)
   */
  seededRandom(seed) {
    let m = 2147483647 // 2^31 - 1
    let a = 16807
    let s = seed % m
    
    return function() {
      s = (a * s) % m
      return (s - 1) / (m - 1)
    }
  },

  /**
   * Formatea la fecha de hoy en formato MM-DD-YYYY
   */
  formatearFechaHoy() {
    const hoy = new Date()
    return `${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}-${hoy.getFullYear()}`
  },

  /**
   * Simula diferentes escenarios de error
   */
  async getTotalesConError(tipoError = 'timeout') {
    const delay = Math.random() * 1000 + 500
    await new Promise(resolve => setTimeout(resolve, delay))
    
    switch (tipoError) {
      case 'timeout':
        throw new Error('Timeout: La petición tardó demasiado tiempo')
      case 'network':
        throw new Error('Network Error: Sin conexión al servidor')
      case 'server':
        throw new Error('Internal Server Error: Error en el servidor')
      default:
        throw new Error('Error desconocido')
    }
  }
}
