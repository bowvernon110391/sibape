<template>
    <div>
        <!-- paginated browser -->
        <paginated-browser
            :search-date-range="false"
            :data-callback="getPenumpang"
            ref="browserPenumpang">
            <!-- di dalem ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-penumpang
                    :items="data">
                </table-penumpang>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TablePenumpang from '@/components/TablePenumpang'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        PaginatedBrowser,
        TablePenumpang
    },
    methods: {

        // panggil api utk ambil data penumpang
        getPenumpang(q, spinner, vm) {
            spinner(true)

            var me = this

            this.api.getPenumpang(q)
            .then(e => {
                spinner(false)

                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                me.errorHandler(e)
            })
        }
    },
    computed: {
        ...mapGetters(['api'])
    }
}
</script>