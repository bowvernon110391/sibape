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
                    <b-col sm="1">
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
                    <b-col sm="1">
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
                    <b-col sm="1">
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
                    <b-col sm="1">
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
                    <b-col sm="1">
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
                    <b-col md="1" sm="0">
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
                <b-row v-if="simulate">
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
                            <b-row>
                                <!-- Nomor Billing -->
                                <b-col md="12">
                                    <b-form-group label="No Billing">
                                        <b-form-input type="text">
                                        </b-form-input>
                                    </b-form-group>
                                </b-col>
                                <!-- Tanggal Billing -->
                                <b-col md="7">
                                    <b-form-group label="Tgl Billing">
                                        <datepicker></datepicker>
                                    </b-form-group>
                                </b-col>
                            </b-row>
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
                                            search-on-empty>
                                        </select-bpj>
                                    </b-form-group>
                                </b-col>
                                <!-- Catatan BPJ -->
                                <b-col md="12">
                                    <b-form-group
                                        label="Catatan BPJ"
                                        label-for="catatan-bpj"
                                        description="Catatan khusus utk BPJ">
                                        <b-form-textarea>
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
        <template v-slot:modal-footer="{ visible, ok, cancel, close, hide }">
            <b-button variant="primary" size="sm" :disabled="!simulate">
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
import { mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import defaultHitungCd from './defaultHitungCd.json'

import Datepicker from '@/components/Datepicker'
import SelectBpj from '@/components/SelectBpj'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    components: {
        Datepicker,
        SelectBpj
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
            jenis: this.initialData ? this.initialData.jenis : null
        }
    },
    computed: {
        ...mapGetters(['api'])
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
        }
    }
}
</script>