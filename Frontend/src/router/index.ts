import { createRouter, createWebHistory } from 'vue-router'
// import loginView from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../views/Logout.vue'),
    },
    {
      path: '/book/:id',
      name: 'bookDetails',
      component: () => import('../views/BookDetails.vue'),
      props: true
    },
  ]
})
export default router