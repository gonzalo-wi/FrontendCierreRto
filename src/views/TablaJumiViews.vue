<template>
  <RepartoView 
    title="Jumillano"
    :service="RtoJumiService"
  />
</template>

<script setup>
import RepartoView from '../components/RepartoView.vue'
import RtoJumiService from '../services/RtoJumiService.js'
</script>

<style scoped>
/* Estilos adicionales si necesitas algo específico */
</style>
