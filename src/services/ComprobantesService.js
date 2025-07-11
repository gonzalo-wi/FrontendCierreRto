import { config } from '../config/config.js'

class ComprobantesService {
  constructor() {
    this.baseURL = '/api' // Usar proxy de Vite
  }

  /**
   * Normalizar el número de reparto para comparaciones
   * @param {string|number} reparto - Reparto en formato "RTO XXX", "RTO_XXX", etc.
   * @returns {string} Número de reparto sin ceros a la izquierda
   */
  normalizeRepartoNumber(reparto) {
    if (!reparto) {
      console.warn('🔄 Reparto recibido es null/undefined:', reparto)
      return ''
    }
    
    let numero = reparto.toString()
    console.log(`🔄 [NORMALIZE] Input: "${reparto}" (tipo: ${typeof reparto})`)
    
    // Si tiene formato "RTO XXX" o "RTO_XXX", extraer solo el número
    if (numero.includes('RTO')) {
      // Manejar tanto "RTO 123" como "RTO_123"
      numero = numero.replace(/^RTO[_\s]*(\d+).*$/i, '$1').trim()
      console.log(`🔄 [NORMALIZE] Después de extraer RTO: "${numero}"`)
    }
    
    // Intentar parsear como número para validar
    const numeroParseado = parseInt(numero, 10)
    if (isNaN(numeroParseado)) {
      console.error(`❌ [NORMALIZE] No se pudo parsear como número: "${numero}" desde "${reparto}"`)
      return ''
    }
    
    // Convertir a string sin ceros a la izquierda
    const numeroFinal = numeroParseado.toString()
    
    console.log(`🔄 [NORMALIZE] Reparto normalizado: "${reparto}" → "${numeroFinal}"`)
    return numeroFinal
  }

  /**
   * Obtener lista de comprobantes por reparto y fecha
   * @param {string} reparto - Username del repartidor
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de comprobantes
   */
  async getComprobantes(reparto, fecha) {
    try {
      // Normalizar el número de reparto para la API
      const numeroReparto = this.normalizeRepartoNumber(reparto)
      
      // Usar endpoint específico para comprobantes que va a la API externa
      const url = `/api/reparto-comprobantes?reparto=${numeroReparto}&fecha=${fecha}`
      console.log('🚀 [API COMPROBANTES] Obteniendo comprobantes:', url)

      // Crear AbortController para timeout personalizado más largo
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 segundos

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId) // Limpiar timeout si la respuesta llega a tiempo

      console.log('📡 [API COMPROBANTES] Response status:', response.status)

      if (!response.ok) {
        // Manejo específico para error 403 (Forbidden)
        if (response.status === 403) {
          console.warn('⚠️ [API COMPROBANTES] Servicio no autorizado (403) - sin comprobantes disponibles')
          return []
        }
        
        const errorText = await response.text()
        console.error('❌ [API COMPROBANTES] Error response:', errorText)
        
        // Para otros errores HTTP, seguir lanzando la excepción
        throw new Error(`Error HTTP: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('✅ [API COMPROBANTES] Raw data received:', data)
      console.log('✅ [API COMPROBANTES] data.success:', data.success)
      console.log('✅ [API COMPROBANTES] data.data:', data.data)
      console.log('✅ [API COMPROBANTES] Array.isArray(data.data):', Array.isArray(data.data))
      
      // NUEVO: Manejar el caso donde success es false (no hay comprobantes)
      if (!data.success) {
        console.log(`❌ [API COMPROBANTES] No hay comprobantes para reparto ${numeroReparto} (success: false)`)
        return []
      }

      const comprobantesReales = data.data || []
      console.log(`✅ [API COMPROBANTES] Found ${comprobantesReales.length} comprobantes REALES for reparto ${numeroReparto}`)
      console.log(`✅ [API COMPROBANTES] Comprobantes array:`, comprobantesReales)
      
      // IMPORTANTE: Solo devolver comprobantes reales, nunca simulados
      if (comprobantesReales.length > 0) {
        console.log(`📋 [API COMPROBANTES] Devolviendo ${comprobantesReales.length} comprobantes reales para badge`)
        return comprobantesReales.map(comp => ({
          ...comp,
          isReal: true  // Marcar como real
        }))
      }
      
      // Si no hay comprobantes reales, devolver array vacío para el badge
      console.log(`❌ [API COMPROBANTES] NO hay comprobantes reales para reparto ${numeroReparto} - Badge NO se mostrará`)
      return []
      
    } catch (error) {
      console.error('❌ [API COMPROBANTES] Error obteniendo comprobantes:', error)
      
      // Manejo específico para timeout
      if (error.name === 'AbortError') {
        console.error('⏰ [API COMPROBANTES] Timeout: La carga de comprobantes tardó más de 60 segundos')
        throw new Error('La carga de comprobantes está tardando más de lo esperado. Por favor, inténtalo de nuevo.')
      }
      
      // IMPORTANTE: En caso de error, NUNCA mostrar comprobantes simulados en el badge
      console.log('🚫 [API COMPROBANTES] Error de conexión - El badge NO mostrará comprobantes')
      return []
    }
  }

  /**
   * Obtener solo el conteo de comprobantes (para badges) sin cargar detalles
   * @param {string} reparto - Username del repartidor
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Promise<number>} Cantidad de comprobantes
   */
  async getComprobantesCount(reparto, fecha) {
    try {
      console.log(`🔢 [API CONTEO] ============ INICIANDO CONTEO ============`)
      
      // Normalizar el número de reparto para la API
      const numeroReparto = this.normalizeRepartoNumber(reparto)
      
      // Usar endpoint específico para comprobantes que va a la API externa
      const url = `/api/reparto-comprobantes?reparto=${numeroReparto}&fecha=${fecha}`
      console.log('🔢 [API CONTEO] URL:', url)
      console.log('🔢 [API CONTEO] Reparto original:', reparto)
      console.log('🔢 [API CONTEO] Reparto normalizado:', numeroReparto)
      console.log('🔢 [API CONTEO] Fecha:', fecha)

      // Crear AbortController para timeout personalizado más corto para conteo
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos para conteo

      console.log('🔢 [API CONTEO] Iniciando fetch...')
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId) // Limpiar timeout si la respuesta llega a tiempo

      console.log('📡 [API CONTEO] Response status:', response.status)
      console.log('📡 [API CONTEO] Response ok:', response.ok)

      if (!response.ok) {
        console.warn('⚠️ [API CONTEO] Comprobantes service unavailable (status:', response.status, ')')
        return 0 // Devolver 0 silenciosamente cuando no está disponible
      }

      const data = await response.json()
      console.log('✅ [API CONTEO] Raw data received:', data)
      console.log('✅ [API CONTEO] data.success:', data.success)
      console.log('✅ [API CONTEO] data.data:', data.data)
      console.log('✅ [API CONTEO] Array.isArray(data.data):', Array.isArray(data.data))
      
      // NUEVO: Manejar el caso donde success es false (no hay comprobantes)
      if (!data.success) {
        console.log(`❌ [API CONTEO] No hay comprobantes para reparto ${numeroReparto} (success: false)`)
        return 0
      }

      const comprobantesReales = data.data || []
      const count = comprobantesReales.length
      console.log(`✅ [API CONTEO] Found ${count} comprobantes para reparto ${numeroReparto}`)
      console.log(`✅ [API CONTEO] Devolviendo count: ${count} (tipo: ${typeof count})`)
      
      return count
      
    } catch (error) {
      // Manejo específico para timeout
      if (error.name === 'AbortError') {
        console.warn('⏰ [API CONTEO] Timeout: El servicio de comprobantes no responde')
      } else {
        console.warn('⚠️ [API CONTEO] Servicio de comprobantes no disponible:', error.message)
      }
      
      return 0 // Devolver 0 cuando el servicio no está disponible
    }
  }

  /**
   * Obtener URL de la imagen del comprobante con fallback inteligente
   * @param {number} id - ID del comprobante
   * @param {boolean} forceReal - Forzar el uso de imagen real (sin fallback inmediato)
   * @returns {string} URL de la imagen
   */
  getComprobanteImageUrl(id, forceReal = false) {
    const realUrl = `/api/reparto-comprobantes/${id}/file`
    console.log(`🖼️ [IMAGEN] Generando URL para comprobante ${id}: ${realUrl}`)
    return realUrl
  }

  /**
   * Obtener URL segura con fallback automático
   * @param {number} id - ID del comprobante
   * @returns {Promise<string>} URL de la imagen (real o simulada)
   */
  async getSafeImageUrl(id) {
    try {
      // Intentar verificar si la imagen real existe
      const realUrl = `/api/reparto-comprobantes/${id}/file`
      const exists = await this.checkImageExists(id)
      
      if (exists) {
        console.log(`✅ Imagen real encontrada para comprobante ${id}`)
        return realUrl
      } else {
        console.log(`📋 Usando imagen simulada para comprobante ${id}`)
        return this.getMockImageUrl(id)
      }
    } catch (error) {
      console.log(`📋 Error verificando imagen real, usando simulada para ${id}:`, error)
      return this.getMockImageUrl(id)
    }
  }

  /**
   * Verificar si una imagen existe
   * @param {number} id - ID del comprobante
   * @returns {Promise<boolean>} True si la imagen existe
   */
  async checkImageExists(id) {
    try {
      const response = await fetch(this.getComprobanteImageUrl(id), {
        method: 'HEAD'
      })
      return response.ok
    } catch (error) {
      console.error('Error verificando imagen:', error)
      return false
    }
  }

  /**
   * Obtener comprobantes - SOLO DATOS REALES (ya no hay fallback a simulados)
   * @param {string} reparto - Username del repartidor
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Array>} Lista de comprobantes reales únicamente
   */
  async getComprobantesConFallback(reparto, fecha) {
    console.log(`🔍 [MODAL] Obteniendo comprobantes para reparto ${reparto}`)
    
    // Solo obtener comprobantes reales - ya no hay fallback a simulados
    const comprobantesReales = await this.getComprobantes(reparto, fecha)
    
    if (comprobantesReales.length > 0) {
      console.log(`✅ [MODAL] Encontrados ${comprobantesReales.length} comprobantes REALES para reparto ${reparto}`)
      return comprobantesReales
    }
    
    console.log(`❌ [MODAL] No hay comprobantes para reparto ${reparto}`)
    return []
  }

  /**
   * Obtener comprobantes de hoy para un reparto (solo reales, para badge)
   * @param {string} reparto - Username del repartidor
   * @returns {Promise<Array>} Lista de comprobantes reales únicamente
   */
  async getComprobantesHoy(reparto) {
    const hoy = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    console.log(`🔍 [getComprobantesHoy] Llamando a getComprobantes para reparto ${reparto} en fecha ${hoy}`)
    
    // Solo llamar a getComprobantes que devuelve solo comprobantes reales
    const result = await this.getComprobantes(reparto, hoy)
    console.log(`✅ [getComprobantesHoy] Resultado para ${reparto}: ${result.length} comprobantes reales`)
    
    return result
  }

}

export default new ComprobantesService()
