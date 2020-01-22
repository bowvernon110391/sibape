<template>
    <b-card>
        <!-- flight data -->
        <h5>Flight</h5>
        <b-row>
            <b-col md="2">
                <strong>Nomor:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.no_flight }}
            </b-col>
            <b-col md="2">
                <strong>Tanggal Tiba:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.tgl_kedatangan }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Asal :</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.pelabuhan_asal.data.nama }} ({{ row.item.pelabuhan_asal.data.kode }})
            </b-col>
            <b-col md="2">
                <strong>Tujuan :</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.pelabuhan_tujuan.data.nama }} ({{ row.item.pelabuhan_tujuan.data.kode }})
            </b-col>
        </b-row>
        <hr>
        <h5>Penumpang</h5>
        <b-row>
            <b-col md="2">
                <strong>Nama:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.penumpang.data.nama }}
            </b-col>
            <b-col md="2">
                <strong>Tgl Lahir:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.penumpang.data.tgl_lahir }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Pekerjaan:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.penumpang.data.pekerjaan }}
            </b-col>
        </b-row>
        <hr>
        <h5>Lain-lain</h5>
        <b-row>
            <b-col md="2">
                <strong>Jumlah Detail:</strong>
            </b-col>
            <b-col md="4">
                {{ row.item.jumlah_detail }}
            </b-col>
            <b-col md="2">
                <strong>Dokumen terkait:</strong>
            </b-col>
            <b-col md="4">
                <b-button size="sm" :variant="pillVariantDokumen[r.rel]" v-for="r in row.item.links.filter(e => e.rel == 'sspcp' || e.rel == 'is')" :key="r.uri" :to="r.uri" class="mr-2 mb-2">
                    {{ r.rel | docName }}
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2" sm="12">
                <strong>Flag:</strong>
            </b-col>
            <b-col md="4" sm="12">
                <div>
                    <!-- some pills here... -->
                    <b-badge v-for="(flag, idx) in row.item.declare_flags" :key="idx" :variant="pillVariant[flag]">
                        {{ flag }}
                    </b-badge>
                </div>
            </b-col>
            <b-col md="2" sm="12">
                <strong>Alamat/Domisili:</strong>
            </b-col>
            <b-col md="4" sm="12">
                {{ row.item.alamat }}
            </b-col>
        </b-row>
        
        <hr>
        <h5>Status</h5>
        <b-row>
            <b-col md="6">
                <table-status :data="row.item.status.data">
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
        row: {
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