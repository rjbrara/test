import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Funding from '@/pages/Funding'
import NotFound from '@/pages/404'
import HistoryDonasi from '@/pages/HistoryDonasi'
import { getToken } from '@/constans'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
//   base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/signin',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/funding',
      name: 'Funding',
      component: Funding,
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/history-donasi',
      name: 'historyDonasi',
      component: HistoryDonasi,
      meta: {
        isLoggedIn: true
      }
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

router.beforeEach((to, from, next) => {
  if(to.meta.isLoggedIn) {
    if(getToken('token')) {
      next()
    } else {
      next({ path: '/signin' })
    }
  } else {
    next()
  }
})

export default router
