// Script de debug para inspeccionar la estructura de datos de repartos
// Ejecutar en la consola del navegador

console.log('🔍 [DEBUG] Iniciando inspección de datos...')

// Hacer call directo a la API
fetch('/api-backend/deposits/db/by-plant?date=2025-07-08')
  .then(response => response.json())
  .then(data => {
    console.log('📊 [DEBUG] Respuesta completa:', data)
    
    if (data.plants && data.plants.jumillano) {
      console.log('📊 [DEBUG] Repartos de Jumillano:', data.plants.jumillano)
      
      if (data.plants.jumillano.length > 0) {
        const primerReparto = data.plants.jumillano[0]
        console.log('📊 [DEBUG] Primer reparto (estructura completa):', primerReparto)
        console.log('📊 [DEBUG] ID del reparto:', primerReparto.id)
        console.log('📊 [DEBUG] Depósitos del reparto:', primerReparto.deposits)
        
        if (primerReparto.deposits && primerReparto.deposits.length > 0) {
          console.log('📊 [DEBUG] Primer depósito:', primerReparto.deposits[0])
          console.log('📊 [DEBUG] ID del primer depósito:', primerReparto.deposits[0].id)
        }
      }
    }
  })
  .catch(error => {
    console.error('❌ [DEBUG] Error:', error)
  })

// También inspeccionar estados
fetch('/api-backend/deposits/states')
  .then(response => response.json())
  .then(data => {
    console.log('📊 [DEBUG] Estados disponibles:', data)
  })
  .catch(error => {
    console.error('❌ [DEBUG] Error obteniendo estados:', error)
  })
