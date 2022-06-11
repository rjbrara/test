import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Funding from '@/pages/Funding'
import NotFound from '@/pages/404'
import HistoryDonasi from '@/pages/HistoryDonasi'
import Payment from '@/pages/Payment'
import Users from '@/pages/Users'
import AboutMe from '@/pages/AboutMe'
import Article from '@/pages/Article'
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
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/about',
      name: 'about-me',
      component: AboutMe,
      meta: {
        isLoggedIn: true
      }
    },
    {
      path: '/articles',
      name: 'articles',
      component: Article,
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
    },
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
