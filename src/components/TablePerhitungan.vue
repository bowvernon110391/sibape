<template>
    <div>
        <!-- first format when it's commercial? -->
        <b-table
            responsive="sm"
            table-class="shadow"
            head-variant="dark"
            bordered
            outlined
            striped
            small
            hover
            v-bind="$attrs"
            v-on="$listeners"
            thead-tr-class="text-center"
            sticky-header="300px"
            :items="dataBarang"
            :fields="isKomersil ? fields : fieldsCase1">
            <!-- row render -->

            <template v-slot:cell(number)="row">
                {{ row.index+1 }}
            </template>

            <!-- DESCRIPTION -->
            <template v-slot:cell(description)="row">
                <div class="newline">{{ row.item.description }}</div>
            </template>

            <!-- HS AND TARIFFS -->
            <template v-slot:cell(hs_code_and_tariffs)="row">
                <div class="newline">{{ row.value }}</div>
            </template>

            <!-- CUSTOMS VALUE -->
            <template v-slot:cell(nilai_cif_pabean)="row">
                <div class="newline text-right">{{ row.value }}</div>
            </template>

            <!-- TAX AND DUTY -->
            <template v-slot:cell(bm_pajak)="row">
                <div class="newline text-right">{{ row.value }}</div>
            </template>

            <template v-slot:custom-foot="{columns, fields, items}" v-if="!isKomersil">
                <b-tr>
                    <b-td colspan="3" class="text-center" variant="dark">
                        Total CIF of {{ items.length }} items
                    </b-td>
                    <b-td variant="dark" class="text-right">
                        {{ totalCIF | formatCurrency | displayRupiah }}
                    </b-td>
                </b-tr>
                
                <!-- Deminimis -->
                <b-tr>
                    <b-td colspan="3" class="text-center" variant="danger">
                        Deminimis value ({{ dataPenetapan.data_pembebasan.nilai_pembebasan | formatCurrency }} {{ dataPenetapan.data_pembebasan.valuta }} @ {{ dataPenetapan.data_pembebasan.ndpbm | formatCurrency }})
                    </b-td>
                    <b-td variant="danger" class="text-right">
                        ({{ dataPenetapan.data_pembebasan.nilai_pembebasan_rp | formatCurrency | displayRupiah }})
                    </b-td>
                </b-tr>

                <!-- Base Value -->
                <b-tr>
                    <b-td colspan="3" class="text-center" variant="primary">
                        <strong>Base Value for Tax and Duty Calculation</strong>
                    </b-td>
                    <b-td variant="primary" class="text-right">
                        <strong>{{ dataPenetapan.data_pembebasan.nilai_dasar_perhitungan | formatCurrency | displayRupiah }}</strong>
                    </b-td>
                </b-tr>
            </template>
        </b-table>
    </div>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {

        dataPenetapan: {
            type: Object,
            required: true
        }
    },

    data () {
        return {
            fields: [
                {
                    label: 'No.',
                    key: 'number'
                },
                {
                    label: 'Description',
                    key: 'description'
                },
                {
                    label: 'HS Code and Tariffs',
                    key: 'hs_code_and_tariffs'
                },
                {
                    label: 'Quantity',
                    key: 'jumlah_satuan'
                },
                {
                    label: 'Customs Value (CIF)',
                    key: 'nilai_cif_pabean'
                },
                {
                    label: 'Tax and Duty (Rp)',
                    key: 'bm_pajak'
                }
            ],

            fieldsCase1: [
                {
                    label: 'No.',
                    key: 'number'
                },
                {
                    label: 'Description',
                    key: 'description'
                },
                {
                    label: 'HS Code and Tariffs',
                    key: 'hs_code_and_tariffs'
                },
                {
                    label: 'Customs Value (CIF)',
                    key: 'nilai_cif_pabean'
                }
            ]
        }
    },

    computed: {
        dataBarang: function() {
            return this.dataPenetapan.data_perhitungan.map(this.prettyExtract)
        },

        isKomersil: function() {
            return this.dataPenetapan.komersil
        },

        totalCIF: function() {
            return this.dataPenetapan.data_perhitungan.map(e => e.nilai_pabean).reduce((acc, e) => (acc + e))
        }
    },

    methods: {
        prettyExtract(d) {
            // const d = this.data_penetapan.data_pembebasan[0]

            var description         = d.long_description
            var hs_code_and_tariffs = `${d.hs_code}\nBM: ${d.bm_tarif}%\nPPN: ${d.ppn_tarif}%\nPPh: ${d.pph_tarif}%`
            var jumlah_satuan       = `${d.jumlah_satuan} ${d.jenis_satuan}`
            
            const nilai_cif_frm     = this.$options.filters.formatCurrency(d.cif)
            const nilai_pabean_frm  = this.$options.filters.displayRupiah(this.$options.filters.formatCurrency(d.nilai_pabean))
            const ndpbm             = this.$options.filters.formatCurrency(d.ndpbm)

            var nilai_cif_pabean    = `${d.valuta} ${nilai_cif_frm}\n${nilai_pabean_frm}\n----------------\n1 ${d.valuta} = ${ndpbm} IDR`

            const bm_frm            = this.$options.filters.formatCurrency(d.bm)
            const ppn_frm           = this.$options.filters.formatCurrency(d.ppn)
            const pph_frm           = this.$options.filters.formatCurrency(d.pph)
            const total_frm         = this.$options.filters.formatCurrency(d.bm + d.ppn + d.pph + d.ppnbm)

            var bm_pajak            = `BM: ${bm_frm}\nPPN: ${ppn_frm}\nPPh: ${pph_frm}\nTotal: ${total_frm}`

            return {
                description:    description,
                hs_code_and_tariffs: hs_code_and_tariffs,
                jumlah_satuan: jumlah_satuan,
                nilai_cif_pabean: nilai_cif_pabean,
                bm_pajak: bm_pajak
            }
        }
    }
}
</script>

<style scoped>
.newline {
    white-space: pre-line;
}
</style>