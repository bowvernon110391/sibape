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
        :class="{ busy: loading }"
        @search:blur="fallbackSync"
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
        },
        initialOptions: [Array,Object,String,Number]
    },
    data () {
        return {
            // make a 'debounced' version of our search callback
            debouncedSearch: debounce(this.doSearch, this.searchDelay),
            // fill internal options with initial options if exists
            options: Array.isArray(this.initialOptions) ? this.initialOptions : (this.initialOptions ? [this.initialOptions] : []),
            // loading and syncing state (only LOADING is used for now)
            loading: false,
            syncing: false
        }
    },
    computed: {
        // tell if the value and option is synched
        synchronized () {
            if (this.$refs.sel) {
                const reduce = this.$refs.sel.reduce
                const val = this.$refs.sel.value
                return this.options.filter(e => reduce(e) == val ).length > 0
            }
            return false
        }
    },
    methods: {
        fallbackSync () {
            if (!this.synchronized) {
                this.syncValueOptions()
            }
        },
        syncValueOptions () {
            // if sel is not defined yet, can't sync
            if (typeof this.$refs.sel == 'undefined') {
                console.log("$refs sel is still undefined. bailing...")
                return
            }
            
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
            // if search is empty but we have value, force using value instead
            const val = this.$refs.sel.value
            if (!search && val) {
                console.log(`Empty search but..Wait! can force search using value instead using: ${val}`)
                this.syncValueOptions()
                return
            }

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
        addOption (data) {
            this.options.push(data)
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
        // this.syncValueOptions()

        // add watcher for wrapped component's value
        var vm = this
        this.$watch('$refs.sel.value', function (nv, ov) {
            console.log(`changed! ${ov} -> ${nv}`)
            console.log('Synched? ' + this.synchronized)
            // are we in multiple mode
            if (vm.$refs.sel.multiple) {
                // check for invalid values
                console.log(`Validating values...`)
                if (nv.some(e => e == null || e == 0 )) {
                    console.log('new value contains invalids: must purge')

                    vm.$refs.sel.$emit('input', nv.filter(e => e != null && e != 0))
                    // prevent sync, and set new value instead
                    return
                }
                console.log('already valid it seems')
            } 
            // if not sycnhronized, call syncvalueopts
            // if (!this.synchronized) {
            if (vm.synchronized) {
                console.log("Already in sync. SHouldn't need to do anything...")
                return
            }
            vm.syncValueOptions()
            // } else {
                // console.log("Already in sync @ " + new Date().toString())
            // }
        }, 
        {
            immediate: true
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