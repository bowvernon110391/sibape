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
            <p class="text-center">
                {{ row.value }}
            </p>
        </template>

        <!-- quantity -->
        <template #cell(jumlah_jenis_kemasan)="row">
            <p class="text-center">
                {{ row.value }}
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

        <!-- custom footer -->
        <template #custom-foot>
            <b-tr>
                <b-td colspan="4" variant="dark" class="text-center">
                    Total Customs Value
                </b-td>
                <b-td variant="dark" class="text-right">
                    {{ totalNilaiPabean | formatCurrency | displayRupiah }}
                </b-td>
            </b-tr>
            <b-tr>
                <b-td colspan="4" variant="danger" class="text-center">
                    Deminimis Value: (USD {{ data.pembebasan | formatCurrency }} x {{ data.ndpbm | formatCurrency }})
                </b-td>
                <b-td variant="danger" class="text-right">
                    ({{ data.nilai_pembebasan_idr | formatCurrency | displayRupiah }})
                </b-td>
            </b-tr>
            <b-tr>
                <b-td colspan="4" variant="info" class="text-center">
                    Base Value for Duty and Tax Calculation
                </b-td>
                <b-td variant="info" class="text-right">
                    <strong><u>{{ data.nilai_dasar_idr | formatCurrency | displayRupiah }}</u></strong>
                </b-td>
            </b-tr>
        </template>
    </b-table>

    <!-- now we just list the steps of calculation -->
    <b-card
    header-bg-variant="light"
    footer-bg-variant="light"
    class="shadow"
    >
        <template #header>
            <h5 class="my-0"><font-awesome-icon icon="money-check-alt"/> Duty and Tax</h5>
        </template>

        <b-row>
            <b-col md="8">
                <strong>Bea Masuk (<em>Import Duty</em>)</strong>: 10% x Base Value
            </b-col>
            <b-col md="4" class="text-right">
                {{ data.pungutan.bm | formatCurrency | displayRupiah }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="7" offset-md="1" class="text-danger">
                <strong>Nilai Impor (<em>Import Value</em>)</strong>: Base Value + Import Duty
            </b-col>
            <b-col md="2" class="text-danger text-right">
                {{ data.nilai_impor | formatCurrency | displayRupiah }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="8">
                <strong>PPN Impor (<em>Value Added Tax</em>)</strong>: 10% x Import Value
            </b-col>
            <b-col md="4" class="text-right">
                {{ data.pungutan.ppn | formatCurrency | displayRupiah }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="8">
                <strong>PPh Impor (<em>Income Tax</em>)</strong>: {{ data.tarif_pph }}% x Import Value
            </b-col>
            <b-col md="4" class="text-right">
                {{ data.pungutan.pph | formatCurrency | displayRupiah }}
            </b-col>
        </b-row>
        
        <template #footer>
        <b-row>
            <b-col md="8" class="text-center">
                <strong>Total Bea Masuk dan Pajak (<em>Total Duty and Tax</em>)</strong>
            </b-col>
            <b-col md="4" class="text-right">
                <u><strong>{{ data.total | formatCurrency | displayRupiah }}</strong></u>
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
                }
            ]
        }
    }
}
</script>

<style scoped>
.newline {
    white-space: pre-line;
}
</style>