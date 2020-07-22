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

        <!-- no flight -->
        <template #cell(no_flight)="{ value }">
            <div v-if="value">
                <b-badge :variant="badgeVariant(value)">{{ value }}</b-badge>
            </div>
        </template>

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
            <!-- show bomb button if document is locked already, no matter who we are -->
            <b-button v-if="data.item.is_locked && canDelete(data.item.is_locked)" variant="warning" size="sm"
                @click="onNuke(data.item.id, data.item.nomor_lengkap)">
                <font-awesome-icon icon="radiation"></font-awesome-icon>
            </b-button>
            <b-button v-else variant="danger" size="sm" :disabled="!canDelete(data.item.is_locked)"
                @click="onDelete(data.item.id, data.item.nomor_lengkap)">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>
        </template>
    </b-table>
</template>

<script>
import userChecker from '../mixins/userChecker'
import niceties from '../mixins/niceties'
import CardViewCd from '@/components/CardViewCd'

export default {
    inheritAttrs: false,
    mixins: [ userChecker, niceties ],
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
                this.$emit('delete', id)
            }
        },

        onNuke (id, nomor) {
            this.$emit('cancel', 'cd', id)
        }
    },
    data () {
        return {
            fields: [
                { label: '', key: 'showDetail' }, 'nomor_lengkap', 
                { key: 'tgl_dok', class: 'text-center' }, 
                { key: 'lokasi', class: 'text-center' }, 
                { label: 'Penumpang', key: 'penumpang.data.nama' }, 'npwp_nib', 
                { key: 'no_flight', class: 'text-center' },
                { label: 'Terkunci', key: 'is_locked', class: 'text-center' },
                'action'
            ]
        }
    }
}
</script>