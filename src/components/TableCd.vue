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
            <card-view-cd :data="row.item"></card-view-cd>
        </template>

        <template v-slot:cell(is_locked)="data">
            <b-badge :variant="data.item.is_locked ? 'danger' : 'primary'">
                {{ data.item.is_locked ? 'Locked' : 'Open' }}
                <font-awesome-icon :icon="data.item.is_locked ? 'lock' : 'lock-open'">
                </font-awesome-icon>
            </b-badge>
        </template>

        <template v-slot:cell(action)="data">
            <!-- Edit Cd -->
            <b-button variant="primary" size="sm" :to="`/cd/${data.item.id}`">
                <font-awesome-icon icon="pencil-alt">
                </font-awesome-icon>
            </b-button>
            <!-- Delete Cd -->
            <b-button variant="danger" size="sm" :disabled="!canDelete(data.item.is_locked)"
                @click="onDelete(data.item.id, data.item.nomor_lengkap)">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>
        </template>
    </b-table>
</template>

<script>
import userChecker from '../mixins/userChecker'
import CardViewCd from '@/components/CardViewCd'

export default {
    inheritAttrs: false,
    mixins: [ userChecker ],
    components: {
        CardViewCd
    },
    methods: {
        async onDelete (id, nomor) {
            var msg = nomor ? nomor : 'Tanpa Nomor'
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data CD ini? (${msg})`, {
                title: `Menghapus CD #${id}`,
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
        }
    },
    data () {
        return {
            fields: [
                { label: '', key: 'showDetail' }, 'nomor_lengkap', 'tgl_dok', 'lokasi', 
                { label: 'Penumpang', key: 'penumpang.data.nama' }, 'npwp_nib', 'no_flight',
                { label: 'Terkunci', key: 'is_locked' },
                'action'
            ]
        }
    }
}
</script>