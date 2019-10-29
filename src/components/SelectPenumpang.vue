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
                                    {{ option.negara.data.uraian }}
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
                <b-button :variant="showDetail ? 'secondary' : 'dark'" size="sm" @click="showDetail=!showDetail" title="Lihat/Tambah Penumpang" v-b-tooltip.hover :disabled="fetching">
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
            </b-input-group-append>
        </b-input-group>
        <!-- <b-row v-if="showDetail">
            <b-col md="12">
                <b-alert variant="dark" :show="showDetail" :dismissible="true" @dismissed="showDetail = false">
                    <h5>Detail Penumpang</h5>
                    <hr>
                    <pre>{{ detail }}</pre>
                </b-alert>
            </b-col>
        </b-row>
        <b-row v-if="error">
            <b-col md="12">
                <b-alert variant="danger" :show="error" :dismissible="true" @dismissed="error=null">
                    {{ error }}
                </b-alert>
            </b-col>
        </b-row> -->
        <b-modal 
            v-model="showDetail"
            id="modal-penumpang"
            :title="modalTitle"
            no-close-on-backdrop
            footer-bg-variant="light"
            header-bg-variant="light"
            size="lg">
            <b-row>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nama Penumpang"
                        label-for="nama-penumpang">
                        <b-form-input type="text" id="nama-penumpang" v-model="detail.nama" :disabled="saving">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Tanggal Lahir"
                        label-for="tgl-lahir">
                        <datepicker v-model="detail.tgl_lahir" :disabled="saving"></datepicker>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nomor Paspor"
                        label-for="no-paspor">
                        <b-form-input type="text" v-model="detail.no_paspor" :disabled="saving"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Kebangsaan"
                        label-for="kebangsaan">
                        <!-- <b-form-input type="text" v-model="detail.kebangsaan" :disabled="saving"></b-form-input> -->
                        <select-negara id="kebangsaan" v-model="detail.kebangsaan" :disabled="saving"></select-negara>
                    </b-form-group>
                </b-col>
                <b-col sm="12">
                    <b-form-group
                        label="Pekerjaan"
                        label-for="pekerjaan">
                        <b-form-input type="text" v-model="detail.pekerjaan" :disabled="saving"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-alert :show="error ? error.length : false" variant="danger" dismissible @dismiss="resetError">
                {{ error }}
            </b-alert>
            <template v-slot:modal-footer>
                <b-button variant="primary" :disabled="saving" @click="doSavePenumpang">
                    <template v-if="saving">
                        Menyimpan... <b-spinner small variant="light"></b-spinner>
                    </template>
                    <template v-else>
                        Simpan
                    </template>
                </b-button>
            </template>
        </b-modal>
    </div>    
</template>

<script>
import Datepicker from '@/components/Datepicker'
import SelectNegara from '@/components/SelectNegara'
import vSelect from 'vue-select'
import { debounce } from 'debounce'

export default {
    components: {
        vSelect,
        Datepicker,
        SelectNegara
    },
    props: ['id', 'value', 'placeholder', 'disabled'],
    watch: {
        value: function (newVal, oldVal) {
            console.log(`penumpang change: ${oldVal} -> ${newVal}`)
            // emit
            // this.$emit('input', newVal)
            this.fetchDetail(newVal)
        },
        error: function (newVal, oldVal) {
            if (newVal) {
                this.$bvToast.toast(newVal, {
                    title: `Error(!)`,
                    autoHideDelay: 5000,
                    appendToast: true,
                    toaster: 'b-toaster-top-center',
                    variant: 'danger'
                })
            }
        },
        detail: {
            deep: true,
            handler () {
                this.dirty = true
            }
        },
        showDetail: function(newVal, oldVal) {
            console.log("modal shown: " + newVal)
            // if we're closing, refetch
            if (!newVal) {
                this.fetchDetail(this.detail.id, true)
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
            fetching: false,
            saving: false,
            dirty: false
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
            } else {
                // reset here?
                this.detail = {...this.defaultPenumpang}
            }
            return "Input Penumpang Baru"
        }
    },
    methods: {
        fetchDetail (id, force) {
            if (this.penumpangByIdExist(id) && !force) {
                console.log('No need to fetch')
            } else {
                console.log('Fetch required for id: ' + id)
                this.fetchPenumpangById(id)
            }
        },
        resetError () {
            this.error = null
        },
        handleError (e) {
            this.$root.handleError(e)
        },
        penumpangByIdExist (id) {
            return this.listPenumpang.filter(e => e.id == id).length > 0;
        },
        fetchPenumpangById (id) {
            // reset dirty flag here?
            this.dirty = false

            // check for valid id
            if (!id) {
                // set to default data
                this.detail = {...this.defaultPenumpang}
                return
            }

            this.fetching = true
            const api = this.$store.getters.apiInstance
            api.get('/penumpang/' + id, {
                params: {
                    include: 'negara'
                }
            })
                .then(e => {
                    // fill inside options
                    // this.listPenumpang.push(e.data.data)
                    this.listPenumpang = [e.data.data]    // replace, rather than add
                    this.detail = {...e.data.data}
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
            this.detail = {...this.defaultPenumpang}
            if (e) {
                const api = this.$store.getters.apiInstance
                api.get('/penumpang/'+e)
                    .then(e => {
                        this.detail = {...e.data.data}
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
                    number: 50,
                    include: 'negara'
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
        }, 500),
        doSavePenumpang () {
            this.saving=true
            this.resetError()
            // do nothing if not dirty
            if (!this.dirty) {
                this.saving = false
                this.showDetail = false
                console.log("Nothing's dirty. Bailing out...")
                return
            }
            // grab api instance
            const api = this.$store.getters.apiInstance
            // depending on the detail.id, this could be
            var dataPenumpang = {
                nama: this.detail.nama,
                no_paspor: this.detail.no_paspor,
                kebangsaan: this.detail.kebangsaan,
                pekerjaan: this.detail.pekerjaan,
                tgl_lahir: this.detail.tgl_lahir
            }
            // UPDATE or CREATE
            if (this.detail.id) {
                // PUT request here
                api.put('/penumpang/' + this.detail.id, dataPenumpang)
                .then(e => {
                    this.saving = false
                    this.dirty = false
                    this.showDetail = false
                    // re-fetch data
                    this.fetchPenumpangById(this.detail.id)
                })
                .catch(e => {
                    this.saving = false
                    this.handleError(e)
                })
            } else {
                // POST request here
                api.post('/penumpang', dataPenumpang)
                .then(e => {
                    console.log('POST success:')
                    console.log(e)
                    this.saving = false
                    // grab id, set current value to it,
                    this.$emit('input', e.data.id)
                    // and hide modal
                    this.showDetail = false
                    this.dirty = false
                })
                .catch(e => {
                    this.saving = false
                    this.handleError(e)
                })
            }
        }
    }
}
</script>