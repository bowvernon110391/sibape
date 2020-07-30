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
                    Please Wait...<b-spinner></b-spinner>
                </div>
            </template>
            <template v-else-if="data_perhitungan">
                <!-- Table Perhitungan -->
                <component 
                    :is="pageComponent"
                    :data="data_perhitungan.pungutan"
                />

                <!-- Keterangan penetapan -->
                <div v-if="!hideKeterangan">
                    <hr>
                    <b-form-group label="Keterangan" description="catatan dari pejabat penetapan">
                        <b-form-textarea size="sm" :disabled="!simulate" v-model="keterangan" />
                    </b-form-group>
                </div>
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
                @click="createPenetapan"
                >
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

import PagePerhitunganCd from '@/components/PagePerhitunganCd'
import PagePerhitunganImpor from '@/components/PagePerhitunganImpor'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    components: {
        PagePerhitunganCd,
        PagePerhitunganImpor
    },
    props: {
        uri: {
            type: String,
            required: true
        },
        simulate: {
            type: Boolean,
            default: true
        },
        value: {
            required: true
        },
        hideKeterangan: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            // busy flag
            busy: false,

            data_perhitungan: null,

            keterangan: null
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),

        createPenetapan () {
            this.setBusyState(true)
            // call the backend with the only data = keterangan
            this.api.putEndpoint(this.uri+'/penetapan', {
                keterangan: this.keterangan
            })
            .then(e => {
                this.setBusyState(false)
                this.showToast('Penetapan Dokumen', 'Dokumen Berhasil ditetapkan', 'success')
                this.$emit('input', false) // close ourself
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
                this.$emit('input', false) // close ourself
            })
        }
    },
    computed: {
        ...mapGetters(['api']),

        isKomersil: function() {
            return typeof this.data_perhitungan.pungutan.pembebasan === 'undefined'
        },

        pageComponent () {
            return this.isKomersil ? PagePerhitunganImpor : PagePerhitunganCd
        }
    },

    watch: {
        value: {
            handler(val) {
                if (val) {
                    this.busy = true
                    // we're being shown, let's fetch
                    this.api.getEndpoint(this.uri+'/simulasi')
                    .then(e => {
                        this.busy = false
                        // let's 
                        this.data_perhitungan = e.data
                        this.keterangan = e.data.keterangan ? e.data.keterangan.keterangan : null
                    })
                    .catch(e => {
                        this.busy = false
                        this.handleError(e)
                        this.$nextTick(() => {
                            this.$emit('input', false)
                        })
                    })
                }
            }
        }
    }
}
</script>

<style scoped>
.nudged {
    margin-left: 1em !important;
}
</style>