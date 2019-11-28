<template>
    <div>
        <!-- paginated browser -->
        <paginated-browser
            :data-callback="getPenumpang"
            ref="browserPenumpang">
            <!-- di dalem ada tabel -->

        </paginated-browser>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        PaginatedBrowser
    },
    methods: {

        // panggil api utk ambil data penumpang
        getPenumpang(q, spinner, vm) {
            spinner(true)

            var me = this

            this.api.getPenumpang({
                q: q
            })
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