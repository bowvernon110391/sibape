<template>
    <div v-if="dataSt.cd">
        <!-- Title at the top, showing lock status too -->
        <h4>
            <template v-if="!isNew">
                <span :class="[ dataSt.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']">ST #{{ id }} <b-badge variant="light"><font-awesome-icon :icon="dataSt.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataSt.is_locked ? "LOCKED" : "OPEN" }}</b-badge></span>
            </template>
            <template v-else>
                Input ST Baru
            </template>
        </h4>
        <!-- Tombol Penyelesaian? -->
        <b-row class="my-2" v-if="id != 'new'">
            <b-col>
                <div class="text-right" ref="btnCetak">
                    <b-button-group size="sm" class="shadow mt-2 mt-md-0">
                        <!-- buatkan / lihat pibk -->
                        <b-button variant="success">
                            <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
                            <template v-if="stHasLink('pibk')">
                                Lihat PIBK
                            </template>
                            <template v-else>
                                Buatkan PIBK
                            </template>
                        </b-button>
                    </b-button-group>

                    <b-button-group size="sm" class="shadow mt-2 mt-md-0">
                        <!-- apabila dijadikan impor sementara -->
                        <b-button variant="dark" @click="printSt">
                            <font-awesome-icon icon="print">
                            </font-awesome-icon>
                            Cetak
                        </b-button>
                    </b-button-group>

                </div>
            </b-col>
        </b-row>

        <!-- Jenis ST -->
        <b-row>
            <b-col md="6">
                <b-form-group>
                    <template #label>
                        Jenis ST/<em>Type of detention</em>
                    </template>
                    <b-form-radio-group 
                        v-model="dataSt.jenis"
                        :disabled="disableInput">
                        <b-form-radio value="KANTOR">🏢Kantor/<em>Office</em></b-form-radio>
                        <b-form-radio value="TERMINAL">✈️Terminal</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Nomor & Tgl Dokumen + Alamat -->
        <b-row>
            <!-- 1st col, nomor & tgl dokumen -->
            <b-col md="6">
                <b-form-group label="Nomor &amp; Tgl SPP">
                    <b-input-group>
                        <b-form-input class="rounded-left flex-grow-1" v-model="dataSt.nomor_lengkap" type="text" disabled></b-form-input>
                        <template v-slot:append>
                            <datepicker class="rounded-right" id="tgl_dok" v-model="dataSt.tgl_dok" :disabled="disableInput" style="max-width: 150px"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- Penumpang -->
            <b-col md="6">
                <b-form-group label="Penumpang" label-for="penumpang">
                    <select-penumpang-2 
                        v-if="dataSt.cd"
                        v-model="dataSt.cd.data.penumpang.data.id" 
                        id="penumpang" 
                        :disabled="disableInput" 
                        :initial-options="dataSt.cd.data.penumpang.data" 
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
                        v-model="dataSt.cd.data.alamat">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
            
            <b-col md="6">
                <b-form-group label="Asal/Country of origin" label-for="negara-asal">
                    <!-- <b-form-input 
                        v-model="dataSt.negara_asal.data.kode" 
                        type="text" 
                        id="negara-asal" 
                        :disabled="disableInput"></b-form-input> -->
                    <select-negara
                        v-model="dataSt.negara_asal.data.kode"
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
                            v-model="dataSt.cd.data.no_flight"
                            :disabled="disableInput"/>
                        <template v-slot:append>
                            <select-airline 
                                :tabindex="9999"
                                style="margin: 0 2px; width: 100%"
                                :disabled="disableInput"
                                v-model="dataSt.cd.data.kd_airline"/>
                        </template>
                    </b-input-group>
                </b-form-group>

            </b-col>

            <!-- Keterangan -->
            <b-col md="6">
                <b-form-group label="Keterangan" label-for="keterangan">
                    <b-form-textarea
                        id="keterangan"
                        v-model="dataSt.keterangan"
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
                :cd-id="dataSt.cd.data.id"
                :disabled="disableInput"
                hide-satuan
                hide-netto>
            </view-cd-details>
        </template>

        <!-- PRINT MODAL -->
        <modal-view-pdf
            v-model="viewPrintDialog"
            :url="pdfUrl"
            :alt-filename="altFilename"
            ></modal-view-pdf>
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

// utk menampilkan pdf
import ModalViewPdf from '@/components/ModalViewPdf'

// ndpbm (USD)
import SelectKurs from '@/components/SelectKurs'

// the default cd header
// import defaultSpp from './defaultSpp.json'
import defaultSt from './defaultSt.json'

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
        Datepicker,
        ModalViewPdf
    },
    data() {
        return {
            dataSt: this.defaultData(),

            // for printing
            viewPrintDialog: false,
            pdfUrl: null,
            altFilename: 'ST'
        }
    },
    computed: {
        // pick api and lokasi from our store
        ...mapGetters(['api', 'lokasi']),

        // when to disable input?
        disableInput () {
           // only disable input if user can't edit
           // and the doc is locked
           return !this.canEdit && this.dataSt.is_locked
        },

        // check if this is a new data
        isNew () {
            return this.id == 'new'
        }
    },
    props: {
        id: [Number,String],

        hideControls: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
        defaultData: function() {
            return cloneDeep({
                ...defaultSt,
                lokasi: this.lokasi
            })
        },

        displayJumlah (value, event) {
            return this.$options.filters.formatCurrency(value)
        },

        loadStData (id) {
            if (id == 'new') {
                console.log("Input SPP Baru di sini!")
                // 1st, init with empty data
                this.dataSt = this.defaultData()
                // 2nd, 

                return
            }
            // 
            this.setBusyState(true)
            // api
            const vm = this
            this.api.getStById(id)
                .then(e => {
                    vm.setBusyState(false)
                    vm.dataSt = e.data.data
                })
                .catch(e => {
                    vm.setBusyState(false)
                    vm.handleError(e)

                    // kalo gk ketemu, replace ke new
                    vm.$router.push({
                       path: '/st'
                    })
                })
        },

        // when save button clicked
        onSave () {
        },

        // when print button clicked
        printSt () {
            // set data
            this.pdfUrl = this.api.generatePdfUrl('st', this.id)
            this.viewPrintDialog = true
            this.altFilename = `st-${this.id}`
        },

        // check if cd has some related documents
        stHasLink: function (rel) {
            if (this.dataSt.links) {
                // check by filtering it
                return this.dataSt.links.filter(e => e.rel == rel).length > 0
            }
            return false
        },

        // grab link detail
        stGetLinkDetails: function (rel) {
            if (this.dataSt.links) {
                var filtered = this.dataSt.links.filter(e => e.rel == rel)

                if (filtered.length) {
                    var link = filtered[0]
                    return {
                        doctype: link.rel,
                        id: link.uri.match(/^\/.+\/(\d+)$/i)[1]
                    }
                }
            }
            return false
        },
    },
    created () {
        // this.setBusyState(true)
        this.loadStData(this.id)
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
                this.loadStData(newVal)
            }
        }
    }
}
</script>

<style>


</style>