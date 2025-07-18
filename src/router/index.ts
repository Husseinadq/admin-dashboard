import { createRouter, createWebHistory } from 'vue-router'
import Dashbard from '../views/Dashbard.vue'
import Login from '../views/auth/Login.vue'
import Ticket from '../views/Ticket.vue'
import Notification from '../views/Notification.vue'
import TemplateAttributes from '../views/TemplateAttributes.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashbard,
      meta: { requiresAuth: true }
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: Ticket,
      meta: { requiresAuth: true }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notification,
      meta: { requiresAuth: true }
    },
    {
      path: '/template-attributes',
      name: 'template-attributes',
      component: TemplateAttributes,
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
})

export default router
