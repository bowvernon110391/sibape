<template>
    <div>
        <div class="mb-2">
            <!-- must show new pembatalan modal input here -->
            <b-button variant="primary" class="shadow">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input Surat Pembatalan
            </b-button>
        </div>
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getPembatalan"
            ref="browserPembatalan">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <!-- <table-cd :items="data"
                    @deleteHeader="deletePembatalan"></table-cd> -->
                <!-- <pre>{{ JSON.stringify(data, null, 4) }}</pre> -->
                <table-pembatalan 
                    :items="data"
                    @deleteHeader="deletePembatalan"
                    @editPembatalan="editPembatalan"></table-pembatalan>
                    
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
// import TableCd from '@/components/TableCd'
import TablePembatalan from '@/components/TablePembatalan'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        // TableCd
        TablePembatalan
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

        // ambil data cd
        getPembatalan (q, spinner, vm) {
            spinner(true)
            this.api.getPembatalan({
                ...q,
                include: 'status'
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
        deletePembatalan (id) {
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deletePembatalan(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `Pembatalan #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserPembatalan.stayAtCurrentPage(-1)
            })
            .catch(e => {
                // stop loading
                this.setBusyState(false)
                // handle error
                this.handleError(e)
            })
        },

        // edit pembatalan
        editPembatalan (id) {
            alert(`Editing Pembatalan #${id}`)
        }
    },
    data () {
        return {
            
        }
    }
}
</script>