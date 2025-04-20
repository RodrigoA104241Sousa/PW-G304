import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import 'leaflet/dist/leaflet.css'
import { createPinia } from 'pinia'

// 1. Criar a instância da app
const app = createApp(App)

// 2. Usar o Pinia (importante!)
const pinia = createPinia()
app.use(pinia)

// 3. Usar o router e montar
app.use(router).mount('#app')
