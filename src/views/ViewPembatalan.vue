<template>
    <div>
        <!-- nomr surat -->
        <b-row>
            <b-col md="6">
                <b-form-group
                    id="no-surat"
                    description="nomor surat lengkap"
                    label="Nomor Surat Pembatalan"
                    label-for="nomor-surat-lengkap"
                    >
                    <b-form-input
                        id="nomor-surat-lengkap"
                        type="text"
                        v-model="dataPembatalan.nomor_lengkap"
                        :disabled="disabled"
                        />
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    id="tgl-surat"
                    description="tanggal surat"
                    label="Tanggal"
                    label-for="tgl-dok"
                    >
                    <datepicker
                        id="tgl-dok"
                        :disabled="disabled"
                        v-model="dataPembatalan.tgl_dok"
                        />
                </b-form-group>
            </b-col>
        </b-row>
        
        <!-- Nama pejabat + NIP -->
        <b-row>
            <!-- Nama -->
            <b-col md="6">
                <b-form-group
                    description="nama ttd pejabat"
                    label="Nama Pejabat"
                    label-for="nama-pejabat">
                    <b-form-input
                        id="nama-pejabat"
                        type="text"
                        :disabled="disabled"
                        v-model="dataPembatalan.nama_pejabat"
                    />
                </b-form-group>
            </b-col>
            
            <!-- NIP -->
            <b-col md="6">
                <b-form-group
                    description="nip ttd pejabat"
                    label="NIP Pejabat"
                    label-for="nip-pejabat">
                    <b-form-input
                        id="nip-pejabat"
                        type="text"
                        :disabled="disabled"
                        v-model="dataPembatalan.nip_pejabat"
                    />
                </b-form-group>
            </b-col>
        </b-row>

        <!-- Keterangan -->
        <b-row>
            <b-col>
                <b-form-group
                    label="Alasan Pembatalan"
                    label-for="keterangan">
                    <b-form-textarea
                        id="keterangan"
                        :disabled="disabled"
                        v-model="dataPembatalan.keterangan"
                        />

                </b-form-group>
            </b-col>
        </b-row>

    </div>
</template>

<script>

// datepicker component
import Datepicker from '@/components/Datepicker'

// default data
import defaultPembatalan from '@/defaults/defaultPembatalan'

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import userChecker from '../mixins/userChecker'

import { mapMutations, mapGetters } from 'vuex'

const cloneDeep = require('clone-deep')

export default {
    mixins: [axiosErrorHandler, userChecker],

    components: {
        Datepicker
    },

    props: {
        id: {
            type: [Number,String],
            default: null
        }
    },

    data() {
        return {
            dataPembatalan: this.defaultData()
        }
    },

    computed: {
        ...mapGetters(['api']),


        disabled: function() {
            return this.dataPembatalan.is_locked || !this.canEdit
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        defaultData: function() {
            return cloneDeep(defaultPembatalan)
        },

        loadPembatalan(id) {
            // alert(`loading pembatalan ${id}`)
            if (!id) {
                // new input, just clear em
                this.dataPembatalan = this.defaultData()
            } else {
                // gotta load something
                this.setBusyState(true)
                // load em
                this.api.getPembatalanById(id)
                .then(e => {
                    // success, replace em
                    this.setBusyState(false)

                    this.dataPembatalan = e.data.data

                    // emit disable edit
                    this.$emit('disableEdit', this.disabled)
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)

                    this.$emit('loadError', id)
                })
            }
        },

        onSave () {
            // gotta call the correct api for this
            if (!this.dataPembatalan.is_locked) {
                // is it new or old?
                if (this.dataPembatalan.id) {
                    // save
                    // alert(`gotta save changed data`)
                    this.setBusyState(true)
                    this.api.updatePembatalan(this.dataPembatalan.id, this.dataPembatalan)
                    .then(e => {
                        this.setBusyState(false)
                        // tell user it's saved?
                        /* this.showToast(`Pembatalan saved`, `Pembatalan #${this.dataPembatalan.id} berhasil disimpan`,
                            'success') */

                        // tell em
                        this.$emit('dataSave', {
                            new: false,
                            id: this.dataPembatalan.id
                        })
                    })
                    .catch(e => {
                        this.setBusyState(false)
                        // tell user error
                        this.handleError(e)
                    })
                } else {
                    // create
                    // alert(`gotta create new data`)
                    this.setBusyState(true)
                    this.api.createPembatalan(this.dataPembatalan)
                    .then(e => {
                        this.setBusyState(false)
                        // this.showToast(`Pembatalan created`, `Pembatalan disimpan dengan id #${e.data.id}`, 'success')

                        this.$emit('dataSave', {
                            new: true,
                            id: e.data.id
                        })
                    })
                    .catch(e => {
                        this.setBusyState(false)
                        this.handleError(e)
                    })
                }
            }
        }
    },

    watch: {
        id: {
            immediate: true,
            handler (newVal) {
                this.loadPembatalan(newVal)
            }
        }
    }
}
</script>