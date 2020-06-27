<template>
    <v-select 
    label="nama"
    :options="jenisDokkap"
    :reduce="e => e.id"
    v-bind="$attrs"
    v-on="$listeners"
    >
        <!-- custom rendering of option -->
        <template #option="opt">
            {{ opt.id }} - <strong>{{ opt.nama }}</strong>
        </template>

        <!-- for selected option -->
        <template #selected-option="opt">
            {{ opt.id }} -&nbsp;<strong>{{ opt.nama }}</strong>
        </template>
    </v-select>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import vSelect from 'vue-select'

export default {
    inheritAttrs: false,

    components: {
        vSelect
    },

    methods: {
        ...mapActions(['fetchRefDataJenisDokkap'])
    },

    computed: {
        ...mapGetters(['jenisDokkap'])
    },

    created: function () {
        if (!this.jenisDokkap.length) {
            this.fetchRefDataJenisDokkap()
        }
    }
}
</script>