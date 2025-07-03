// Funciones de utilidad para formateo

export const formatDate = (dateString) => {
  // Verificar si dateString es válido
  if (!dateString || typeof dateString !== 'string') {
    return 'Fecha no disponible'
  }
  
  // Maneja diferentes formatos de fecha
  if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
    // Formato YYYY-MM-DD
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  } else if (dateString.includes('-') && dateString.split('-')[2].length === 4) {
    // Formato DD-MM-YYYY
    return dateString.replace(/-/g, '/')
  } else if (dateString.includes('/')) {
    // Ya está en formato DD/MM/YYYY
    return dateString
  }
  
  // Si no coincide con ningún formato conocido, devolver como está
  return dateString
}

export const formatCurrency = (amount) => {
  // Verificar si amount es válido
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0'
  }
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(amount))
}

export const getDifferenceClass = (expected, real) => {
  const expectedNum = Number(expected) || 0
  const realNum = Number(real) || 0
  const difference = realNum - expectedNum
  
  if (difference > 0) return 'text-green-600 font-medium'
  if (difference < 0) return 'text-red-600 font-medium'
  return 'text-gray-600 font-medium'
}

export const getStatusClass = (expected, real) => {
  const expectedNum = Number(expected) || 0
  const realNum = Number(real) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) return 'bg-green-100 text-green-800'
  return 'bg-red-100 text-red-800'
}

export const getStatus = (expected, real) => {
  const expectedNum = Number(expected) || 0
  const realNum = Number(real) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) return 'Exacto'
  return difference > 0 ? 'Excedente' : 'Faltante'
}

export const getRowClass = (expected, real) => {
  const expectedNum = Number(expected) || 0
  const realNum = Number(real) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) {
    return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400'
  } else {
    return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400'
  }
}
