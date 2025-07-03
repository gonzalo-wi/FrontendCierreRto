<template>
  <RepartoView 
    title="Nafa"
    :service="RtoNafaService"
  />
</template>

<script setup>
import RepartoView from '../components/RepartoView.vue'
import RtoNafaService from '../services/RtoNafaService.js'
</script>
