<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        header-bg-variant="light"
        size="md"
        centered
        :title="title"
        @change="e => $emit('input', e)"
        >
        
        <!-- SELECT-PEMBATALAN : MIGHT NEED TO REFACTOR LATER -->
        <api-select
            label="nomor_lengkap"
            :reduce="e => e.id"
            :search-callback="searchPembatalan"
            :sync-callback="searchPembatalan"
            search-on-empty
            v-model="pembatalanId">
            <!-- normal options on the list -->
            <template v-slot:option="opt">
                <div>
                    <strong>{{ opt.nomor_lengkap }}</strong>

                    <span class="float-right">
                        ({{ opt.tgl_dok }})
                    </span>
                </div>
                <div>
                    <p class="my-0">{{ opt.nama_pejabat }}</p>
                    <p class="my-0"><em>{{ opt.nip_pejabat }}</em></p>
                </div>
            </template>

            <!-- selected options -->
            <template v-slot:selected-option="opt">
                <div>
                    <strong>{{ opt.nomor_lengkap }}</strong> tanggal (<em>{{ opt.tgl_dok }}</em>)
                </div>
            </template>
        </api-select>

        <template v-slot:modal-footer>
            <!-- put some buttons here -->
            <b-button 
                variant="danger"
                size="sm"
                @click="handlePembatalan">
                <font-awesome-icon icon="radiation">
                </font-awesome-icon>
                Batalkan Dokumen (!)
            </b-button>
        </template>
    </b-modal>
</template>

<script>

import ApiSelect from '@/components/ApiSelect'
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,

    mixins: [ axiosErrorHandler ],

    components: {
        ApiSelect
    },

    computed: {
        ...mapGetters(['api'])
    },

    props: {
        doctype: {
            type: String,
            required: true
        },

        docid: {
            type: [Number,String],
            required: true
        },

        value: {
            type: [Boolean,Number,String],
            required: true
        },

        title: {
            type: String,
            default: "Pilih Surat Pembatalan"
        }
    },

    data () {
        return {
            pembatalanId : null
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        searchPembatalan (q, spinner, vm) {
            spinner(true)
            this.api.getPembatalan({
                q: q,
                status: 'unlocked',
                number: 15
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        handlePembatalan () {
            // first, close it?
            // first, check if id is not null
            if (!this.pembatalanId) {
                // error, and dont close
                this.showToast(`Error`, 'Tolong pilih surat pembatalan yang akan digunakan!', 'danger')
            } else {
                
                // set busy first
                this.setBusyState(true)

                // now we call the api
                this.api.addPembatalanDetail(this.pembatalanId, this.doctype, this.docid)
                .then(e => {
                    // stop loading screen
                    this.setBusyState(false)
                    // show message
                    this.showToast('Dokumen berhasil dibatalkan',
                        `${this.doctype} #${this.docid} berhasil dibatalkan dengan Pembatalan #${this.pembatalanId}`, 'success')
                    // for now, just alert it
                    this.$emit('input', false)

                    // tell parent to refresh
                    this.$emit('refresh')
                })
                .catch(e => {
                    this.setBusyState(false)
                })
            }
        }
    }
}
</script>