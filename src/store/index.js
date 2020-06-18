import Vue from 'vue'
import Vuex from 'vuex'
import { ApiSibape } from './api-sibape'
import { SSO } from './sso'

Vue.use(Vuex)

const axios = require('axios').default
const STORE_DEBUG = true

// now we grab variable
/* const proc_env = process.env.NODE_ENV
console.log('App run in : ' + proc_env)
console.log('Complete env : ')
console.log(process.env)
 */
export default new Vuex.Store({
    state: {
        userInfo: null, // user info dari sso
        busy: false,    // status layar (busy) bakal mnculin modal
        lokasi: 'KANTOR',   // data lokasi
        // backend SiBAPE
        api: new ApiSibape(process.env.API_URL, process.env.API_TIMEOUT),
        sso: new SSO(),
        refData: {
            kemasan: [],
            negara: [],
            satuan: [],
            jenisDetailSekunder: [],
            airline: [],
            // dirty flags
            isNegaraDirty: true,
            isSatuanDirty: true,
            isKemasanDirty: true
        },

        sidebarActive: false
    },
    mutations: {
        setSidebarActive(state, payload) {
            state.sidebarActive = payload
        },
        setUserInfo(state, payload) {
            state.userInfo = payload
        },
        setBusyState(state, payload) {
            state.busy = payload
            // log it?
            console.log("BUSY? " + state.busy)
        },
        setLokasi(state, payload) {
            state.lokasi = payload

            // also store @ localStorage for 
            // later fetch if unavailable
            localStorage.setItem('lokasi', payload)
        },
        setToken(state, payload) {
            state.api.setToken(payload)
        },
        setDirtyFlagNegara(state, payload) {
            state.refData.isNegaraDirty = payload
        },
        setRefDataNegara(state, payload) {
            state.refData.negara = payload
        },
        clearLocalData(state) {
            state.userInfo = null
            state.lokasi = null
            localStorage.clear()
        },
        setRefDataJenisDetailSekunder(state, payload) {
            state.refData.jenisDetailSekunder = payload
        },
        setRefDataAirline(state, payload) {
            state.refData.airline = payload
        }
    },
    getters: {
        sidebar: (state) => (state.sidebarActive),
        lokasi: state => {
            if (!state.lokasi) {
                // attempt to fetch from localStorage
                // if our store is newly created
                return localStorage.getItem('lokasi')
            }
            return state.lokasi
        },
        api: state => {
            return state.api
        },
        sso: state => {
            return state.sso
        },
        negara: state => {
            return state.refData.negara
        },
        airline: state => {
            return state.refData.airline
        },
        negaraDirty: state => {
            return state.refData.isNegaraDirty
        },
        jenisDetailSekunder: state => {
            return state.refData.jenisDetailSekunder
        },
        canEdit: state => {
            // check if user role is one of 'KASI' or 'CONSOLE'
            // do we have user info?
            if (!state.userInfo) return false
            // does the user have apps?
            if (!state.userInfo.apps_data) return false
            // does the user have SiBAPE privilege?
            if (!state.userInfo.apps_data['5']) return false
            // ok, check privileges
            return state.userInfo.apps_data['5'].roles.filter(e => e == 'KASI' || e == 'CONSOLE').length > 0
        },
        canDelete: (state, getters) => isDocLocked => {
            return getters.canEdit || !isDocLocked
        },
        roles: (state) => {
            if (!state.userInfo) return false
            if (!state.userInfo.apps_data) return false
            if (!state.userInfo.apps_data['5']) return false

            return state.userInfo.apps_data['5'].roles
            // return state.userInfo.apps_data['5'].roles.filter(e => -1 !== roles.indexOf(e))
        },
        version: (state) => {
            return process.env.APP_VERSION
        },
        hasRole : (state, getters) => (roles) => {
            // special case
            if (roles === '*') {
                var arr_roles = getters.roles
                return Array.isArray(arr_roles)
            }

            // better check, split em
            var arr_roles = roles.split(',')
            var intersection = arr_roles.filter(e => getters.roles.indexOf(e) !== -1)

            return intersection.length > 0
        }
    },
    actions: {
        extractError(context, e) {
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
        storeNegara(context, payload) {
            const api = context.state.api
            // call POST
            return api.createNegara(payload)
                .then(e => {
                    // mark dirty
                    context.commit('setDirtyFlagNegara', true)
                    // well, now we fetch data again
                    return e
                })
        },
        fetchNegara(context, forceFetch) {
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
                return api.getNegara()
                    .then(e => {
                        // data is in e.data.data
                        var data = e.data.data

                        if (STORE_DEBUG) {
                            console.log('fetched Data: ')
                            console.log(data)
                        }

                        // store locally
                        context.commit('setRefDataNegara', data)
                        // store in localStorage using its JSON string
                        localStorage.setItem('ref_negara', JSON.stringify(data))
                        // remove dirty flag
                        context.commit('setDirtyFlagNegara', false)

                        if (STORE_DEBUG) {
                            console.log('-> success')
                            console.log(context.state.refData.negara)
                        }
                    })
            }
        },
        // check if can delete
        canDelete(context, isDocLocked) {
            return context.getters.canEdit || !isDocLocked
        },
        // get data jenis detail sekunder, 
        fetchRefDataJenisDetailSekunder(context) {
            // check if refDataIsThere, returning it anyway
            if (!context.state.refData.jenisDetailSekunder.length) {
                // load that shit here
                context.getters.api.getJenisDetailSekunder()
                    .then(e => {
                        // store the data
                        context.commit('setRefDataJenisDetailSekunder', e.data.data)
                    })
                    .catch(e => { })
            }
        },
        // get airline data,
        fetchAirline(context) {
            // check if the data is empty yet?
            // return promise

            return new Promise((resolve, reject) => {
                // first, check if we already have data
                if (context.state.refData.airline.length < 1) {
                    // gotta fetch and store first, then resolve
                    const api = context.state.api

                    // try to fetch airline data
                    api.getAirline()
                        .then(e => {
                            var data = e.data.data
                            // store locally
                            context.commit('setRefDataAirline', data)
                            // resolve using it
                            resolve(context.state.refData.airline)
                        })
                        .catch(e => {
                            reject(e)
                        })
                } else {
                    resolve(context.state.refData.airline)
                }
            })
        }
    }
})