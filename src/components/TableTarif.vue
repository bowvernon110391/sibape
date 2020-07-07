<template>
    <div>
        <!-- tombol tambah -->
        <div class="mb-2">
            <b-button 
                variant="primary" 
                size="sm" 
                class="shadow" 
                :disabled="disabled"
                @click="$emit('create')"
                >
                <font-awesome-icon icon="plus-square"/>
                Tambah
            </b-button>
        </div>
        <!-- the table -->
        <b-table
            bordered
            striped
            hover
            small
            head-variant="dark"
            :fields="fields"
            :items="value"
            class="shadow"
            show-empty
            responsive="sm"
        >
            
            <!-- Jenis Tarif -->
            <template #cell(jenis_tarif)="row">
                <!-- jenis pungutan -->
                <select-jenis-pungutan 
                :disabled="disabled" 
                v-model="row.item.jenis_pungutan_id"/>

                <!-- detilkan jenis (ADVALORUM,SPESIFIK apabila jenisnya BM) -->
                <template v-if="row.item.jenis_pungutan_id >= 2 && row.item.jenis_pungutan_id <= 5">
                    <!-- Jenis (utk BM?) -->
                    <b-form-select v-model="row.item.jenis" class="mt-1" :disabled="disabled">
                        <b-form-select-option :value="null">--NULL--</b-form-select-option>
                        <b-form-select-option value="ADVALORUM">ADVALORUM</b-form-select-option>
                        <b-form-select-option value="SPESIFIK">SPESIFIK</b-form-select-option>
                    </b-form-select>
                </template>
            </template>

            <!-- Tarif -->
            <template #cell(tarif)="row">
                <b-form-input size="sm" v-model="row.item.tarif" :disabled="disabled"/>
            </template>

            <!-- Detail tarif (dibayar, bla bla) -->
            <template #cell(tarif_detail)="row">
                <b-form-group label="Dibayar" label-cols="3" label-align="right">
                    <b-input-group size="sm">
                        <b-form-input v-model="row.item.bayar" :disabled="disabled"/>
                        <b-input-group-append>
                            <b-input-group-text>%</b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-form-group label="Dibebaskan" label-cols="3" label-align="right">
                    <b-input-group size="sm">
                        <b-form-input v-model="row.item.bebas" :disabled="disabled"/>
                        <b-input-group-append>
                            <b-input-group-text>%</b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-form-group label="Ditunda" label-cols="3" label-align="right">
                    <b-input-group size="sm">
                        <b-form-input v-model="row.item.tunda" :disabled="disabled"/>
                        <b-input-group-append>
                            <b-input-group-text>%</b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-form-group label="Ditanggung Pemerintah" label-cols="3" label-align="right">
                    <b-input-group size="sm">
                        <b-form-input v-model="row.item.tanggung_pemerintah" :disabled="disabled"/>
                        <b-input-group-append>
                            <b-input-group-text>%</b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </template>

            <!-- act -->
            <template #cell(act)="row">
                <div class="text-center">
                    <b-button size="sm" variant="danger" @click="$emit('delete', row.item)" :disabled="disabled">
                        <font-awesome-icon icon="trash-alt"/>
                    </b-button>
                </div>
            </template>

            <!-- empty -->
            <template v-slot:empty="row">
                <p class="text-center">Tidak ada data tarif override</p>
            </template>

        </b-table>
    </div>
</template>

<script>
import SelectJenisPungutan from '@/components/SelectJenisPungutan'

export default {
    inheritAttrs: false,

    props: {
        value: {
            type: Array,
            default: () => ([])
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },

    components: {
        SelectJenisPungutan
    },

    computed: {
        fields() {
            return [
                {
                    label: 'Jenis Tarif',
                    key: 'jenis_tarif'
                },
                'tarif',
                {
                    label: 'Detail',
                    key: 'tarif_detail'
                },
                {
                    label: '',
                    key: 'act'
                }
            ]
        }
    }
}
</script>