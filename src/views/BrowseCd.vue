<template>
    <div>
        <div class="mb-2">
            <b-button variant="primary" to="/cd/new" class="shadow">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input CD
            </b-button>
        </div>
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getCd"
            ref="browserCd">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-cd :items="data"
                    @deleteHeader="deleteCd"
                    @cancel="cancelCd"></table-cd>
            </template>
        </paginated-browser>

        <modal-view-pembatalan
            doctype="cd"
            :docid="cancelTargetId"
            v-model="showCancelDlg"
            @refresh="refreshTable">
        </modal-view-pembatalan>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableCd from '@/components/TableCd'
import ModalViewPembatalan from '@/components/ModalViewPembatalan'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        TableCd,
        ModalViewPembatalan
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

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
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deleteCd(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `CD #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserCd.stayAtCurrentPage(-1)
            })
            .catch(e => {
                // stop loading
                this.setBusyState(false)
                // handle error
                this.handleError(e)
            })
        },

        // batalkan data cd
        cancelCd (doctype, docid) {
            // alert(`cancelling ${doctype} #${docid}`)
            this.cancelTargetId = docid
            this.showCancelDlg = true
        },

        // refresh table
        refreshTable () {
            this.$refs.browserCd.stayAtCurrentPage(-1)
        }
    },
    data () {
        return {
            showCancelDlg: false,
            cancelTargetId: null
        }
    }
}
</script>