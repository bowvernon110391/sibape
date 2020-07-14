<template>
    <b-input-group class="d-flex">
        <v-select
            label="nama"
            v-bind="$attrs"
            v-on="$listeners"

            :options="pjt"
            :reduce="e => e.id"

            class="flex-grow-1 no-flex-selected"
            :disabled="disabled"
        >
            <!-- custom rendering -->
            <template #option="opt">
                <div>
                    <h5>{{ opt.nama }}</h5>
                    <strong>NPWP ({{ opt.npwp }})</strong>
                </div>
            </template>

            <!-- selected -->
            <template #selected-option="opt">
                <div>
                    <strong>{{ opt.nama }}</strong>
                </div>
                <div>
                    NPWP ({{opt.npwp}})
                </div>
            </template>
        </v-select>

        <!-- the button -->
        <b-input-group-append>
            <b-button 
            variant="primary"
            size="sm"
            :disabled="disabled"
            v-b-modal.modal-add-pjt
            >
                <font-awesome-icon icon="user-plus"/>
            </b-button>
        </b-input-group-append>
        <!-- put some modal here -->
        <b-modal
            id="modal-add-pjt"
            header-bg-variant="light"
            footer-bg-variant="light"
            title="Rekam PJT Baru"
            ref="modal"
        >
            <!-- custom footer -->
            <template #modal-footer>
                <b-button
                    size="sm"
                    variant="primary"
                    @click="storePjt"
                >
                    <font-awesome-icon icon="save"/>
                    Simpan
                </b-button>
            </template>

            <!-- custom contents -->
            <b-form-group label="Nama PJT" description="Nama min 6 karakter">
                <b-form-input size="sm" v-model="newPjt.nama" />
            </b-form-group>
            <b-form-group label="NPWP" description="Npwp harus 15 digit (minus tanda baca)">
                <b-form-input size="sm" v-model="newPjt.npwp" />
            </b-form-group>
            <b-form-group label="Alamat" description="Opsional, bisa dikosongin">
                <b-form-textarea size="sm" v-model="newPjt.alamat" />
            </b-form-group>
        </b-modal>
    </b-input-group>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import vSelect from 'vue-select'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,

    mixins: [
        axiosErrorHandler
    ],

    components: {
        vSelect
    },

    props: [ 'disabled' ],

    data () {
        return {
            // new pjt to be stored
            newPjt: {
                npwp: null,
                nama: null,
                alamat: null
            }
        }
    },

    methods: {
        ...mapActions(['fetchRefDataPjt']),
        ...mapMutations(['setRefDataPjt', 'setBusyState']),

        storePjt() {
            var id = null // the newly created pjt

            this.setBusyState(true)
            // 1st, POST /pjt : { nama, npwp }
            this.api.createPjt(this.newPjt)
            // 2nd, then -> refetch (clear and fetch again)
            .then(e => {
                // store id
                id = e.data.id
                // clear it
                this.setRefDataPjt([])
                // fetch again
                this.fetchRefDataPjt()
                .then(e => {
                    // done fetching, let's emit toast
                    this.showToast('PJT Tersimpan', `PJT tersimpan dengan id #${id}`, 'success')
                    // 3rd,   then -> emit input -> hide
                    this.$emit('input', id)
                    this.$nextTick(() => {
                        this.setBusyState(false)
                        this.$refs.modal.hide()

                        // clear data
                        this.newPjt.nama = null
                        this.newPjt.npwp = null
                        this.newPjt.alamat = null
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
        ...mapGetters(['pjt', 'api'])
    },

    created: function () {
        if (!this.pjt.length) {
            this.fetchRefDataPjt()
        }
    }
}
</script>

<style>
.no-flex-selected .vs__selected {
    display: block;
}
</style>