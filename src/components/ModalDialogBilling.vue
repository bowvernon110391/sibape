<template>
    <b-modal
        v-on="$listeners"
        v-bind="$attrs"
        header-bg-variant="light"
        footer-bg-variant="light"
        ref="modal"
    >
        <!-- title -->
        <template #modal-title>
            Input Data Billing
        </template>

        <!-- body -->
        <b-form-group label="Nomor Billing">
            <b-form-input :v-model="nomor" :disabled="disabled"/>
        </b-form-group>

        <b-form-group label="Tanggal Billing">
            <b-form-input :v-model="tanggal" :disabled="disabled"/>
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
        }
    },

    components: {
        Datepicker
    },

    data () {
        return {
            nomor: '',
            tanggal: ''
        }
    },

    methods: {
        handleOk() {
            this.$refs['modal'].hide()
            this.$emit('select', {
                nomor: nomor,
                tanggal: tanggal
            })
        }
    }
}
</script>