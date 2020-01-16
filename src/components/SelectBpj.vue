<template>
    <api-select
        label="nomor_lengkap"
        :reduce="e => e.id"
        :search-callback="searchBpj"
        :sync-callback="syncBpj"
        :clear-search-on-select="true"
        v-bind="$attrs"
        v-on="$listeners"
        >
        <!-- what to display for option -->
        <template v-slot:option="opt">
            
            <b-row>
                <b-col>
                    <strong>{{ opt.nomor_lengkap }}</strong>
                </b-col>
            </b-row>    
            <b-row>
                <b-col>
                    <em>{{ opt.nomor_jaminan }}</em>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <em>{{ opt.bentuk_jaminan }}</em>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    {{ opt.penumpang.data.nama }}
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <strong>{{ opt.penjamin }}</strong>
                </b-col>
            </b-row>
            
        </template>
        <!-- what to display for selected option -->
        <template v-slot:selected-option="opt">
            <div>
                <template v-if="opt.nomor_lengkap">
                    <strong>{{ opt.nomor_lengkap }}</strong>
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
        searchBpj (q, spinner, vm) {
            // spin it out
            spinner(true)
            var me = this
            // call api
            this.api.getBpj({
                q: q,
                status_not: 'CLOSED'
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
        syncBpj (q, spinner, vm) {
            // spin it out
            spinner(true)
            var me = this
            // call api
            this.api.getBpjById(q)
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