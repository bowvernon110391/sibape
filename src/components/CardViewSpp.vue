<template>
    <b-card>
        <!-- identitas penumpang -->
        <h5>Pemilik Barang</h5>
        <b-row>
            <b-col md="2">
                Nama Penumpang:
            </b-col>
            <b-col md="4">
                <b-button
                    v-b-popover.hover="popoverPenumpang"
                    variant="success">
                    {{ data.cd.data.penumpang.data.nama }}
                </b-button>
            </b-col>
        </b-row>

        <hr>

        <h5>Summary Data Barang</h5>
        <!-- jumlah/quantity -->
        <b-row>
            <b-col md="2">
                Jumlah:
            </b-col>
            <b-col md="4">
                <strong>{{ data.cd.data.koli }} Koli / {{ totalBrutto | formatCurrency }} Kg</strong>
            </b-col>

            <b-col md="2">
                Asal Barang:
            </b-col>
            <b-col md="4">
                <strong>{{ data.negara_asal.data.uraian }}</strong>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="2">
                No. Flight
            </b-col>
            <b-col md="10">
                <strong>{{ data.cd.data.no_flight }} ({{ data.cd.data.airline.data.uraian }})</strong>
            </b-col>
        </b-row>

        <b-row>
            <b-col md="2">
                Uraian (singkat):
            </b-col>
            <b-col md="4">
                <!-- table uraian -->
                <b-table
                    responsive="sm"
                    table-class="shadow"
                    head-variant="dark"
                    bordered
                    outlined
                    striped
                    small
                    hover
                    :fields="[ 'no', 'uraian_summary']"
                    :items="uraianSummary">
                </b-table>
            </b-col>
        </b-row>

        <hr>

        <h5>Status</h5>
        <b-row>
            <b-col md="6">
                <table-status :data="data.status.data"/>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
import TableStatus from '@/components/TableStatus'

import userPopup from '../mixins/userPopup'

export default {
    mixins: [
        userPopup
    ],
    components: {
        TableStatus
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },

    computed: {
        

        uraianSummary () {
            if (typeof this.data.cd.data.details == 'undefined') {
                return null
            }

            var no = 1
            return this.data.cd.data.details.data.map(e => {
                return {
                    no: `${no ++}.`,
                    uraian_summary: e.uraian
                }
            })
        },

        totalBrutto () {
            if (typeof this.data.cd.data.details == 'undefined') {
                return null
            }

            return this.data.cd.data.details.data.reduce((acc,e) => (acc + e.brutto), 0)
        }
    }
}
</script>