<template>
    <div>
        <!-- Title at the top, showing lock status too -->
        <h4>
            <template v-if="id != 'new'">
                CD #{{ id }} <b-badge :variant="dataCd.is_locked ? 'danger' : 'primary'"><font-awesome-icon :icon="dataCd.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataCd.is_locked ? "LOCKED" : "OPEN" }}</b-badge>
            </template>
            <template v-else>
                Input CD Baru
            </template>
        </h4>
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
                    <select-penumpang-2 v-model="dataCd.penumpang_id" id="penumpang" :disabled="disableInput" :initial-options="dataCd.penumpang.data"></select-penumpang-2>
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
                <b-form-group label="Nomor &amp; Tgl. Flight">
                    <b-input-group>
                        <b-form-input v-model="dataCd.no_flight" type="text" id="no_flight"  class="md-3" :disabled="disableInput"></b-form-input>
                        <template v-slot:append>
                            <datepicker v-model="dataCd.tgl_kedatangan" id="tgl_kedatangan" :disabled="disableInput" style="max-width: 150px"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>
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
                                    :initial-options="dataCd.pelabuhan_asal.data"></select-pelabuhan>
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
                                :initial-options="dataCd.pelabuhan_tujuan.data"></select-pelabuhan>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

        <!-- Flag deklarasi + PERHITUNGAN -->
        <b-row>
            <!-- Flag Deklarasi -->
            <b-col md="6">
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
                <b-button @click="onSave" class="float-right" variant="primary" :disabled="disableInput">
                    <font-awesome-icon icon="save"></font-awesome-icon> Simpan
                </b-button>
            </b-col>
        </b-row>
        <hr>
        <h5>Data Detil Barang</h5>
        <div class="my-2">
            <b-button variant="primary" class="shadow" :disabled="disableInput">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Tambah Barang
            </b-button>
        </div>
        <!-- paginated utk data detail -->
        <paginated-browser :data-callback="loadCdDetails" :search-date-range="false" :search-box="false">
            <template v-slot:default="{ data, pagination }">
                <!-- table utk details -->
                <b-table
                    responsive="sm"
                    table-class="shadow"
                    head-variant="dark"
                    bordered
                    outlined
                    striped
                    small
                    hover
                    primary-key="id"
                    :items="data"
                    :fields="fieldDetails">
                    <!-- custom render : SATUAN -->
                    <template v-slot:cell(satuan)="data">
                        {{ data.item.satuan.jumlah }} {{ data.item.satuan.jenis }}
                    </template>
                    <!-- custom render : KEMASAN -->
                    <template v-slot:cell(kemasan)="data">
                        {{ data.item.kemasan.jumlah }} {{ data.item.kemasan.jenis }}
                    </template>
                    <!-- custom render : FOB -->
                    <template v-slot:cell(fob)="data">
                        <span>{{ data.item.kurs.data.kode_valas }}&nbsp;</span>
                        <span class="float-right">
                            {{ data.item.fob | formatCurrency(4) }}
                        </span>
                    </template>
                    <!-- custom render : NILAI PABEAN -->
                    <template v-slot:cell(nilai_pabean)="data">
                        <span>Rp&nbsp;</span>
                        <span class="float-right">
                        {{ data.item.nilai_pabean | formatCurrency }}
                        </span>
                    </template>
                    <!-- Tombol actions (edit, delete) -->
                    <template v-slot:cell(action)="data">
                        <b-button-group>
                            <b-button size="sm" variant="primary" :disabled="disableInput">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                            </b-button>
                            <b-button size="sm" variant="danger" v-if="!disableInput">
                                <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                            </b-button>
                        </b-button-group>
                    </template>
                    <!-- Row detail button -->
                    <template v-slot:cell(_showDetail)="row">
                        <b-button variant="dark" size="sm" @click="row.toggleDetails">
                            <font-awesome-icon :icon="row.detailsShowing ? 'minus-square' : 'plus-square'">
                            </font-awesome-icon>
                        </b-button>
                    </template>
                    <!-- Row detail -->
                    <template v-slot:row-details="row">
                        <b-card>
                            <!-- Show Kategori -->
                            <h5>Kategori</h5>
                            <b-row>
                                <b-col>
                                    <v-select multiple disabled :value="row.item.kategori"></v-select>
                                </b-col>
                            </b-row>
                            <hr>
                            <!-- Detail Sekunder -->
                            <h5>Data Pendukung lainnya</h5>
                            <template v-if="row.item.detailSekunders.data.length < 1">
                                <b-alert variant="secondary" :show="true">
                                    Tidak ada data sekunder
                                </b-alert>
                            </template>
                            <template v-else>
                                <b-row v-for="(secData, idx) in row.item.detailSekunders.data" :key="secData.id" class="mb-2">
                                    <b-col md="4" class="d-flex">
                                        <!-- <strong>{{idx+1}}. {{ secData.jenis }}:</strong> -->
                                        <span>{{ idx+1 }}.&nbsp;</span> <v-select disabled :value="secData.jenis" class="flex-grow-1"></v-select>
                                    </b-col>
                                    <b-col md="8">
                                        <!-- {{ secData.data }} -->
                                        <textarea disabled v-model="secData.data" class="form-control"></textarea>
                                    </b-col>
                                </b-row>
                            </template>                            
                        </b-card>
                    </template>
                </b-table>
            </template>
        </paginated-browser>
        <!-- <pre>{{ dataCd }}</pre> -->
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import Datepicker from '@/components/Datepicker'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import vSelect from 'vue-select'
import SelectPelabuhan from '@/components/SelectPelabuhan'
import { mapMutations, mapGetters } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        SelectPenumpang2,
        Datepicker,
        PaginatedBrowser,
        vSelect,
        SelectPelabuhan
    },
    filters: {
        formatCurrency (val, decLength = 2) {
            return Number(val).toFixed(decLength).replace(/\d(?=(\d{3})+\.)/g, '$&,')
        },
        displayRupiah (val) {
            return "Rp. " + val
        }
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
            ]
        }
    },
    computed: {
        ...mapGetters(['api', 'lokasi', 'canEdit']),
        disableInput () {
           // only disable input if user can't edit
           // and the doc is locked
           return !this.canEdit && this.dataCd.is_locked
        },
        labelNpwp () {
           var defaultLabel = 'NPWP/NIB/NIK'
           if (!this.dataCd.npwp_nib) {
              return defaultLabel
           }
           
           switch (this.dataCd.npwp_nib.length) {
              case 6:
                 return 'NIK'
               case 13:
                  return 'NIB'
               case 15:
                  return 'NPWP'
           }
           return defaultLabel
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
            return {
                "id": null,
                "no_dok": null,
                "tgl_dok": null,
                "nomor_lengkap": null,
                "lokasi": this.lokasi,
                "declare_flags": [],
                "npwp_nib": null,
                "no_flight": null,
                "tgl_kedatangan": null,
                "kd_pelabuhan_asal": null,
                "kd_pelabuhan_tujuan": null,
                "jumlah_detail": 0,
                "last_status": null,
                "is_locked": false,
                "penumpang_id": null,
                "pelabuhan_asal": {
                    data: null
                },
                "pelabuhan_tujuan": {
                    data: null
                },
                "penumpang" : {
                    data: null
                }
            }
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
        onSave: function() {
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
        }
    },
    created () {
        this.setBusyState(true)
    },
    mounted () {
        this.setBusyState(false)
        // console.log(this.$route);
        console.log('Data CD:')
        console.log(this.dataCd)
        console.log(this.id)
        console.log(Number(this.id))
    },
    watch: {
        id: {
            immediate: true,
            handler (newVal) {
                this.loadCdData(newVal)
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