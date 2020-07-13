<template>
    <b-modal
        v-on="$listeners"
        v-bind="$attrs"
        header-bg-variant="light"
        footer-bg-variant="light"
        ref="modal"
        :visible="value"
        @change="e => $emit('input', e)"
    >
        <!-- title -->
        <template #modal-title>
            Input Data Billing
        </template>

        <!-- body -->
        <b-form-group label="Nomor Billing">
            <b-form-input 
                v-model="nomor" 
                :disabled="disabled" 
                size="sm"/>
        </b-form-group>

        <b-form-group label="Tanggal Billing">
            <datepicker 
                v-model="tanggal"
                :disabled="disabled"
                size="sm"
                style="max-width: 128px"
            />
        </b-form-group>
        
        <b-form-group label="NTB" description="Nomor Transaksi Bank">
            <b-form-input 
                v-model="ntb" 
                :disabled="disabled" 
                size="sm"/>
        </b-form-group>
        <b-form-group label="NTPN" description="Nomor Transaksi Penerimaan Negara">
            <b-form-input 
                v-model="ntpn" 
                :disabled="disabled" 
                size="sm"/>
        </b-form-group>

        <b-form-group label="Tanggal NTPN">
            <datepicker 
                v-model="tgl_ntpn"
                :disabled="disabled"
                size="sm"
                style="max-width: 128px"
            />
        </b-form-group>

        <!-- footer -->
        <template #modal-footer>
            <b-button variant="primary" size="sm" :disabled="disabled" @click="handleOk">
                <font-awesome-icon icon="save"/>
                Simpan
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import Datepicker from '@/components/Datepicker'

export default {
    inheritAttrs: false,

    props: {
        disabled: {
            type: Boolean,
            default: false
        },

        value: {
            type: Boolean
        }
    },

    components: {
        Datepicker
    },

    data () {
        return {
            nomor: '',
            tanggal: '',
            ntb: null,
            ntpn: null,
            tgl_ntpn: null
        }
    },

    methods: {
        handleOk() {
            this.$refs['modal'].hide()
            this.$emit('select', {
                nomor: this.nomor,
                tanggal: this.tanggal,
                ntb: this.ntb,
                ntpn: this.ntpn,
                tgl_ntpn: this.tgl_ntpn
            })
        }
    }
}
</script>