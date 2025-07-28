<template>
  <!-- El LoginForm maneja todo el diseño, este componente solo maneja la lógica de navegación -->
  <LoginForm @login-success="handleLoginSuccess" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'

const router = useRouter()

const handleLoginSuccess = (userData) => {
  // El login ya se maneja en el composable useAuth
  console.log('Login exitoso:', userData)
  
  // Redirigir al dashboard
  router.push('/')
}
</script>
