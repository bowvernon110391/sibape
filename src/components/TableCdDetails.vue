<template>
    <b-table
        responsive="sm"
        table-class="shadow"
        head-variant="dark"
        bordered
        outlined
        striped
        small
        hover
        primary-key="id"
        :fields="fields"
        v-bind="$attrs"
        v-on="$listeners">
        <template v-slot:cell(showDetail)="row">
            <b-button size="sm" variant="dark" @click="row.toggleDetails">
                <font-awesome-icon :icon="row.detailsShowing ? 'minus-square' : 'plus-square'">
                </font-awesome-icon>
            </b-button>
        </template>

        <!-- seri -->
        <template v-slot:cell(seri)="row">
            {{ pagination.start + row.index }}.
        </template>

        <!-- Kemasan -->
        <template v-slot:cell(kemasan)="row">
            {{ row.item.kemasan.jumlah }} <strong>{{ row.item.kemasan.jenis }}</strong>
        </template>

        <!-- Satuan -->
        <template v-slot:cell(satuan)="row">
            {{ row.item.satuan.jumlah }} <strong>{{ row.item.satuan.jenis }}</strong>
        </template>

        <!-- FOB -->
        <template v-slot:cell(fob)="row">
            <strong>{{ row.item.kurs.data.kode_valas }}</strong> <span class="float-right">{{ row.item.fob | formatCurrency(4) }}</span>
        </template>

        <!-- Detail Row -->
        <template v-slot:row-details="row">
            <!-- <pre>{{ JSON.stringify(row, null, 2) }}</pre> -->
            <card-view-detail-cd
                :data="row.item"
                :editable="!disabled"
                @detailChange="handleDetailChange"></card-view-detail-cd>
        </template>
    </b-table>
</template>

<script>
import CardViewDetailCd from '@/components/CardViewDetailCd'

export default {
    inheritAttrs: false,
    components: {
        CardViewDetailCd
    },
    props: {
        pagination: {
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            fields: [
                'seri',
                'uraian',
                'kemasan',
                'satuan',
                'fob',
                'brutto',
                {
                    label: '',
                    key: 'showDetail'
                }
            ]
        }
    },
    methods: {
        handleDetailChange (id) {
            console.log(`Detail ${id} changed!`)
            this.$emit('detailChange', id)
        }
    }
}
</script>