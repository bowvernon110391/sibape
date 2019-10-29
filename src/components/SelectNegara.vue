<template>
    <v-select
        label="uraian"
        :input-id="id"
        :options="negara"
        :reduce="e => e.kode"
        :disabled="disabled || syncing"
        :filter-by="searchNegara"
        v-model="innerValue"
        @option:created="onCreateOption"
        taggable>
        <template v-slot:option="opt">
            <template v-if="opt.id">
                <strong>{{ opt.uraian }}</strong> <em>({{ opt.id }})</em>
            </template>
            <template v-else>
                Tambahkan <strong>{{ opt.uraian }}</strong>...
            </template>
        </template>
    </v-select>
</template>

<script>
import vSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        vSelect
    },
    props: ['id','disabled','value'],
    data () {
        return {
            // negara: [],  // would synchronize from store
            syncing: false,
            innerValue: this.value
        }
    },
    computed: {
        ...mapGetters(['negara', 'negaraDirty'])
    },
    methods: {
        ...mapActions(['fetchNegara', 'storeNegara', 'extractError']),
        searchNegara (option, label, search) {
            return option.kode.toLowerCase().indexOf(search.toLowerCase()) >= 0
                || option.uraian.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        },
        onCreateOption (opt) {
            // default state
            var dataValid=true
            // check user input
            var kode_id = prompt('Masukkan kode + id dalam format kode,id untuk negara '+opt.uraian, 'CONTOH_KODE,CONTOH_ID')
            if (!kode_id) {
                kode_id = ''
                dataValid = false
            }

            var data = kode_id.split(',').map(e => e.trim())

            // cek kembalian
            if (data.length >= 2) {
                // cek tipe data id
                var id = Number(data[1])
                if (isNaN(id)) {
                    alert("Kode bukan angka woe! --> " + data[1])
                    dataValid=false
                }
                // cek kode
                if (data[0].length != 2) {
                    alert('Kode negara harus 2 digit')
                    dataValid=false
                }
            }

            // kalo valid semua, bisa lanjut
            if (dataValid) {
                // flag syncing
                this.syncing = true
                var vm = this

                // pangil api utk store data
                this.storeNegara({
                    id: Number(data[1]),
                    kode: data[0].toUpperCase(),
                    uraian: opt.uraian
                })
                .then(e => {
                    console.log('storeNegara success! force refetch...')
                    this.$root.showToast('Data saved', 'Sukses menyimpan data negara', 'success')
                    this.$root.showToast('Re-Fetching...', 'Re-fetching data...', 'info')
                    // refetch
                    this.fetchNegara()
                        .then(e => {
                            vm.syncing = false
                            this.$root.showToast('Data ready', 'Data re-fetched', 'success')
                        })
                        .catch(e => {
                            alert("Failed on re-fetching after store!")
                            console.log(e)
                            vm.syncing = false
                            this.$root.handleError(e)
                        })
                })
                .catch(e => {
                    alert("Gagal menyimpan negara!")
                    console.log('store negara failed')
                    console.log('string rep: ' + e.toString())
                    console.log(e.response)
                    console.log('json: ' +JSON.stringify(e))
                    this.$root.handleError(e)
                    // fail to store, remove value
                    vm.innerValue=null
                    vm.syncing=false
                })
            } else {
                alert('Data input negara baru tidak valid!')
                // manually nullify
                setTimeout(() => {
                    this.innerValue=null
                }, 500)
            }
            
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
        console.log(this.$root)
        // first, check if options is filled.
        if (this.negara.length) {
            return
        }

        // got no content. load from store
        this.syncing = true
        // mock something
        // setTimeout(() => {
        //     this.syncing = false
        // }, 5000)
        this.fetchNegara()
            .then(e => {
                this.syncing = false
            })
            .catch(e => {
                alert('Error fetching data negara!')
            })
    }
}
</script>