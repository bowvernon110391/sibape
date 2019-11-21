<template>
    <div>
        <!-- title -->
        <h5>Data Detil Barang</h5>
        <!-- button tambah barang -->
        <div class="my-2">
            <b-button variant="primary" class="shadow" :disabled="disabled" @click="tambahBarang">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Tambah Barang
            </b-button>
        </div>

        <!-- browser within it the table -->
        <paginated-browser 
            :data-callback="loadCdDetails" 
            :search-date-range="false" 
            :search-box="false" 
            ref="detailBrowser">
            <!-- put TableCdDetails here -->
            <template v-slot:default="{ data, pagination }">
                <!-- <pre>{{ data.length }} is loaded</pre>
                <pre>{{ JSON.stringify(pagination, null, 2) }}</pre> -->
                <table-cd-details
                    :items="data"
                    :pagination="pagination"
                    :disabled="disabled"
                    @detailChange="detailChange"
                    @viewDetail="viewDetail"
                    @deleteDetail="deleteDetail"></table-cd-details>
            </template>
        </paginated-browser>

        <hr>
        <pre>{{ modalShown }}</pre>
        <hr>

        <!-- modal view of detail cd -->
        <modal-view-detail-cd
            :cd-id="cdId"
            :data="viewData"
            :index="index"
            :editable="!disabled"
            v-model="modalShown"
            @detailChange="$refs.detailBrowser.loadData()">
        </modal-view-detail-cd>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableCdDetails from '@/components/TableCdDetails'
import ModalViewDetailCd from '@/components/ModalViewDetailCd'
// for default data
import defaultCdDetail from './defaultCdDetail.json'
// clone deep shit
const cloneDeep = require('clone-deep')

export default {
    components: {
        PaginatedBrowser,
        TableCdDetails,
        ModalViewDetailCd
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
    data () {
        return {
            viewData: cloneDeep(defaultCdDetail),
            modalShown: false,
            index: null
        }
    },
    computed: {
        ...mapGetters(['api']),
        jsonData () {
            return JSON.stringify(this.$data, null, 2)
        }
    },
    methods: {
        // some from store...
        ...mapMutations(['setBusyState']),

        // load cd details data
        loadCdDetails (q, spinner, vm) {
            spinner(true)
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
        },

        // when child emit detailChange, what do?
        detailChange () {
            console.log("Refresh now!")
            this.$refs.detailBrowser.loadData()
        },

        // when viewing a detail
        viewDetail (e) {
            console.log("Viewing detail...")
            console.log(e.index)
            console.log(e.data)
            // just set our view data here?
            this.viewData = cloneDeep(e.data)
            this.index = e.index
            this.modalShown = true
        },

        // when deleting a detail
        deleteDetail (data) {
            // alert(`Deleting detail seri #${data.seri} id: ${data.id}`)
            this.setBusyState(true)

            // delet dis
            this.api.deleteCdDetail(data.id)
            .then(e => {
                // stop spinning
                this.setBusyState(false)
                // alert user
                this.showToast(`Deletion successful`, `Detil Barang #${data.seri} berhasil dihapus`, 'warning')
            })
            .catch(e => {
                // stop spinning
                this.setBusyState(false)
                // handle error
                this.handleError(e)
            })
        },

        tambahBarang () {
            // first, create new data
            this.viewData = cloneDeep(defaultCdDetail)
            // then, show modal
            this.modalShown = true
            // index is nullified
            this.index = null

            // log
            console.log("Adding barang...")
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