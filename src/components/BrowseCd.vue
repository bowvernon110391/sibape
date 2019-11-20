<template>
    <div>
        <div class="mb-2">
            <b-button variant="primary" to="/cd/new">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input CD
            </b-button>
        </div>
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getCd">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-cd :items="data"
                    @deleteHeader="deleteCd"></table-cd>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableCd from '@/components/TableCd'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        TableCd
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // ambil data cd
        getCd (q, spinner, vm) {
            spinner(true)
            this.api.getCd({
                ...q,
                include: 'pelabuhan_asal,pelabuhan_tujuan'
            })
            .then(e => {
                // console.log("Got cd data:")
                // console.log(e.data.data)
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // hapus data cd
        deleteCd (id) {
            alert(`Delete Cd #${id}`)
        }
    },
    data () {
        return {
            
        }
    }
}
</script>