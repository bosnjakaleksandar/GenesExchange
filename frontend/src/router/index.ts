import { createRouter, createWebHistory } from 'vue-router'
// import AuthView from '../views/AuthView.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import RatesView from '../views/RatesView.vue'
import CalculatorView from '@/views/CalculatorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'auth',
    //   component: AuthView,
    // },
    {
      path: '/',
      name: 'početna',
      component: HomeView,
    },
    {
      path: '/o-nama',
      name: 'o-nama',
      component: AboutView,
    },
    {
      path: '/kursna-lista',
      name: 'kursna-lista',
      component: RatesView,
    },
    {
      path: '/kalkulator',
      name: 'kalkulator',
      component: CalculatorView,
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

export default router
