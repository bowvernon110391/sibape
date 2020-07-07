<template>
    <v-select 
    label="nama"
    :options="jenisPungutan"
    :reduce="e => e.id"
    v-bind="$attrs"
    v-on="$listeners"
    >
        <!-- custom rendering of option -->
        <template #option="opt">
            <h5>{{ opt.kode }}</h5> 
            <strong>{{ opt.nama }}</strong>&nbsp;(#{{ opt.kode_akun }})
        </template>

        <!-- for selected option -->
        <template #selected-option="opt">
            {{ opt.kode }} -&nbsp;<strong>{{ opt.nama }}</strong>
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
        ...mapActions(['fetchRefDataJenisPungutan'])
    },

    computed: {
        ...mapGetters(['jenisPungutan'])
    },

    created: function () {
        if (!this.jenisPungutan.length) {
            this.fetchRefDataJenisPungutan()
        }
    }
}
</script>