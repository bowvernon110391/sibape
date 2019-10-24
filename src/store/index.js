import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: null,
        busy: false
    },
    mutations: {
        setUserInfo (state, payload) {
            state.userInfo = payload
        },
        setBusyState (state, payload) {
            state.busy = payload
        }
    }
})