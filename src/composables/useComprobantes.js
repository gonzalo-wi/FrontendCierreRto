import { ref, computed, reactive } from 'vue'
import comprobantesService from '../services/ComprobantesService.js'

// Estado global para caché de comprobantes
const comprobantesCache = reactive(new Map())
const loadingStates = reactive(new Map())

export const useComprobantes = () => {
  const comprobantes = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Función para crear una clave de caché
  const getCacheKey = (reparto, fecha) => `${reparto}-${fecha}`

  // Cargar comprobantes con caché
  const cargarComprobantes = async (reparto, fecha) => {
    const cacheKey = getCacheKey(reparto, fecha)
    
    // Si ya tenemos datos en caché y no están cargando, devolverlos
    if (comprobantesCache.has(cacheKey) && !loadingStates.get(cacheKey)) {
      comprobantes.value = comprobantesCache.get(cacheKey)
      return comprobantes.value
    }

    // Evitar múltiples llamadas simultáneas
    if (loadingStates.get(cacheKey)) {
      return comprobantes.value
    }

    loading.value = true
    loadingStates.set(cacheKey, true)
    error.value = null

    try {
      const data = await comprobantesService.getComprobantes(reparto, fecha)
      
      // Guardar en caché
      comprobantesCache.set(cacheKey, data)
      comprobantes.value = data
      
      console.log(`✅ Comprobantes cargados para ${reparto} - ${fecha}:`, data.length)
      return data
    } catch (err) {
      // Manejo específico para diferentes tipos de errores
      if (err.message.includes('60 segundos')) {
        error.value = `⏰ Carga lenta: Los comprobantes están tardando más de lo esperado. Esto puede deberse a una gran cantidad de datos.`
        console.warn(`⏰ Timeout para comprobantes ${reparto}:`, err)
      } else if (err.message.includes('timeout')) {
        error.value = `⏰ Tiempo agotado: La carga de comprobantes tardó demasiado. Inténtalo de nuevo.`
        console.warn(`⏰ Timeout genérico para comprobantes ${reparto}:`, err)
      } else {
        error.value = err.message || 'Error desconocido al cargar comprobantes'
        console.error('❌ Error cargando comprobantes:', err)
      }
      throw err
    } finally {
      loading.value = false
      loadingStates.set(cacheKey, false)
    }
  }

  // Cargar comprobantes de hoy (solo reales, para badge)
  const cargarComprobantesHoy = async (reparto) => {
    try {
      console.log(`🔍 [BADGE] Cargando comprobantes para badge del reparto: ${reparto}`)
      const hoy = new Date().toISOString().split('T')[0]
      
      // Usar directamente getComprobantes que SOLO devuelve comprobantes reales
      const data = await comprobantesService.getComprobantes(reparto, hoy)
      console.log(`✅ [BADGE] Comprobantes reales para ${reparto}:`, data.length)
      
      // getComprobantes ya filtra solo los reales, no necesitamos filtrar más
      return data || []
    } catch (error) {
      console.error(`❌ [BADGE] Error cargando comprobantes para ${reparto}:`, error)
      return [] // Siempre devolver array vacío en caso de error para el badge
    }
  }

  // Cargar comprobantes con fallback (para modal)
  const cargarComprobantesConFallback = async (reparto, fecha) => {
    const cacheKey = getCacheKey(reparto, fecha)
    
    // Si ya tenemos datos en caché y no están cargando, devolverlos
    if (comprobantesCache.has(cacheKey) && !loadingStates.get(cacheKey)) {
      comprobantes.value = comprobantesCache.get(cacheKey)
      return comprobantes.value
    }

    // Evitar múltiples llamadas simultáneas
    if (loadingStates.get(cacheKey)) {
      return comprobantes.value
    }

    loading.value = true
    loadingStates.set(cacheKey, true)
    error.value = null

    try {
      // Usar función con fallback actualizada (solo comprobantes reales, sin simulados)
      const data = await comprobantesService.getComprobantesConFallback(reparto, fecha)
      
      // Guardar en caché
      comprobantesCache.set(cacheKey, data)
      comprobantes.value = data
      
      console.log(`✅ Comprobantes cargados para ${reparto} - ${fecha}:`, data.length)
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error cargando comprobantes:', err)
      throw err
    } finally {
      loading.value = false
      loadingStates.set(cacheKey, false)
    }
  }

  // Cargar solo el conteo de comprobantes (para badges)
  const cargarConteoComprobantes = async (reparto, fecha) => {
    console.log(`🔢 [COMPOSABLE] ============ INICIANDO CARGA DE CONTEO ============`)
    console.log(`🔢 [COMPOSABLE] Reparto recibido: "${reparto}"`)
    console.log(`🔢 [COMPOSABLE] Fecha recibida: "${fecha}"`)
    
    const cacheKey = `count-${reparto}-${fecha}`
    console.log(`🔢 [COMPOSABLE] Cache key: "${cacheKey}"`)
    
    // Si ya tenemos el conteo en caché, devolverlo
    if (comprobantesCache.has(cacheKey)) {
      const cachedCount = comprobantesCache.get(cacheKey)
      console.log(`🔢 [COMPOSABLE] Usando conteo desde cache: ${cachedCount}`)
      return cachedCount
    }

    // Evitar múltiples llamadas simultáneas
    if (loadingStates.get(cacheKey)) {
      console.log(`🔢 [COMPOSABLE] Ya hay una carga en progreso para: ${cacheKey}`)
      return 0
    }

    console.log(`🔢 [COMPOSABLE] Estableciendo loading state para: ${cacheKey}`)
    loadingStates.set(cacheKey, true)

    try {
      console.log(`🔢 [COMPOSABLE] Llamando al servicio getComprobantesCount...`)
      const count = await comprobantesService.getComprobantesCount(reparto, fecha)
      
      console.log(`🔢 [COMPOSABLE] Respuesta del servicio: ${count} (tipo: ${typeof count})`)
      
      // Asegurar que es un número
      const countNumber = parseInt(count) || 0
      console.log(`🔢 [COMPOSABLE] Conteo procesado: ${countNumber}`)
      
      // Guardar en caché
      comprobantesCache.set(cacheKey, countNumber)
      console.log(`🔢 [COMPOSABLE] Conteo guardado en cache: ${countNumber}`)
      
      console.log(`✅ [COMPOSABLE] Conteo cargado para ${reparto} - ${fecha}: ${countNumber}`)
      return countNumber
    } catch (err) {
      console.error('❌ [COMPOSABLE] Error cargando conteo de comprobantes:', err)
      return 0
    } finally {
      console.log(`🔢 [COMPOSABLE] Liberando loading state para: ${cacheKey}`)
      loadingStates.set(cacheKey, false)
    }
  }

  // Obtener URL de imagen
  const getImageUrl = (id) => {
    return comprobantesService.getComprobanteImageUrl(id)
  }

  // Verificar si existe imagen
  const verificarImagen = async (id) => {
    return comprobantesService.checkImageExists(id)
  }

  // Limpiar caché
  const limpiarCache = (reparto = null, fecha = null) => {
    if (reparto && fecha) {
      const cacheKey = getCacheKey(reparto, fecha)
      comprobantesCache.delete(cacheKey)
      loadingStates.delete(cacheKey)
    } else {
      comprobantesCache.clear()
      loadingStates.clear()
    }
    console.log('Caché de comprobantes limpiado')
  }

  // Recargar forzando actualización
  const recargarComprobantes = async (reparto, fecha) => {
    limpiarCache(reparto, fecha)
    return cargarComprobantes(reparto, fecha)
  }

  // Obtener estadísticas de comprobantes
  const estadisticas = computed(() => {
    const total = comprobantes.value.length
    const porTipo = comprobantes.value.reduce((acc, comp) => {
      const tipo = comp.tipo || 'sin-tipo'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    return {
      total,
      porTipo,
      hayComprobantes: total > 0
    }
  })

  // Estado de carga global
  const isLoadingAny = computed(() => {
    return Array.from(loadingStates.values()).some(state => state)
  })

  // Obtener comprobantes del caché sin cargar
  const getComprobantesFromCache = (reparto, fecha) => {
    const cacheKey = getCacheKey(reparto, fecha)
    return comprobantesCache.get(cacheKey) || []
  }

  // Verificar si hay datos en caché
  const hasCache = (reparto, fecha) => {
    const cacheKey = getCacheKey(reparto, fecha)
    return comprobantesCache.has(cacheKey)
  }

  return {
    // Estado
    comprobantes: computed(() => comprobantes.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    estadisticas,
    isLoadingAny,

    // Métodos
    cargarComprobantes,
    cargarComprobantesHoy,
    cargarComprobantesConFallback,
    recargarComprobantes,
    limpiarCache,
    getImageUrl,
    verificarImagen,
    getComprobantesFromCache,
    hasCache,
    cargarConteoComprobantes
  }
}

// Composable específico para un reparto
export const useComprobantesByReparto = (reparto, fecha = null) => {
  const {
    comprobantes,
    loading,
    error,
    cargarComprobantes,
    cargarComprobantesHoy,
    recargarComprobantes,
    getImageUrl,
    estadisticas
  } = useComprobantes()

  const fechaActual = ref(fecha || new Date().toISOString().split('T')[0])

  // Cargar automáticamente
  const cargar = () => {
    if (reparto) {
      return cargarComprobantes(reparto, fechaActual.value)
    }
  }

  // Cambiar fecha
  const cambiarFecha = (nuevaFecha) => {
    fechaActual.value = nuevaFecha
    return cargar()
  }

  // Recargar datos actuales
  const recargar = () => {
    if (reparto) {
      return recargarComprobantes(reparto, fechaActual.value)
    }
  }

  return {
    comprobantes,
    loading,
    error,
    estadisticas,
    fechaActual: computed(() => fechaActual.value),
    cargar,
    recargar,
    cambiarFecha,
    getImageUrl
  }
}
