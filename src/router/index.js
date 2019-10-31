import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import MainApp from '@/components/MainApp'
import BrowseCd from '@/components/BrowseCd'
import ViewCd from '@/components/ViewCd'
import DummyView from '@/components/DummyView'
import LoginPage from '@/components/LoginPage'
import PageNotFound from '@/components/PageNotFound'
import store from '../store'

const axios = require('axios').default
const cookie = require('cookie')

Vue.use(Router)

const router = new Router({
  routes: [
      { /* root path */
         path: '/',
         component: MainApp,
         meta: {
            breadcrumb: 'Home',
            authRequired: true
         },
         children: [
            { /* /home */
               path: '',
               name: 'HomePage',
               component: HomePage,
               meta: {
                  title: 'Home Page'
               }
            },
            { /* /cd */
               path: 'cd',
               component: DummyView,
               meta: {
                  breadcrumb: 'Browse CD'
               },
               children: [
                  { // /cd/{id}
                     path: ':id',
                     name: 'ViewCd',
                     component: ViewCd,
                     props: true,
                     meta: {
                        title: 'Detail CD',
                        breadcrumb: 'Detail CD'
                     }
                  },
                  { //
                     path: '',
                     name: 'BrowseCd',
                     meta: {
                        title: 'List'
                     },
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
      },
      {
         path: '*',
         name: 'PageNotFound',
         component: PageNotFound
      }
   ]
})

// set navigation guards here
router.beforeEach((to, from, next) => {  
  console.log('-->>')
  console.log(to)

  var authRequired = to.matched.some(e => e.meta.authRequired)
  console.log("AUTH REQUIRED")

  // bypass authentication if we're in dev mode
  // also, set default userInfo
  if (process.env.NODE_ENV != 'production') {
     console.log("Not in production. Bypassing login and authentication and using default user")
     var userDemo = {
      "user_id": "666",
      "username": "user.demo",
      "name": "User Demo",
      "nip": "123456789012345678",
      "pangkat": "Penata Muda - III/a",
      "status": true,
      "apps_data": {
        "1": {
          "app_name": "SSO",
          "roles": [
            "Administrator"
          ]
        },
        "2": {
          "app_name": "APPFOTO",
          "roles": [
            "Administrator"
          ]
        },
        "3": {
          "app_name": "AKANG",
          "roles": [
            "PJT",
            "ADMIN_PABEAN",
            "SUPERUSER"
          ]
        },
        "5": {
          "app_name": "SiBAPE",
          "roles": [
            "KASI",
            "CONSOLE"
          ]
        }
      }
    }
    var lokasiDemo = "KANTOR"
    var tokenDemo = 'token_admin'
    // store default data
    store.commit('setUserInfo', userDemo)
    store.commit('setLokasi', lokasiDemo)
    store.commit('setToken', tokenDemo)
    // bypass auth
    authRequired = false
  }

  // okay, if required and we're not logged in yet (check user info)
  console.log(store.state.userInfo)
  if (authRequired /* && !store.state.userInfo */) {
    // perhaps state.userInfo is reset, but our token is still valid?
   //  var tokenData = document.cookie.split("=")
    var cookies = cookie.parse(document.cookie) 
    console.log(cookies)     
    var token = cookies.sso_token_5
    
    // use token from .env if there's one
    if (process.env.VUE_APP_TOKEN) {
       console.log('ENV token exists! using it instead...')
       token = process.env.VUE_APP_TOKEN
    }
    
    console.log("Token Cookie:")
    console.log(token)
    // show loading screen
    store.commit('setBusyState', true)
    // if no token existed, we're way off of our login process
    // so just redirect to login page
    if (!token) {
      next('/login')
      store.commit('setBusyState', false)
    } else {
      // okay, token exists meaning it must have been attached (or not)
      // 1st, request user info from sso
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
          // also store token
          store.commit('setToken', token)
          // log store data?
          console.log('store now: ')
          console.log(store)
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
    store.commit('setBusyState', false)
    next()
  }
})

export default router