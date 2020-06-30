<template>
<div>
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
                <detail-barang-contents disabled v-model="row.item"/>
            </b-card>
        </template>

        <!-- Action -->
        <template #cell(action)="row">
            <div class="text-center">
                <!-- EDID DIS -->
                <b-button size="sm" variant="primary" class="shadow" @click="editItem(row.item)">
                    <font-awesome-icon icon="pencil-alt"/>
                </b-button>
                <!-- DELET DIS -->
                <b-button size="sm" variant="danger" class="shadow">
                    <font-awesome-icon icon="trash-alt"/>
                </b-button>
            </div>
        </template>
    </b-table>

    <b-modal 
    id="viewDetailBarang"
    header-bg-variant="light"
    footer-bg-variant="light"
    title="Edit Detail Barang"
    v-model="showModal"
    size="xl">
        <detail-barang-contents :disabled="disabled" v-model="selectedItem" v-if="selectedItem"/>
    </b-modal>
</div>
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

    data: () => ({
        selectedItem: null,
        showModal: false,
        dirty: false,
        initialItemSerialized: ''
    }),

    computed: {
        fields () {
            return [
                'seri',
                'uraian',
                'kemasan',
                ...this.hideSatuan ? [] : ['satuan'],
                'fob',
                'brutto',
                {
                    label: 'action',
                    key: 'action'
                }
            ]
        }
    },

    methods: {
        editItem(item) {
            this.selectedItem = item
            this.showModal = true

            // store initial shit
            this.initialItemSerialized = JSON.stringify(item)
        }
    },

    watch: {
        showModal: {
            handler(nv) {
                if (!nv) {
                    // time to reload?
                    // 1st, compute serialized item
                    const serialized = JSON.stringify(this.selectedItem)
                    const changed = this.initialItemSerialized != serialized

                    console.log('old', this.initialItemSerialized)
                    console.log('new', serialized)
                    console.log('changing? ', changed)

                    if (changed && this.selectedItem.id) {
                        this.$emit('refresh')
                    }
                }
            }
        }
    }
}
</script>