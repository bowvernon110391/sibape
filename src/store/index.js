import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const axios = require('axios').default
const STORE_DEBUG = true

// now we grab variable
const proc_env = process.env.NODE_ENV
console.log('App run in : ' + proc_env)
console.log('Complete env : ' + JSON.stringify(process.env))

export default new Vuex.Store({
    state: {
        userInfo: null, // user info dari sso
        busy: false,    // status layar (busy) bakal mnculin modal
        lokasi: null,   // data lokasi
        // api instance
        api: axios.create({
            baseURL: process.env.VUE_APP_URL,
            timeout: 15000
        }),
        refData: {
            kemasan: [],
            negara: [],
            satuan: [],
            // dirty flags
            isNegaraDirty: true,
            isSatuanDirty: true,
            isKemasanDirty: true
        }
    },
    mutations: {
        setUserInfo (state, payload) {
            state.userInfo = payload
            if (STORE_DEBUG) {
                console.log('axios')
                console.log(state.api)
            }
        },
        setBusyState (state, payload) {
            state.busy = payload
        },
        setLokasi (state, payload) {
            state.lokasi = payload
        },
        setToken (state, payload) {
            state.api.defaults.headers.common['Authorization'] = 'Bearer ' + payload
        },
        setDirtyFlagNegara(state, payload) {
            state.refData.isNegaraDirty = payload
        },
        setRefDataNegara(state, payload) {
            state.refData.negara = payload
        }
    },
    getters: {
        apiInstance: state => {
            return state.api
        },
        negara: state => {
            return state.refData.negara
        },
        negaraDirty: state => {
            return state.refData.isNegaraDirty
        }
    },
    actions: {
        extractError (context, e) {
            // normal error
            if (e.response) {
                if (e.response.data) {
                    return {
                        code: e.response.data.error.http_code,
                        message: e.response.data.error.message
                    }
                } else {
                    return {
                        code: e.status,
                        message: e.statusText
                    }
                }
            } 

            return {
                code: 999,
                message: e.toString()
            }
        },
        storeNegara (context, payload) {
            const api = context.state.api
            // call POST
            return api.post('/negara', payload)
                .then(e => {
                    // mark dirty
                    context.commit('setDirtyFlagNegara', true)
                    // well, now we fetch data again
                    return e
                })
        },
        fetchNegara (context, forceFetch) {
            // just return current data if not dirty
            if (!context.getters.negaraDirty) {
                if (STORE_DEBUG) {
                    console.log('fetchNegara not dirty, fetching from local store data')
                    console.log(context.state.refData.negara)
                }

                return new Promise((resolve) => {
                    resolve(context.state.refData.negara)
                })
            }

            // check if there's data in localstorage
            var storedNegara = false // localStorage.getItem('ref_negara')

            // there's data in localStorage
            if (storedNegara) {
                if (STORE_DEBUG) {
                    console.log('fetchNegara fetching from localStorage data...')
                }
                // return custom promise
                return new Promise((resolve, reject) => {
                    // parsing json might fail, wrap in try/catch block
                    try {
                        // parse the json if possible
                        var data = JSON.parse(storedNegara)
                        // store it locally?
                        context.commit('setRefDataNegara', data)
                        // remove dirty flag
                        context.commit('setDirtyFlagNegara', false)
                        // resolve using it
                        resolve(data)

                        if (STORE_DEBUG) {
                            console.log('-> success')
                            console.log(context.state.refData.negara)
                        }
                    } catch (error) {
                        // otherwise, reject with error
                        reject(error)

                        if (STORE_DEBUG) {
                            console.log('-> error')
                        }
                    }
                })
            } else {
                if (STORE_DEBUG) {
                    console.log('fetchNegara fetching from api')
                }
                // welp, nothing was stored. fetch from api now!
                const api = context.state.api

                // return promise from axios
                return api.get('/negara')
                    .then(e => {
                        // data is in e.data.data
                        var data = e.data.data

                        if (STORE_DEBUG) {
                            console.log('fetched Data: ')
                            console.log(data)
                        }

                        // transform to set id into its code
                        var correctData = data.map(e => ({
                            id: e.kode,
                            kode: e.kode,
                            uraian: e.uraian
                        }))
                        // store locally
                        context.commit('setRefDataNegara', correctData)
                        // store in localStorage using its JSON string
                        localStorage.setItem('ref_negara', JSON.stringify(correctData))
                        // remove dirty flag
                        context.commit('setDirtyFlagNegara', false)

                        if (STORE_DEBUG) {
                            console.log('-> success')
                            console.log(context.state.refData.negara)
                        }
                    })
            }
        }
    }
})