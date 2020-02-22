<template>
    <div v-if="dataSpp.cd">
        <!-- Title at the top, showing lock status too -->
        <h4>
            <template v-if="!isNew">
                <span :class="[ dataSpp.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']">SPP #{{ id }} <b-badge variant="light"><font-awesome-icon :icon="dataSpp.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataSpp.is_locked ? "LOCKED" : "OPEN" }}</b-badge></span>
            </template>
            <template v-else>
                Input SPP Baru
            </template>
        </h4>
        <!-- Tombol Penyelesaian? -->
        <b-row class="my-2" v-if="id != 'new'">
            <b-col>
                <div class="text-right" ref="btnCetak">
                    <b-button-group size="sm" class="shadow">
                        <!-- apabila dijadikan impor sementara -->
                        <b-button variant="dark">
                            <font-awesome-icon icon="print">
                            </font-awesome-icon>
                            Cetak
                        </b-button>
                    </b-button-group>

                </div>
            </b-col>
        </b-row>

        <!-- Nomor & Tgl Dokumen + Alamat -->
        <b-row>
            <!-- 1st col, nomor & tgl dokumen -->
            <b-col md="6">
                <b-form-group label="Nomor &amp; Tgl SPP">
                    <b-input-group>
                        <b-form-input class="rounded-left flex-grow-1" v-model="dataSpp.nomor_lengkap" type="text" disabled></b-form-input>
                        <template v-slot:append>
                            <datepicker class="rounded-right" id="tgl_dok" v-model="dataSpp.tgl_dok" :disabled="disableInput" style="max-width: 150px"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- Penumpang -->
            <b-col md="6">
                <b-form-group label="Penumpang" label-for="penumpang">
                    <select-penumpang-2 
                        v-if="dataSpp.cd"
                        v-model="dataSpp.cd.data.penumpang.data.id" 
                        id="penumpang" 
                        :disabled="disableInput" 
                        :initial-options="dataSpp.cd.data.penumpang.data" 
                        :search-on-empty="isNew"></select-penumpang-2>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Penumpang + No Identitas -->
        <b-row>
            <!-- 2nd col, jenis identitas -->
            <b-col md="6">
                <b-form-group label="Alamat" label-for="alamat">
                    <b-form-textarea 
                        :disabled="disableInput"
                        v-model="dataSpp.cd.data.alamat">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
            
            <b-col md="6">
                <b-form-group label="Asal/Country of origin" label-for="negara-asal">
                    <!-- <b-form-input 
                        v-model="dataSpp.negara_asal.data.kode" 
                        type="text" 
                        id="negara-asal" 
                        :disabled="disableInput"></b-form-input> -->
                    <select-negara
                        v-model="dataSpp.negara_asal.data.kode"
                        id="negara-asal"
                        :disabled="disableInput"></select-negara>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- No Flight + Keterangan? -->
        <b-row>
            <!-- Nomor Flight -->
            <b-col md="6">
                <b-form-group label="Flight/Voyage No.">
                    <b-input-group>
                        <b-form-input
                            v-model="dataSpp.cd.data.no_flight"
                            :disabled="disableInput"/>
                        <template v-slot:append>
                            <select-airline 
                                :tabindex="9999"
                                style="min-width: 350px; margin: 0 2px;"
                                :disabled="disableInput"
                                v-model="dataSpp.cd.data.kd_airline"/>
                        </template>
                    </b-input-group>
                </b-form-group>

            </b-col>

            <!-- Keterangan -->
            <b-col md="6">
                <b-form-group label="Keterangan" label-for="keterangan">
                    <b-form-textarea
                        id="keterangan"
                        v-model="dataSpp.keterangan"
                        :disabled="disableInput">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Simpan -->
        <b-row class="mt-2">
            <b-col>
                <b-button @click="onSave" class="float-right shadow" variant="primary" :disabled="disableInput">
                    <font-awesome-icon icon="save"></font-awesome-icon> Simpan
                </b-button>
            </b-col>
        </b-row>

        <!-- Paginated for detail data -->
        <template v-if="!isNew">
            <hr>
            <view-cd-details 
                :cd-id="dataSpp.cd.data.id"
                :disabled="disableInput">
            </view-cd-details>
        </template>
    </div>
</template>

<script>
// mixins
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import userChecker from '../mixins/userChecker'
// components
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import SelectNegara from '@/components/SelectNegara'
import SelectAirline from '@/components/SelectAirline'
import Datepicker from '@/components/Datepicker'
// import PaginatedBrowser from '@/components/PaginatedBrowser'
// import vSelect from 'vue-select'
// import SelectPelabuhan from '@/components/SelectPelabuhan'
// import CardViewDetailCd from '@/components/CardViewDetailCd'
import { mapMutations, mapGetters } from 'vuex'
import ViewCdDetails from '@/components/ViewCdDetails'

// utk menampilkan pungutan
// import ModalViewPerhitungan from '@/components/ModalViewPerhitungan'

// ndpbm (USD)
import SelectKurs from '@/components/SelectKurs'

// the default cd header
import defaultSpp from './defaultSpp.json'

// for deep copy
const cloneDeep = require('clone-deep')

export default {
    mixins: [ axiosErrorHandler, userChecker ],
    components: {
        SelectKurs,
        SelectPenumpang2,
        SelectNegara,
        ViewCdDetails,
        SelectAirline,
        Datepicker
    },
    data() {
        return {
            dataSpp: this.defaultData()
        }
    },
    computed: {
        // pick api and lokasi from our store
        ...mapGetters(['api', 'lokasi']),

        // when to disable input?
        disableInput () {
           // only disable input if user can't edit
           // and the doc is locked
           return !this.canEdit && this.dataSpp.is_locked
        },

        // check if this is a new data
        isNew () {
            return this.id == 'new'
        }
    },
    props: {
        id: [Number,String]
    },
    methods: {
        ...mapMutations(['setBusyState']),
        defaultData: function() {
            return cloneDeep({
                ...defaultSpp,
                lokasi: this.lokasi
            })
        },

        displayJumlah (value, event) {
            return this.$options.filters.formatCurrency(value)
        },

        loadSppData (id) {
            if (id == 'new') {
                console.log("Input SPP Baru di sini!")
                // 1st, init with empty data
                this.dataSpp = this.defaultData()
                // 2nd, 

                return
            }
            // 
            this.setBusyState(true)
            // api
            const vm = this
            this.api.getSppById(id)
                .then(e => {
                    vm.setBusyState(false)
                    vm.dataSpp = e.data.data
                })
                .catch(e => {
                    vm.setBusyState(false)
                    vm.handleError(e)

                    // kalo gk ketemu, replace ke new
                    vm.$router.push({
                       path: '/spp'
                    })
                })
        },

        // when save button clicked
        onSave () {
        }
    },
    created () {
        // this.setBusyState(true)
        this.loadSppData(this.id)
    },
    mounted () {
        // this.setBusyState(false)
        // // console.log(this.$route);
        // console.log('Data CD:')
        // console.log(this.id)
        // console.log(Number(this.id))
    },
    watch: {
        id: {
            immediate: false,
            handler (newVal) {
                this.loadSppData(newVal)
            }
        }
    }
}
</script>

<style>


</style>