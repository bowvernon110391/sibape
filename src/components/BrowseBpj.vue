<template>
    <div>
        <div class="mb-2">
            <b-button variant="primary" to="/bpj/new" class="shadow">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input BPJ
            </b-button>
        </div>
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getBpj"
            ref="browserBpj">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-bpj :items="data"
                    @deleteHeader="deleteCd"></table-bpj>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
// import TableCd from '@/components/TableCd'
import TableBpj from '@/components/TableBpj'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        TableBpj
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

        // ambil data cd
        getBpj (q, spinner, vm) {
            spinner(true)
            this.api.getBpj({
                ...q
                // include: 'pelabuhan_asal,pelabuhan_tujuan'
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
        deleteBpj (id) {
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deleteBpj(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `BPJ #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserBpj.stayAtCurrentPage(-1)
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