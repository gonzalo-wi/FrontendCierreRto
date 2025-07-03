// Test script para verificar el servicio de Jumillano
import RtoJumiService from '../services/RtoJumiService.js'

const testJumillanoService = async () => {
  console.log('🧪 Probando servicio de Jumillano...')
  
  try {
    const repartos = await RtoJumiService.getRepartos('07-02-2025')
    console.log('✅ Servicio funcionando correctamente')
    console.log('📊 Total de repartos:', repartos.length)
    
    if (repartos.length > 0) {
      console.log('📋 Primer reparto:', repartos[0])
      console.log('💰 Depósitos reales encontrados:', repartos.map(r => ({
        rto: r.idReparto,
        deposito: r.depositoReal,
        esperado: r.depositoEsperado,
        diferencia: r.diferencia
      })))
    }
    
    return repartos
  } catch (error) {
    console.error('❌ Error en el servicio:', error)
    throw error
  }
}

export { testJumillanoService }
