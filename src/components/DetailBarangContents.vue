<template>
    <div>
        <!-- 1st ROW -->
        <b-form-row>
            <!-- Uraian -->
            <b-col md="6">
                <b-form-group label="Urian Barang">
                    <b-form-textarea :disabled="disabled" v-model="value.uraian" />
                </b-form-group>
            </b-col>
            <!-- Select HS -->
            <b-col md="6">
                <b-form-group label="HS Code">
                    <select-hs
                    :disabled="disabled"
                    v-model="value.hs_id"
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
                    <b-form-input :disabled="disabled" v-model="value.fob" size="sm"/>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Insurance">
                    <b-form-input :disabled="disabled" v-model="value.insurance" size="sm"/>
                </b-form-group>
            </b-col>
            <b-col md="2">
                <b-form-group label="Freight">
                    <b-form-input :disabled="disabled" v-model="value.freight" size="sm"/>
                </b-form-group>
            </b-col>

            <!-- KURS -->
            <b-col md="4">
                <b-form-group label="Kurs">
                    <select-kurs
                    :disabled="disabled"
                    v-model="value.kurs_id"
                    :id="value.id"
                    ref="kurs"
                    :initial-options="initialKurs"
                    />
                </b-form-group>
            </b-col>

            <!-- PEMBEBASAN -->
            <b-col md="2">
                <b-form-group label="Pembebasan (USD)">
                    <b-form-input disabled v-model="value.pembebasan" size="sm" />
                </b-form-group>
            </b-col>
        </b-form-row>

        <!-- 3rd ROW -->
        <b-form-row>
            <!-- Nilai Pabean -->
            <b-col md="4">
                <b-form-group label="Nilai Pabean">
                    <b-alert variant="info" show class="p-1">
                        {{ value.nilai_pabean| formatCurrency | displayRupiah }}
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
                    <b-form-input :disabled="disabled" v-model="value.jumlah_kemasan" size="sm"/>
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
            <b-col md="1">
                <b-form-group label="Jumlah">
                    <b-form-input :disabled="disabled" v-model="value.jumlah_satuan" size="sm"/>
                </b-form-group>
            </b-col>

            <b-col md="3">
                <b-form-group label="Jenis Satuan">
                    <select-satuan
                    :disabled="disabled"
                    v-model="value.jenis_satuan"
                    :initial-options="initialSatuan"
                    />
                </b-form-group>
            </b-col>
            </template>

            <!-- Brutto -->
            <b-col md="2">
                <b-form-group label="Bruto (Kg)">
                    <b-form-input :disabled="disabled" v-model="value.brutto" size="sm" />
                </b-form-group>
            </b-col>
            <!-- Netto -->
            <b-col md="2" v-if="!hideNetto">
                <b-form-group label="Netto (Kg)">
                    <b-form-input :disabled="disabled" v-model="value.netto" size="sm" />
                </b-form-group>
            </b-col>

            <!-- Override Tariff -->
            <b-col md="12">
                <b-form-group
                label="Override tarif"
                description="untuk penetapan tarif manual">
                    <b-button variant="warning" class="shadow" size="sm" v-b-toggle.collapse-table-tarif>
                        <font-awesome-icon :icon="disabled ? 'eye' : 'pencil-alt'"/>
                        Override <b-badge>{{ value.tarif.data.length }} tariffs</b-badge>
                    </b-button>
                </b-form-group>

                <b-collapse id="collapse-table-tarif">
                    <b-card>
                        <table-tarif
                            v-model="value.tarif.data"
                            :disabled="disabled"
                            @create="addNewTarif"
                            @delete="deleteTarif"
                            />
                    </b-card>
                </b-collapse>
            </b-col>
        </b-form-row>

        <hr>
        <!-- 5th row -->
        <b-form-row>
            <b-col md="12">
                <h5>Detail Tambahan</h5>
                <div class="text-left my-2">
                    <b-button size="sm" class="shadow" variant="primary" :disabled="disabled" @click="addNewDetailSekunder">
                        <font-awesome-icon icon="plus-square"/>&nbsp;Tambah
                    </b-button>
                </div>
                <table-cd-detail-sekunder
                class="shadow"
                :disabled="disabled"
                v-model="value.detailSekunder.data"
                />
            </b-col>
        </b-form-row>

        <hr>
        <!-- 6th row -->
        <b-form-row>
            <b-col md="12">
                <h5>Fasilitas</h5>
                <table-fasilitas
                  v-model="value.fasilitas.data"
                  :disabled="disabled"
                  @create="addNewFasilitas"
                  @delete="deleteFasilitas"
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
import TableTarif from '@/components/TableTarif'
import TableFasilitas from '@/components/TableFasilitas'

import defaultDetailSekunder from '../defaults/defaultDetailSekunder'
import defaultTarif from '../defaults/defaultTarif'
import defaultFasilitas from '../defaults/defaultFasilitas'

const cloneDeep = require('clone-deep')

export default {
    components: {
        SelectHs,
        SelectKemasan,
        SelectSatuan,
        SelectKurs,
        SelectKategori,
        TableCdDetailSekunder,
        TableTarif,
        TableFasilitas
    },

    props: {
        hideSatuan: {
            type: Boolean,
            default: true
        },

        hideNetto: {
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
        },

        showFasilitas: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
        }
    },

    methods: {
        addNewDetailSekunder() {
            this.value.detailSekunder.data.push(
                cloneDeep(defaultDetailSekunder)
            )
        },

        addNewTarif() {
            this.value.tarif.data.push(
                cloneDeep(defaultTarif)
            )
        },

        deleteTarif(data) {
            // find index
            var id = this.value.tarif.data.findIndex(e => e === data)

            if (id >= 0) {
                this.value.tarif.data.splice(id, 1)
            }
        },

        addNewFasilitas() {
            this.value.fasilitas.data.push(
                cloneDeep(defaultFasilitas)
            )
        },

        deleteFasilitas(data) {
            // find index?
            var id = this.value.fasilitas.data.findIndex(e => e === data)
            if (id >= 0) {
                this.value.fasilitas.data.splice(id, 1)
            }
        }
    },

    computed: {
        searchOnEmpty() {
            return !this.value.id
        },

        initialHs() {
            return this.value.hs ? this.value.hs.data : null
        },

        initialKemasan() {
            return this.value.kemasan ? this.value.kemasan.data : null
        },

        initialSatuan() {
            return this.value.satuan ? this.value.satuan.data : null
        },

        initialKurs() {
            return this.value.kurs ? this.value.kurs.data : null
        },
    },
}
</script>
