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
        v-on="$listeners"
        >
        <!-- custom cell for action -->
        <template #cell(action)="row">
            <div class="text-center">
            <!-- Ambil/Periksa button -->
            <b-button size="sm" variant="info" :disabled="row.item.lhp ? row.item.lhp.is_locked : false" class="shadow">
                <font-awesome-icon icon="pencil-alt" />&nbsp;
                Ambil/Periksa
            </b-button>
            </div>
        </template>
    </b-table>
</template>

<script>
export default {
    inheritAttrs: false,

    data () {
        return {
            fields: [
                'nomor_lengkap',
                'tgl_dok',
                {
                    label: 'Nama Pejabat',
                    key: 'nama_issuer'
                },
                {
                    label: 'NIP Pejabat',
                    key: 'nip_issuer'
                },
                'action'
            ]
        }
    }
}
</script>