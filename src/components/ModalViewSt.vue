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
                <font-awesome-icon icon="lock"></font-awesome-icon>
                Penahanan/Penitipan <em>(Detention/Deposit)</em>
            </h4>
        </template>

        <!-- body -->
        <template v-slot:default>
            <!-- when busy, show spinner -->
            <template v-if="(busy || !dataSt)">
                <div class="text-md-center">
                    {{ simulate ? 'Generating' : 'Loading' }} ST...<b-spinner></b-spinner>
                </div>
            </template>

            <!-- show input? -->
            <template v-else>
                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Jenis ST/<em>Type of detention</em>
                            </template>
                            <b-form-radio-group v-model="dataSt.jenis">
                                <b-form-radio value="KANTOR">Kantor/<em>Office</em></b-form-radio>
                                <b-form-radio value="TERMINAL">Terminal</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <hr>
                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Nama/<em>Name</em>
                            </template>
                            <b-form-input
                                type="text"
                                :value="dataSt.cd.data.penumpang.data.nama"
                                disabled/>
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Alamat/<em>Address</em>
                            </template>
                            <b-form-textarea
                                :value="dataSt.cd.data.alamat"
                                disabled>
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Pasport/<em>Passport No.</em>
                            </template>
                            <b-form-input
                                :value="dataSt.cd.data.penumpang.data.no_paspor"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Kebangsaan/<em>Nationality</em>
                            </template>
                            <b-form-input
                                :value="dataSt.cd.data.penumpang.data.negara.data.uraian"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                <em>Flight / Voyage No.</em>
                            </template>
                            <b-form-input
                                :value="dataSt.cd.data.no_flight"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Asal/<em>Country of Origin</em>
                            </template>
                            <b-form-input
                                :value="dataSt.negara_asal.data.uraian"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- Untuk data barang -->
                <hr>
                <b-row>
                    <!-- summary jumlah -->
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Jumlah/<em>Quantity</em>
                            </template>
                            
                            <b-form-input
                                disabled
                                :value="quantityString">
                            </b-form-input>
                        </b-form-group>
                    </b-col>

                    <!-- simple uraian -->
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Uraian Barang/<em>Description</em>
                            </template>
                            <b-form-input
                                v-for="(uraian, id) in dataSt.uraian_summary"
                                :key="uraian"
                                :value="(id+1) + '. ' + uraian"
                                disabled
                                class="mb-2"/>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- last row, name and address -->
                <hr>
                <b-row>
                    <b-col>
                        <b-form-group
                            label="Keterangan"
                            description="catatan tambahan untuk SPP ini">
                            <b-form-textarea
                                v-model="keterangan"
                                :disabled="!simulate || disabled">
                            </b-form-textarea>
                        </b-form-group>
                    </b-col>
                </b-row>

            </template>
        </template>

        <!-- footer -->
        <template v-slot:modal-footer="{ visible, ok, cancel }">
            <b-button 
                variant="primary" 
                size="sm" 
                :disabled="!simulate || busy || !dataSt || disabled"
                @click="onSave"
                >
                <font-awesome-icon icon="lock" v-if="!disabled">
                </font-awesome-icon>
                <b-spinner 
                    small
                    v-else>
                </b-spinner>
                Tahan/Titipkan
            </b-button>
            <b-button variant="danger" @click="cancel" size="sm" :disabled="disabled">
                <font-awesome-icon icon="times">
                </font-awesome-icon>
                Tutup
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {

    },

    props: {
        cdId: {
            type: [Number, String],
            required: true
        },

        value: {
            required: true
        },

        simulate: {
            type: Boolean,
            default: true
        }
    },

    methods: {
        onSave () {
            if (this.disabled) {
                return
            }

            this.disabled = true

            // call teh api
            const data = {
                keterangan: this.keterangan,
                lokasi: this.lokasi,
                jenis: this.dataSt.jenis
            }

            this.api.createSt(this.cdId, data)
            .then(e => {
                this.disabled = false
                const retData = e.data

                // make toast
                this.showToast("Perekaman ST", 
                    `CD #${this.cdId} ditunda pengeluarannya dengan ST #${retData.id}`,
                    'success')

                // force close
                this.$emit('input', false)

                // change route
                this.$router.replace({
                    path: retData.uri
                })
            })
            .catch(e => {
                this.disabled = false
                this.handleError(e)
                // force close
                this.$emit('input', false)
            })
        }
    },

    data () {
        return {
            // busy flag
            busy: false,

            dataSt: null,

            keterangan: null,

            disabled: false
        }
    },

    computed: {
        ...mapGetters(['api', 'lokasi']),

        quantityString() {
            if (!this.dataSt) {
                return null
            }

            return this.dataSt.package_summary_string + " / " + this.$options.filters.formatCurrency(this.dataSt.total_brutto, 2) + " kg"
        }
    },

    watch: {
        value: {
            handler (nv, ov) {
                // when it becomes true, load some shiet
                if (nv) {
                    this.busy = true

                    // call teh api
                    var sppCallback = null

                    if (this.simulate) {
                        sppCallback = this.api.getMockupSt(this.cdId)
                    } else {
                        sppCallback = this.api.getStByCdId(this.cdId)
                    }

                    sppCallback
                    .then(e => {
                        // cancel busy state
                        this.busy = false

                        // set data
                        this.dataSt = e.data.data
                    })
                    .catch(e => {
                        this.busy = false
                        this.handleError(e)
                        // force close?
                        this.$emit('input', false)
                    })
                }
            }
        }
    }
}
</script>