<template>
    <b-dropdown size="sm" variant="info" class="shadow" right :disabled="disabled">
        <template #button-content>
            💲 Bayar
        </template>

        <!-- Option -->
        <b-dropdown-item @click="$emit('createBppm')" :disabled="disabled">
            Manual (BPPM)
        </b-dropdown-item>
        <b-dropdown-item @click="$emit('createBilling')" :disabled="disabled">
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
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>