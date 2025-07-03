// Función para obtener los repartos
const fetchRepartos = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('🔄 Cargando datos para', props.title)
    
    if (config.DEV_MODE) {
      console.log('🧪 Modo desarrollo: intentando conectar con API real para', props.title)
      
      try {
        // Intentar usar la API real
        const data = await props.service.getRepartos()
        repartos.value = data
        console.log('✅ Datos cargados desde API real para', props.title, '- Total:', data.length, 'repartos')
      } catch (apiError) {
        console.log('⚠️ API real no disponible, usando datos simulados para', props.title, '- Error:', apiError.message)
        
        // Datos simulados de fallback
        repartos.value = [
          {
            id: `${props.title}-001`,
            idReparto: `RTO-${props.title.toUpperCase()}-001`,
            fechaReparto: '2025-07-02',
            numeroReparto: '001',
            userName: `Usuario ${props.title}`,
            depositoEsperado: 500000,
            depositoReal: 495000,
            diferencia: -5000,
            estado: 'FALTANTE',
            movimientoFinanciero: null
          },
          {
            id: `${props.title}-002`,
            idReparto: `RTO-${props.title.toUpperCase()}-002`,
            fechaReparto: '2025-07-02',
            numeroReparto: '002',
            userName: `Usuario ${props.title} 2`,
            depositoEsperado: 300000,
            depositoReal: 300000,
            diferencia: 0,
            estado: 'EXACTO',
            movimientoFinanciero: null
          }
        ]
      }
    } else {
      // En producción, usar la API directamente
      const data = await props.service.getRepartos()
      repartos.value = data
    }
  } catch (err) {
    console.error('❌ Error fetching repartos:', err)
    error.value = err.message || 'Error al cargar los repartos'
  } finally {
    loading.value = false
  }
}
