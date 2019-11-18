<template>
    <api-select
        label="uraian"
        :reduce="e => e.kode"
        v-bind="$attrs"
        v-on="$listeners"
        :search-callback="searchSatuan"
        :sync-callback="syncSatuan">

        <!-- SLOT : OPTION -->
        <template v-slot:option="opt">
            <template v-if="opt.id">
                <!-- <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em> -->
                <strong>{{ opt.kode }}</strong> <em>({{ opt.uraian }})</em>
            </template>
            <template v-else>
                Tambahkan <strong>{{ opt.uraian }}</strong>...
            </template>
        </template>

        <!-- SLOT : SELECTED-OPTION -->
        <template v-slot:selected-option="opt">
            <div>
                <!-- <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em> -->
                <template v-if="opt.id">
                    <strong>{{ opt.kode }}</strong> <em>({{ opt.uraian }})</em>
                </template>
                <!-- when uraian not exist, meaning it's syncing -->
                <template v-else>
                    <strong>Synchronizing...</strong>
                </template>
            </div>
        </template>
    </api-select>
</template>

<script>
// use api select with special twist,
// it loads from static .json file, 
// should handle cache better

// import vSelect from 'vue-select'
import ApiSelect from '@/components/ApiSelect'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    components: {
        ApiSelect
    },
    computed: {
        ...mapGetters(['api'])
    },
    methods: {
        searchSatuan (q, spinner, vm) {
            spinner(true)
            var me = this

            this.api.getSatuan({
                q: q,
                number: 50
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                me.handleError(e)
            })
        },

        // sync satuan by kode
        syncSatuan (q, spinner, vm) {
            spinner(true)
            var me = this

            this.api.getSatuanByKode(q)
            .then(e => {
                spinner(false)
                vm.setOptions([e.data.data])
            })
            .catch(e => {
                spinner(false)
                me.handleError(e)
            })
        }
    }
}
</script>