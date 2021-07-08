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
                <font-awesome-icon icon="plus-square" />
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
            <!-- jenis fasilitas -->
            <template #cell(jenis)="{ item }">
                <!-- jenis fasilitasnya -->
                <b-form-row>
                  <b-col md="5">
                    <v-select
                      :disabled="disabled"
                      :options="jenisFasilitas"
                      v-model="item.jenis"
                      />
                  </b-col>
                <!-- jenis pungutannya -->
                <b-col md="7">
                  <select-jenis-pungutan
                    :disabled="disabled"
                    v-model="item.jenis_pungutan_id" />
                </b-col>
                </b-form-row>
            </template>

            <!-- tarif keringanan (kalau ada) -->
            <template #cell(tarif_keringanan)="{ item }">
                <b-input-group>
                  <b-form-input
                    v-model="item.tarif_keringanan"
                    :disabled="disabled || item.jenis != 'KERINGANAN'"
                  />
                  <template #append>
                    <b-input-group-text>%</b-input-group-text>
                  </template>
                </b-input-group>
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
            <template v-slot:empty>
                <p class="text-center">Tidak ada fasilitas untuk barang ini</p>
            </template>
        </b-table>
    </div>
</template>

<script>
import SelectJenisPungutan from '@/components/SelectJenisPungutan'
import vSelect from 'vue-select'

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
        },
    },

    components: {
        SelectJenisPungutan,
        vSelect
    },

    computed: {
        fields() {
            return [
                {
                    label: 'Fasilitas',
                    key: 'jenis',
                    class: 'text-center'
                },
                {
                    label: 'Tarif Keringanan',
                    key: 'tarif_keringanan',
                    class: 'text-center'
                },
                {
                    label: '',
                    key: 'act'
                }
            ]
        },

        jenisFasilitas() {
            return [
                "PEMBEBASAN", "TIDAK_DIPUNGUT", "KERINGANAN"
            ]
        }
    },

    watch: {
        value: {
            deep: true,
            handler(newVal, oldVal) {
                console.log('newVal: ', newVal)
                // gotta check if any of them is changed from old to new?
                // iterate over all newVal
                for (var i=0; i<newVal.length; i++) {
                    let fas = newVal[i]
                    if (fas.jenis != 'KERINGANAN' && fas.tarif_keringanan !== null) {
                        fas.tarif_keringanan = null
                    }
                }
            }
        }
    }
}
</script>
