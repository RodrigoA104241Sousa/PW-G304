import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/home.vue'
import PaginaInicial from './pages/paginainicial.vue'
import Perfil from './pages/perfil.vue'
import Auditoria from './pages/auditorias.vue' 
const routes = [
  { path: '/', component: PaginaInicial }, 
  { path: '/home', component: Home },
  { path: '/perfil', component: Perfil},
  { path: '/auditorias', component: Auditoria },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router