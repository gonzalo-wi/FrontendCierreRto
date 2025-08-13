<template>
  <RepartoView 
    title="Ciudadela"
    :service="RtoJumiService"
  />
</template>

<script setup>
import RepartoView from '../components/RepartoView.vue'
import RtoJumiService from '../services/RtoJumiService.js'

console.log('🔵 [JUMILLANO VIEW] Componente TablaJumiViews cargado')
console.log('🔵 [JUMILLANO VIEW] RtoJumiService:', RtoJumiService)
</script>

<style scoped>
/* Estilos adicionales si necesitas algo específico */
</style>
