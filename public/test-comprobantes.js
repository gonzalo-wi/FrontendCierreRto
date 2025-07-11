// Test manual de comprobantes - ejecutar en la consola del navegador

// Función para probar un ID específico de comprobante
async function testComprobanteImage(id) {
  const url = `/api/reparto-comprobantes/${id}/file`;
  console.log(`🧪 Testing imagen comprobante ${id}: ${url}`);
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`✅ Comprobante ${id}:`, response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.log(`❌ Error comprobante ${id}:`, error);
    return false;
  }
}

// Función para probar varios IDs
async function testMultipleComprobantes(ids) {
  console.log('🚀 Iniciando tests de comprobantes...');
  const results = {};
  
  for (const id of ids) {
    results[id] = await testComprobanteImage(id);
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay entre requests
  }
  
  console.log('📊 Resultados:', results);
  return results;
}

// Ejemplos de uso:
// testComprobanteImage(7)
// testMultipleComprobantes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

console.log('🔧 Funciones de test cargadas. Usa testComprobanteImage(id) o testMultipleComprobantes([ids])');
