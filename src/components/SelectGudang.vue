<template>
    <b-input-group>
        <v-select
            label="kode"
            v-bind="$attrs"
            v-on="$listeners"

            :options="gudang"

            class="flex-grow-1 no-flex-selected"
            :disabled="disabled"
        >
            <!-- custom rendering -->
            <template #option="opt">
                <h5>{{ opt.kode }}</h5>
                <template v-if="opt.tps">
                    <div>
                        <strong>🏤 ({{ opt.tps.data.nama }})</strong>
                    </div>
                    <div>
                        <small>{{ opt.tps.data.alamat }}</small>
                    </div>
                </template>
            </template>

            <!-- selected -->
            <template #selected-option="opt">
                <strong>{{ opt.kode }}</strong><span v-if="opt.tps">&nbsp;({{ opt.tps.data.nama }})</span>
            </template>
        </v-select>

        <!-- the button -->
        <b-input-group-append>
            <b-button 
            variant="primary"
            size="sm"
            :disabled="disabled"
            v-b-modal.modal-add-gudang
            >
                <font-awesome-icon icon="user-plus"/>
            </b-button>
        </b-input-group-append>
        <!-- put some modal here -->
        <b-modal
            id="modal-add-gudang"
            header-bg-variant="light"
            footer-bg-variant="light"
            title="Rekam Gudang Baru"
            ref="modal"
        >
            <!-- custom footer -->
            <template #modal-footer>
                <b-button
                    size="sm"
                    variant="primary"
                    @click="storeGudang"
                >
                    <font-awesome-icon icon="save"/>
                    Simpan
                </b-button>
            </template>

            <!-- custom contents -->
            <b-form-group label="Kode TPS">
                <select-tps
                    :reduce="e => e.id"
                    v-model="newGudang.tps_id"
                />
            </b-form-group>
            <b-form-group label="Kode Gudang">
                <b-form-input
                    size="sm"
                    v-model="newGudang.kode"
                />
            </b-form-group>
        </b-modal>
    </b-input-group>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import vSelect from 'vue-select'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

import SelectTps from '@/components/SelectTps'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        vSelect,
        SelectTps
    },

    props: [ 'disabled' ],

    data () {
        return {
            // new pjt to be stored
            newGudang: {
                tps_id: null,
                kode: null
            }
        }
    },

    methods: {
        ...mapActions(['fetchRefDataGudang']),
        ...mapMutations(['setRefDataGudang', 'setBusyState']),

        storeGudang() {
            var id = null // the newly created pjt

            this.setBusyState(true)
            // 1st, POST /pjt : { nama, npwp }
            this.api.createGudang(this.newGudang.tps_id, this.newGudang.kode)
            // 2nd, then -> refetch (clear and fetch again)
            .then(e => {
                // store id
                id = e.data.id
                // clear it
                this.setRefDataGudang([])
                // fetch again
                this.fetchRefDataGudang()
                .then(e => {
                    // done fetching, let's emit toast
                    this.showToast('Kode Gudang Tersimpan', `Kode Gudang tersimpan dengan id #${id}`, 'success')
                    // 3rd,   then -> emit input -> hide
                    this.$emit('input', id)
                    this.$nextTick(() => {
                        this.setBusyState(false)
                        this.$refs.modal.hide()

                        // clear data
                        this.newGudang.kode = null
                        this.newGudang.tps_id = null
                    })
                })
            })
            // handle error as usual?
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    },

    computed: {
        ...mapGetters(['gudang', 'api'])
    },

    created: function () {
        if (!this.gudang.length) {
            this.fetchRefDataGudang()
        }
    }
}
</script>