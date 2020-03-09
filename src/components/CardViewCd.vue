<template>
    <b-card>
        <!-- flight data -->
        <h5>Flight</h5>
        <b-row>
            <b-col md="2">
                <strong>Nomor:</strong>
            </b-col>
            <b-col md="4">
                {{ data.no_flight }}
            </b-col>
            <b-col md="2">
                <strong>Tanggal Tiba:</strong>
            </b-col>
            <b-col md="4">
                {{ data.tgl_kedatangan }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Asal :</strong>
            </b-col>
            <b-col md="4">
                {{ data.pelabuhan_asal.data.nama }} ({{ data.pelabuhan_asal.data.kode }})
            </b-col>
            <b-col md="2">
                <strong>Tujuan :</strong>
            </b-col>
            <b-col md="4">
                {{ data.pelabuhan_tujuan.data.nama }} ({{ data.pelabuhan_tujuan.data.kode }})
            </b-col>
        </b-row>
        <hr>
        <h5>Penumpang</h5>
        <b-row>
            <b-col md="2">
                <strong>Nama:</strong>
            </b-col>
            <b-col md="4">
                <b-button
                    v-b-popover.hover="popoverPenumpang"
                    variant="success">
                    {{ dataPenumpang.nama }}
                </b-button>
            </b-col>
            <!-- <b-col md="4">
                {{ data.penumpang.data.nama }}
            </b-col>
            <b-col md="2">
                <strong>Tgl Lahir:</strong>
            </b-col>
            <b-col md="4">
                {{ data.penumpang.data.tgl_lahir }}
            </b-col>
        </b-row>
        <b-row>
            <b-col md="2">
                <strong>Pekerjaan:</strong>
            </b-col>
            <b-col md="4">
                {{ data.penumpang.data.pekerjaan }}
            </b-col> -->
        </b-row>
        <hr>
        <h5>Lain-lain</h5>
        <b-row>
            <b-col md="2">
                <strong>Jumlah Detail:</strong>
            </b-col>
            <b-col md="4">
                {{ data.jumlah_detail }}
            </b-col>
            <b-col md="2">
                <strong>Dokumen terkait:</strong>
            </b-col>
            <b-col md="4">
                <b-button size="sm" :variant="pillVariantDokumen[r.rel]" v-for="r in data.links.filter(e => e.rel == 'sspcp' || e.rel == 'bpj')" :key="r.uri" :to="r.uri" class="mr-2 mb-2">
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
                    <b-badge v-for="(flag, idx) in data.declare_flags" :key="idx" :variant="pillVariant[flag]">
                        {{ flag }}
                    </b-badge>
                </div>
            </b-col>
            <b-col md="2" sm="12">
                <strong>Alamat/Domisili:</strong>
            </b-col>
            <b-col md="4" sm="12">
                {{ data.alamat }}
            </b-col>
        </b-row>
        
        <hr>
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
            type: Object
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        dataPenumpang () {
            return this.data.penumpang.data
        },
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
                is: 'danger',
                bpj: 'warning'
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
                case 'bpj':
                    return 'Bukti Penerimaan Jaminan'
            }
            return String(name).toUpperCase()
        }
    }
}
</script>