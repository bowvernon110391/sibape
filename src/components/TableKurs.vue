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
        tbody-tr-class="text-center"
        thead-tr-class="text-center">
        <!-- Custom render for kursidr -->
        <template v-slot:cell(kurs_idr)="row">
            <div class="text-center">
                <strong>{{ row.value | formatCurrency(4) }}</strong>
            </div>
        </template>
        <!-- action button -->
        <template v-slot:cell(action)="row">
            <!-- button group? nope -->
            <b-button variant="danger" size="sm" class="shadow"
                @click="onDelete(row.item.id)">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>
        </template>
    </b-table>
</template>

<script>
export default {
    inheritAttrs: false,
    data () {
        return {
            fields: [
                'kode_valas',
                'jenis',
                'kurs_idr',
                'tanggal_awal',
                'tanggal_akhir',
                'created_at',
                {
                    label:'',
                    key:'action'
                }
            ]
        }
    },

    methods: {
        // handle delete kurs
        async onDelete (id) {
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data Kurs ini?`, {
                title: `Menghapus Kurs #${id}`,
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
                this.$emit('deleteKurs', id)
            }
        }
    }
}
</script>