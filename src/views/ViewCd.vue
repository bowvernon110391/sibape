<template>
    <div>
        <!-- Title at the top, showing lock status too -->
        <doc-banner doctype="CD" :data="dataCd" :is-new="isNew" v-if="!hideBanner"/>
        <!-- Tombol Penyelesaian? -->
        <template v-if="!hideControls">
            <!-- <b-row class="my-2" v-if="id != 'new'">
                <b-col>
                    
                </b-col>
            </b-row> -->
            <cd-controls :data="dataCd" ref="tombolPenyelesaian"
                @showPenitipan="showPenitipan"
                @showPenundaan="showPenundaan"
                @showPungutan="showPungutan"
                @printSspcp="printSspcp"
                @printLembarHitungCd="printLembarHitungCd"
                />
        </template>

        <!-- Flag Deklarasi, special check utk flag KOMERSIL -->
        <hr>
        <cd-contents 
            :data="dataCd"
            :disabled="disableInput"
        />
        <b-row class="mt-2">
            <b-col>
                <b-button @click="onSave" class="float-right shadow" variant="primary" :disabled="disableInput">
                    <font-awesome-icon icon="save"></font-awesome-icon> Simpan
                </b-button>
            </b-col>
        </b-row>        
        <!-- paginated utk data detail -->
        <template v-if="!isNew">
            <hr>
            <view-cd-details 
                :cd-id="id" 
                :disabled="disableInput" 
                hide-satuan
                hide-netto></view-cd-details>

            <!-- lampiran (manatau perlu) -->
            <hr>
            <attachment-bucket 
                :disabled="disableInput"
                :endpoint="endpoint"/>

            <!-- modal view utk perhitungan -->
            <template v-if="!isNew">
                <!-- Tampilkan perhitungan -->
                <modal-view-perhitungan
                    :cd-id="dataCd.id"
                    size="xl"
                    v-model="viewPungutan"
                    :simulate="!docHasLink(dataCd, 'sspcp')">
                </modal-view-perhitungan>

                <!-- Tampilkan SPP -->
                <modal-view-spp
                    :cd-id="dataCd.id"
                    size="xl"
                    :simulate="!docHasLink(dataCd, 'spp')"
                    v-model="viewSpp">
                </modal-view-spp>

                <!-- Tampilkan dialog ST -->
                <modal-view-st
                    :cd-id="dataCd.id"
                    size="xl"
                    :simulate="!docHasLink(dataCd, 'st')"
                    v-model="viewSt"></modal-view-st>
            </template>

            <!-- utk nampilin respon sspcp -->
            <template v-else>
                <!-- TODO: buat komponen baru -->
            </template>
        </template>
        <!-- <pre>{{ dataCd }}</pre> -->

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
import docMethod from '../mixins/docMethod'

// components
import { mapMutations, mapGetters } from 'vuex'

import PaginatedBrowser from '@/components/PaginatedBrowser'
import ViewCdDetails from '@/views/ViewCdDetails'

import DocBanner from '@/components/DocBanner'
import CdControls from '@/components/CdControls'
import CdContents from '@/components/CdContents'

// utk menampilkan pungutan
import ModalViewPerhitungan from '@/components/ModalViewPerhitungan'

// ndpbm (USD)
import SelectKurs from '@/components/SelectKurs'

// untuk menampilkan cetakan PDF
import ModalViewPdf from '@/components/ModalViewPdf'

// untuk menampilkan spp
import ModalViewSpp from '@/components/ModalViewSpp'

// untuk menampilkan st
import ModalViewSt from '@/components/ModalViewSt'

// untuk handle lampiran
import AttachmentBucket from '@/components/AttachmentBucket'

// the default cd header
import defaultCd from '@/defaults/defaultCd'

// for deep copy
const cloneDeep = require('clone-deep')

export default {
    mixins: [ axiosErrorHandler, userChecker, docMethod ],
    components: {
        PaginatedBrowser,
        ViewCdDetails,
        ModalViewPerhitungan,
        ModalViewPdf,
        ModalViewSpp,
        ModalViewSt,
        AttachmentBucket,
        DocBanner,
        CdControls,
        CdContents
    },
    data() {
        return {
            dataCd: this.defaultData(),
            fieldDetails: [
                { label: '', key: '_showDetail'},
                'uraian',
                'satuan',
                'kemasan',
                'hscode',
                'fob',
                'nilai_pabean',
                { label: '', key: 'action' }
            ],
            
            // pungutan data
            viewPungutan: false,

            // print data
            viewPrintDialog: false,
            pdfUrl: null,
            altFilename: 'SSPCP',

            // SPP
            viewSpp: false,

            // ST
            viewSt: false,
        }
    },
    computed: {
        // pick api and lokasi from our store
        ...mapGetters(['api', 'lokasi']),

        // when to disable input?
        disableInput () {
           // only disable input if user can't edit
           // and the doc is locked
           return !this.canEdit && this.dataCd.is_locked
        },

        

        // change npwp label depends on what data is being input
        // 15 digits: npwp
        // 13 digits: nib
        // 6/8 digits: nik
        labelNpwp () {
           var defaultLabel = 'NPWP/NIB/NIK'
           if (!this.dataCd.npwp_nib) {
              return defaultLabel
           }
           
           switch (this.dataCd.npwp_nib.replace(/\.\-/i, '').length) {
              case 6:
              case 8:
                 return 'NIK'
               case 13:
                  return 'NIB'
               case 15:
                  return 'NPWP'
           }
           return defaultLabel
        },

        // check if this is a new data
        isNew () {
            return this.id == 'new'
        },

        // endpoint utk attachment
        endpoint () {
            return this.dataCd.id ? `/cd/${this.dataCd.id}/lampiran` : null
        }
    },
    props: {
        id: [Number,String],

        hideBanner: {
            type: Boolean,
            default: false
        },

        hideControls: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
        loadCdDetails(q, spinner, vm) {
            
            if (this.id != 'new') {
                var me = this
                spinner(true)

                this.api.getCdDetails(this.id, q)
                .then(e => {
                    spinner(false)
                    vm.setData(e.data.data)
                    vm.setTotal(e.data.meta.pagination.total)
                })
                .catch(e => {
                    spinner(false)
                    me.handleError(e)
                })
            }
        },
        defaultData: function() {
            return cloneDeep({
                ...defaultCd,
                lokasi: this.lokasi
            })
        },
        loadCdData (cdId) {
            if (cdId == 'new') {
                console.log("Input CD Baru di sini!")
                // 1st, init with empty data
                this.dataCd = this.defaultData()
                // 2nd, set default airport?
                this.dataCd.kd_pelabuhan_tujuan = "IDCGK"
                
                return
            }
            // 
            this.setBusyState(true)
            // api
            const vm = this
            this.api.getCdById(cdId)
                .then(e => {
                    vm.setBusyState(false)
                    vm.dataCd = e.data.data
                })
                .catch(e => {
                    vm.setBusyState(false)
                    vm.handleError(e)

                    // kalo gk ketemu, replace ke new
                    vm.$router.push({
                       path: '/cd/new'
                    })
                })
        },

        // when save button clicked
        onSave () {
           this.setBusyState(true)
           const vm = this
           // kalo id dataCd null, berarti buat baru
           if (!this.dataCd.id) {
              this.api.createCd(this.dataCd)
               .then(e => {
                  vm.setBusyState(false)
                  var newId = e.data.id
                  vm.showToast('Data CD Tersimpan!', `Data Cd tersimpan dengan id #${newId}`, "success")
                  // re route
                  this.$router.replace({
                     name: 'ViewCd',
                     params: {
                        id: newId
                     }
                  })
               })  
               .catch(e => {
                  vm.setBusyState(false)
                  vm.handleError(e)
               })
           } else {
              // klo udh ada id, berarti simpan
              this.api.updateCd(this.id, this.dataCd)
               .then(e => {
                  vm.setBusyState(false)
                  vm.showToast('Data CD terupdate!', `Berhasil mengupdate data CD #${vm.id}`, "success")
                  // reload biar sinkron?
                  vm.loadCdData(vm.id)
               })
               .catch(e => {
                  vm.setBusyState(false)
                  vm.handleError(e)
               })
           }
        },

        // when the detail is changed, what do?
        // well, we reload the current paginated data
        onDetailChange (id) {
            // alert('Detail changed! -> #' + id)
            this.$refs.detailBrowser.loadData()
        },
        
        
        // tampilkan perhitungan
        showPungutan () {
            // tergantung status cd
            this.viewPungutan = true
        },

        // show penundaan
        showPenundaan () {
            this.viewSpp = true
        },

        // show st
        showPenitipan () {
            this.viewSt = true
        },

        // print sspcp
        printSspcp () {
            // alert("Printing SSPCP...")
            var printData = this.cdGetLinkDetails('sspcp')

            console.log("SSPCP PDF GENERATION DATA:")
            console.log(this.cdGetLinkDetails('sspcp'))
            // let's set data
            this.pdfUrl = this.api.generatePdfUrl(printData.doctype, printData.id)
            this.viewPrintDialog = true
            this.altFilename = printData.doctype + '-' + printData.id
        },

        // print lembar perhitungan cd
        printLembarHitungCd () {
            // simple, just generate pdfUrl manually
            this.pdfUrl = this.api.generatePdfUrl('lembarhitungcd', this.id)
            this.viewPrintDialog = true
            this.altFilename = 'lembarhitungcd-' + this.id
        },

        // print bpj
        printBpj () {
            alert("Printing BPJ...")
        }
    },
    created () {
        // this.setBusyState(true)
        this.loadCdData(this.id)
    },
    mounted () {
        // this.setBusyState(false)
        // // console.log(this.$route);
        // console.log('Data CD:')
        // console.log(this.dataCd)
        // console.log(this.id)
        // console.log(Number(this.id))
    },
    watch: {
        id: {
            immediate: false,
            handler (newVal) {
                this.loadCdData(newVal)
            }
        },

        viewPungutan (newVal, oldVal) {
            if (!newVal) {
                // alert("Closing view pungutan, reload pls")
                this.loadCdData(this.id)
            }
        },
    }
}
</script>

<style>
.perhitungan {
    position: relative;
}

.perhitungan::after {
    position: absolute;
    top: 0;
    left: 0;
    padding-left: 1.2em;
    content: 'Rp.';
}

</style>