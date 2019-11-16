<template>
    <b-card 
        no-body>
        <template v-slot:header>
            <template v-if="data.id">
                <strong>#{{ index }}:&nbsp;</strong> 
                <span>
                    {{ data.uraian }}, FOB({{ data.kurs.data.kode_valas }} {{ data.fob | formatCurrency }})
                </span>
            </template>
            <span class="float-right">
                <b-button size="sm" variant="dark" @click="showBody = !showBody">
                    <!-- {{ showBody ? 'hide' : 'show' }} -->
                    <font-awesome-icon :icon="showBody ? 'eye-slash' : 'eye'"></font-awesome-icon>
                </b-button>
                <template v-if="!editMode">
                    <b-button size="sm" variant="primary" :disabled="!editable" @click="showBody = editMode = true">
                        <font-awesome-icon icon="pencil-alt">
                        </font-awesome-icon>
                        Edit
                    </b-button>
                </template>
                <template v-else>
                    <b-button-group size="sm">
                        <b-button variant="danger" @click="resetDetail">
                            <font-awesome-icon icon="trash-alt">
                            </font-awesome-icon>
                            Cancel
                        </b-button>
                        <b-button variant="primary" @click="saveDetail">
                            <font-awesome-icon icon="save">
                            </font-awesome-icon>
                            Save
                        </b-button>
                    </b-button-group>
                </template>
                
            </span>
        </template>

        <b-card-body v-if="showBody">
            <!-- Uraian barang -->
            <b-row>
                <b-col md="12">
                    <b-form-group
                        label="Uraian"
                        label-for="uraian">
                        <b-form-textarea v-model="data.uraian" :disabled="!canEdit">
                        </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- Nilai Barang + Kurs + Nilai Pabean -->
            <b-row>
                <b-col md="4">
                    <b-form-group
                        label="FOB">
                        <b-form-input type="text" v-model="data.fob" :disabled="!canEdit">
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
import { mapMutations, mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    props: [ 'index', 'data', 'editable' ],
    mixins: [ axiosErrorHandler ],
    data () {
        return {
            showBody: false,
            editMode: false
        }
    },
    computed: {
        ...mapGetters(['api']),
        canEdit: function () {
            return this.editable && this.editMode
        }
    },
    methods: {
        ...mapMutations(['setBusyState']),
        saveDetail () {
            this.setBusyState(true)
            setTimeout(() => {
                this.setBusyState(false)
                this.showBody = this.editMode = false

                this.showToast('Detail saved!', `Detail cd tersimpan`, 'success')

                // emit data to reload shit
                this.$emit('detailChange', this.data.id)

            }, 3000)
        },
        resetDetail () {
            this.showBody = this.editMode = false
            this.$emit('detailChange', null)
        }
    }
}
</script>