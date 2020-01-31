<template>
    <div>
        <!-- Title at the top, showing lock status too -->
        <h4>
            <template v-if="!isNew">
                <span :class="[ dataCd.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']">CD #{{ id }} <b-badge variant="light"><font-awesome-icon :icon="dataCd.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataCd.is_locked ? "LOCKED" : "OPEN" }}</b-badge></span>
            </template>
            <template v-else>
                Input CD Baru
            </template>
        </h4>
        <!-- Tombol Penyelesaian? -->
        <b-row class="my-2" v-if="id != 'new'">
            <b-col>
                <div class="text-right" ref="btnGroupPenyelesaian">
                    <b-button-group size="sm" class="shadow">
                        <!-- apabila dijadikan impor sementara -->
                        <b-button variant="danger" :disabled="cdHasLink('bpj') || disableInput">
                            <font-awesome-icon icon="plane-departure"></font-awesome-icon>
                            Jaminkan (Impor Sementara)
                        </b-button>

                        <!-- titip (gk mampu/mau bayar) -->
                        <b-button variant="dark" :disabled="cdHasLink('st') || disableInput">
                            <font-awesome-icon icon="lock"></font-awesome-icon>
                            Titipkan
                        </b-button>

                        <!-- tunda pengeluaran -->
                        <b-button variant="warning" :disabled="cdHasLink('spp') || disableInput">
                            <font-awesome-icon icon="hand-paper"></font-awesome-icon>
                            Tunda Pengeluaran
                        </b-button>

                        <!-- apabila dibayar (Terbit SPPBMCP) -->
                        <b-button variant="success" :disabled="false" @click="showPungutan">
                            <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
                            <template v-if="cdHasLink('sspcp')">
                                Lihat Pungutan
                            </template>
                            <template v-else>
                                Bayar
                            </template>
                        </b-button>
                    </b-button-group>

                    <!-- tombol cetak -->
                    <template v-if="cdHasLink('sspcp') || cdHasLink('bpj')">
                        <b-dropdown 
                            size="sm"
                            split
                            split-variant="dark"
                            variant="dark"
                            class="shadow"
                            @click="printSspcp"
                            >
                            <!-- text and icon for button -->
                            <template v-slot:button-content>
                                <font-awesome-icon icon="print">
                                </font-awesome-icon>
                                Cetak
                            </template>
                            <!-- opsi yang selalu ada -->
                            <b-dropdown-item @click="printSspcp">
                                SSPCP
                            </b-dropdown-item>
                            <!-- opsi tergantung link yg ada -->
                            <!-- Impor Sementara -->
                            <!-- <template v-if="cdHasLink('is')">
                                <b-dropdown-divider>
                                </b-dropdown-divider>
                                <b-dropdown-item>
                                    Form Impor Sementara
                                </b-dropdown-item>
                            </template> -->
                            <!-- SSPCP -->
                            <template v-if="cdHasLink('bpj')">
                                <b-dropdown-item @click="printBpj">
                                    BPJ (jaminan)
                                </b-dropdown-item>
                            </template>
                        </b-dropdown>
                    </template>
                </div>
            </b-col>
        </b-row>
        <!-- Nomor & Tgl Dokumen + Alamat -->
        <b-row>
            <!-- 1st col, nomor & tgl dokumen -->
            <b-col md="6">
                <b-form-group label="Nomor &amp; Tgl. Dokumen">
                    <b-input-group>
                        <b-form-input class="rounded-left flex-grow-1" v-model="dataCd.nomor_lengkap" type="text" disabled></b-form-input>
                        <template v-slot:append>
                            <datepicker class="rounded-right" id="tgl_dok" v-model="dataCd.tgl_dok" :disabled="disableInput" style="max-width: 150px"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- 2nd col, alamat -->
            <b-col md="6">
                <b-form-group label="Alamat" label-for="alamat">
                    <b-form-textarea id="alamat" v-model="dataCd.alamat" :disabled="disableInput">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Penumpang + NIB -->
        <b-row>
            <b-col md="6">
                <b-form-group label="Penumpang" label-for="penumpang">
                    <select-penumpang-2 v-model="dataCd.penumpang_id" id="penumpang" :disabled="disableInput" :initial-options="dataCd.penumpang.data" :search-on-empty="isNew"></select-penumpang-2>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group :label="labelNpwp" label-for="npwp_nib">
                    <b-form-input v-model="dataCd.npwp_nib" type="text" id="npwp_nib" :disabled="disableInput"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Nomor & Tgl Flight + Airport -->
        <b-row>
            <b-col md="6">
                <!-- No tgl flight -->
                <b-row>
                    <b-col>
                        <b-form-group label="Nomor &amp; Tgl. Flight">
                            <b-input-group>
                                <b-form-input v-model="dataCd.no_flight" type="text" id="no_flight"  class="md-3" :disabled="disableInput"></b-form-input>
                                <template v-slot:append>
                                    <datepicker v-model="dataCd.tgl_kedatangan" id="tgl_kedatangan" :disabled="disableInput" style="max-width: 150px"></datepicker>
                                </template>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <!-- bagasi dibawa + tdk dbawa (lnf) -->
                <b-row>
                    <b-col>
                        <b-form-group label="Bagasi dibawa">
                            <b-form-input class="text-right" size="sm" :disabled="disableInput" v-model="dataCd.jml_bagasi_dibawa">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col>
                        <b-form-group label="Bagasi tertinggal">
                            <b-form-input class="text-right" size="sm" :disabled="disableInput" v-model="dataCd.jml_bagasi_tdk_dibawa">
                            </b-form-input>
                        </b-form-group>
                    </b-col>
                    
                    <b-col>
                        <!-- Pembebasan select. Disabled if commercial, also set to 0 if commercial -->
                        <b-form-group label="Pembebasan (USD)">
                            <b-form-select size="sm" :disabled="disableInput || isCommercial" v-model="dataCd.pembebasan">
                                <option value="0">0</option>
                                <option value="50" :disabled="isCommercial">50</option>
                                <option value="500" :disabled="isCommercial">500</option>
                                <option value="1000" :disabled="isCommercial">1000</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>

            <!-- airport asal + tujuan -->
            <b-col md="6">
                <b-row>
                    <b-col>
                        <b-form-group label="Airport asal" label-for="kd_pelabuhan_asal">
                            <!-- <b-input-group prepend="Dari" class="mb-2"> -->
                                <!-- <b-form-input v-model="dataCd.kd_pelabuhan_asal" id="kd_pelabuhan_asal" type="text" :disabled="disableInput"></b-form-input> -->
                                <select-pelabuhan 
                                    id="kd_pelabuhan_asal" 
                                    v-model="dataCd.kd_pelabuhan_asal" 
                                    :disabled="disableInput"
                                    :initial-options="dataCd.pelabuhan_asal.data"
                                    :search-on-empty="isNew"></select-pelabuhan>
                                <!-- <b-input-group-prepend is-text>
                                    Ke
                                </b-input-group-prepend> -->
                                <!-- <b-form-input v-model="dataCd.kd_pelabuhan_tujuan" id="kd_pelabuhan_tujuan" type="text" :disabled="disableInput"></b-form-input> -->
                            <!-- </b-input-group> -->
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-form-group label="Airport Tujuan" label-for="kd_pelabuhan_tujuan">
                            <select-pelabuhan 
                                id="kd_pelabuhan_tujuan" 
                                v-model="dataCd.kd_pelabuhan_tujuan" 
                                :disabled="disableInput"
                                :initial-options="dataCd.pelabuhan_tujuan.data"
                                :search-on-empty="isNew"></select-pelabuhan>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <!-- Jml anggota keluarga + Flag deklarasi -->
        <b-row>
            <!-- Jml Keluarga -->
            <b-col md="2" sm="6">
                <b-form-group label="Jumlah Keluarga" description="Yang datang bersamaan">
                    <b-form-input type="number" 
                        class="text-right" 
                        v-model="dataCd.jml_anggota_keluarga"
                        :disabled="disableInput"
                        size="sm">
                    </b-form-input>
                </b-form-group>
            </b-col>

            <!-- Tarif PPh -->
            <b-col md="2" sm="6">
                <b-form-group label="Tarif PPh (%)">
                    <b-form-select v-model="dataCd.pph_tarif" :disabled="disableInput" size="sm">
                        <option value="2.5">2.5</option>
                        <option value="7.5">7.5</option>
                        <option value="15">15</option>
                        <option value="22.5">22.5</option>
                    </b-form-select>
                </b-form-group>
            </b-col>

            <!-- NDPBM -->
            <b-col md="4">
                <b-form-group label="NDPBM">
                    <select-kurs
                        id="cd-ndpbm"
                        :disabled="disableInput"
                        v-model="dataCd.ndpbm.data.id"
                        :initial-options="isNew ? null : dataCd.ndpbm.data"
                        :search-on-empty="isNew">
                    </select-kurs>
                </b-form-group>
            </b-col>

            <!-- Flag Deklarasi, special check utk flag KOMERSIL -->
            <b-col md="4"  sm="12">
                <b-form-group label="Flag Deklarasi" description="Flag deklarasi sesuai form cd">
                    <b-form-checkbox-group
                        :options="flagDeklarasi"
                        stacked
                        :disabled="disableInput"
                        v-model="dataCd.declare_flags">

                    </b-form-checkbox-group>
                </b-form-group>
            </b-col>
        </b-row>
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
            <view-cd-details :cd-id="id" :disabled="disableInput"></view-cd-details>

            <!-- modal view utk perhitungan -->
            <template v-if="dataCd.id">
                <modal-view-perhitungan
                    :cd-id="dataCd.id"
                    size="xl"
                    v-model="viewPungutan"
                    :simulate="!cdHasLink('sspcp')">
                </modal-view-perhitungan>
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
// components
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import Datepicker from '@/components/Datepicker'
import PaginatedBrowser from '@/components/PaginatedBrowser'
// import vSelect from 'vue-select'
import SelectPelabuhan from '@/components/SelectPelabuhan'
// import CardViewDetailCd from '@/components/CardViewDetailCd'
import { mapMutations, mapGetters } from 'vuex'
import ViewCdDetails from '@/components/ViewCdDetails'

// utk menampilkan pungutan
import ModalViewPerhitungan from '@/components/ModalViewPerhitungan'

// ndpbm (USD)
import SelectKurs from '@/components/SelectKurs'

// untuk menampilkan cetakan PDF
import ModalViewPdf from '@/components/ModalViewPdf'

// the default cd header
import defaultCd from './defaultCd.json'

// for deep copy
const cloneDeep = require('clone-deep')

export default {
    mixins: [ axiosErrorHandler, userChecker ],
    components: {
        SelectPenumpang2,
        Datepicker,
        PaginatedBrowser,
        // vSelect,
        SelectPelabuhan,
        // CardViewDetailCd
        ViewCdDetails,
        ModalViewPerhitungan,
        SelectKurs,
        ModalViewPdf
    },
    data() {
        return {
            dataCd: this.defaultData(),
            flagDeklarasi: [
                { text: 'Barang yang diatur karantina', value: "KARANTINA"},
                { text: 'Narkotika dan/atau obat-obatan', value: "NARKOTIKA"},
                { text: 'Barang Kena Cukai', value: "BKC"},
                { text: 'Pembawaan Mata Uang', value: "UANG"},
                { text: 'Barang dagangan (tidak untuk dipakai)', value: "KOMERSIL"},
                { text: 'Barang impor untuk dipakai', value: "IMPOR_UNTUK_DIPAKAI"}
            ],
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
            altFilename: 'SSPCP'
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

        // check if this is commercial
        isCommercial () {
            var commercial = this.dataCd.declare_flags.includes("KOMERSIL")

            // if flag set, reset pembebasan to 0
            if (commercial) {
                this.dataCd.pembebasan = 0
            }

            return commercial
        }
    },
    props: {
        id: [Number,String]
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
                // 2nd, 

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

        // check if cd has some related documents
        cdHasLink: function (rel) {
            if (this.dataCd.links) {
                // check by filtering it
                return this.dataCd.links.filter(e => e.rel == rel).length > 0
            }
            return false
        },

        // grab link detail
        cdGetLinkDetails: function (rel) {
            if (this.dataCd.links) {
                var filtered = this.dataCd.links.filter(e => e.rel == rel)

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
        
        // tampilkan perhitungan
        showPungutan () {
            // tergantung status cd
            this.viewPungutan = true
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
        }
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