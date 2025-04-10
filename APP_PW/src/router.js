import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/home.vue'
import PaginaInicial from './pages/paginainicial.vue'
import Perfil from './pages/perfil.vue'
import Auditoria from './pages/auditorias.vue' 
import AuditoriaInfo from './pages/auditoriaInfo.vue'
import Documentaracao from './pages/documentaracao.vue'
import maisdetalhes from './pages/maisdetalhes.vue'
const routes = [
  { path: '/', component: PaginaInicial }, 
  { path: '/home', component: Home },
  { path: '/perfil', component: Perfil},
  { path: '/auditorias', component: Auditoria },
  //{path: '/auditorias/:id', component: AuditoriaInfo, props: true}, // Pass the id as a prop to the component
  {path: '/auditoriasInfo', component: AuditoriaInfo},
  {path: '/documentaracao', component: Documentaracao},
  {path: '/maisdetalhes', component: maisdetalhes},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router