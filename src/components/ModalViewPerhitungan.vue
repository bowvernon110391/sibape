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
            <template v-else>
                <!-- BM -->
                <b-row>
                    <b-col sm="4">
                        Bea Masuk
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_bm | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- CUKAI -->
                <b-row>
                    <b-col sm="4">
                        Cukai
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_cukai | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- PPN -->
                <b-row>
                    <b-col sm="4">
                        PPN
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_ppn | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- PPh -->
                <b-row>
                    <b-col sm="4">
                        PPh
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_pph | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- PPNBM -->
                <b-row>
                    <b-col sm="4">
                        PPNBM
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
                        <div class="text-md-right">
                            {{ perhitungan.total_ppnbm | formatCurrency(2) }}
                        </div>
                    </b-col>
                </b-row>
                <!-- Total -->
                <hr>
                <b-row>
                    <b-col sm="4">
                        Total
                    </b-col>
                    <b-col sm="1" offset-md="2">
                        Rp.
                    </b-col>
                    <b-col md="4" sm="7">
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
                <b-row v-if="true">
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

            data_perhitungan: {"komersil":true,"pph_tarif":"7.5000","ppnbm_tarif":0,"total_bm":273818000,"total_cukai":0,"total_ppn":252467000,"total_pph":189352000,"total_ppnbm":0,"total_bm_pajak":715637000,"data_perhitungan":[{"bm_tarif":5,"bm_tarif_hs":5,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":12,"jenis_satuan":"KGM","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":432789778.88978285,"fob":"56917.0584","insurance":"52.8125","freight":"86.2394","cif":57056.1103,"bm":21640000,"cukai":0,"ppn":45443000,"pph":34083000,"ppnbm":0,"valuta":"USD","ndpbm":"7585.3362","long_description":"Illum vero perspiciatis labore. -- 7 BX, 12 KGM -- brutto 3650905.9930 KG, netto 2501016.5645 KG\n- IMEI : Modi nulla nam iusto ratione laborum hic numquam beatae quae dolorem cupiditate.; - MAC ADDRESS : Aut rem facilis aut nisi quo corrupti ut rerum odit.; - IMEI : Deleniti ex rerum qui veniam."},{"bm_tarif":5,"bm_tarif_hs":5,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":90,"jenis_satuan":"EA","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":26735.0162,"fob":"26530.0617","insurance":"26.4404","freight":"178.5141","cif":26735.0162,"bm":2000,"cukai":0,"ppn":3000,"pph":3000,"ppnbm":0,"valuta":"IDR","ndpbm":"1.0000","long_description":"Dolorem molestias dolorum eum reiciendis possimus sunt iste a. -- 17 BX, 90 EA -- brutto 22.2613 KG, netto 11.7585 KG"},{"bm_tarif":5,"bm_tarif_hs":5,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":26,"jenis_satuan":"PCE","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":278544312.72827643,"fob":"31019.1892","insurance":"90.8928","freight":"81.2340","cif":31191.316000000003,"bm":13928000,"cukai":0,"ppn":29248000,"pph":21936000,"ppnbm":0,"valuta":"USD","ndpbm":"8930.1879","long_description":"Distinctio facilis. -- 11 BX, 26 PCE -- brutto 24.1683 KG, netto 5.5077 KG"},{"bm_tarif":550,"bm_tarif_hs":550,"jenis_tarif_bm":"SPESIFIK","satuan_spesifik":"\/kg","jumlah_satuan":56,"jenis_satuan":"KGM","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":74312295.74509974,"fob":"80764.1239","insurance":"94.4882","freight":"28.9177","cif":80887.52980000002,"bm":31000,"cukai":0,"ppn":7435000,"pph":5576000,"ppnbm":0,"valuta":"KRW","ndpbm":"918.7114","long_description":"Et optio occaecati. -- 11 BX, 56 KGM -- brutto 9342793.7602 KG, netto 6114082.1922 KG"},{"bm_tarif":0,"bm_tarif_hs":0,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":83,"jenis_satuan":"KGM","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":512280039.51214415,"fob":"88599.7421","insurance":"11.3471","freight":"35.0044","cif":88646.09360000001,"bm":0,"cukai":0,"ppn":51229000,"pph":38422000,"ppnbm":0,"valuta":"THB","ndpbm":"5778.9353","long_description":"Quaerat ut et. -- 9 BX, 83 KGM -- brutto 983289.9061 KG, netto 23579.5598 KG"},{"bm_tarif":25,"bm_tarif_hs":25,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":30,"jenis_satuan":"PCE","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":952861668.7829953,"fob":"69138.9318","insurance":"67.5949","freight":"115.4632","cif":69321.9899,"bm":238216000,"cukai":0,"ppn":119108000,"pph":89331000,"ppnbm":0,"valuta":"THB","ndpbm":"13745.4460","long_description":"Non et accusamus occaecati beatae. -- 10 PK, 30 PCE -- brutto 43599.1949 KG, netto 6211.9235 KG\n- IMSI : Eligendi nulla quisquam facilis ipsam."},{"bm_tarif":10,"bm_tarif_hs":10,"jenis_tarif_bm":"ADVALORUM","satuan_spesifik":null,"jumlah_satuan":50,"jenis_satuan":"KGM","ppn_tarif":10,"pph_tarif":7.5,"ppnbm_tarif":0,"nilai_pabean":1852.7744,"fob":"1727.6742","insurance":"37.7098","freight":"87.3904","cif":1852.7744,"bm":1000,"cukai":0,"ppn":1000,"pph":1000,"ppnbm":0,"valuta":"IDR","ndpbm":"1.0000","long_description":"Animi id sunt. -- 7 RO, 50 KGM -- brutto 4088715.5413 KG, netto 1299673.3441 KG\n- SERIAL NUMBER : Fugiat harum ut corporis est quam doloremque error."}],"data_pembebasan":null}
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
        ...mapGetters(['api', 'lokasi'])
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