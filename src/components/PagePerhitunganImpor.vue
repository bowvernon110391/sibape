<template>
<div>
    <b-table
        v-on="$listeners"
        v-bind="$attrs"

        head-variant="dark"
        bordered
        striped
        hover
        class="shadow"

        sticky-header="300px"
        responsive="sm"

        :fields="fields"
        :items="data.barang"
    >
        <!-- number -->
        <template #cell(number)="row">
            {{ row.index+1 }}
        </template>

        <!-- DESCRIPTION -->
        <template #cell(uraian)="row">
            <div class="newline">{{ row.value }}</div>
        </template>

        <!-- hs_raw_code -->
        <template #cell(hs_raw_code)="row">
            <div class="text-center">
                <u>{{ row.value }}</u>
            </div>
            <div v-for="(tarif, kode) in row.item.tarif" :key="kode">
                -
                <template v-if="kode.indexOf('BM') == 0">
                    <!-- for BM Tarif -->
                    <strong>{{ kode }}</strong>: {{ tarif.tarif | formatCurrency }} <span v-if="tarif.jenis=='ADVALORUM'">%</span> ({{ tarif.jenis }})
                </template>
                <!-- other kind -->
                <template v-else>
                    <strong>{{ kode }}</strong>: {{ tarif.tarif }} %
                </template>
            </div>
        </template>

        <!-- quantity -->
        <template #cell(jumlah_jenis_kemasan)="row">
            <p class="text-center">
                {{ row.value }}
            </p>
            <p class="text-center">
                {{ row.item.jumlah_jenis_satuan }}
            </p>
        </template>

        <!-- nilai_pabean -->
        <template #cell(nilai_pabean)="row">
            <div class="text-right">
            {{ row.item.fob | formatCurrency }} + {{ row.item.insurance | formatCurrency }} + {{ row.item.freight | formatCurrency }} <br>
            = <strong>{{ row.item.valuta }}</strong> {{ row.item.cif | formatCurrency }}<br>
            = <strong>IDR</strong> {{ row.item.nilai_pabean | formatCurrency }}
            </div>
        </template>

        <!-- tax and duty -->
        <template #cell(tax_and_duty)="row">
            <div v-for="(pungutan, id) in row.item.pungutan" :key="id+'pungutan'+pungutan.jenis_pungutan_id">
                <strong>{{ pungutan.jenis_pungutan.kode }}</strong>: {{ pungutan.bayar | formatCurrency |displayRupiah }}
            </div>
        </template>
    </b-table>

    <!-- now we just list the steps of calculation -->
    <b-card
    header-bg-variant="light"
    footer-bg-variant="light"
    class="shadow"
    >
        <template #header>
            <h5 class="my-0"><font-awesome-icon icon="money-check-alt"/> Duty and Tax Summary</h5>
        </template>

        <b-row v-for="(pungutan, kode) in dataPungutanBayar" :key="kode">
            <b-col md="8">
                <strong>{{ dict[kode][0] }} (<em>{{ dict[kode][1] }}</em>)</strong>
            </b-col>
            <b-col md="4" class="text-right">
                {{ pungutan | formatCurrency | displayRupiah }}
            </b-col>
        </b-row>
        
        <template #footer>
        <b-row>
            <b-col md="8" class="text-center">
                <strong>Total Bea Masuk dan Pajak (<em>Total Duty and Tax</em>)</strong>
            </b-col>
            <b-col md="4" class="text-right">
                <u><strong>{{ totalDutyAndTax | formatCurrency | displayRupiah }}</strong></u>
            </b-col>
        </b-row>
        </template>
    </b-card>
</div>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {
        data: {
            type: Object,
            required: true
        }
    },

    computed: {
        totalNilaiPabean() {
            return this.data.barang.reduce((prev, curr) => (prev + curr.nilai_pabean), 0.0)
        },

        totalDutyAndTax() {
            var total = 0
            for (let kode in this.data.pungutan.bayar) {
                total += this.data.pungutan.bayar[kode]
            }

            return total
        },

        dataPungutanBayar() {
            // produce sorted key first
            var keys = Object.keys(this.data.pungutan.bayar).sort((a,b)=> (a > b))

            // return copy of object
            var o = {};
            for (var i=0; i<keys.length; i++) {
                o[keys[i]] = this.data.pungutan.bayar[keys[i]]
            }
            return o
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
                    key: 'uraian'
                },
                {
                    label: 'HS Code and Tariffs',
                    key: 'hs_raw_code'
                },
                {
                    label: 'Quantity',
                    key: 'jumlah_jenis_kemasan'
                },
                {
                    label: 'Customs Value (CIF)',
                    key: 'nilai_pabean'
                },
                {
                    label: 'Duty and Tax',
                    key: 'tax_and_duty'
                }
            ],

            dict: {
                'BM': [
                    'Bea Masuk',
                    'Import Duty'
                ],
                'BMI': [
                    'Bea Masuk Imbalan',
                    'Reciprocal Duty'
                ],
                'BMAD': [
                    'Bea Masuk Anti Dumping',
                    'Duty for Anti Dumping'
                ],
                'BMTP': [
                    'Bea Masuk Tindak Pengamaman',
                    'Duty for Protection'
                ],
                'PPN': [
                    'PPN Impor',
                    'Value Added Tax'
                ],
                'PPh': [
                    'PPh Impor',
                    'Income Tax'
                ],
                'PPnBM': [
                    'PPnBM Impor',
                    'Luxury Goods Tax'
                ],
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