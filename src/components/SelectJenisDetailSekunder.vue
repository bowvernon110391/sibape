<template>
    <v-select
        :options="jenisDetailSekunder"
        :reduce="e => e.nama"
        label="nama"
        v-bind="$attrs"
        v-on="$listeners">
    </v-select>
</template>

<script>
// import vSelect
import vSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'

export default {
    inheritAttrs: false,
    components: {
        vSelect
    },
    computed: {
        ...mapGetters(['jenisDetailSekunder'])
    },
    methods: {
        ...mapActions(['fetchRefDataJenisDetailSekunder'])
    },
    created () {
        // force fetch if not populated yet
        if (!this.jenisDetailSekunder.length) {
            this.fetchRefDataJenisDetailSekunder()
        }
    }
}
</script>