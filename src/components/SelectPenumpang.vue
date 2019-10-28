<template>
    <div>
        <!-- Make it into a group input -->
        <b-input-group class="d-flex">
            <v-select 
                :disabled="disabled || fetching"
                class="flex-grow-1"
                label="nama"
                :id="id" 
                :value="value"
                @input="updatePenumpang"
                :reduce="e => e.id"
                :filterable="false"
                :searchable="true"
                :options="listPenumpang"
                @search="doSearchPenumpang"
                :placeholder="placeholder">
                <template v-slot:no-options>
                    Penumpang tidak ditemukan
                </template>
                <template v-slot:option="option">
                    <b-row v-if="'id' in option">
                        <b-col md="6">
                            <strong class="d-md-inline d-block">{{ option.nama }}</strong> <em class="d-md-inline d-block">({{ option.pekerjaan }})</em>
                        </b-col>
                        <b-col md="6">
                            <b-row>
                                <b-col md="6">
                                    {{ option.kebangsaan }}
                                </b-col>
                                <b-col md="6">
                                    {{ option.no_paspor }}
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row v-else>
                        <b-col>
                            <em>Tambah Penumpang <strong>{{ option.nama }}...</strong></em>
                        </b-col>
                    </b-row>
                </template>
                </v-select>
            <b-input-group-append>
                <b-button :variant="showDetail ? 'secondary' : 'dark'" size="sm" @click="showDetail=!showDetail">
                    <template v-show="!showDetail && !fetching && detail.id">
                        <span v-show="!showDetail && !fetching  && detail.id">
                            <i class="fa fa-eye"></i>
                        </span>
                    </template>
                    <template v-show="showDetail && !fetching  && detail.id">
                        <span v-show="showDetail && !fetching  && detail.id">
                            <i class="fa fa-eye-slash"></i>
                        </span>
                    </template>
                    <template v-show="!detail.id && !fetching">
                        <span v-show="!detail.id && !fetching">
                            <i class="fa fa-plus"></i>
                        </span>
                    </template>
                    <b-spinner variant="light" type="grow" small v-if="fetching" label="fetching..."></b-spinner>
                </b-button>
                <!-- <b-button size="sm" variant="primary">
                    <i class="fa fa-plus"></i>
                </b-button> -->
            </b-input-group-append>
        </b-input-group>
        <b-row v-if="showDetail">
            <b-col md="12">
                <b-alert variant="dark" :show="showDetail" :dismissible="true" @dismissed="showDetail = false">
                    <h5>Detail Penumpang</h5>
                    <hr>
                    <pre v-if="detail">{{ detail }}</pre>
                    <div v-else class="text-center">
                        <b-spinner variant="danger" small></b-spinner>
                        Loading...
                        <b-spinner variant="danger" small></b-spinner>
                    </div>
                </b-alert>
            </b-col>
        </b-row>
        <b-row v-if="error">
            <b-col md="12">
                <b-alert variant="danger" :show="error" :dismissible="true" @dismissed="error=null">
                    {{ error }}
                </b-alert>
            </b-col>
        </b-row>
        <b-modal 
            v-model="showDetail"
            id="modal-penumpang"
            :title="modalTitle"
            no-close-on-backdrop
            class="shadow">
            <b-row>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nama Penumpang"
                        label-for="nama-penumpang">
                        <b-form-input type="text" id="nama-penumpang" v-model="detail.nama">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Tanggal Lahir"
                        label-for="tgl-lahir">
                        <datepicker v-model="detail.tgl_lahir"></datepicker>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nomor Paspor"
                        label-for="no-paspor">
                        <b-form-input type="text" v-model="detail.no_paspor"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Kebangsaan"
                        label-for="kebangsaan">
                        <b-form-input type="text" v-model="detail.kebangsaan"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12">
                    <b-form-group
                        label="Pekerjaan"
                        label-for="pekerjaan">
                        <b-form-input type="text" v-model="detail.pekerjaan"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-alert :show="error ? error.length : false" variant="danger" dismissible>
                Some error happened here
            </b-alert>
        </b-modal>
    </div>    
</template>

<script>
import Datepicker from '@/components/Datepicker'
import vSelect from 'vue-select'
import { debounce } from 'debounce'

export default {
    components: {
        vSelect,
        Datepicker
    },
    props: ['id', 'value', 'placeholder', 'disabled'],
    watch: {
        value: function (newVal, oldVal) {
            console.log(`penumpang change: ${oldVal} -> ${newVal}`)
            // emit
            // this.$emit('input', newVal)
            if (this.penumpangByIdExist(newVal)) {
                console.log('No need to fetch')
            } else {
                console.log('Fetch required for id: ' + newVal)
                this.fetchPenumpangById(newVal)
            }
        }
    },
    data () {
        return {
            selected: null,
            error: null,
            detail: {
                id:0,
                nama:null,
                pekerjaan:null,
                kebangsaan:null,
                no_paspor:null,
                tgl_lahir:null
            },
            listPenumpang: [],
            showDetail: false,
            fetching: false
        }
    },
    computed: {
        defaultPenumpang: function () {
            return {
                id:0,
                nama:'',
                pekerjaan:'',
                no_paspor:'',
                kebangsaan:'',
                tgl_lahir:''
            }
        },
        modalTitle: function () {
            if (this.detail.id) {
                return "Detail Penumpang #" + this.detail.id
            } 
            return "Input Penumpang Baru"
        }
    },
    methods: {
        handleError (e) {
            // build custom error text
            if (e.response) {
                // do we havedata?
                if ('data' in e.response) {
                    this.error = `error ${e.response.data.error.http_code} : ${e.response.data.error.message}`
                } else {
                    // generic
                    this.error = `error ${e.response.status} : ${e.response.statusText}`
                }
            } else {
                this.error = "Unexpected error"
            }
        },
        penumpangByIdExist (id) {
            return this.listPenumpang.filter(e => e.id == id).length > 0;
        },
        fetchPenumpangById (id) {
            if (!id) {
                // set to default data
                this.detail = this.defaultPenumpang
                return
            }

            this.fetching = true
            const api = this.$store.getters.apiInstance
            api.get('/penumpang/' + id)
                .then(e => {
                    // fill inside options
                    this.listPenumpang.push(e.data.data)
                    this.detail = e.data.data
                    this.fetching = false
                })
                .catch(e => {
                    this.handleError(e)
                    this.fetching = false
                })
        },
        updatePenumpang (e) {
            this.$emit('input', e)

            // call api if valid
            this.detail = this.defaultPenumpang
            if (e) {
                const api = this.$store.getters.apiInstance
                api.get('/penumpang/'+e)
                    .then(e => {
                        this.detail = e.data.data
                        console.log(e)
                    })
                    .catch(e => {
                        this.handleError(e)
                    })
            }
        },
        doSearchPenumpang (search, loading) {
            // start spinner
            loading(true)
            // if no query string (when blurs out usually), bails out
            if (search == '') {
                loading(false)
                return
            }
            // do the real search (debounced)
            this.searchPenumpang(search, loading, this, this.$store.getters.apiInstance)
        },
        searchPenumpang: debounce((search, loading, vm, api) => {
            // do api call
            api.get('/penumpang', {
                params: {
                    q: search,
                    number: 50
                }
            })
            .then(e => {
                loading(false)
                vm.listPenumpang = [...e.data.data]
            })
            .catch(e => {
                loading(false)
                this.handleError(e)
            })
        }, 500)
    }
}
</script>