<template>
    <div>
        <b-form-group
            label="Penumpang"
            label-for="select-penumpang"
            description="Select data penumpang">
            <api-select 
                id="select-penumpang"
                label="nama" 
                :reduce="e => e.id" 
                placeholder="Cari berdasarkan nama/no-paspor/asal/pekerjaan..."
                :search-callback="searchPenumpang"
                :sync-callback="syncPenumpang"
                v-model="penumpang"
                >
                <template v-slot:no-options>
                    Penumpang tidak ditemukan
                </template>
                <template v-slot:option="option">
                    <b-row v-if="option.id">
                        <b-col md="6">
                            <strong class="d-md-inline d-block">{{ option.nama }}</strong> <em class="d-md-inline d-block">({{ option.pekerjaan }})</em>
                        </b-col>
                        <b-col md="6">
                            <b-row>
                                <b-col md="6">
                                    {{ option.kebangsaan }}
                                </b-col>
                                <b-col md="6">
                                    {{ option.no_paspor }}
                                </b-col>
                            </b-row>
                        </b-col>
                    </b-row>
                    <b-row v-else>
                        <b-col>
                            <em>Tambah Penumpang <strong>{{ option.nama }}...</strong></em>
                        </b-col>
                    </b-row>
                </template>
            </api-select>
        </b-form-group>

        <b-form-group
            label="Test Select Penumpang"
            label-for="sel-penumpang"
            description="Select penumpang + view + input">
            <select-penumpang
                id="sel-penumpang"
                v-model="penumpang"
                placeholder="nama/asal/pekerjaan/no paspor...">
            </select-penumpang>
        </b-form-group>

        <b-form-group
            label="Test Select Negara"
            label-for="sel-negara"
            description="Select negara (auto data from storage/fetch)">
            <select-negara
                id="sel-negara"
                v-model="negara">
            </select-negara>
        </b-form-group>

        <b-row>
            <b-col md="6">
                <b-form-group
                    label="test kurs select"
                    label-for="sel-kurs">
                    <api-select
                        id="sel-kurs"
                        v-model="kursId"
                        :reduce="e => e.id"
                        :search-callback="searchKurs"
                        :sync-callback="syncKurs"
                        label="kode_valas">
                        <template v-slot:option="opt">
                            <div>
                                <h5>{{ `#${opt.id} ${opt.kode_valas} @ Rp ${opt.kurs_idr}` }}</h5>
                                <h6>{{ opt.jenis }}</h6>
                                <p>
                                    <em>{{ opt.tanggal_awal }}</em> s/d <em>{{ opt.tanggal_akhir }}</em>
                                </p>
                            </div>
                        </template>
                        <template v-slot:selected-option="opt">
                            <template v-if="opt.kurs_idr">
                                <span>#{{ opt.id }} : <strong>{{ opt.kode_valas }} @ Rp. {{ opt.kurs_idr }}</strong></span>
                            </template>
                            <template v-else>
                                synchronizing...
                            </template>
                        </template>
                    </api-select>
                </b-form-group>
            </b-col>
            <b-col md="6">
                <b-form-group
                    label="tes-api-multiselect"
                    label-for="api-multiselect">
                    <api-select
                        id="api-multiselect"
                        ref="selectKategori"
                        v-model="kategori"
                        :reduce="e => e.nama"
                        label="nama"
                        :search-callback="searchKategori"
                        :sync-callback="searchKategori"
                        taggable
                        multiple
                        :create-option="createKategori"
                        :clear-search-on-select="true">
                        <template v-slot:option="opt">
                            <template v-if="opt.id">
                                <span>{{ opt.nama }}</span>
                            </template>
                            <template v-else>
                                <span><strong>Tambahkan</strong> {{ opt.nama }}...</span>
                            </template>
                        </template>
                    </api-select>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row>
            <b-col>
            <b-form-group
                label="Pilih Kode HS"
                label-for="select-hs"
                description="(pencarian dapat menggunakan kode depan atau kata kunci)">
                <api-select
                    id="select-hs"
                    v-model="kodeHS"
                    :reduce="e => e.kode"
                    :search-callback="searchHS"
                    :sync-callback="searchHS"
                    :clear-search-on-select="true"
                    >
                    <template v-slot:option="opt">
                        <div :class="[{ 'text-muted': !opt.usable, 'text-dark': opt.usable }, 'clearfix']" :style="opt.usable ? {fontWeight: 'bold'} : {fontSize: '0.75em'}">
                            <span v-if="opt.jenis_tarif == 'SPESIFIK'">
                                <strong class="float-right text-danger">(SPESIFIK)</strong>
                            </span>
                            <b-col md="2">
                                {{ opt.raw_code }}
                            </b-col>
                            <b-col md="6">
                                {{ opt.uraian }}
                            </b-col>
                            <b-col md="4" v-if="opt.usable">
                                (bm: {{ opt.jenis_tarif=='SPESIFIK' ? 'Rp.' + opt.bm_tarif + ' ' +opt.satuan_spesifik : opt.bm_tarif }}, ppn: {{ opt.ppn_text }}, ppnbm: {{ opt.ppnbm_text }} )
                            </b-col>
                        </div>
                    </template>
                    <template v-slot:selected-option="opt">
                        <div>
                            <strong>{{ opt.raw_code }}: {{ opt.uraian }} (bm: {{ opt.jenis_tarif=='SPESIFIK' ? 'Rp.' + opt.bm_tarif + ' ' +opt.satuan_spesifik : opt.bm_tarif }}, ppn: {{ opt.ppn_text }}, ppnbm: {{ opt.ppnbm_text }} )</strong>
                        </div>
                        <!-- <div v-else>
                            synchronizing...<b-spinner small variant="danger"></b-spinner>
                        </div> -->
                    </template>                
                </api-select>
            </b-form-group>
            </b-col>
        </b-row>
    
        <p>
            selectedKurs: {{ kursId }}
        </p>

        <pre class="bg-light dark p-3 m-2">{{ jsonData }}</pre>
    </div>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import vSelect from 'vue-select'
import { debounce } from 'debounce'
import { mapGetters } from 'vuex'
import SelectPenumpang from '@/components/SelectPenumpang'
import SelectNegara from '@/components/SelectNegara'
import ApiSelect from '@/components/ApiSelect'

export default {
    components: {
        Datepicker,
        vSelect,
        SelectPenumpang,
        SelectNegara,
        ApiSelect
    },
    data () {
        return {
            showAlert: true,
            kodeHS:'10063030',
            selectVal: [],
            selectedNumber: null,
            kategori: ["Alat Telekomunikasi", "Media Informasi"],
            kursId: 2,
            dataPenumpang: [],
            penumpang:null,
            negara:null,
            busy: false
        }
    },
    computed: {
        ...mapGetters(['api']),
        jsonData () {
            let dats = {
                ...this.$data
            }
            return JSON.stringify(dats, null, 2)
        },
        selectValid: function () {
            return this.selectVal.length >= 3
        },
        dateValid: function () {
            return this.dateFromString(this.dateOfBirth) < this.dateFromString('01-01-1994')
        }
    },
    watch: {
        selectVal: {
            handler () {
                // always filter value so it stays valid
                // this.selectVal = this.selectVal.filter(e => e.id)
                console.log('Select Val Change')
                console.log(this.selectVal)
                // check last value only?
                if (this.selectVal.length) {
                    let x = this.selectVal[this.selectVal.length-1]
                    if (!x.id) {
                        this.selectVal.pop()
                    }
                }
            }
        }
    },
    methods: {
        searchHS (q, spinner, vm) {
            spinner(true)
            this.api.getHS({
                q: q,
                number: 150
            })
            .then(e => {
                spinner(false)
                vm.setOptions(e.data.data)
            })
            .catch(e => {
                spinner(false)
                alert("Failed to get hs!")
            })
        },
        createKategori (value) {
            var requestData = {
                id: 0,
                nama: value
            }

            // call api to create kategori
            var vm = this
            this.api.createKategori(requestData)
                .then(e => {
                    // clear selection
                    // vm.$refs.selectKategori.onEscape()
                    // gotta push manually?
                    vm.kategori.push(value)
                    // vm.kategori = vm.kategori.push(e.data.id)
                    // requestData.id = e.data.id
                    // when successful, reset data
                })
                .catch(e => {
                    alert(`Gagal menambah tag: ${value}`)
                })
            return {
                id: 0,
                nama: ''
            }
        },
        searchKategori (q, spinner, vm) {
            spinner(true)
            this.api.getKategori()
                .then(e => {
                    vm.setOptions(e.data.data)
                    spinner(false)
                })
                .catch(e => {
                    spinner(false)
                    alert('Failed to get kategori')
                })
        },
        searchKurs (q, spinner, vm) {
            spinner(true)
            this.api.getKurs({ q: q, number: 50 })
                .then(e => {
                    console.log('got kurs:')
                    console.log(e)
                    vm.setOptions(e.data.data)
                    spinner(false)
                })
                .catch(e => {
                    alert('failed get kurs')
                    spinner(false)
                })
        },
        syncKurs (q, spinner, vm) {
            spinner(true)
            this.api.getKursById(q)
                .then(e => {
                    vm.setOptions([e.data.data])
                    spinner(false)
                })
                .catch(e => {
                    alert('failed sync kurs')
                    spinner(false)
                })
        },
        searchNumber (q, spinner, vm) {
            spinner(true)
            setTimeout(() => {
                spinner(false)
                vm.setOptions(this.numbers)
            }, 1500)
        },
        searchNumberByValue (v, spinner, vm) {
            spinner(true)
            setTimeout(() => {
                spinner(false)
                vm.setOptions(this.numbers.filter(e => e.value == v))
            }, 2500)
        },
        toggleBusyState () {
            this.$store.commit('setBusyState', !this.$store.state.busy)
            // force to hide after 4 secs
            setTimeout(() => {
                this.$store.commit('setBusyState', false)
            }, 4000)
        },
        searchPenumpang (q, spinner, vm) {
            spinner(true)
            this.api.getPenumpang({
                q: q,
                number: 50
            })
                .then(e => {
                    spinner(false)
                    vm.setOptions(e.data.data)
                })
                .catch(e => {
                    spinner(false)
                    alert("Gagal cari penumpang")
                })
        },
        syncPenumpang (q, spinner, vm) {
            spinner(true)
            this.api.getPenumpangById(q)
                .then(e => {
                    spinner(false)
                    vm.setOptions([e.data.data])
                })
                .catch(e => {
                    spinner(false)
                    alert("Failed to sync penumpang")
                })
        },
        numberId(o) {
            return o.value
        },
        dateFromString (str) {
            var matches = str.match(/(\d{1,2})-(\d{1,2})-(\d{4})/i)
            console.log(matches)
            if (matches.length >=4) {
                let d = new Date()
                d.setFullYear(matches[3])
                d.setMonth(Number(matches[2]) - 1)
                d.setDate(matches[1])

                console.log(d)

                return d
            }
            return null
        },
        select1and3 () {
            $('#select2').val([1,3]).trigger('change')
        }
    }
}
</script>