<template>
    <v-select
        label="uraian"
        :options="satuan"
        :reduce="e => e.kode"
        :filter-by="searchSatuan"
        :disabled="disabled || loading"
        v-bind="$attrs"
        v-on="$listeners">

        <!-- SLOT : OPTION -->
        <template v-slot:option="opt">
            <template v-if="opt.id">
                <!-- <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em> -->
                <strong>{{ opt.kode }}</strong> <em>({{ opt.uraian }})</em>
            </template>
            <template v-else>
                Tambahkan <strong>{{ opt.uraian }}</strong>...
            </template>
        </template>

        <!-- SLOT : SELECTED-OPTION -->
        <template v-slot:selected-option="opt">
            <template v-if="loading">
                <div>Loading...<b-spinner small variant="dark"></b-spinner></div>
            </template>
            <template v-else>
                <div>
                    <!-- <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em> -->
                    <strong>{{ opt.kode }}</strong> <em>({{ opt.uraian }})</em>
                </div>
            </template>
        </template>
    </v-select>
</template>

<script>
// use api select with special twist,
// it loads from static .json file, 
// should handle cache better

import vSelect from 'vue-select'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
const axios = require('axios').default

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    props: [ 'disabled' ],
    components: {
        vSelect
    },
    data () {
        return {
            loading: false,
            satuan: []
        }
    },
    methods: {
        searchSatuan (option, label, search) {
            return option.kode.toLowerCase().indexOf(search.toLowerCase()) >= 0
                || option.uraian.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        }
    },
    mounted () {
        // load if not loaded?
        if (!this.satuan.length) {
            this.loading = true
            // now we try to read the json
            axios.get('/static/satuan.json')
            .then(e => {
                this.loading = false
                // console.log('loaded negara!')
                // console.log(e.data)
                this.satuan = e.data.data
            })
            .catch(e => {
                this.loading = false
                this.handleError(e)
            })
        }
    }
}
</script>