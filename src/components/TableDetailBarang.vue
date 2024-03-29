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

        <!-- uraian (utk nambah data teks?) -->
        <template #cell(uraian)="{ item }">
          <div>
            <p class="text-center">
              {{ item.uraian }}
            </p>
            <hr v-if="item.fasilitas.data.length">
            <p class="text-left" v-if="item.fasilitas.data.length">
              <em>*) Fasilitas</em><br/>
              <!-- better show all of them as badge? -->
              <template v-for="(f, idx) in item.fasilitas.data">
                <span :key="f.id" :class="{ 'ml-1' : idx }">
                  <b-badge :variant="variantForFasilitas(f.jenis)">
                    {{ f.deskripsi }}
                  </b-badge>
                </span>
              </template>
            </p>
          </div>
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
                {{ row.item.jumlah_satuan }} <strong>{{ row.item.jenis_satuan }}</strong>
            </p>
        </template>

        <!-- FOB -->
        <template v-slot:cell(fob)="row">
            <strong>{{ row.item.kurs.data.kode_valas }}</strong> {{ row.item.fob | formatCurrency(4) }}
        </template>

        <!-- PEMBEBASAN -->
        <template #cell(pembebasan)="{ value }">
            <strong>USD</strong> {{ value | formatCurrency(4) }}
        </template>

        <!-- Bruto -->
        <template v-slot:cell(brutto)="row">
            {{ row.item.brutto | formatCurrency }} KG
        </template>

        <!-- Netto -->
        <template #cell(netto)="row">
            <p class="text-center" v-if="row.item.netto">
                {{ row.item.netto | formatCurrency }} KG
            </p>
        </template>

        <!-- Action -->
        <template #cell(action)="row">
            <div class="text-center">
                <!-- EDID DIS -->
                <b-button size="sm" variant="primary" class="shadow" @click="disabled ? viewItem(row.item) : editItem(row.item)">
                    <font-awesome-icon icon="pencil-alt"/>
                </b-button>
                <!-- DELET DIS -->
                <b-button :disabled="disabled" size="sm" variant="danger" class="shadow" @click="deleteItem(row.item)">
                    <font-awesome-icon icon="trash-alt"/>
                </b-button>
            </div>
        </template>
    </b-table>
</div>
</template>

<script>
/**
 * This component just let us view contents of detail barang and pass events
 */

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

        showPembebasan: {
            type: Boolean,
            default: false
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
    }),

    computed: {
        fields () {
            return [
                'seri',
                { key: 'uraian', class:'text-center' },
                'kemasan',
                ...this.hideSatuan ? [] : ['satuan'],
                { key: 'fob', class: 'text-center' },
                ...!this.showPembebasan ? [] : [{
                    key: 'pembebasan',
                    class: 'text-center'
                }],
                { key: 'brutto', class: 'text-center' },
                ...this.hideSatuan ? [] : ['netto'],
                {
                    label: 'action',
                    key: 'action'
                }
            ]
        }
    },

    methods: {
        editItem(item) {
            this.$emit('edit', item)
        },

        viewItem(item) {
            this.$emit('view', item)
        },

        deleteItem(item) {
            this.$emit('delete', item)
        },

        variantForFasilitas(text) {
          return text == 'PEMBEBASAN' ? 'success' :
              text == 'TIDAK_DIPUNGUT' ? 'warning' : 'danger'
        }
    }
}
</script>
