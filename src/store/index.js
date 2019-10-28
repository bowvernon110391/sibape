import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios').default

export default new Vuex.Store({
    state: {
        userInfo: null, // user info dari sso
        busy: false,    // status layar (busy) bakal mnculin modal
        lokasi: null,   // data lokasi
        // api instance
        api: axios.create({
            baseURL: 'http://api-sibape.soetta.xyz/',
            timeout: 15000
        }),
        refData: {
            kemasan: null,
            negara: null,
            satuan: null
        }
    },
    mutations: {
        setUserInfo (state, payload) {
            state.userInfo = payload
            console.log('axios')
            console.log(state.api)
        },
        setBusyState (state, payload) {
            state.busy = payload
        },
        setLokasi (state, payload) {
            state.lokasi = payload
        },
        setToken (state, payload) {
            state.api.defaults.headers.common['Authorization'] = 'Bearer ' + payload
        }
    },
    getters: {
        apiInstance: state => {
            return state.api
        }
    }
})