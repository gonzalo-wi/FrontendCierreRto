<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './composables/useAuth.js'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const { isAuthenticated, checkAuthStatus } = useAuth()

onMounted(async () => {
  console.log('App montado correctamente')
  await checkAuthStatus()
})
</script>

<template>
  <div id="app">
    <!-- Mostrar navbar solo si no es la página de login -->
    <Navbar v-if="route.path !== '/login'" />

    <!-- Contenido principal donde se renderizan las rutas -->
    <main :class="route.path !== '/login' ? 'container mx-auto p-4' : ''">
      <router-view />
    </main>
  </div>
</template>

<style scoped>

</style>
