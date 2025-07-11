# 🎯 Funcionalidad de Edición de Estados - Documentación

## ✅ Resumen de Implementación

La aplicación ahora permite editar los estados de los depósitos y repartos directamente desde el frontend, consumiendo los endpoints del backend (puerto 8001).

## 🔧 Nuevos Componentes

### `EstadoSelector.vue`
Componente reutilizable que permite:
- Mostrar el estado actual con un badge visual
- Cambiar el estado a través de un dropdown
- Manejo de errores y estados de carga
- Soporte para estados individuales (depósitos) y masivos (repartos)

**Props:**
- `estado`: Estado actual (String)
- `editable`: Si se puede editar (Boolean, default: true)
- `tipoEntidad`: 'deposito' o 'reparto' (String)
- `servicio`: Servicio de la planta (Object)
- `entityId`: ID del depósito (String, solo para depósitos)
- `entityData`: Datos del reparto (Object, solo para repartos)

**Eventos:**
- `estado-cambiado`: Emitido cuando se cambia exitosamente
- `error`: Emitido cuando hay errores

## 🎨 Componentes Actualizados

### `RepartoRow.vue`
- ✅ Integra el nuevo `EstadoSelector`
- ✅ Usa estados del backend en lugar de cálculos locales
- ✅ Detecta automáticamente la planta para usar el servicio correcto
- ✅ Emite evento `estado-actualizado` al padre

### `RepartoTable.vue`
- ✅ Propaga el evento `estado-actualizado` al padre
- ✅ Logging para debugging

### `RepartoView.vue`
- ✅ Maneja el evento `estado-actualizado`
- ✅ Actualiza localmente el estado para UX inmediata
- ✅ Opción de refrescar datos del servidor

## 🔌 API Integration

### Endpoints Utilizados
```javascript
// Obtener estados disponibles
GET /api-backend/deposits/states
// Respuesta: [{"value": "PENDIENTE", "label": "PENDIENTE"}, {"value": "LISTO", "label": "LISTO"}]

// Cambiar estado de un depósito
PUT /api-backend/deposits/{deposit_id}/status
// Body: {"status": "LISTO"}
```

### Servicios Actualizados
Todos los servicios (`RtoNafaService`, `RtoJumiService`, `RtoLaPlataService`) ahora incluyen:

```javascript
// Obtener estados disponibles
async getEstadosDisponibles()

// Cambiar estado de un depósito individual
async cambiarEstadoDeposito(depositId, nuevoEstado)

// Cambiar estado de todos los depósitos de un reparto
async cambiarEstadoReparto(reparto, nuevoEstado)
```

## 🎯 Estados Disponibles

| Estado | Descripción | Color | Uso |
|--------|-------------|-------|-----|
| `PENDIENTE` | Estado inicial | Gris | Por defecto |
| `LISTO` | Depósito listo | Verde | Editable desde frontend |
| `ENVIADO` | Depósito enviado | Azul | Solo backend |
| `EXACTO` | Sin diferencia | Verde | Calculado por backend |
| `SOBRANTE` | Monto mayor | Naranja | Calculado por backend |
| `FALTANTE` | Monto menor | Rojo | Calculado por backend |

## 🚀 Flujo de Trabajo

1. **Usuario hace click en el estado**: Se abre dropdown con estados disponibles
2. **Usuario selecciona nuevo estado**: Se envía petición al backend
3. **Backend valida y actualiza**: Solo permite cambios PENDIENTE ↔ LISTO
4. **Frontend actualiza UI**: Estado se actualiza inmediatamente
5. **Propagación de eventos**: Todos los componentes padre se notifican

## 🔍 Debugging

### Logs a Buscar
```javascript
// En EstadoSelector
console.log('🔄 [PLANTA] Cambiando estado de depósito/reparto...')
console.log('✅ [PLANTA] Estado cambiado exitosamente')

// En RepartoRow
console.log('✅ Estado cambiado exitosamente:', evento)

// En RepartoTable
console.log('🔄 RepartoTable - Estado actualizado:', event)

// En RepartoView
console.log('🔄 Estado de reparto actualizado:', event)
```

### Verificación en Red
- Verificar requests a `/api-backend/deposits/states`
- Verificar PUT requests a `/api-backend/deposits/{id}/status`
- Verificar response status 200 para cambios exitosos

## 🛡️ Manejo de Errores

### Errores Comunes
1. **Backend no disponible**: Fallback a estados por defecto
2. **Estado no permitido**: Error mostrado al usuario
3. **Falta de permisos**: Error 403 manejado silenciosamente
4. **Red lenta/timeout**: Spinner de carga, retry automático

### Fallbacks
- Estados por defecto si backend no responde
- Logging detallado para debugging
- UI siempre responsiva, no se bloquea

## 🎮 Ejemplos de Uso

### Cambiar Estado de un Depósito Individual
```vue
<EstadoSelector
  :estado="deposito.estado"
  :editable="true"
  tipo-entidad="deposito"
  :servicio="RtoNafaService"
  :entity-id="deposito.deposit_id"
  @estado-cambiado="manejarCambio"
  @error="manejarError"
/>
```

### Cambiar Estado de Todo un Reparto
```vue
<EstadoSelector
  :estado="reparto.estado"
  :editable="true"
  tipo-entidad="reparto"
  :servicio="RtoJumiService"
  :entity-data="reparto"
  @estado-cambiado="manejarCambio"
  @error="manejarError"
/>
```

## 🔮 Próximas Mejoras

- [ ] Toast notifications para cambios de estado
- [ ] Historial de cambios de estado
- [ ] Permisos por usuario/rol
- [ ] Bulk actions para cambiar múltiples estados
- [ ] Integración con sistema de auditoría

---

La funcionalidad está completamente implementada y lista para usar. Los usuarios pueden cambiar estados directamente desde la UI de manera intuitiva y segura. 🚀
