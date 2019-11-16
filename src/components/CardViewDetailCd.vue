<template>
    <b-card 
        no-body>
        <template v-slot:header>
            <template v-if="data.id">
                <strong>#{{ index }}</strong>
            </template>
            <span class="float-right">
                <b-button size="sm" variant="primary">
                    <font-awesome-icon icon="pencil-alt">
                    </font-awesome-icon>
                    Edit
                </b-button>
            </span>
        </template>

        <b-card-body>
            <!-- Uraian barang -->
            <b-row>
                <b-col md="12">
                    <b-form-group
                        label="Uraian"
                        label-for="uraian">
                        <b-form-textarea v-model="data.uraian">
                        </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- Nilai Barang + Kurs + Nilai Pabean -->
            <b-row>
                <b-col md="4">
                    <b-form-group
                        label="FOB">
                        <b-form-input type="text" v-model="data.fob">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    Kurs Select goes here...
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Nilai Pabean">
                        <b-form-input type="text" disabled :value="data.nilai_pabean | formatCurrency | displayRupiah">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
export default {
    props: [ 'index', 'data' ]
}
</script>