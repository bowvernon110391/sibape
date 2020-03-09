import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import MainApp from '@/components/MainApp'
import BrowseCd from '@/components/BrowseCd'
import ViewCd from '@/components/ViewCd'

import DummyView from '@/components/DummyView'
import LoginPage from '@/components/LoginPage'
import PageNotFound from '@/components/PageNotFound'
import BrowsePenumpang from '@/components/BrowsePenumpang'
import BrowseKurs from '@/components/BrowseKurs'
// import PrintSppbmcp from '@/components/PrintSppbmcp'

import BrowseBpj from '@/components/BrowseBpj'
import ViewBpj from '@/components/ViewBpj'

import BrowseSpp from '@/components/BrowseSpp'
import ViewSpp from '@/components/ViewSpp'

// ST
import BrowseSt from '@/components/BrowseSt'

import store from '../store'

const axios = require('axios').default
const cookie = require('cookie')

Vue.use(Router)

const router = new Router({
  routes: [
      // specific path put first so it can resolve
      /* {
         path: '/print-sppbmcp',
         component: PrintSppbmcp
      }, */
      { 
        /* root path */
         path: '/',
         component: MainApp,
         meta: {
            breadcrumb: '🏠Home',
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
                  breadcrumb: '🔍Browse CD'
               },
               children: [
                  { // /cd/{id}
                     path: ':id',
                     name: 'ViewCd',
                     component: ViewCd,
                     props: true,
                     meta: {
                        title: 'Detail CD',
                        breadcrumb: '💰Lihat Detail CD'
                     }
                  },
                  { //
                     path: '',
                     name: 'BrowseCd',
                     meta: {
                        title: 'Browse Customs Declaration'
                     },
                     component: BrowseCd
                  }
               ]
            },
            /* penumpang */
            {
              path: 'penumpang',
              name: 'BrowsePenumpang',
              meta: {
                breadcrumb: '🔍Browse Penumpang',
                title: 'Browse Data Penumpang'
              },
              component: BrowsePenumpang
            },
            /* kurs */
            {
              path: 'kurs',
              component: DummyView,
              meta: {
                breadcrumb: '🔍Browse Data Kurs',
                title: 'Browse Data Kurs'
              },
              component: BrowseKurs
            },
            /* bpj */
            {
              path: 'bpj',
              meta: {
                breadcrumb: '🔍Browse BPJ'
              },
              component: DummyView,
              children: [
                // /bpj/:id (ViewBpj)
                {
                  path: ':id',
                  name: 'ViewBpj',
                  component: ViewBpj,
                  props: true,
                  meta: {
                    title: 'Detail BPJ',
                    breadcrumb: '📝Lihat Detail BPJ'
                  }
                },
                // default (Browse BPJ)
                {
                  path: '',
                  name: 'BrowseBpj',
                  component: BrowseBpj,
                  meta: {
                    title: 'Browse BPJ'
                  }
                }
              ]              
            },
            /* spp */
            {
              path: 'spp',
              meta: {
                breadcrumb: '🔍Browse SPP'
              },
              component: DummyView,
              children: [
                {
                  path: ':id',
                  name: 'ViewSpp',
                  component: ViewSpp,
                  props: true,
                  meta: {
                    title: 'Detail SPP',
                    breadcrumb: '✋Lihat Detail SPP'
                  }
                },
                // default (Browse SPP)
                {
                  path: '',
                  name: 'BrowseSpp',
                  component: BrowseSpp,
                  meta: {
                    title: 'Browse SPP'
                  }
                }
              ]
            },
            /* st */
            {
              path: 'st',
              meta: {
                breadcrumb: '🔍Browse ST'
              },
              component: DummyView,
              children: [
                /* {
                  path: ':id',
                  name: 'ViewSpp',
                  component: ViewSpp,
                  props: true,
                  meta: {
                    title: 'Detail SPP',
                    breadcrumb: '✋Lihat Detail SPP'
                  }
                }, */
                // default (Browse SPP)
                {
                  path: '',
                  name: 'BrowseSt',
                  component: BrowseSt,
                  meta: {
                    title: 'Browse ST'
                  }
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
   ],

  //  mode: 'history'
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

     var mockRoles = {
       token_pdtt: ['PDTT'],
       token_admin: ['CONSOLE','KASI']
     }

     var lokasiDemo = process.env.MOCK_LOKASI || "KANTOR"
     var tokenDemo = process.env.MOCK_TOKEN || 'token_admin'

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
          "roles": mockRoles[tokenDemo]
        }
      }
    }
    
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