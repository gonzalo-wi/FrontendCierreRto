import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Importar las rutas
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
