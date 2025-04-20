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
import verauditoria from './pages/verauditoria.vue'

const routes = [
  { path: '/', component: PaginaInicial }, 
  { path: '/home', component: Home },
  { path: '/perfil', component: Perfil},
  { path: '/auditorias', component: Auditoria },
  { path: '/auditoriasInfo/:id', component: AuditoriaInfo, props: true },
  {path: '/documentaracao/:id', component: Documentaracao, props: true},//botao documentação
  {path: '/maisdetalhes/:id', component: maisdetalhes},//botao mais detalhes
  {path: '/auditoriasresolvidas', component: auditoriasresolvidas},
  {path: '/upload', component: upload},// card para verificar se o upload foi feito
  {path: '/registarlocalizacao/:id', component: registarlocalizacao, props: true},//botao guardar localização
  {path: '/verauditoria/:id', component: verauditoria, props: true},//botao ver auditoria
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router