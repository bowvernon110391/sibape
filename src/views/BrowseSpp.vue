<template>
    <div>
        <!-- <div class="mb-2">
            <b-button variant="primary" to="/cd/new" class="shadow">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input CD
            </b-button>
        </div> -->
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getSpp"
            ref="browserSpp">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-spp :items="data"
                    @deleteHeader="deleteSpp"></table-spp>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableSpp from '@/components/TableSpp'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        TableSpp
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

        // ambil data cd
        getSpp (q, spinner, vm) {
            spinner(true)
            this.api.getSpp({
                ...q,
                include: 'cd.airline'
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
        deleteSpp (id) {
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deleteSpp(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `SPP #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserSpp.stayAtCurrentPage(-1)
            })
            .catch(e => {
                // stop loading
                this.setBusyState(false)
                // handle error
                this.handleError(e)
            })
        }
    },
    data () {
        return {
            
        }
    }
}
</script>