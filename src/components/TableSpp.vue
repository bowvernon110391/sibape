<template>
    <b-table
        responsive="sm"
        table-class="shadow"
        head-variant="dark"
        bordered
        outlined
        striped
        small
        hover
        primary-key="id"
        :fields="fields"
        v-bind="$attrs"
        v-on="$listeners">
        <!-- lokasi -->
        <template #cell(lokasi)="{ value }">
            <div v-if="value">
                <b-badge :variant="badgeVariant(value)">{{ value }}</b-badge>
            </div>
        </template>

        <!-- status terakhir -->
        <template #cell(last_status)="{ value }">
            <!-- <pre>{{ value }}</pre> -->
            <div v-if="value">
                <b-badge :variant="badgeVariant(value.status)">{{ value.status }}</b-badge>
            </div>
        </template>

        <!-- Pemilik Barang -->
        <template #cell(pemilik_barang)="{ item }">
            {{ item.source.data.penumpang ? item.source.data.penumpang.data.nama : item.source.data.importir.data.nama }}
        </template>

        <template v-slot:cell(showDetail)="row">
            <div class="text-center">
                <b-button size="sm" variant="dark" @click="row.toggleDetails">
                    <font-awesome-icon :icon="row.detailsShowing ? 'minus-square' : 'plus-square'">
                    </font-awesome-icon>
                </b-button>
            </div>
        </template>

        <!-- Detail Row -->
        <template v-slot:row-details="row">
            <!-- <card-view-cd :row="row"></card-view-cd> -->
            <card-view-spp :data="row.item"/>
            <!-- <pre>{{ JSON.stringify(row.item, null, 2) }}</pre> -->
        </template>

        <template v-slot:cell(is_locked)="data">
            <b-badge :variant="data.item.is_locked ? 'danger' : 'primary'">
                {{ data.item.is_locked ? 'Locked' : 'Open' }}
                <font-awesome-icon :icon="data.item.is_locked ? 'lock' : 'lock-open'">
                </font-awesome-icon>
            </b-badge>
        </template>

        <template v-slot:cell(action)="data">
            <div class="text-center">
                <!-- Edit Spp -->
                <b-button variant="primary" size="sm" :to="`/spp/${data.item.id}`">
                    <font-awesome-icon icon="pencil-alt">
                    </font-awesome-icon>
                </b-button>
                <!-- Delete Spp -->
                <b-button variant="danger" size="sm" :disabled="!canDelete(data.item.is_locked)"
                    @click="onDelete(data.item.id, data.item.nomor_lengkap)">
                    <font-awesome-icon icon="trash-alt">
                    </font-awesome-icon>
                </b-button>
            </div>
        </template>
    </b-table>
</template>

<script>
import userChecker from '../mixins/userChecker'
import niceties from '../mixins/niceties'
import CardViewSpp from '@/components/CardViewSpp'

export default {
    inheritAttrs: false,
    mixins: [ userChecker, niceties ],
    components: {
        // CardViewCd
        CardViewSpp
    },
    methods: {
        async onDelete (id, nomor) {
            var msg = nomor ? nomor : 'Tanpa Nomor'
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data SPP ini? (${msg})`, {
                title: `Menghapus SPP #${id}`,
                size: 'md',
                buttonSize: 'md',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })

            if (result) {
                // alert("Hapuuus")
                // emit delete event
                this.$emit('delete', id)
            }
        }
    },
    data () {
        return {
            fields: [
                { label: '', key: 'showDetail' },
                'nomor_lengkap',
                { key: 'tgl_dok', class: 'text-center' },
                { key: 'lokasi', class: 'text-center' },
                { label:'Pemilik Barang', key: 'pemilik_barang' },
                { label: 'Terkunci', key: 'is_locked', class: 'text-center' },
                { label: 'Status Terakhir', key: 'last_status', class: 'text-center' },
                'action'
            ]
        }
    }
}
</script>
