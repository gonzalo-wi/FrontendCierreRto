// Script para inspeccionar la API y estructura de datos
const fetch = require('node-fetch')

async function inspectAPI() {
    try {
        console.log('🔍 Inspeccionando API...')
        
        // Llamada a los datos de depósitos
        const response = await fetch('http://localhost:8001/api/deposits/db/by-plant?date=2025-07-08')
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('📊 Respuesta completa:', JSON.stringify(data, null, 2))
        
        if (data.plants && data.plants.jumillano && data.plants.jumillano.length > 0) {
            const primerReparto = data.plants.jumillano[0]
            console.log('📊 Primer reparto de Jumillano:')
            console.log('   - ID del reparto:', primerReparto.id)
            console.log('   - deposit_id:', primerReparto.deposit_id)
            console.log('   - Depósitos:', primerReparto.deposits)
            
            if (primerReparto.deposits && primerReparto.deposits.length > 0) {
                const primerDeposito = primerReparto.deposits[0]
                console.log('📊 Primer depósito:')
                console.log('   - ID:', primerDeposito.id)
                console.log('   - deposit_id:', primerDeposito.deposit_id)
                console.log('   - Estructura completa:', JSON.stringify(primerDeposito, null, 2))
            }
        }
        
        // También inspeccionar estados
        const statesResponse = await fetch('http://localhost:8001/api/deposits/states')
        if (statesResponse.ok) {
            const states = await statesResponse.json()
            console.log('📊 Estados disponibles:', states)
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

inspectAPI()
