<template>
    <div>
        <b-input-group class="d-flex">
            <api-select 
                label="nama"
                ref="sel"
                class="flex-grow-1"
                :disabled="disabled"
                v-bind="$attrs"
                v-on="$listeners"
                :reduce="e => e.id"
                :search-callback="searchPenumpang"
                :sync-callback="syncPenumpang"
                @valueChanged="handleValueChange">
                <template v-slot:selected-option="opt">
                    <div v-if="'kebangsaan' in opt">
                        {{ opt.nama }}
                    </div>
                    <div class="text-danger" v-else>
                        Synchronizing penumpang...<b-spinner small variant="primary"></b-spinner>
                    </div>
                </template>
                <template v-slot:no-options>
                    Penumpang tidak ditemukan
                </template>
                <template v-slot:option="option">
                    <b-row v-if="'id' in option">
                        <b-col md="12">
                            <strong class="d-md-inline d-block">{{ option.nama }}</strong>
                        </b-col>
                        <b-col md="12">
                            <em class="d-md-inline d-block">📧 {{ option.email }}</em>
                        </b-col>
                        <b-col md="12">
                            <em class="d-md-inline d-block">📞 {{ option.phone }}</em>
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
            </api-select>
            <b-input-group-append>
                <b-button variant="primary" size="sm" :disabled="busy" @click="showDetail = true">
                    <!-- could be view or add depending on innerData -->
                    <template v-if="innerData">
                        <!-- there's inner data, show it -->
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                    </template>
                    <template v-else>
                        <font-awesome-icon icon="user-plus"></font-awesome-icon>
                    </template>
                </b-button>
                <!-- <b-button variant="danger" size="sm" @click="forceSync">
                    Force Sync
                </b-button> -->
            </b-input-group-append>
        </b-input-group>
        <!-- MODAL FOR INNER DETAIL -->
        <b-modal 
            v-if="detail"
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
                        <b-form-input type="text" id="nama-penumpang" v-model="detail.nama" :disabled="saving || disabled">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Tanggal Lahir"
                        label-for="tgl-lahir">
                        <datepicker v-model="detail.tgl_lahir" :disabled="saving || disabled"></datepicker>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nomor Paspor"
                        label-for="no-paspor">
                        <b-form-input type="text" v-model="detail.no_paspor" :disabled="saving || disabled"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Nomor KTP"
                        label-for="no-ktp"
                        description="opsional, hanya untuk WNI"
                        >
                        <b-form-input type="text" v-model="detail.nik" :disabled="saving || disabled"></b-form-input>
                    </b-form-group>
                </b-col>
                <b-col sm="12" md="6">
                    <b-form-group
                        label="Kebangsaan"
                        label-for="kebangsaan">
                        <!-- <b-form-input type="text" v-model="detail.kebangsaan" :disabled="saving"></b-form-input> -->
                        <select-negara id="kebangsaan" v-model="detail.kebangsaan" :disabled="saving || disabled"></select-negara>
                    </b-form-group>
                </b-col>
                <!-- <b-col sm="12">
                    <b-form-group
                        label="Pekerjaan"
                        label-for="pekerjaan">
                        <b-form-input type="text" v-model="detail.pekerjaan" :disabled="saving || disabled"></b-form-input>
                    </b-form-group>
                </b-col> -->
            </b-row>
            <b-row>
                <b-col md="6">
                    <b-form-group
                        label="E-mail"
                        label-for="email">
                        <b-form-input type="email" v-model="detail.email" :disabled="saving || disabled"></b-form-input>
                    </b-form-group>
                </b-col>

                <b-col md="6">
                    <b-form-group
                        label="Phone Number"
                        label-for="phone">
                        <b-form-input type="text" v-model="detail.phone" :disabled="saving || disabled"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
            <template v-slot:modal-footer>
                <b-button variant="primary" :disabled="saving || disabled" @click="savePenumpang">
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
import ApiSelect from '@/components/ApiSelect'
import Datepicker from '@/components/Datepicker'
import SelectNegara from '@/components/SelectNegara'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,
    mixins: [axiosErrorHandler],
    components: {
        ApiSelect,
        Datepicker,
        SelectNegara
    },
    props: ['disabled'],
    computed: {
        ...mapGetters(['api']),
        defaultPenumpang () {
            return {
                id:0,
                nama:'',
                pekerjaan:'',
                no_paspor:'',
                kebangsaan:'',
                tgl_lahir:'',
                nik:null
            }
        },
        modalTitle () {
            if (this.detail) {
                if (this.detail.id) {
                    return `Edit Penumpang #${this.detail.id}`
                }
            }
            return `Input Penumpang Baru`
        }
    },
    data () {
        return {
            busy: false,
            innerData: null,
            saving: false,
            showDetail: false,
            detail: {
                id:0,
                nama:'',
                pekerjaan:'',
                no_paspor:'',
                kebangsaan:'',
                tgl_lahir:'',
                email:'',
                phone:'',
                nik:null
            }
        }
    },
    mounted () {
        var vm = this

        // watch loading state for the button
        this.$watch('$refs.sel.loading', function (newVal) {
            vm.busy = newVal
        }, { immediate: true })

        // watch for initial option @ $refs.sel?
        this.$watch('$refs.sel.initialOptions', function (newVal) {
            console.log('Select Penumpang 2 has initial options! use it!!!')
            // if it's the only one, then FUCCKING USE IT
            if (! Array.isArray(newVal)) {
                console.log("Yeah definitely use it!")
                vm.innerData = newVal
            }
        }, { immediate: true })
    },
    watch: {
        innerData: function (newVal, oldVal) {
            console.log("old penumpang:")
            console.log(oldVal)
            console.log("new penumpang:")
            console.log(newVal)

            // if it's good data, store it?
            if (newVal) {
                this.detail = {...newVal}
            } else {
                this.detail = {...this.defaultPenumpang}
            }

            this.$emit('penumpangChange', newVal)
        },
        showDetail: function (newVal) {
            // if we're closing, force sync
            if (!newVal) {
                this.forceSync()
            }
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),

        forceEmitInput (val) {
            if (this.$refs.sel) {
                this.$refs.sel.$emit('input', val)
            }
        },
        forceSync () {
            if (this.$refs.sel) {
                console.log('force sync...')
                console.log('current value:')
                console.log(this.$refs.sel.$refs.sel.value)
                this.$refs.sel.syncValueOptions()
            }
        },

        handleValueChange (id) {
            var vm = this
            this.setBusyState(true)

            this.api.getPenumpangById(id)
            .then(e => {
                this.setBusyState(false)
                vm.innerData = e.data.data
            })
            .catch(e => {
                this.setBusyState(false)
            })
        },

        searchPenumpang(q, spinner, vm) {
            // search means innerData needs to be nulled
            this.innerData = null           

            // normal progression
            spinner(true)
            this.api.getPenumpang({
                q: q,
                number: 150
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },
        syncPenumpang(q, spinner, vm) {
            var me = this
            spinner(true)
            this.api.getPenumpangById(q)
            .then(e => {
                spinner(false)
                var data = e.data.data
                vm.setOptions([data])
                // set inner data too
                me.innerData = data
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },
        savePenumpang () {
            // first, lock all inputs
            var vm = this
            this.saving = true
            // is it save or create?
            if (this.detail.id) {
                // UPDATE penumpang
                this.api.updatePenumpang(this.detail.id, this.detail)
                .then(e => {
                    this.saving = false
                    // good. do nothing?
                    this.showToast('Saving successful!', `Data penumpang #${this.detail.id} tersimpan!`, 'success')
                })
                .catch(e => {
                    this.saving = false
                    this.handleError(e)
                })
            } else {
                // CREATE penumpang
                this.api.createPenumpang(this.detail)
                .then(e => {
                    this.saving = false
                    // good. show something
                    var newId = e.data.id
                    this.showToast('Penumpang created!', `Created penumpang with id #${newId}`, 'success')
                    // also, 
                    console.log('force emit input: ' + newId)
                    vm.forceEmitInput(newId)
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