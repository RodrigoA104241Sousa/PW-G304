import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/home.vue'
import PaginaInicial from './pages/paginainicial.vue'
import Perfil from './pages/perfil.vue'
import Auditoria from './pages/auditorias.vue' 
import AuditoriaInfo from './pages/auditoriaInfo.vue'
import Documentaracao from './pages/documentaracao.vue'
import maisdetalhes from './pages/maisdetalhes.vue'
import auditoriasresolvidas from './pages/auditoriasresolvidas.vue'
import upload from './components/upload.vue'
import registarlocalizacao from './pages/registarlocalizacao.vue'

const routes = [
  { path: '/', component: PaginaInicial }, 
  { path: '/home', component: Home },
  { path: '/perfil', component: Perfil},
  { path: '/auditorias', component: Auditoria },
  //{path: '/auditorias/:id', component: AuditoriaInfo, props: true}, // Pass the id as a prop to the component
  { path: '/auditoriasInfo/:id', component: AuditoriaInfo, props: true },
  {path: '/documentaracao', component: Documentaracao},//botao documentação
  {path: '/maisdetalhes', component: maisdetalhes},//botao mais detalhes
  {path: '/auditoriasresolvidas', component: auditoriasresolvidas},
  {path: '/upload', component: upload},// card para verificar se o upload foi feito
  {path: '/registarlocalizacao', component: registarlocalizacao},//botao guardar localização
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router