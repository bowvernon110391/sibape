<template>
    <div>
        <!-- Paginated browser -->
        <paginated-browser
            :data-callback="getIp"
            ref="browserIp">
            <template #default="{ data, pagination }">
                <table-ip :items="data" />
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'

import PaginatedBrowser from '@/components/PaginatedBrowser'

import TableIp from '@/components/TableIp'

export default {
    mixins: [
        axiosErrorHandler
    ],
    components: {
        PaginatedBrowser,
        TableIp
    },
    computed: {
        ...mapGetters(['api'])
    },
    methods: {
        ...mapMutations(['setBusyState']),

        getIp (q, spinner, vm) {
            spinner(true)
            this.api.getIp({
                ...q,
                self: true // limit ip to only that belongs to us
            })
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    }
}
</script>