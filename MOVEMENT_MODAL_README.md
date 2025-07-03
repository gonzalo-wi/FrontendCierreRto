# Modal de Edición de Movimientos Financieros

## Descripción General

El `EditMovementModal.vue` es un componente dinámico que permite crear y editar movimientos financieros específicamente para dos tipos: **RETENCIÓN** y **CHEQUE**. El modal adapta su interfaz y validaciones según el tipo de movimiento seleccionado.

## Tipos de Movimiento Soportados

### 1. RETENCIÓN ⚠️
Campos específicos:
- **Número de Retención** (`nro_retencion`): Identificador único de la retención
- Validación: Mínimo 3 caracteres

### 2. CHEQUE 📄
Campos específicos:
- **Banco** (`banco`): Nombre del banco emisor
- **Sucursal** (`sucursal`): Sucursal del banco
- **Localidad** (`localidad`): Ubicación geográfica
- **Número de Cheque** (`nro_cheque`): Número del cheque
- **Número de Cuenta** (`nro_cuenta`): Cuenta bancaria asociada
- **Titular** (`titular`): Nombre del titular del cheque
- Validaciones específicas para cada campo

## Campos Comunes

Independientemente del tipo, todos los movimientos requieren:
- **Tipo de Movimiento** (`tipo`): RETENCIÓN o CHEQUE
- **Número de Cuenta** (`nrocta`): Cuenta contable (mín. 4 caracteres)
- **Concepto** (`concepto`): Descripción del movimiento (mín. 3 caracteres)
- **Fecha** (`fecha`): Fecha del movimiento
- **Importe** (`importe`): Monto mayor a 0

## Comportamiento Dinámico

### Cambio de Tipo
Cuando el usuario cambia el tipo de movimiento:
1. Se limpian automáticamente los campos específicos del tipo anterior
2. Se eliminan los errores de validación del tipo anterior
3. Se sugiere un concepto por defecto:
   - RETENCIÓN: "Retención"
   - CHEQUE: "Pago con cheque"

### Validación en Tiempo Real
- Cada campo se valida mientras el usuario escribe
- Los errores se muestran inmediatamente debajo de cada campo
- El botón "Guardar" se habilita solo cuando todos los campos requeridos son válidos

### Interfaz Visual
- **RETENCIÓN**: Sección con fondo naranja claro e icono de advertencia
- **CHEQUE**: Sección con fondo azul claro e icono de tarjeta de crédito
- Campos organizados en grid responsive (1 columna en móvil, 2 en desktop)

## Estructura de Datos

### Objeto de Salida (RETENCIÓN)
```javascript
{
  tipo: "RETENCION",
  nrocta: "12345678",
  concepto: "Retención IIBB",
  fecha: "2024-01-15",
  importe: 1500.00,
  nro_retencion: "RET-001"
}
```

### Objeto de Salida (CHEQUE)
```javascript
{
  tipo: "CHEQUE",
  nrocta: "87654321",
  concepto: "Pago con cheque",
  fecha: "2024-01-15",
  importe: 2500.00,
  banco: "Banco Nación",
  sucursal: "Centro",
  localidad: "La Plata",
  nro_cheque: "12345678",
  nro_cuenta: "1234567890",
  titular: "Juan Pérez"
}
```

## Eventos

### Props
- `isVisible`: Boolean - Controla la visibilidad del modal
- `reparto`: Object - Datos del reparto y movimiento existente (si se está editando)
- `saving`: Boolean - Estado de guardado para mostrar spinner

### Emits
- `close`: Se emite cuando se cierra el modal
- `save`: Se emite con los datos del formulario cuando se valida correctamente

## Características de UX/UI

### Animaciones
- Transiciones suaves de entrada/salida del modal
- Animaciones escalonadas para los campos del formulario
- Efectos hover en iconos y botones

### Responsive Design
- Layout adaptable a diferentes tamaños de pantalla
- Botones que se expanden en móviles
- Font-size optimizado para evitar zoom en iOS

### Accesibilidad
- Iconos descriptivos para cada campo
- Mensajes de error claros y específicos
- Estados visuales para campos con errores
- Navegación por teclado

### Estados de Carga
- Spinner animado durante el guardado
- Botones deshabilitados durante operaciones
- Feedback visual inmediato

## Uso del Componente

```vue
<template>
  <EditMovementModal
    :isVisible="showModal"
    :reparto="selectedReparto"
    :saving="isSaving"
    @close="closeModal"
    @save="saveMovement"
  />
</template>

<script>
const saveMovement = (movementData) => {
  console.log('Guardando movimiento:', movementData)
  // Lógica para guardar en el backend
}
</script>
```

## Mejoras Futuras

1. **Autocompletado**: Implementar autocompletado para bancos y sucursales
2. **Validación de CBU**: Validar formato de números de cuenta bancaria
3. **Cálculo Automático**: Calcular automáticamente retenciones según porcentajes
4. **Historial**: Mostrar movimientos anteriores similares
5. **Templates**: Guardar plantillas de movimientos frecuentes

## Consideraciones Técnicas

- Compatible con Vue 3 Composition API
- Utiliza Teleport para renderizar en el body
- CSS modular con Tailwind CSS
- Validación reactiva con watchers
- Estado del formulario completamente reactivo
