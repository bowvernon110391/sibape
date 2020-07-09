<template>
    <b-dropdown size="sm" variant="info" class="shadow" right>
        <template #button-content>
            💲 Bayar
        </template>

        <!-- Option -->
        <b-dropdown-item>
            Manual (BPPM)
        </b-dropdown-item>
        <b-dropdown-item>
            Dengan Billing (input manual)
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'

export default {
    inheritAttrs: false,

    props: {
        uri: {
            type: String,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>