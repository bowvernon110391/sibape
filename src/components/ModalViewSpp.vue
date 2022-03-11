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
                <font-awesome-icon icon="hand-paper"></font-awesome-icon>
                Penangguhan Pengeluaran <em>(Release Postponement)</em>
            </h4>
        </template>

        <!-- body -->
        <template v-slot:default>
            <!-- when busy, show spinner -->
            <template v-if="(busy || !dataSpp)">
                <div class="text-md-center">
                    {{ simulate ? 'Generating' : 'Loading' }} SPP...<b-spinner></b-spinner>
                </div>
            </template>

            <!-- show input? -->
            <template v-else>
                <b-row>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Nama/<em>Name</em>
                            </template>
                            <b-form-input
                                type="text"
                                :value="dataPenumpang.data.nama"
                                disabled/>
                        </b-form-group>
                    </b-col>

                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Alamat/<em>Address</em>
                            </template>
                            <b-form-textarea
                                :value="dataSpp.source.data.alamat"
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
                                :value="dataPenumpang.data.no_paspor"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Kebangsaan/<em>Nationality</em>
                            </template>
                            <b-form-input
                                :value="dataPenumpang.data.negara.data.uraian"
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
                                :value="dataSpp.source.data.no_flight"
                                disabled></b-form-input>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <b-form-group>
                            <template #label>
                                Asal/<em>Country of Origin</em>
                            </template>
                            <b-form-input
                                :value="dataSpp.negara_asal.data.uraian"
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
                                v-for="(barang, id) in dataSpp.source.data.details.data"
                                :key="id"
                                :value="(id+1) + '. ' + barang.uraian"
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
        <template v-slot:modal-footer="{ cancel }">
            <b-button
                variant="primary"
                size="sm"
                :disabled="!simulate || busy || !dataSpp || disabled"
                @click="onSave"
                >
                <font-awesome-icon icon="hand-paper" v-if="!disabled">
                </font-awesome-icon>
                <b-spinner
                    small
                    v-else>
                </b-spinner>
                Tunda Pengeluaran
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
        sourceId: {
            type: [Number, String],
            required: true
        },

        sourceType: {
            type: String,
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
                lokasi: this.lokasi
            }

            this.api.createSpp(this.sourceType, this.sourceId, data)
            .then(e => {
                this.disabled = false
                const retData = e.data

                // make toast
                this.showToast("Perekaman SPP",
                    `${this.sourceType} #${this.sourceId} ditunda pengeluarannya dengan SPP #${retData.id}`,
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

            dataSpp: null,

            keterangan: null,

            disabled: false
        }
    },

    computed: {
        ...mapGetters(['api', 'lokasi']),

        dataPenumpang() {
            return this.dataSpp ? this.dataSpp.source.data.penumpang ? this.dataSpp.source.data.penumpang : this.dataSpp.source.data.importir : null
        },

        quantityString() {
            if (!this.dataSpp) {
                return null
            }

            var total_brutto = this.dataSpp.source.data.details.data.reduce((acc, e) => (acc + e.brutto), 0.0)

            return this.dataSpp.source.data.koli + " Koli / " +
                this.$options.filters.formatCurrency(total_brutto, 2) + " kg"
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
                        sppCallback = this.api.getMockupSpp(this.sourceType, this.sourceId)
                    } else {
                        sppCallback = this.api.getSppBySourceId(this.sourceType, this.sourceId)
                    }

                    sppCallback
                    .then(e => {
                        // cancel busy state
                        this.busy = false

                        // set data
                        this.dataSpp = e.data.data
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
