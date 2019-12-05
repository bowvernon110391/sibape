<template>
    <div>
        <!-- Button control -->
        <div class="mb-2">
            <b-button variant="primary" class="shadow">
                <font-awesome-icon icon="cloud-download-alt"></font-awesome-icon>
                Tarik dari Situs BKF
            </b-button>
        </div>
        <!-- paginated browser -->
        <paginated-browser
            :data-callback="getKurs"
            ref="kursBrowser">
            <template v-slot:default="{ data, pagination }">
                <!-- table kurs -->
                <table-kurs
                    :items="data"
                    @deleteKurs="handleDelete">
                </table-kurs>
            </template>
        </paginated-browser>

        <!-- confirm box -->
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import TableKurs from '@/components/TableKurs'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        PaginatedBrowser,
        TableKurs
    },
    methods: {
        // grab set busy state
        ...mapMutations(['setBusyState']),

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
        },

        // handle deletion
        handleDelete(id) {
            // alert(`deleting kurs...${id}`)
            this.setBusyState(true)

            var vm = this

            // call api
            this.api.deleteKurs(id)
            .then(e => {
                // success
                vm.setBusyState(false)

                // reload
                vm.$refs.kursBrowser.loadData()
            })
            .catch(e => {
                // fail
                vm.setBusyState(false)

                vm.handleError(e)
            })
        }
    },
    computed: {
        ...mapGetters(['api'])
    }
}
</script>