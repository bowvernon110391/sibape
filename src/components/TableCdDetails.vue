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
            <b-button size="sm" variant="dark" @click="viewDetail(row.item, row.index + pagination.start)">
                <font-awesome-icon icon="pencil-alt">
                </font-awesome-icon>
            </b-button>
        </template>

        <!-- seri -->
        <template v-slot:cell(seri)="row">
            {{ pagination.start + row.index }}.
        </template>

        <!-- Kemasan -->
        <template v-slot:cell(kemasan)="row">
            <p class="text-center">
            {{ row.item.kemasan.jumlah }} <strong>{{ row.item.kemasan.jenis }}</strong>
            </p>
        </template>

        <!-- Satuan -->
        <template v-slot:cell(satuan)="row">
            <p class="text-center">
            {{ row.item.satuan.jumlah }} <strong>{{ row.item.satuan.jenis }}</strong>
            </p>
        </template>

        <!-- FOB -->
        <template v-slot:cell(fob)="row">
            <p class="text-right">
                <strong>{{ row.item.kurs.data.kode_valas }}</strong> {{ row.item.fob | formatCurrency(4) }}
            </p>
        </template>

        <!-- Bruto -->
        <template v-slot:cell(brutto)="row">
            <p class="text-right">
                {{ row.item.brutto | formatCurrency }} KG
            </p>
        </template>

        <!-- Detail Row -->
        <!-- <template v-slot:row-details="row">
            <card-view-detail-cd
                :data="row.item"
                :editable="!disabled"
                :key="row.item.id"
                @detailChange="handleDetailChange"></card-view-detail-cd>
        </template> -->
    </b-table>
</template>

<script>
import CardViewDetailCd from '@/components/CardViewDetailCd'

// default json for cdDetail
import defaultCdDetail from './defaultCdDetail.json'

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
        // when detail changed
        handleDetailChange (id) {
            console.log(`Detail ${id} changed!`)
            this.$emit('detailChange', id)
        },

        // when view detail is clicked
        viewDetail (data, index) {
            this.$emit('viewDetail', {
                data: data,
                index: index
            })
        }
    },
    mounted () {
        console.log('default cd Detail:')
        console.log(defaultCdDetail)
    }
}
</script>