<template>
    <div>
        <h4>
            <template v-if="id != 'new'">
                CD #{{ id }} <b-badge :variant="dataCd.is_locked ? 'danger' : 'primary'"><font-awesome-icon :icon="dataCd.is_locked ? 'lock' : 'lock-open'"></font-awesome-icon> {{ dataCd.is_locked ? "LOCKED" : "OPEN" }}</b-badge>
            </template>
            <template v-else>
                Input CD Baru
            </template>
        </h4>
        <b-row>
            <b-col md="6" sm="12" class="mt-4">
                <b-form-group label="Nomor &amp; Tgl. Dokumen">
                    <b-input-group>
                        <b-form-input class="rounded-left" v-model="dataCd.nomor_lengkap" type="text" disabled></b-form-input>
                        <template v-slot:append>
                            <datepicker class="rounded-right" id="tgl_dok" v-model="dataCd.tgl_dok" :disabled="disableInput"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <b-form-group label="Penumpang" label-for="penumpang">
                    <select-penumpang-2 v-model="dataCd.penumpang_id" id="penumpang" :disabled="disableInput"></select-penumpang-2>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group :label="labelNpwp" label-for="npwp_nib">
                    <b-form-input v-model="dataCd.npwp_nib" type="text" id="npwp_nib" :disabled="disableInput"></b-form-input>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <b-form-group label="Nomor &amp; Tgl. Flight">
                    <b-input-group>
                        <b-form-input v-model="dataCd.no_flight" type="text" id="no_flight"  class="md-3" :disabled="disableInput"></b-form-input>
                        <template v-slot:append>
                            <datepicker v-model="dataCd.tgl_kedatangan" id="tgl_kedatangan" :disabled="disableInput"></datepicker>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group label="Airport asal dan tujuan" label-for="kd_pelabuhan_asal">
                    <b-input-group prepend="Dari" class="mb-2">
                        <b-form-input v-model="dataCd.kd_pelabuhan_asal" id="kd_pelabuhan_asal" type="text" :disabled="disableInput"></b-form-input>
                        <b-input-group-prepend is-text>
                            Ke
                        </b-input-group-prepend>
                        <b-form-input v-model="dataCd.kd_pelabuhan_tujuan" id="kd_pelabuhan_tujuan" type="text" :disabled="disableInput"></b-form-input>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>
        <!-- Flag deklarasi -->
        <b-row>
            <b-col>
                <b-form-group label="Flag Deklarasi">
                    <b-form-checkbox-group
                        :options="flagDeklarasi"
                        stacked
                        :disabled="disableInput"
                        v-model="dataCd.declare_flags">

                    </b-form-checkbox-group>
                </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col><b-button @click="onSave" class="float-right" variant="primary" :disabled="disableInput"><font-awesome-icon icon="save"></font-awesome-icon> Simpan</b-button></b-col>
        </b-row>
        <hr>
        <p>
           Details go here...
        </p>
        <pre>{{ dataCd }}</pre>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import Datepicker from '@/components/Datepicker'
import { mapMutations, mapGetters } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        SelectPenumpang2,
        Datepicker
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
                "penumpang_id": null
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
    mounted () {
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