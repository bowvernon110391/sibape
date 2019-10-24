import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import MainApp from '@/components/MainApp'
import BrowseCd from '@/components/BrowseCd'
import ViewCd from '@/components/ViewCd'
import DummyView from '@/components/DummyView'
import LoginPage from '@/components/LoginPage'
import store from '../store'

const axios = require('axios').default

Vue.use(Router)

const router = new Router({
  routes: [
    // ROOT PATH
    {
      path: '/',
      component: MainApp,
      meta: {
        breadcrumb: 'Home',
        authRequired: true
      },
      children: [
        // /home
        {
          path: '',
          name: 'HomePage',
          component: HomePage
        },
        // /cd
        {
          path: 'cd',
          component: DummyView,
          meta: {
            breadcrumb: 'Browse CD'
          },
          children: [
            // /cd/{id}
            {
              path: ':id',
              name: 'ViewCd',
              component: ViewCd,
              props: true,
              meta: {
                breadcrumb: 'Detail CD'
              }
            },
            //
            {
              path: '',
              name: 'BrowseCd',
              component: BrowseCd
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    }
  ]
})

// set navigation guards here
router.beforeEach((to, from, next) => {
  console.log('-->>')
  console.log(to)

  const authRequired = to.matched.some(e => e.meta.authRequired)
  console.log("AUTH REQUIRED")

  // okay, if required and we're not logged in yet (check user info)
  console.log(store.state.userInfo)
  if (authRequired /* && !store.state.userInfo */) {
    // perhaps state.userInfo is reset, but our token is still valid?
    var tokenData = document.cookie.split("=")
    console.log("Token Cookie:")
    console.log(tokenData)

    // if no token existed, we're way off of our login process
    // so just redirect to login page
    if (tokenData.length < 2) {
      next('/login')
    } else {
      // okay, token exists meaning it must have been attached (or not)
      // 1st, request user info from sso
      store.commit('setBusyState', true)
      axios({
        method: 'get',
        url: '/static/sso/api.php?command=getUserInfo'
      })
      .then((e) => {
        store.commit('setBusyState', false)
        // we got user info! but is it empty?
        if (!e.data) {
          // empty!! We're not logged in
          next('/login')
        } else {
          // data is valid. store it to store
          store.commit('setUserInfo', e.data)
          // redirect to whatever page we were accessing
          next()
        }
      })
      .catch((e) => {
        store.commit('setBusyState', false)
        // obviously we're in deep trouble
        // either the token is not-attached to sso session
        // or sso server is down. For now, redirect to
        // login
        next('/login')
      })
      
    }
  } else {
    next()
  }
})

export default router