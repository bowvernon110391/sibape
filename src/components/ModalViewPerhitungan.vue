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
            <template v-else-if="data_perhitungan">
                <!-- Table Perhitungan -->
                <component 
                    :is="pageComponent"
                    :data="data_perhitungan.pungutan"
                />
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
        }
    },
    data () {
        return {
            // busy flag
            busy: false,

            data_perhitungan: null
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
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
                    this.api.getEndpoint(this.uri)
                    .then(e => {
                        this.busy = false
                        // let's 
                        this.data_perhitungan = e.data
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