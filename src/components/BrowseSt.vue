<template>
    <div>
        <!-- <div class="mb-2">
            <b-button variant="primary" to="/cd/new" class="shadow">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input CD
            </b-button>
        </div> -->
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getSt"
            ref="browserSt">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <table-st :items="data"
                    @deleteHeader="deleteSpp"></table-st>
            </template>

            <!-- jenis -->
            <template #append-search-param>
                <b-col sm="12" class="d-none d-sm-block">
                <hr>
                </b-col>
                <b-col md="3" offset-md="9" class="mt-md-2">
                    <b-form-group 
                        label="Jenis ST"
                        label-cols-md>
                        <!-- <b-form-input type="text"/> -->
                        <b-form-checkbox-group 
                            v-model="jenis"
                            stacked>
                            <b-form-checkbox value="KANTOR">KANTOR</b-form-checkbox>
                            <b-form-checkbox value="TERMINAL">TERMINAL</b-form-checkbox>
                        </b-form-checkbox-group>
                    </b-form-group>
                </b-col>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableSt from '@/components/TableSt'

export default {
    mixins: [ axiosErrorHandler ],
    components: {
        PaginatedBrowser,
        TableSt
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

        // ambil data cd
        getSt (q, spinner, vm) {
            console.log('jenis st', this.jenis)
            spinner(true)
            this.api.getSt({
                ...q,
                include: 'cd.airline',
                jenis: this.jenis
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
        deleteSt (id) {
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deleteSt(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `ST #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserSt.stayAtCurrentPage(-1)
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
            jenis: [
                'KANTOR', 'TERMINAL'
            ]
        }
    }
}
</script>