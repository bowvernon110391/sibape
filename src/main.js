// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
   faUserSecret, faCaretDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret, faCaretDown)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import './assets/css/style.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/js/all'

// vue-select
import 'vue-select/dist/vue-select.css'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
   el: '#app',
   router,
   store,
   components: { App },
   template: '<App/>',
   methods: {
      // show success message
      showToast(title,message,variant) {
         this.$bvToast.toast(message, {
            title: title,
            autoHideDelay: 5000,
            appendToast: true,
            toaster: 'b-toaster-top-center',
            variant: variant
        })
      },
      // show floating error
      showError(code, message) {
          this.showToast(`Error (${code})`, message, 'danger')
      },
      handleError (e) {
          var code = 0
          var msg = '<GENERIC ERROR TEXT>'
          // e is axios error
          if (e.response) {
              // got response
              if (e.response.data) {
                  // stylized error
                  code = e.response.data.error.http_code
                  msg = e.response.data.error.message
              } else {
                  code = e.status
                  msg = e.statusText
              }
          } else {
              code = '?'
              msg = e.toString()
          }
  
          // show floating text
          this.showError(code, msg)
      }
    }
})
