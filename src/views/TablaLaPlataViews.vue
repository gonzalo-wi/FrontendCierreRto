<template>
  <RepartoView 
    title="La Plata"
    :service="RtoLaPlataService"
  />
</template>

<script setup>
import RepartoView from '../components/RepartoView.vue'
import RtoLaPlataService from '../services/RtoLaPlataService.js'
</script>
