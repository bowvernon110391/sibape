<template>
    <v-select
        label="uraian"
        :options="airline"
        :reduce="e => e.kode"
        :disabled="disabled || syncing"
        :filter-by="searchAirline"
        v-model="innerValue"
        >
        <template v-slot:option="opt">
            <template v-if="opt.id">
                <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em>
            </template>
            <template v-else>
                Tambahkan <strong>{{ opt.uraian }}</strong>...
            </template>
        </template>
        <!-- selected view? -->
        <template v-slot:selected-option="opt">
            <div>
                <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode }})</em>
            </div>
        </template>
    </v-select>
</template>

<script>
import vSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    components: {
        vSelect
    },
    mixins: [axiosErrorHandler],
    props: ['id','disabled','value'],
    data () {
        return {
            // negara: [],  // would synchronize from store
            innerValue: this.value,
            syncing: false
        }
    },
    computed: {
        ...mapGetters([
            'airline'
        ]),

        isFetching () {
            return this.airline.length < 1
        }
    },
    methods: {
        ...mapActions(['fetchAirline', 'extractError']),
        searchAirline (option, label, search) {
            return option.kode.toLowerCase().indexOf(search.toLowerCase()) >= 0
                || option.uraian.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        }
    },
    watch: {
        innerValue: function (newVal, oldVal) {
            if (newVal != oldVal) {
                this.$emit('input', newVal);
            }
        },
        value: function () {
            this.innerValue = this.value
        }
    },
    created () {
        console.log('root is:')
        // console.log(this.$root)
        // first, check if options is filled.
        if (this.airline.length) {
            return
        }

        // got no content. load from store
        this.syncing = true
        // mock something
        // setTimeout(() => {
        //     this.syncing = false
        // }, 5000)
        var vm = this
        this.fetchAirline()
            .then(e => {
                this.syncing = false
            })
            .catch(e => {
                vm.handleError(e)
            })
    }
}
</script>