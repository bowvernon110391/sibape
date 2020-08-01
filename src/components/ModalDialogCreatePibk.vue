<template>
    <b-modal
        v-on="$listeners"
        v-bind="$attrs"
        header-bg-variant="light"
        footer-bg-variant="light"
        ref="modal"
        :visible="value"
        @change="e => $emit('input', e)"
    >
        <!-- title -->
        <template #modal-title>
            Input Data Pelengkap PIBK <small class="text-muted">(sisanya ikut data dok sumber)</small>
        </template>

        <!-- body -->
        <b-form-group label="Pemberitahu (PJT)" description="kosongkan kalau tidak ada (misal barang penumpang)">
            <select-pjt
                :disabled="disabled"
                v-model="pemberitahu_id"
            />
        </b-form-group>

        <b-form-group label="Lokasi Barang" description="bisa di lokasi kerja atau gudang tertentu">
            <!-- Radio selector -->
            <b-form-radio-group v-model="lokasi_type" :disabled="disabled" class="mb-1" @change="lokasi_id = 0">
                <b-form-radio value="App\Lokasi">Lokasi Kerja</b-form-radio>
                <b-form-radio value="App\Gudang">Gudang</b-form-radio>
            </b-form-radio-group>

            <!-- real selectors -->
            <template v-if="lokasi_type == 'App\\Lokasi'">
                <select-lokasi
                    v-model="lokasi_id"
                    :disabled="disabled"
                    :reduce="e => e.id"
                />
            </template>
            <template v-else-if="lokasi_type == 'App\\Gudang'">
                <select-gudang
                    v-model="lokasi_id"
                    :disabled="disabled"
                    :reduce="e => e.id"
                />
            </template>
            <template v-else>
                <small>Pilih jenis lokasi dulu</small>
            </template>
            
        </b-form-group>

        <!-- footer -->
        <template #modal-footer>
            <b-button variant="primary" size="sm" :disabled="disabled" @click="handleOk">
                <font-awesome-icon icon="save"/>
                Simpan
            </b-button>
        </template>
    </b-modal>
</template>

<script>
import SelectPjt from '@/components/SelectPjt'

import SelectLokasi from '@/components/SelectLokasi'
import SelectGudang from '@/components/SelectGudang'

export default {
    inheritAttrs: false,

    props: {
        disabled: {
            type: Boolean,
            default: false
        },

        value: {
            type: Boolean
        }
    },

    components: {
        SelectPjt,
        SelectLokasi,
        SelectGudang
    },

    data () {
        return {
            pemberitahu_type: "App\\PJT",
            pemberitahu_id: null,
            lokasi_type: null,
            lokasi_id: null
        }
    },

    methods: {
        handleOk() {
            this.$refs['modal'].hide()
            this.$emit('submit', {
                pemberitahu_type: this.pemberitahu_type,
                pemberitahu_id: this.pemberitahu_id,
                lokasi_type: this.lokasi_type,
                lokasi_id: this.lokasi_id
            })
        }
    }
}
</script>