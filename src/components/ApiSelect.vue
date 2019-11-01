<template>
    <v-select
        ref="sel"
        v-bind="$attrs"
        v-on="$listeners"
        :options="options"
        :filterable="false"
        :loading="loading"
        :disabled="disabled || syncing"
        :input-id="id"
        @search="debouncedSearch"
        @search:blur="syncValueOptions"
        :class="{ busy: loading }"
        >
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
        id: String,
        disabled: Boolean,
        searchDelay: {
            type: Number,
            default: 500
        },
        searchCallback: {
            type: Function,
            default: null
        },
        syncCallback: {
            type: Function,
            default: null
        },
        searchOnEmpty: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            debouncedSearch: debounce(this.doSearch, this.searchDelay),
            options: [],
            loading: false,
            syncing: false
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
        syncValueOptions () {
            const val = this.$refs.sel.value
            if (!val) {
                // value is null, but is our options also empty?
                if (!this.options.length || this.searchOnEmpty) {
                    // that means, initial load
                    this.doSearch('', this.setLoading)
                }
            } else {
                // call sync-callback here
                console.log(`Needs to sync: ${val}`)
                if (this.syncCallback) {
                    console.log("Calling sync callback...")
                    // same format as search callback, but use value instead
                    this.syncCallback(val, this.setSyncing, this)
                } else {
                    console.log("No sync callback provided!")
                }
            }
        },
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
                } else if (!search && !this.$refs.sel.value && this.searchOnEmpty) {
                    console.log("Re fetching empty options")
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
        },
        setSyncing (flag) {
            this.loading = /* this.syncing = */ flag
        }
    },
    mounted () {
        console.log("Mounted biatch!")
        // fill initial options with synced value
        this.syncValueOptions()

        // add watcher for wrapped component's value
        this.$watch('$refs.sel.value', function (nv, ov) {
            console.log(`changed! ${ov} -> ${nv}`)
            console.log('Synched? ' + this.synchronized)
            // if not sycnhronized, call syncvalueopts
            // if (!this.synchronized) {
                this.syncValueOptions()
            // } else {
                // console.log("Already in sync @ " + new Date().toString())
            // }
        })
    }
}
</script>

<style scoped>
.busy {
    position: relative;
}
.busy::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: red;
}
</style>