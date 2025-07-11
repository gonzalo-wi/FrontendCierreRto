// Cache global para estados disponibles
let estadosCache = {
  data: null,
  timestamp: null,
  isLoading: false,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutos
}

/**
 * Obtiene los estados disponibles con cache
 * @param {Object} service - Servicio a usar para obtener los estados
 * @returns {Promise<Array>} Estados disponibles
 */
export async function getEstadosConCache(service) {
  const now = Date.now()
  
  // Si tenemos cache válido, devolverlo
  if (estadosCache.data && 
      estadosCache.timestamp && 
      (now - estadosCache.timestamp) < estadosCache.CACHE_DURATION) {
    console.log('[EstadosCache] Usando estados desde cache')
    return estadosCache.data
  }
  
  // Si ya está cargando, esperar un poco y revisar de nuevo
  if (estadosCache.isLoading) {
    console.log('[EstadosCache] Ya está cargando, esperando...')
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Revisar si terminó de cargar
    if (estadosCache.data) {
      return estadosCache.data
    }
  }
  
  // Cargar estados
  estadosCache.isLoading = true
  
  try {
    console.log('[EstadosCache] Cargando estados desde servicio...')
    
    if (typeof service.getEstadosDisponibles === 'function') {
      const estados = await service.getEstadosDisponibles()
      // Si la respuesta es vacía o no es un array válido, usar fallback
      if (Array.isArray(estados) && estados.length > 0) {
        estadosCache.data = estados
      } else {
        estadosCache.data = [
          { value: 'PENDIENTE', label: 'PENDIENTE' },
          { value: 'LISTO', label: 'LISTO' }
        ]
        console.warn('[EstadosCache] Respuesta vacía, usando fallback:', estadosCache.data)
      }
    } else {
      // Fallback
      estadosCache.data = [
        { value: 'PENDIENTE', label: 'PENDIENTE' },
        { value: 'LISTO', label: 'LISTO' }
      ]
    }
    
    estadosCache.timestamp = now
    console.log('[EstadosCache] Estados cargados y guardados en cache:', estadosCache.data)
    
    return estadosCache.data
    
  } catch (error) {
    console.error('[EstadosCache] Error cargando estados:', error)
    
    // Fallback en caso de error
    const fallbackEstados = [
      { value: 'PENDIENTE', label: 'PENDIENTE' },
      { value: 'LISTO', label: 'LISTO' }
    ]
    
    estadosCache.data = fallbackEstados
    estadosCache.timestamp = now
    
    return fallbackEstados
    
  } finally {
    estadosCache.isLoading = false
  }
}

/**
 * Limpia la cache de estados (útil para debugging)
 */
export function limpiarCacheEstados() {
  estadosCache.data = null
  estadosCache.timestamp = null
  estadosCache.isLoading = false
  console.log('[EstadosCache] Cache limpiada')
}
