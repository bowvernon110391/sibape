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
        <!-- seri -->
        <template #cell(seri)="row">
            {{ pagination.start + row.index }}.
        </template>

        <!-- kemasan -->
        <template #cell(kemasan)="row">
            <p class="text-center">
                {{ row.item.jumlah_kemasan }} <strong>{{ row.item.jenis_kemasan }}</strong>
            </p>
        </template>

        <!-- satuan -->
        <template #cell(satuan)="row" v-if="!hideSatuan">
            <p class="text-center">
                {{ row.item.jumlah_kemasan }} <strong>{{ row.item.jenis_kemasan }}</strong>
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

        <!-- Detail -->
        <template v-slot:cell(_detail)="row">
            <b-button variant="dark">
                <font-awesome-icon :icon="row.item._showDetails? 'minus-square' : 'plus-square'" @click="row.toggleDetails"/>
            </b-button>
        </template>

        <template v-slot:row-details="row">
            <!-- <pre>{{ JSON.stringify(row, null, 2) }}</pre> -->
            <b-card>
                <detail-barang-contents v-model="row.item"/>
            </b-card>
        </template>
    </b-table>
</template>

<script>

import DetailBarangContents from '@/components/DetailBarangContents'

export default {
    inheritAttrs: false,

    components: {
        DetailBarangContents
    },

    props: {
        hideSatuan: {
            type: Boolean,
            default: true
        },

        pagination: {
            type: Object
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        fields () {
            return [
                {
                    label: '',
                    key: '_detail'
                },
                'seri',
                'uraian',
                'kemasan',
                ...this.hideSatuan ? [] : ['satuan'],
                'fob',
                'brutto'
            ]
        }
    }
}
</script>