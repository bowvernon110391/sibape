// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
   faCalendarAlt, faLock, faLockOpen, faUserCircle,
   faUser, faUserAlt, faPowerOff, faEye, faUserPlus,
   faSave, faSearch, faPencilAlt, faPlusSquare, faMinusSquare,
   faTrashAlt, faPlaneDeparture, faMoneyCheckAlt
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCalendarAlt, faLock, faLockOpen, faUserCircle, 
   faUser, faUserAlt, faPowerOff, faEye, faUserPlus, faSave,
   faSearch, faPencilAlt, faPlusSquare, faMinusSquare, faTrashAlt,
   faPlaneDeparture, faMoneyCheckAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Bootstrap
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// import './assets/css/style.css'
// vue-select
import 'vue-select/dist/vue-select.css'

// our custom style.css
// import './assets/style.css'

// mixins?
// import axiosErrorHandler from './mixins/axiosErrorHandler'

Vue.use(BootstrapVue)
// Vue.mixin(axiosErrorHandler)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
   el: '#app',
   router,
   store,
   components: { App },
   template: '<App/>'
})
