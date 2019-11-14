<template>
    <api-select
        label="nama"
        :reduce="e => e.kode"
        :search-callback="searchPelabuhan"
        :sync-callback="syncPelabuhan"
        :clear-search-on-select="true"
        v-bind="$attrs"
        v-on="$listeners"
        >
        <!-- what to display for option -->
        <template v-slot:option="opt">
            <strong>{{ opt.nama }}</strong> <em>({{ opt.kode }})</em>
        </template>
        <!-- what to display for selected option -->
        <template v-slot:selected-option="opt">
            <div>
                <template v-if="opt.nama">
                    <strong>{{ opt.nama }}</strong> <em>({{ opt.kode }})</em>
                </template>
                <template v-else>
                    <strong><em>Synchronizing...</em></strong>
                </template>
            </div>
        </template>
    </api-select>
</template>

<script>
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
        // search pelabuhan, called when we lookup on select
        searchPelabuhan (q, spinner, vm) {
            // spin it out
            spinner(true)
            var me = this
            // call api
            this.api.getPelabuhan({
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

        // syncPelabuhan, called when syncing value with options
        syncPelabuhan (q, spinner, vm) {
            // spin it out
            spinner(true)
            var me = this
            // call api
            this.api.getPelabuhanByKode(q)
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