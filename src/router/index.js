import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('../views/Overview/OverviewPage.vue')

    },

    {
      path: '/device',
      name: 'device',
      component: () => import('../views/Device/DevicePage.vue')
    },

    {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/Payment/PaymentPage.vue')
    },

    {
      path: '/report',
      name: 'report',
      component: () => import('../views/Report/ReportPage.vue')
    },

    {
      path: '/system',
      name: 'system',
      component: () => import('../views/System/SystemPage.vue')
    }
  ]
})

export default router
