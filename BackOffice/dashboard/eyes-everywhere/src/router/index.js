import { createRouter, createWebHistory } from 'vue-router'
import AppDashboard from '../views/dashboard.vue'

const routes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: AppDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
