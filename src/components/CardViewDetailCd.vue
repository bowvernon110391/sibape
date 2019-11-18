<template>
    <b-card 
        no-body>
        <template v-slot:header>
            <span class="float-right">
                <!-- <b-button size="sm" variant="dark" @click="showBody = !showBody"> -->
                    <!-- {{ showBody ? 'hide' : 'show' }} -->
                    <!-- <font-awesome-icon :icon="showBody ? 'eye-slash' : 'eye'"></font-awesome-icon> -->
                <!-- </b-button> -->
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

        <b-card-body>
            <!-- Uraian barang -->
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
                            :initial-options="tempData.kurs.data"
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
            </b-row>
        </b-card-body>
    </b-card>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import SelectKurs from '@/components/SelectKurs'
import SelectKemasan from '@/components/SelectKemasan'
import SelectSatuan from '@/components/SelectSatuan'

const cloneDeep = require('clone-deep')

export default {
    props: [ 'index', 'data', 'editable' ],
    mixins: [ axiosErrorHandler ],
    components: {
        SelectKurs,
        SelectKemasan,
        SelectSatuan
    },
    data () {
        return {
            showBody: false,
            editMode: false,
            tempData: cloneDeep(this.data)
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
            var vm = this
            /* setTimeout(() => {
                this.setBusyState(false)
                this.showBody = this.editMode = false

                this.showToast('Detail saved!', `Detail cd tersimpan`, 'success')

                // emit data to reload shit
                this.$emit('detailChange', this.data.id)

            }, 3000) */

            // the real deal
            this.api.updateCdDetail(this.data.id, this.tempData)
            .then(e => {
                // alert?
                vm.setBusyState(false)
                vm.showToast('Detail saved!', `Detail Cd #${vm.data.id} tersimpan`, 'success')

                // emit event
                vm.$emit('detailChange', vm.data.id)

                this.editMode = false
            })
            .catch(e => {
                vm.setBusyState(false)
                vm.handleError(e)
            })
        },
        resetDetail () {
            this.showBody = this.editMode = false
            // this.$emit('detailChange', null)
            // reset data too
            this.tempData = cloneDeep(this.data)
        }
    }
}
</script>