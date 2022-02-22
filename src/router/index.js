import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Funding from '@/pages/Funding'
import NotFound from '@/pages/404'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
//   base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/funding',
      name: 'Funding',
      component: Funding,
    },
    {
      path: '/404',
      name: 'Not Found',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

export default router
