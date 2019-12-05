<template>
    <div>
        <!-- paginated browser -->
        <paginated-browser
            :data-callback="getKurs">
            <template v-slot:default="{ data, pagination }">
                <!-- table kurs -->
                <table-kurs
                    :items="data">
                </table-kurs>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import TableKurs from '@/components/TableKurs'
import { mapGetters } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        PaginatedBrowser,
        TableKurs
    },
    methods: {
        // panggil api utk ambil data kurs
        getKurs(q, spinner, vm) {
            spinner(true)

            var me = this

            this.api.getKurs(q)
            .then(e => {
                spinner(false)

                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                me.handleError(e)
            })
        }
    },
    computed: {
        ...mapGetters(['api'])
    }
}
</script>