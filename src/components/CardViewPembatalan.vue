<template>
    <b-card>
        <h5>Keterangan</h5>
        
        <b-form-textarea 
            disabled
            rows="3"
            max-rows="9"
            :value="data.keterangan">
        </b-form-textarea>

        <!-- cancellable -->
        <hr>
        <h5>List dokumen yang dibatalkan</h5>
            <!-- show if empty -->
            <b-alert
                v-if="!cancellableCount" 
                variant="warning"
                show>
                No Document cancelled yet
            </b-alert>
            <!-- otherwise, show b-table -->
            <b-table
                v-else
                responsive="sm"
                table-class="shadow"
                head-variant="dark"
                bordered
                outlined
                striped
                small
                hover
                primary-key="id"
                :items="data.cancellable.data"
                :fields="cancellableFields">
                <!-- custom slot -->
                <template v-slot:cell(nomor)="row">
                    {{ (row.index+1) }}.
                </template>

                <!-- custom action slot -->
                <template v-slot:cell(action)="row">
                    <div class="text-center">
                        <b-button size="sm" variant="danger" :disabled="disabled"
                            @click="onDelete(row.item.id)">
                            <font-awesome-icon icon="trash-alt"></font-awesome-icon>
                        </b-button>
                    </div>
                </template>
            </b-table>
        <hr>
        <h5>Status</h5>
        <b-row>
            <b-col md="6">
                <table-status
                    :data="data.status.data">
                </table-status>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>

import TableStatus from '@/components/TableStatus'

export default {
    props: {
        data: {
            type: Object,
            default: null
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        TableStatus
    },
    computed: {
        cancellableCount () {
            return this.data ? this.data.cancellable.data.length : 0;
        },
    },
    data () {
        return {
            cancellableFields: [
                { label: 'No.', key: 'nomor' },
                { label: 'Jenis Dok', key: 'cancellable_type' },
                { label: 'Nomor Dok', key: 'detail.nomor_lengkap'},
                { label: 'Tanggal', key: 'detail.tgl_dok'},
                { label: 'Waktu Pembatalan', key: 'updated_at' },
                { label: 'Action', key: 'action'}
            ]
        }
    },
    methods: {
        onDelete (id) {
            alert(`Delete pembatalan/detail/${id}`)
        }
    }
}
</script>