<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        @change="e => $emit('input', e)"
        size="xl"
        header-bg-variant="light"
        hide-footer
        no-close-on-backdrop
        no-close-on-esc
        >
        <!-- header -->
        <template v-slot:modal-header>
            <div>
                <h4 v-if="tempData.id">
                    Detail Seri Barang <b-badge variant="dark">#{{ index }}</b-badge>
                </h4>
                <h4 v-else>
                    Input data barang...
                </h4>
            </div>
            <div>
                <b-button-group size="sm">
                    <b-button variant="danger" @click="resetDetail">
                        <font-awesome-icon icon="trash-alt">
                        </font-awesome-icon>
                        Cancel
                    </b-button>
                    <b-button variant="primary" @click="saveDetail" :disabled="!canEdit">
                        <template v-if="!saving">
                            <font-awesome-icon icon="save">
                            </font-awesome-icon>
                            Save
                        </template>
                        <template v-else>
                            Saving...<b-spinner class="align-middle" variant="light" small></b-spinner>
                        </template>
                    </b-button>
                </b-button-group>
            </div>
        </template>

        <!-- body -->
        <template v-slot:default>
            <b-row>
                <b-col md="12">
                    <b-form-group
                        label="Uraian"
                        label-for="uraian">
                        <b-form-textarea v-model="tempData.uraian" :disabled="!canEdit">
                        </b-form-textarea>
                    </b-form-group>
                </b-col>
            </b-row>
            <!-- Nilai Barang + Kurs + Nilai Pabean -->
            <b-row>
                <b-col md="4">
                    <b-form-group
                        label="FOB">
                        <b-form-input type="text" v-model="tempData.fob" :disabled="!canEdit" class="text-right">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Kurs">
                        <select-kurs 
                            v-model="tempData.kurs.data.id"
                            :initial-options="tempData.id ? tempData.kurs.data : null"
                            :disabled="!canEdit"></select-kurs>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                    <b-form-group
                        label="Nilai Pabean">
                        <b-form-input type="text" disabled :value="tempData.nilai_pabean | formatCurrency | displayRupiah" class="text-right">
                        </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>

            <!-- Jumlah jenis kemasan, jumlah jenis satuan, bruto, neto -->
            <b-row>
                <!-- jml jenis kemasan -->
                <b-col md="4">
                    <b-form-group
                        label="Jumlah &amp; Jenis Kemasan">
                        <div>
                            <b-form-input class="d-inline w-25 mx-0" v-model="tempData.kemasan.jumlah" :disabled="!canEdit">
                            </b-form-input>
                            <select-kemasan class="d-inline-block mx-0" style="width: 72.5%" v-model="tempData.kemasan.jenis" :disabled="!canEdit"></select-kemasan>
                        </div>
                    </b-form-group>                    
                </b-col>

                <!-- jml jenis satuan -->
                <b-col md="4">
                    <b-form-group
                        label="Jumlah &amp; Jenis Satuan">
                        <div>
                            <b-form-input class="d-inline w-25 mx-0" v-model="tempData.satuan.jumlah" :disabled="!canEdit">
                            </b-form-input>
                            <select-satuan class="d-inline-block mx-0" style="width: 72.5%" v-model="tempData.satuan.jenis" :disabled="!canEdit"></select-satuan>
                        </div>
                    </b-form-group>                    
                </b-col>

                <!-- Bruto -->
                <b-col md="2">
                    <b-form-group
                        label="Bruto (kg)">
                        <b-form-input v-model="tempData.brutto" :disabled="!canEdit"></b-form-input>
                    </b-form-group>
                </b-col>

                <!-- Neto -->
                <b-col md="2">
                    <b-form-group
                        label="Netto (kg)">
                        <b-form-input v-model="tempData.netto" :disabled="!canEdit"></b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
        </template>

    </b-modal>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import SelectKurs from '@/components/SelectKurs'
import SelectKemasan from '@/components/SelectKemasan'
import SelectSatuan from '@/components/SelectSatuan'

const cloneDeep = require('clone-deep')

export default {
    inheritAttrs: false,
    props: [ 'value', 'data', 'editable', 'cdId', 'index' ],
    methods: {
        // when the modal is changing its visible state
        onChange (e) {
            this.$emit('input', e)
        },

        // when save button is clicked
        saveDetail () {
            // this.setBusyState(true)
            var vm = this
            // disable editing
            this.saving = true
            // the real deal, saving or creating?
            this.api.updateCdDetail(this.data.id, this.tempData)
            .then(e => {
                // alert?
                // vm.setBusyState(false)
                vm.showToast('Detail saved!', `Detail Cd #${vm.data.id} tersimpan`, 'success')

                // emit event
                vm.$emit('detailChange', vm.data.id)

                this.editMode = false
                this.saving = false
            })
            .catch(e => {
                this.saving = false
                // vm.setBusyState(false)
                vm.handleError(e)
            })
        },

        // when reset detail is clicked
        resetDetail () {
            this.editMode = false
            // this.$emit('detailChange', null)
            // reset data too
            this.tempData = cloneDeep(this.data)
            // close dialog
            this.$emit('input', false)
        }
    },
    data () {
        return {
            editMode: false,
            tempData: cloneDeep(this.data),
            dataIndex: null,
            saving: false
        }
    },
    computed: {
        ...mapGetters(['api']),
        canEdit: function () {
            return this.editable && !this.saving //&& this.editMode
        }
    },
    mixins: [ axiosErrorHandler ],
    components: {
        SelectKurs,
        SelectKemasan,
        SelectSatuan
    },
    watch: {
        data: {
            handler (val) {
                this.tempData = cloneDeep(val)
            }
        }
    }
}
</script>