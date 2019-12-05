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
                'created_at'
            ]
        }
    }
}
</script>