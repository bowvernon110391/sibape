import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: null,
        busy: false,
        lokasi: null
    },
    mutations: {
        setUserInfo (state, payload) {
            state.userInfo = payload
        },
        setBusyState (state, payload) {
            state.busy = payload
        },
        setLokasi (state, payload) {
            state.lokasi = payload
        }
    }
})