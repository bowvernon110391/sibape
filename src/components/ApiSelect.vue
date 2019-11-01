<template>
    <v-select
        ref="sel"
        v-bind="$attrs"
        v-on="$listeners"
        :options="options"
        :filterable="false"
        :loading="loading"
        @search="debouncedSearch">
        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"></slot>
        </template>
    </v-select>
</template>

<script>
import vSelect from 'vue-select'
import { debounce } from 'debounce'

export default {
    components: {
        vSelect
    },
    inheritAttrs: false,
    props: {
        searchDelay: {
            type: Number,
            default: 500
        },
        searchCallback: {
            type: Function,
            default: null
        }
    },
    data () {
        return {
            debouncedSearch: debounce(this.doSearch, this.searchDelay),
            options: [],
            loading: false
        }
    },
    computed: {
        // tell if the value and option is synched
        synchronized () {
            const reduce = this.$refs.sel.reduce
            const val = this.$refs.sel.value
            return this.options.filter(e => reduce(e) == val ).length > 0
        }
    },
    methods: {
        syncValueOptions () {},
        doSearch (search, loading) {
            console.log("searching: " + search)

            // only call search if it's empty and we have no options
            // or if it's something
            if (this.searchCallback) {
                console.log("calling search callback...")
                // if search is empty, do not call unless
                // options is also empty
                if (!search && !this.options.length) {
                    console.log("cause of callback: filling empty options")
                    this.searchCallback(search, this.setLoading, this)
                } else if (search) {
                    console.log("normal callback search")
                    this.searchCallback(search, this.setLoading, this)
                } else {
                    console.log("Ignoring empty search")
                }
            } else {
                console.log("No search callback!")
            }
        },
        setOptions (data) {
            this.options = data
        },
        setLoading (flag) {
            this.loading = flag
        }
    },
    mounted () {
        console.log("Mounted biatch!")
        // fill initial options with synced value
        this.$watch('$refs.sel.value', function (nv, ov) {
            console.log(`changed! ${ov} -> ${nv}`)
            console.log('Synched? ' + this.synchronized)
        })
    }
}
</script>