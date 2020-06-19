<template>
    <api-select 
        v-bind="$attrs" 
        v-on="$listeners"

        :reduce="e => e.user_id"
        :get-option-key="e => e.user_id"
        label="name"
        :search-callback="searchPemeriksa"
        :sync-callback="syncPemeriksa"

        :search-on-empty="true"
        >
        <!-- Option Slot -->
        <template #option="opt">
            <!-- spawn some divs? -->
            <div>
                <strong>{{ opt.name }}</strong>
            </div>
            <div>
                NIP {{ opt.nip }}
            </div>
            <div>
                {{ opt.pangkat }}
            </div>
        </template>

        <!-- Selected option slot -->
        <template #selected-option="opt">
            <div>
                <strong>{{ opt.name }}</strong> - (<em>{{ opt.nip }}</em>)
            </div>
        </template>
    </api-select>
</template>

<script>
import ApiSelect from '@/components/ApiSelect'
import { mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,
    components: {
        ApiSelect
    },

    mixins: [axiosErrorHandler],

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        searchPemeriksa(q, spinner, vm) {
            spinner(true)

            this.api.getPemeriksa({
                q: q
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },
        syncPemeriksa(q, spinner, vm) {
            this.searchPemeriksa('', spinner, vm)
        }
    }
}
</script>