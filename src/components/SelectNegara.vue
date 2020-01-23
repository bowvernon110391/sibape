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
                <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode_alpha3 }})</em>
            </template>
            <template v-else>
                Tambahkan <strong>{{ opt.uraian }}</strong>...
            </template>
        </template>
        <!-- selected view? -->
        <template v-slot:selected-option="opt">
            <div>
                <strong>{{ opt.uraian }}</strong> <em>({{ opt.kode_alpha3 }})</em>
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
            return option.kode_alpha3.toLowerCase().indexOf(search.toLowerCase()) >= 0
                || option.uraian.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        },
        onCreateOption (opt) {
            // default state
            var dataValid=true
            // check user input
            var kode_id = prompt('Masukkan kode + id dalam format kode 2 huruf, kode 3 huruf, id numerik (3 digit) untuk negara: '+opt.uraian, 'KODE_ALPHA_2,KODE_ALPHA_3,CONTOH_ID')
            if (!kode_id) {
                kode_id = ''
                dataValid = false
            }

            var data = kode_id.split(',').map(e => e.trim())

            // cek kembalian
            if (data.length >= 3) {
                // cek tipe data id
                var id = Number(data[2])
                if (isNaN(id)) {
                    alert("Kode bukan angka woe! --> " + data[1])
                    dataValid=false
                }
                // cek kode
                if (data[0].length != 2) {
                    alert('Kode negara harus 2 huruf')
                    dataValid=false
                }
                // cek kode 3 huruf
                if (data[1].length != 3) {
                    alert('Kode alpha 3 harus 3 huruf')
                }
            }

            // kalo valid semua, bisa lanjut
            if (dataValid) {
                // flag syncing
                this.syncing = true
                var vm = this

                // pangil api utk store data
                var id = Number(data[2])
                var kode = data[0].toUpperCase()
                var kode3 = data[1].toUpperCase()
                this.storeNegara({
                    id: id,
                    kode: kode,
                    kode_alpha3: kode3,
                    uraian: opt.uraian
                })
                .then(e => {
                    // raise input event?
                    this.$emit('input', kode)

                    // logging
                    console.log('storeNegara success! force refetch...')
                    this.showToast('Data saved', 'Sukses menyimpan data negara', 'success')
                    this.showToast('Re-Fetching...', 'Re-fetching data...', 'info')
                    
                    // refetch
                    this.fetchNegara()
                        .then(e => {
                            vm.syncing = false
                            this.showToast('Data ready', 'Data re-fetched', 'success')
                        })
                        .catch(e => {
                            alert("Failed on re-fetching after store!")
                            console.log(e)
                            vm.syncing = false
                            vm.handleError(e)
                        })
                })
                .catch(e => {
                    alert("Gagal menyimpan negara!")
                    console.log('store negara failed')
                    console.log('string rep: ' + e.toString())
                    console.log(e.response)
                    console.log('json: ' +JSON.stringify(e))
                    vm.handleError(e)
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
        // console.log(this.$root)
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
        var vm = this
        this.fetchNegara()
            .then(e => {
                this.syncing = false
            })
            .catch(e => {
                vm.handleError(e)
            })
    }
}
</script>