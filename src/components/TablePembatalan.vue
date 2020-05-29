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
        <template v-slot:cell(showDetail)="row">
            <b-button size="sm" variant="dark" @click="row.toggleDetails">
                <font-awesome-icon :icon="row.detailsShowing ? 'minus-square' : 'plus-square'">
                </font-awesome-icon>
            </b-button>
        </template>

        <!-- Detail Row -->
        <template v-slot:row-details="row">
            <card-view-pembatalan 
                :data="row.item"
                :disabled="row.item.is_locked"></card-view-pembatalan>
            <b-card>
                <pre>{{ JSON.stringify(row.item, null, 4) }}</pre>
            </b-card>
        </template>

        <template v-slot:cell(is_locked)="data">
            <b-badge :variant="data.item.is_locked ? 'danger' : 'primary'">
                {{ data.item.is_locked ? 'Locked' : 'Open' }}
                <font-awesome-icon :icon="data.item.is_locked ? 'lock' : 'lock-open'">
                </font-awesome-icon>
            </b-badge>
        </template>

        <template v-slot:cell(action)="data">
            <!-- Edit Pembatalan -->
            <b-button variant="primary" size="sm" 
                @click="onEdit(data.item.id)">
                <font-awesome-icon icon="pencil-alt">
                </font-awesome-icon>
            </b-button>
            <!-- Delete Pembatalan -->
            <b-button variant="danger" size="sm" :disabled="data.item.is_locked"
                @click="onDelete(data.item.id, data.item.nomor_lengkap)">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>

            <!-- Lock button when the document is unlocked -->
            <b-button variant="warning" size="sm" v-if="!data.item.is_locked"
                @click="onLock(data.item.id, data.item.nomor_lengkap)">
                <font-awesome-icon icon="lock"></font-awesome-icon>
            </b-button>
        </template>
    </b-table>
</template>

<script>
import userChecker from '../mixins/userChecker'
// import CardViewCd from '@/components/CardViewCd'
import CardViewPembatalan from '@/components/CardViewPembatalan'

export default {
    inheritAttrs: false,
    mixins: [ userChecker ],
    components: {
        // CardViewCd
        CardViewPembatalan
    },
    methods: {
        async onDelete (id, nomor) {
            var msg = nomor ? nomor : 'Tanpa Nomor'
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data Pembatalan ini? (${msg})`, {
                title: `Menghapus Pembatalan #${id}`,
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
                this.$emit('deleteHeader', id)
            }
        },

        onEdit (id) {
            this.$emit('editHeader', id)
        },

        async onLock (id, nomor) {
            var msg = nomor ? nomor : 'Tanpa nomor'
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau mengunci data Pembatalan ini? (${msg})`, {
                title: `Kunci Surat Pembatalan #${id}`,
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
                this.$emit('lockHeader', id)
            }
        }
    },
    data () {
        return {
            fields: [
                { label: '', key: 'showDetail' }, 'nomor_lengkap', 'tgl_dok', 'nama_pejabat', 
                'nip_pejabat',
                { label: 'Terkunci', key: 'is_locked' },
                'action'
            ]
        }
    }
}
</script>