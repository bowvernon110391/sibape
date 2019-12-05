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
        thead-tr-class="text-center">
        <!-- special rendered column goes here -->
        <!-- action column -->
        <template v-slot:cell(_showDetails)="row">
            <div class="text-center">
                <b-button @click="row.toggleDetails" variant="dark" size="sm">
                    <font-awesome-icon
                        :icon="row.detailsShowing ? 'minus-square' : 'plus-square'">
                    </font-awesome-icon>
                </b-button>
            </div>
        </template>

        <!-- row details -->
        <template v-slot:row-details="{ item, index, fields, toggleDetails}">
            <b-card>
                <pre>{{ JSON.stringify(item, null, 2) }}</pre>
            </b-card>
        </template>
    </b-table>
</template>

<script>
export default {
    inheritAttrs: false,
    data () {
        return {
            fields: [
                {
                    label: '',
                    key: '_showDetails'
                },
                'nama',
                'tgl_lahir',
                'pekerjaan',
                { 
                    label: 'Negara',
                    key: 'negara.data.uraian'
                }
            ]
        }
    }
}
</script>