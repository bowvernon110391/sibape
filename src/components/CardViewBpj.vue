<template>
    <b-card>
        <!-- Identitas Terjamin -->
        <h5>Identitas Terjamin</h5>
        <b-row>
            <b-col md="2">
                <strong>Jenis Identitas:</strong>
            </b-col>
            <b-col md="4">
                {{ data.jenis_identitas }}
            </b-col>
            <b-col md="2">
                <strong>No Identitas:</strong>
            </b-col>
            <b-col md="4">
                {{ data.no_identitas }}
            </b-col>
        </b-row>

        <b-row>
            <b-col md="2">
                <strong>Nama Penumpang:</strong>
            </b-col>
            <b-col md="4">
                {{ data.penumpang.data.nama }}
            </b-col>
            <b-col md="2">
                <strong>Alamat:</strong>
            </b-col>
            <b-col md="4">
                {{ data.alamat }}
            </b-col>
        </b-row>

        <hr>

        <!-- Identitas Penjamin -->
        <h5>Penjamin</h5>
        <b-row>
            <b-col md="2">
                <strong>Nama Penjamin:</strong>
            </b-col>
            <b-col md="4">
                {{ data.penjamin }}
            </b-col>
            <b-col md="2">
                <strong>Alamat Penjamin:</strong>
            </b-col>
            <b-col md="4">
                {{ data.alamat_penjamin }}
            </b-col>
        </b-row>

        <hr>

        <!-- Detil Jaminan -->
        <h5>Detil Jaminan</h5>
        <b-row>
            <b-col md="2">
                <strong>Bentuk Jaminan:</strong>
            </b-col>
            <b-col md="4">
                {{ data.bentuk_jaminan }}
            </b-col>

            <b-col md="2">
                <strong>Aktif:</strong>
            </b-col>
            <b-col md="4">
                <strong>{{ data.active ? 'YA' : 'TIDAK' }}</strong>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Nomor Jaminan:</strong>
            </b-col>
            <b-col md="4">
                {{ data.nomor_jaminan }}
            </b-col>
            <b-col md="2">
                <strong>Tanggal Jaminan:</strong>
            </b-col>
            <b-col md="4">
                {{ data.tanggal_jaminan }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Jumlah Jaminan:</strong>
            </b-col>
            <b-col md="4">
                {{ data.jumlah | formatCurrency | displayRupiah }}
            </b-col>
            <b-col md="2">
                <strong>Tanggal Jatuh Tempo:</strong>
            </b-col>
            <b-col md="4">
                {{ data.tanggal_jatuh_tempo }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Telah Digunakan:</strong>
            </b-col>
            <b-col md="4">
                <strong>{{ data.guaranteeable ? 'SUDAH' : 'BELUM' }}</strong>
            </b-col>
            <b-col md="2">
                <strong>Status Terakhir:</strong>
            </b-col>
            <b-col md="4">
                {{ `${data.last_status.status} (${data.last_status.created_at})` }}
            </b-col>
        </b-row>

        <hr>

        <template v-if="data.guaranteeable">
            <h5>Dokumen Terjamin</h5>
            <b-row>
                <b-col md="2">
                    <strong>Dokumen:</strong>
                </b-col>
                <b-col md="4">
                    <b-button size="sm" :variant="pillVariantDokumen[data.dok_sumber.jenis_dokumen]" :to="data.dok_sumber.uri" class="mr-2 mb-2">
                        {{ data.dok_sumber.jenis_dokumen | docName }}
                    </b-button>
                </b-col>
                
            </b-row>
            <b-row>
                <b-col md="2">
                    <strong>Nomor Dokumen:</strong>
                </b-col>
                <b-col md="4">
                    {{ data.dok_sumber.nomor_lengkap }}
                </b-col>
                <b-col md="2">
                    <strong>Tanggal Dokumen:</strong>
                </b-col>
                <b-col md="4">
                    {{ data.dok_sumber.tgl_dok }}
                </b-col>
            </b-row>

            <hr>
        </template>

        <h5>Status</h5>
        <b-row>
            <b-col md="6">
                <table-status :data="data.status.data">
                </table-status>
            </b-col>
        </b-row>

    </b-card>
</template>

<script>
import TableStatus from '@/components/TableStatus'

export default {
    components: {
        TableStatus
    },
    props: {
        data: {
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        pillVariant () {
            const mapping = {
                KARANTINA: 'warning',
                NARKOTIKA: 'danger',
                UANG: 'success',
                BKC: 'dark',
                KOMERSIL: 'primary',
                IMPOR_UNTUK_DIPAKAI: 'info'
            }
            return mapping
        },
        pillVariantDokumen () {
            return {
                cd: 'primary',
                sspcp: 'success',
                is: 'danger'
            }
        }
    },
    filters: {
        docName: function (name) {
            switch (name) {
                case 'sspcp':
                    return 'SSPCP';
                case 'cd':
                    return 'Customs Declaration';
                case 'is':
                    return 'Impor Sementara';
            }
            return String(name).toUpperCase()
        }
    }
}
</script>