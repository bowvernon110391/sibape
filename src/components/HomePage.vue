<template>
    <div>
        <!-- <b-form-group
            label="Tes select-penumpang-2"
            label-for="sel-penumpang-2">
            <select-penumpang-2
                id="sel-penumpang-2"
                v-model="penumpang"
                :initial-options="dataPenumpang">
            </select-penumpang-2>
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

        <p>
            <select-hs v-model="kodeHS" :initial-options="dataHs"></select-hs>
        </p> -->
        <!-- <paginated-browser
            :data-callback="browseCd">
            <template v-slot:default="data">
                <pre>{{ JSON.stringify(data, null, 2) }}</pre>
            </template>
        </paginated-browser>

        <pre class="bg-light dark p-3 m-2">{{ jsonData }}</pre> -->
        <select-pelabuhan></select-pelabuhan>
        <hr>
        <select-kategori v-model="kategori"></select-kategori>


        <pre class="bg-light dark p-3 m-2">{{ jsonData }}</pre>
    </div>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import vSelect from 'vue-select'
import { debounce } from 'debounce'
import { mapGetters } from 'vuex'
import SelectNegara from '@/components/SelectNegara'
import ApiSelect from '@/components/ApiSelect'
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import SelectHs from '@/components/SelectHs'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import SelectPelabuhan from '@/components/SelectPelabuhan'
import SelectKategori from '@/components/SelectKategori'

export default {
    components: {
        SelectPelabuhan,
        SelectKategori
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
            penumpang:2,
            negara:null,
            busy: false,
            dataHs: [
                {
                "id": 1324,
                "usable": true,
                "takik": 2,
                "raw_code": "1006.30.30",
                "kode": "10063030",
                "uraian": "- - Beras ketan",
                "jenis_tarif": "SPESIFIK",
                "bm_tarif": 450,
                "ppn_tarif": 0,
                "ppnbm_tarif": 0,
                "ppn_text": "-",
                "ppnbm_text": "-",
                "satuan_spesifik": "/kg"
                }
            ],
            dataPenumpang: {
                "id": 2,
                "nama": "Eve Streich VI",
                "tgl_lahir": "1978-09-03",
                "no_paspor": "1-877-353-9262",
                "kebangsaan": "NZ",
                "pekerjaan": "Radiologic Technologist and Technician",
                "created_at": "2019-11-04 16:21:47",
                "updated_at": "2019-11-05 10:19:58",
                "links": [
                    {
                        "rel": "self",
                        "uri": "/penumpang/2"
                    }
                ],
                "negara": {
                    "data": {
                        "id": 554,
                        "kode": "NZ",
                        "uraian": "New Zealand"
                    }
                }
            }
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
        browseCd (q, spinner, vm) {
            console.log('search parameter')
            console.log(q)

            spinner(true)
            this.api.getCd({
                ...q,
                include: 'pelabuhan_asal,pelabuhan_tujuan'
            })
                .then(e => {
                    console.log("Got cd data:")
                    console.log(e.data.data)
                    spinner(false)
                    vm.setData(e.data.data)
                    vm.setTotal(e.data.meta.pagination.total)
                })
                .catch(e => {
                    spinner(false)
                    this.handleError(e)
                })
        },
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