<template>
    <div>
        <!-- the main thing, our api-select -->
        <div>
            <b-input-group class="d-flex">
                <!-- api-select -->
                <api-select
                    ref="sel"
                    v-bind="$attrs"
                    v-on="$listeners"
                    label="kode_valas"
                    class="flex-grow-1"
                    :disabled="disabled"
                    :search-callback="searchKurs"
                    :sync-callback="searchKurs"
                    :reduce="e => e.id">
                    <!-- Slot for options -->
                    <template v-slot:option="opt">
                        <div>
                            <h5>{{ `#${opt.id} ${opt.kode_valas} @ Rp ${opt.kurs_idr}` }}</h5>
                            <h6>{{ opt.jenis }}</h6>
                            <p>
                                <em>{{ opt.tanggal_awal }}</em> s/d <em>{{ opt.tanggal_akhir }}</em>
                            </p>
                        </div>
                    </template>
                    <!-- Slot for selected option -->
                    <template v-slot:selected-option="opt">
                        <template v-if="opt.kurs_idr">
                            <span>#{{ opt.id }} : <strong>{{ opt.kode_valas }} @ Rp. {{ opt.kurs_idr }}</strong></span>
                        </template>
                        <template v-else>
                            <strong>Synchronizing...</strong>
                        </template>
                    </template>
                    </api-select>
                <!-- button setting as append -->
                <b-input-group-append>
                    <b-button 
                        id="btn-settings" 
                        variant="dark" 
                        @click="showSetting = !showSetting" 
                        :disabled="disabled" 
                        size="sm">
                        <font-awesome-icon icon="wrench">
                        </font-awesome-icon>
                    </b-button>
                </b-input-group-append>
            </b-input-group>
        </div>
        <!-- <template v-if="showSetting"> -->
            <!-- our datepicker -->
        <b-popover target="btn-settings" triggers="click" placement="bottomleft">
            <template v-slot:title>
                Cari kurs per tanggal
            </template>
            <!-- <b-form-group
                label="Cari kurs per tanggal"
                description="kosongkan tanggal utk gunakan kurs hari ini"> -->
                <datepicker v-model="activeDate" style="width: 150px"></datepicker>
            <!-- </b-form-group> -->
        </b-popover>
        <!-- </template> -->
    </div>
</template>

<script>
import ApiSelect from '@/components/ApiSelect'
import Datepicker from '@/components/Datepicker'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    components: {
        ApiSelect,
        Datepicker
    },
    props: {
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            activeDate: null,   // the said active date
            showSetting: false
        }
    },
    computed: {
        ...mapGetters(['api'])
    },
    methods: {
        searchKurs (q, spinner, vm) {
            // first, spin
            spinner(true)
            // set reference and param
            var me = this
            var params = {
                number: 50  // load 50 rows so it doesn't page (hopefully)
            }
            if (this.activeDate) {
                params.tanggal = this.activeDate
            }

            // call it
            this.api.getKurs(params)
            .then(e => {
                spinner(false)
                // set data?
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                me.handleError(e)
            })
        }
    },
    watch: {
        activeDate: {
            handler () {
                // when it changes, force api-select to refresh?
                this.$refs.sel.syncValueOptions()
            }
        }
    }
}
</script>