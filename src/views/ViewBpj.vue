<template>
    <div>
        <!-- Title at the top, showing lock status too -->
        <h4>
            <template v-if="!isNew">
                <span :class="[ dataBpj.is_locked ? 'bg-danger' : 'bg-primary', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']">BPJ #{{ id }} <b-badge variant="light"><font-awesome-icon :icon="dataBpj.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataBpj.is_locked ? "LOCKED" : "OPEN" }}</b-badge></span>
            </template>
            <template v-else>
                Input BPJ Baru
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
                <b-form-group label="Nomor &amp; Tgl BPJ">
                    <b-input-group>
                        <b-form-input class="rounded-left flex-grow-1" v-model="dataBpj.nomor_lengkap" type="text" disabled></b-form-input>
                        <template v-slot:append>
                            <datepicker class="rounded-right" id="tgl_dok" v-model="dataBpj.tgl_dok" :disabled="disableInput" style="max-width: 150px"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- 2nd col, jenis identitas -->
            <b-col md="6">
                <b-form-group label="Jenis Identitas" label-for="jenis-identitas">
                    <b-form-radio-group id="jenis-identitas" v-model="dataBpj.jenis_identitas" :disabled="disableInput">
                        <b-form-radio value="NPWP">NPWP</b-form-radio>
                        <b-form-radio value="KTP">KTP</b-form-radio>
                        <b-form-radio value="PASPOR">Paspor</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Penumpang + No Identitas -->
        <b-row>
            <b-col md="6">
                <b-form-group label="Penumpang" label-for="penumpang">
                    <select-penumpang-2 
                        v-model="dataBpj.penumpang_id" 
                        id="penumpang" 
                        :disabled="disableInput" 
                        :initial-options="dataBpj.penumpang.data" 
                        :search-on-empty="isNew"
                        @penumpangChange="penumpangChange"></select-penumpang-2>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group label="Nomor Identitas" label-for="no_identitas">
                    <b-form-input 
                        v-model="dataBpj.no_identitas" 
                        type="text" 
                        id="no_identitas" 
                        :disabled="disableInput"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Alamat penumpang -->
        <b-row>
            <b-col md="6" order-md="6">
                <b-form-group label="Alamat" label-for="alamat">
                    <b-form-textarea
                        id="alamat"
                        v-model="dataBpj.alamat"
                        :disabled="disableInput">
                    </b-form-textarea>
                </b-form-group>
            </b-col>
            <!-- Bentuk Jaminan -->     
            <b-col md="6" order-md="0">
                           
                <b-form-group label="Bentuk Jaminan" label-for="bentuk_jaminan">
                    <b-form-radio-group 
                        id="bentuk_jaminan" 
                        v-model="dataBpj.bentuk_jaminan"
                        :disabled="disableInput">
                        <b-form-radio value="TUNAI">TUNAI</b-form-radio>
                        <b-form-radio value="BANK">BANK</b-form-radio>
                        <b-form-radio value="CUSTOMS_BOND"><em>Customs Bond</em></b-form-radio>
                        <b-form-radio :checked="true">Lainnya</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>

                
                <b-form-input 
                    v-show="jaminanLainnya" 
                    v-model="dataBpj.bentuk_jaminan"
                    :disabled="disableInput"></b-form-input>

            </b-col>
        </b-row>

        <!-- Bentuk Jaminan + jumlah-->
        <b-row>        
            <!-- nomor + tgl jaminan -->
            <b-col md="4">
                <b-form-group 
                    label="Nomor Jaminan" 
                    label-for="nomor-jaminan"
                    description="Untuk Jaminan Tunai penomoran otomatis">
                    <b-form-input
                        id="nomor-jaminan"
                        v-model="dataBpj.nomor_jaminan"
                        :disabled="disableInput || dataBpj.bentuk_jaminan == 'TUNAI'"></b-form-input>
                </b-form-group>
            </b-col>

            <!-- Tanggal jaminan -->
            <b-col md="2">
                <b-form-group label="Tanggal Jaminan" label-for="tanggal-jaminan">
                    <datepicker
                        id="tanggal-jaminan"
                        v-model="dataBpj.tanggal_jaminan"
                        :disabled="disableInput">
                    </datepicker>
                </b-form-group>
            </b-col>

            <!-- Jumlah -->
            <b-col md="4">
                <b-form-group label="Jumlah (Rp)." label-for="jumlah">
                    <b-form-input
                        v-model="dataBpj.jumlah"
                        :disabled="disableInput"

                        class="text-right"></b-form-input>
                </b-form-group>
            </b-col>

            <!-- Tgl Jatuh Tempo -->
            <b-col md="2">
                <b-form-group label="Tgl Jatuh Tempo" label-for="tanggal-jatuh-tempo">
                    <datepicker 
                        id="tanggal-jatuh-tempo"
                        v-model="dataBpj.tanggal_jatuh_tempo"
                        :disabled="disableInput">
                    </datepicker>
                </b-form-group>
            </b-col>
        </b-row>        

        <!-- nomor jaminan + tgl jaminan -->
        <b-row>
            
        </b-row>

        <!-- Penjamin + Alamat -->
        <b-row>
            <!-- penjamin -->
            <b-col md="6">
                <b-form-group label="Penjamin" label-for="penjamin">
                    <b-form-input
                        v-model="dataBpj.penjamin"
                        :disabled="disableInput"
                        ></b-form-input>
                </b-form-group>
            </b-col>

            <!-- alamat penjamin -->
            <b-col md="6">
                <b-form-group label="Alamat Penjamin" label-for="alamat-penjamin">
                    <b-form-textarea
                        v-model="dataBpj.alamat_penjamin"
                        :disabled="disableInput"
                        ></b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
            <!-- catatan -->
            <b-col md="6">
                <b-form-group label="Catatan" label-for="catatan" description="Bisa juga direkam saat digunakan (utk pelunasan dokumen)">
                    <b-form-textarea
                        v-model="dataBpj.catatan"
                        :disabled="disableInput"
                        ></b-form-textarea>
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

        <!-- <hr>

        <pre>{{ dataBpj }}</pre> -->
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
// import SelectPelabuhan from '@/components/SelectPelabuhan'
// import CardViewDetailCd from '@/components/CardViewDetailCd'
import { mapMutations, mapGetters } from 'vuex'
// import ViewCdDetails from '@/components/ViewCdDetails'

// utk menampilkan pungutan
// import ModalViewPerhitungan from '@/components/ModalViewPerhitungan'

// ndpbm (USD)
import SelectKurs from '@/components/SelectKurs'

// the default cd header
import defaultBpj from '@/defaults/defaultBpj'

// for deep copy
const cloneDeep = require('clone-deep')

export default {
    mixins: [ axiosErrorHandler, userChecker ],
    components: {
        SelectPenumpang2,
        Datepicker,
        PaginatedBrowser,
        // vSelect,
        // SelectPelabuhan,
        // CardViewDetailCd
        // ViewCdDetails,
        // ModalViewPerhitungan,
        SelectKurs
    },
    data() {
        return {
            dataBpj: this.defaultData()
        }
    },
    computed: {
        // pick api and lokasi from our store
        ...mapGetters(['api', 'lokasi']),

        // when to disable input?
        disableInput () {
           // only disable input if user can't edit
           // and the doc is locked
           return !this.canEdit && this.dataBpj.is_locked
        },

        // check if this is a new data
        isNew () {
            return this.id == 'new'
        },

        // check if jenis jaminan is lain2
        jaminanLainnya () {
            return this.dataBpj.bentuk_jaminan != 'TUNAI'
                && this.dataBpj.bentuk_jaminan != 'BANK'
                && this.dataBpj.bentuk_jaminan != 'CUSTOMS_BOND';
        }
    },
    props: {
        id: [Number,String]
    },
    methods: {
        ...mapMutations(['setBusyState']),
        defaultData: function() {
            return cloneDeep({
                ...defaultBpj,
                lokasi: this.lokasi
            })
        },

        displayJumlah (value, event) {
            return this.$options.filters.formatCurrency(value)
        },

        penumpangChange(data) {
            if (data) {
                console.log('penumpang changed:')
                console.log(data)

                if (this.dataBpj.jenis_identitas == 'PASPOR' && !this.dataBpj.no_identitas) {
                    this.dataBpj.no_identitas = data.no_paspor // + ' <---> ' + this.dataBpj.penumpang_id
                }
            }
        },

        loadBpjData (bpjId) {
            if (bpjId == 'new') {
                console.log("Input BPJ Baru di sini!")
                // 1st, init with empty data
                this.dataBpj = this.defaultData()
                // 2nd, 

                return
            }
            // 
            this.setBusyState(true)
            // api
            const vm = this
            this.api.getBpjById(bpjId)
                .then(e => {
                    vm.setBusyState(false)
                    vm.dataBpj = e.data.data
                })
                .catch(e => {
                    vm.setBusyState(false)
                    vm.handleError(e)

                    // kalo gk ketemu, replace ke new
                    vm.$router.push({
                       path: '/bpj/new'
                    })
                })
        },

        // when save button clicked
        onSave () {
           this.setBusyState(true)
           const vm = this
           // kalo id dataBpj null, berarti buat baru
           if (!this.dataBpj.id) {
              this.api.createBpj(this.dataBpj)
               .then(e => {
                  vm.setBusyState(false)
                  var newId = e.data.id
                  vm.showToast('Data BPJ Tersimpan!', `Data Bpj tersimpan dengan id #${newId}`, "success")
                  // re route
                  this.$router.replace({
                     name: 'ViewBpj',
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
              this.api.updateBpj(this.id, this.dataBpj)
               .then(e => {
                  vm.setBusyState(false)
                  vm.showToast('Data BPJ terupdate!', `Berhasil mengupdate data BPJ #${vm.id}`, "success")
                  // reload biar sinkron?
                  vm.loadBpjData(vm.id)
               })
               .catch(e => {
                  vm.setBusyState(false)
                  vm.handleError(e)
               })
           }
        }
    },
    created () {
        // this.setBusyState(true)
        this.loadBpjData(this.id)
    },
    mounted () {
        // this.setBusyState(false)
        // // console.log(this.$route);
        // console.log('Data CD:')
        // console.log(this.dataBpj)
        // console.log(this.id)
        // console.log(Number(this.id))
    },
    watch: {
        id: {
            immediate: false,
            handler (newVal) {
                this.loadBpjData(newVal)
            }
        },
        "dataBpj.bentuk_jaminan": {
            immediate: true,
            handler (val, oldVal) {
                if (val == 'TUNAI' && oldVal !== 'TUNAI') {
                    // change to tunai requires renumbering
                    // so, delete current number
                    this.dataBpj.nomor_jaminan = null
                }
            }
        }
    }
}
</script>

<style>


</style>