<template>
    <div>
        <!-- Title -->
        <slot name="title"><h5>Detil Barang</h5></slot>

        <!-- button utk tambah barang -->
        <div class="my-2">
            <b-button variant="primary" class="shadow" :disabled="disabled">
                <font-awesome-icon icon="plus-square"/>&nbsp;Tambah Barang
            </b-button>
        </div>

        <!-- Paginated browser -->
        <paginated-browser
            :data-callback="loadDetailBarang"
            :search-date-range="false"
            :search-box="false"
            ref="detailBrowser">
            <template #default="{ data, pagination }">
                <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
                <table-detail-barang :items="data" :pagination="pagination" :disabled="disabled" @refresh="handleRefresh"/>
            </template>
        </paginated-browser>
    </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDetailBarang from '@/components/TableDetailBarang'

export default {
    inheritAttrs: false,

    mixins: [axiosErrorHandler],

    props: {
        uri: {
            type: String,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    components: {
        PaginatedBrowser,
        TableDetailBarang
    },

    data() {
        return {}
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        handleRefresh() {
            this.$refs.detailBrowser.stayAtCurrentPage(0)
        },

        loadDetailBarang(q, spinner, vm) {
            spinner(true)

            this.api.instance.get(this.uri, {
                params: q
            })
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        }
    }
}
</script>