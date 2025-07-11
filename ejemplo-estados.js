// Ejemplos de uso de las nuevas funciones de manejo de estados

// 1. Obtener estados disponibles para un dropdown
async function pruebaEstadosDisponibles() {
  try {
    const statesResponse = await fetch('/api-backend/deposits/states');
    const states = await statesResponse.json();
    console.log('Estados disponibles:', states);
    // Resultado esperado: [{"value": "PENDIENTE", "label": "PENDIENTE"}, {"value": "LISTO", "label": "LISTO"}]
  } catch (error) {
    console.error('Error al obtener estados:', error);
  }
}

// 2. Cambiar estado de un depósito (solo PENDIENTE ↔ LISTO)
async function cambiarEstado(depositId, nuevoEstado) {
  try {
    const response = await fetch(`/api-backend/deposits/${depositId}/status`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({status: nuevoEstado})
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Estado del depósito ${depositId} cambiado a ${nuevoEstado}:`, result);
      return result;
    } else {
      const error = await response.json();
      console.error(`❌ Error al cambiar estado del depósito ${depositId}:`, error.detail);
      throw new Error(error.detail);
    }
  } catch (error) {
    console.error('Error en la petición:', error);
    throw error;
  }
}

// Ejemplos de uso específicos:
// cambiarEstado('39045000', 'LISTO')    // ✅ Permitido
// cambiarEstado('39045000', 'PENDIENTE') // ✅ Permitido  
// cambiarEstado('39045000', 'ENVIADO')   // ❌ No permitido desde frontend

// 3. Ejemplo de uso con los servicios actualizados

async function ejemploUsoServicios() {
  try {
    // Importar servicios
    const RtoNafaService = await import('./src/services/RtoNafaService.js');
    const RtoJumiService = await import('./src/services/RtoJumiService.js');
    const RtoLaPlataService = await import('./src/services/RtoLaPlataService.js');
    
    // Obtener estados disponibles para todos los servicios
    console.log('=== Estados disponibles ===');
    const estadosNafa = await RtoNafaService.default.getEstadosDisponibles();
    const estadosJumi = await RtoJumiService.default.getEstadosDisponibles();
    const estadosPlata = await RtoLaPlataService.default.getEstadosDisponibles();
    
    console.log('NAFA:', estadosNafa);
    console.log('Jumillano:', estadosJumi);
    console.log('La Plata:', estadosPlata);
    
    // Ejemplo de cambio de estado para un depósito específico
    console.log('=== Cambio de estado individual ===');
    const resultado = await RtoNafaService.default.cambiarEstadoDeposito('39049819', 'LISTO');
    console.log('Resultado:', resultado);
    
    // Ejemplo de cambio de estado para todo un reparto (simulado)
    console.log('=== Cambio de estado de reparto completo ===');
    const repartoEjemplo = {
      idReparto: 'RTO_001',
      deposits: [
        { deposit_id: '39049819' },
        { deposit_id: '39049820' }
      ]
    };
    
    const resultadoReparto = await RtoNafaService.default.cambiarEstadoReparto(repartoEjemplo, 'LISTO');
    console.log('Resultado del reparto:', resultadoReparto);
    
  } catch (error) {
    console.error('Error en ejemplo:', error);
  }
}

// Estructura esperada del JSON que devuelve el backend:
const ejemploDepositoBackend = {
  "deposit_id": "39049819",
  "total_amount": 309150,
  "deposit_esperado": null,
  "diferencia": 0,
  "tiene_diferencia": false,
  "estado": "PENDIENTE"
};

console.log('Estructura esperada del depósito del backend:', ejemploDepositoBackend);

export {
  pruebaEstadosDisponibles,
  cambiarEstado,
  ejemploUsoServicios
};
