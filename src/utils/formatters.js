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

// Funciones actualizadas para usar el estado del backend
export const getStatusClass = (estado) => {
  // Si recibe el estado directamente del backend, usarlo
  if (typeof estado === 'string') {
    switch (estado) {
      case 'LISTO':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
      case 'ENVIADO':
        return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200'
      case 'EXACTO':
        return 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-green-200'
      case 'SOBRANTE':
        return 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200'
      case 'FALTANTE':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
      case 'PENDIENTE':
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200'
    }
  }
  
  // Fallback para compatibilidad con código antiguo que pasa expected/real
  const expectedNum = Number(estado) || 0
  const realNum = Number(arguments[1]) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) return 'bg-green-100 text-green-800'
  return 'bg-red-100 text-red-800'
}

export const getStatus = (estado) => {
  // Si recibe el estado directamente del backend, usarlo
  if (typeof estado === 'string') {
    return estado
  }
  
  // Fallback para compatibilidad con código antiguo que pasa expected/real
  const expectedNum = Number(estado) || 0
  const realNum = Number(arguments[1]) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) return 'Exacto'
  return difference > 0 ? 'Excedente' : 'Faltante'
}

export const getRowClass = (estado) => {
  // Si recibe el estado directamente del backend, usarlo
  if (typeof estado === 'string') {
    switch (estado) {
      case 'LISTO':
      case 'EXACTO':
        return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400'
      case 'ENVIADO':
        return 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-400'
      case 'SOBRANTE':
        return 'bg-orange-50 hover:bg-orange-100 border-l-4 border-orange-400'
      case 'FALTANTE':
        return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400'
      case 'PENDIENTE':
      default:
        return 'bg-gray-50 hover:bg-gray-100 border-l-4 border-gray-400'
    }
  }
  
  // Fallback para compatibilidad con código antiguo que pasa expected/real
  const expectedNum = Number(estado) || 0
  const realNum = Number(arguments[1]) || 0
  const difference = realNum - expectedNum
  
  if (difference === 0) {
    return 'bg-green-50 hover:bg-green-100 border-l-4 border-green-400'
  } else {
    return 'bg-red-50 hover:bg-red-100 border-l-4 border-red-400'
  }
}
