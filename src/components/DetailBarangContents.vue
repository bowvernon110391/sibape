<template>
    <div>
        <!-- 1st ROW -->
        <b-form-row>
            <!-- Uraian -->
            <b-col md="6">
                <b-form-group label="Urian Barang">
                    <b-form-textarea :disabled="disabled" v-model="value.uraian"/>
                </b-form-group>
            </b-col>
            <!-- Select HS -->
            <b-col md="6">
                <b-form-group label="HS Code">
                    <select-hs 
                    :disabled="disabled" 
                    v-model="value.hs.data.id"
                    :initial-options="initialHs"
                    
                    />
                </b-form-group>
            </b-col>
        </b-form-row>

        <!-- 2nd ROW -->
        <b-form-row>
            <!-- CIF -->
            <b-col md="2">
                <b-form-group label="FOB">
                    <b-form-input :disabled="disabled" v-model="value.fob"/>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Insurance">
                    <b-form-input :disabled="disabled" v-model="value.insurance"/>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Freight">
                    <b-form-input :disabled="disabled" v-model="value.freight"/>
                </b-form-group>
            </b-col>

            <!-- KURS -->
            <b-col md="4">
                <b-form-group label="Kurs">
                    <select-kurs 
                    :disabled="disabled" 
                    v-model="value.kurs.data.id" 
                    :id="value.id" 
                    ref="kurs"
                    :initial-options="initialKurs"
                    />
                </b-form-group>
            </b-col>
        </b-form-row>

        <!-- 3rd ROW -->
        <b-form-row>
            <!-- Nilai Pabean -->
            <b-col md="4">
                <b-form-group label="Nilai Pabean">
                    <b-alert variant="info" show class="p-1">
                        {{ 1234.5678 | formatCurrency | displayRupiah }}
                    </b-alert>
                </b-form-group>
            </b-col>

            <!-- Kategori -->
            <b-col md="6">
                <b-form-group label="Tag Kategori (Optional)">
                    <select-kategori 
                    lazy
                    :disabled="disabled" 
                    v-model="value.kategori_tags"
                    />
                </b-form-group>
            </b-col>
        </b-form-row>

        <!-- 4th row -->
        <b-form-row>
            <!-- Jumlah Jenis Kemasan -->
            <b-col md="1">
                <b-form-group label="Jumlah">
                    <b-form-input :disabled="disabled" v-model="value.jumlah_kemasan"/>
                </b-form-group>
            </b-col>

            <b-col md="3">
                <b-form-group label="Jenis Kemasan">
                    <select-kemasan 
                    :disabled="disabled" 
                    v-model="value.jenis_kemasan"
                    :initial-options="initialKemasan"
                    />
                </b-form-group>
            </b-col>

            <!-- Jumlah Jenis Satuan -->
            <template v-if="!hideSatuan">
            <b-col md="2">
                <b-form-group label="Jumlah Satuan">
                    <b-form-input :disabled="disabled" v-model="value.jumlah_satuan"/>
                </b-form-group>
            </b-col>

            <b-col md="2">
                <b-form-group label="Jenis Satuan">
                    <select-kemasan 
                    :disabled="disabled" 
                    v-model="value.jenis_satuan"
                    :initial-options="initialSatuan"
                    />
                </b-form-group>
            </b-col>
            </template>
        </b-form-row>

        <hr>
        <!-- 5th row -->
        <b-form-row>
            <b-col md="8" class="border-right">
                <h5>Detail Tambahan</h5>
                <table-cd-detail-sekunder 
                :disabled="disabled" 
                v-model="value.detailSekunder.data"
                />
            </b-col>
        </b-form-row>
    </div>
</template>

<script>
import SelectHs from '@/components/SelectHs'
import SelectKemasan from '@/components/SelectKemasan'
import SelectSatuan from '@/components/SelectSatuan'
import SelectKurs from '@/components/SelectKurs'
import SelectKategori from '@/components/SelectKategori'
import TableCdDetailSekunder from '@/components/TableCdDetailSekunder'

export default {
    components: {
        SelectHs,
        SelectKemasan,
        SelectSatuan,
        SelectKurs,
        SelectKategori,
        TableCdDetailSekunder
    },

    props: {
        hideSatuan: {
            type: Boolean,
            default: true
        },

        disabled: {
            type: Boolean,
            default: false
        },

        value: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
        }
    },

    computed: {
        searchOnEmpty() {
            return !this.value.id
        },

        initialHs() {
            return this.value.hs.data.id ? this.value.hs.data : null
        },

        initialKemasan() {
            return this.value.kemasan.data.id ? this.value.kemasan.data : null
        },

        initialSatuan() {
            return this.value.satuan ? this.value.satuan : null
        },

        initialKurs() {
            return this.value.kurs.data.id ? this.value.kurs.data : null
        },
    },
}
</script>