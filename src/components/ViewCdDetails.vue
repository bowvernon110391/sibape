<template>
    <div>
        <h5>Data Detil Barang</h5>
        <div class="my-2">
            <b-button variant="primary" class="shadow" :disabled="disabled">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Tambah Barang
            </b-button>
        </div>
        <paginated-browser 
            :data-callback="loadCdDetails" 
            :search-date-range="false" 
            :search-box="false" 
            ref="detailBrowser">
            <!-- put TableCdDetails here -->
            <template v-slot:default="{ data, pagination }">
                <pre>{{ data.length }} is loaded</pre>
                <pre>{{ JSON.stringify(pagination, null, 2) }}</pre>
            </template>
        </paginated-browser>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'

export default {
    components: {
        PaginatedBrowser
    },
    mixins: [ axiosErrorHandler ],
    props: {
        cdId: {
            type: [String, Number],
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters(['api'])
    },
    methods: {
        loadCdDetails (q, spinner, vm) {
            // make sure the cd id is valid
            const id = Number(this.cdId)
            if (!isNaN(Number(id)) && typeof id != 'undefined') {
                // call api, and load some shit
                var me = this
                spinner(true)

                this.api.getCdDetails(id, q)
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
        }
    },
    mounted () {
        
    },
    watch: {
        cdId: {
            handler (val) {
                // console.log("load detail of", val)
                // only load if val is valid
                // and our detailBrowser is loaded
                if (val && this.$refs.detailBrowser) {
                    this.$refs.detailBrowser.loadData()
                }
            },
            immediate: true
        }
    }
}
</script>