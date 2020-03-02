<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        header-bg-variant="light"
        :visible="value"
        @change="e => $emit('input', e)">
        <!-- header -->
        <template v-slot:modal-header>
            <h4>
                <font-awesome-icon icon="cash-register">
                </font-awesome-icon>
                {{ simulate ? 'Perhitungan Bea Masuk &amp; Pajak' : 'Data Bea Masuk &amp; Pajak' }}
            </h4>
        </template>

        <!-- body -->
        <template v-slot:default>
            <!-- Bea Masuk, Cukai, PPN, PPh, PPNBM, TOTAL -->
            <template v-if="busy">
                <div class="text-md-center">
                    Calculating...<b-spinner></b-spinner>
                </div>
            </template>
            <template v-else-if="perhitungan">
                <!-- Table Perhitungan -->
                <table-perhitungan
                    :dataPenetapan="perhitungan">
                </table-perhitungan>

                <!-- Title -->
                <h5>Summary:</h5>

                <!-- BM -->
                <b-row>
                    <b-col sm="6">
                        Bea Masuk / <em>Customs Duty</em> <div v-if="!isKomersil && perhitungan.data_pembebasan" class="nudged">( <em>{{ perhitungan.data_pembebasan.tarif_bm_universal }}% x Base Value</em> )</div>
                    </b-col>
                    <b-col sm="1" offset="1">
                        Rp.
                    </b-col>
                    <b-col sm="4">
                        <div class="text-md-right">
                            {{ perhitungan.total_bm | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>

                <!-- NILAI IMPOR (only when non komersil) -->
                <b-row v-if="!isKomersil" class="text-danger">
                    <b-col sm="6">
                        Nilai Impor / <em>Import Value</em> <div v-if="!isKomersil && perhitungan.data_pembebasan" class="nudged">( <em>Base Value + Customs Duty</em> )</div>
                    </b-col>
                    <b-col sm="1">
                        Rp.
                    </b-col>
                    <b-col sm="4">
                        <div class="text-md-right">
                            <em>{{ nilaiImpor | formatCurrency(2) }}</em>
                        </div>
                    </b-col>
                </b-row>
                <!-- CUKAI -->
                <!-- <b-row>
                    <b-col sm="6">
                        Cukai
                    </b-col>
                    <b-col sm="1">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_cukai | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row> -->
                <!-- PPN -->
                <b-row>
                    <b-col sm="6">
                        PPN / <em>Value Added Tax</em> <div v-if="!isKomersil" class="nudged">( <em>10% x Import Value</em> )</div>
                    </b-col>
                    <b-col sm="1" offset="1">
                        Rp.
                    </b-col>
                    <b-col sm="4">
                        <div class="text-md-right">
                            {{ perhitungan.total_ppn | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- PPh -->
                <b-row>
                    <b-col sm="6">
                        PPh / <em>Income Tax</em> <div v-if="!isKomersil" class="nudged">( <em>{{ perhitungan.pph_tarif | formatCurrency(2) }}% x Import Value</em> )</div>
                    </b-col>
                    <b-col sm="1" offset="1">
                        Rp.
                    </b-col>
                    <b-col sm="4">
                        <div class="text-md-right">
                            {{ perhitungan.total_pph | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- PPNBM -->
                <!-- <b-row>
                    <b-col sm="4">
                        PPNBM / <em>Luxury Tax</em>
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_ppnbm | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row> -->
                <!-- Total -->
                <hr>
                <b-row>
                    <b-col sm="6">
                        Total
                    </b-col>
                    <b-col sm="1" offset="1">
                        Rp.
                    </b-col>
                    <b-col sm="4">
                        <div class="text-md-right">
                            <strong>{{ perhitungan.total_bm_pajak | formatCurrency(2) }}</strong>
                        </div>
                    </b-col>
                </b-row>

                <hr>

                <!-- catatan -->
                <b-row>
                    <b-col>
                        <b-form-group
                            label="Catatan"
                            description="catatan khusus terkait penetapan"
                            :disabled="!simulate">
                            <b-form-textarea rows="3" v-model="catatan">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- metode pembayaran -->
                <b-row v-if="false">
                    <!-- Jenis pembayaran -->
                    <b-col md="4">
                        <b-form-group
                            label="Jenis Pembayaran"
                            :disabled="!simulate">
                            <b-form-select v-model="jenis" size="sm">
                                <option value="TUNAI">Tunai</option>
                                <option value="JAMINAN">Jaminan</option>
                            </b-form-select>
                        </b-form-group>
                    </b-col>

                    <!-- Inputan detil? -->
                    <b-col md="8">
                        <!-- Apabila tunai, input no + tgl billing (dari BayMan) -->
                        <template v-if="jenis == 'TUNAI'">
                        </template>

                        <!-- Apabila jaminan, select-jaminan -->
                        <template v-else-if="jenis == 'JAMINAN'">
                            <b-row>
                                <!-- Select BPJ -->
                                <b-col md="12">
                                    <b-form-group
                                        label="Nomor BPJ"
                                        label-for="bpj-id"
                                        description="Pilih dari BPJ yang BELUM digunakan">
                                        <select-bpj
                                            id="bpj-id"
                                            search-on-empty
                                            v-model="jaminan_id"
                                            :disabled="!simulate">
                                        </select-bpj>
                                    </b-form-group>
                                </b-col>
                                <!-- Catatan BPJ -->
                                <b-col md="12">
                                    <b-form-group
                                        label="Catatan BPJ"
                                        label-for="catatan-bpj"
                                        description="Catatan khusus utk BPJ">
                                        <b-form-textarea
                                            v-model="catatan_jaminan"
                                            :disabled="!simulate">
                                        </b-form-textarea>
                                    </b-form-group>
                                </b-col>
                            </b-row>
                        </template>

                        <!-- Lain lain, input catatan aja kali ya -->
                    </b-col>
                </b-row>
            </template>

            <template v-else>
                This thing does not compute
            </template>

        </template>

        <!-- footer -->
        <template v-slot:modal-footer="{ visible, ok, cancel }">
            <b-button 
                variant="primary" 
                size="sm" 
                :disabled="!simulate"
                @click="createPenetapan">
                <font-awesome-icon icon="stamp">
                </font-awesome-icon>
                Tetapkan
            </b-button>
            <b-button variant="danger" @click="cancel" size="sm">
                <font-awesome-icon icon="times">
                </font-awesome-icon>
                Tutup
            </b-button>
        </template>
    </b-modal>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import defaultHitungCd from './defaultHitungCd.json'

import Datepicker from '@/components/Datepicker'
import SelectBpj from '@/components/SelectBpj'
import TablePerhitungan from '@/components/TablePerhitungan'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    components: {
        Datepicker,
        SelectBpj,
        TablePerhitungan
    },
    props: {
        cdId: {
            type: [Number, String],
            required: true
        },
        simulate: {
            type: Boolean,
            default: true
        },
        value: {
            required: true
        },
        initialData: {
            type: Object,
            default: null
        }
    },
    data () {
        return {
            // busy flag
            busy: false,
            perhitungan: defaultHitungCd,
            catatan: this.initialData ? this.initialData.catatan : '',
            jenis: this.initialData ? this.initialData.jenis : null,
            jaminan_id: this.initialData ? this.initialData.jaminan_id : null,
            catatan_jaminan: this.initialData ? this.initialData.catatan_jaminan : null,

            data_perhitungan: null
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
        createPenetapan () {
            // gather essential data
            var reqData = {
                jenis_pembayaran: this.jenis,
                catatan: this.catatan,
                lokasi: this.lokasi,
                jaminan_id: this.jaminan_id,
                catatan_jaminan: this.catatan_jaminan
            }

            // alert(JSON.stringify(reqData))
            this.setBusyState(true)

            // call api
            const vm = this

            this.api.createPenetapanCd(this.cdId, reqData)
            .then(e => {
                vm.setBusyState(false)
                
                // close self, and force parent to reload? or just send event
                vm.$emit('input', false)

                // show toast
                vm.showToast("Penetapan CD", `CD #${vm.cdId} berhasil ditetapkan dengan SSPCP #${e.data.id}`, 'success')

                /* // re route
                vm.$router.replace({
                    name: 'ViewCd',
                    params: {
                    id: vm.cdId
                    }
                }) */
            })
            .catch(e => {
                vm.setBusyState(false)

                // delegate error handling
                vm.handleError(e)
            })
        }
    },
    computed: {
        ...mapGetters(['api', 'lokasi']),

        isKomersil: function() {
            return this.perhitungan.komersil
        },

        nilaiImpor: function() {
            if (this.perhitungan.data_pembebasan)
                return this.perhitungan.data_pembebasan.nilai_dasar_perhitungan + this.perhitungan.total_bm
            
            return this.perhitungan.total_bm + this.perhitungan.nilai_pabean
        }
    },
    watch: {
        value: {
            immediate: true,
            handler (val) {
                if (!this.cdId || !val) {
                    return
                }
                // gotta pull computation
                this.busy = true
                var vm = this
                // call api perhitungan
                this.api.getPerhitunganCd(this.cdId)
                .then(e => {
                    vm.busy = false
                    // if success, show it
                    vm.perhitungan = e.data
                })
                .catch(e => {
                    vm.busy = false
                    // handle error
                    vm.handleError(e)
                    // force close?
                    vm.$emit('input', false)
                })
            }
        },

        perhitungan (nv, ov) {
            this.catatan = nv.catatan
            this.jenis = nv.jenis_pembayaran
            this.jaminan_id = nv.jaminan_id
            this.catatan_jaminan = nv.catatan_jaminan

            console.log("Got Data:")
            console.log(nv)
        }
    }
}
</script>

<style scoped>
.nudged {
    margin-left: 1em !important;
}
</style>