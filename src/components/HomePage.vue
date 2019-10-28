<template>
    <div>
        <b-form-group
            label="Datepicker test"
            label-for="tgl-lahir"
            description="Tanggal lahir, sebisa mgkn < 01-01-1994">
            <datepicker id="tgl-lahir" v-model="dateOfBirth" :state="dateValid"></datepicker>
            <b-form-invalid-feedback :state="dateValid">
                Too young to join, sorry!
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
            label="Some selection in select2"
            label-for="select2"
            description="Select some options">
            <v-select 
                :options="numbers" 
                multiple
                taggable
                v-model="selectVal"
                placeholder="Select some numbers..."
                @option:created="createOption">
            </v-select>
            <b-form-invalid-feedback :state="selectValid">
                Gotta select two or more, pal
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group
            label="Penumpang"
            label-for="select-penumpang"
            description="Select data penumpang">
            <v-select 
                label="nama" 
                :reduce="e => e.id" 
                :options="dataPenumpang"
                placeholder="Cari berdasarkan nama/no-paspor/asal/pekerjaan..."
                :filterable="false"
                @search="onSearchPenumpang"
                v-model="penumpang"
                >
                <template v-slot:no-options>
                    Penumpang tidak ditemukan
                </template>
                <template v-slot:option="option">
                    <b-row>
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
                </template>
            </v-select>
        </b-form-group>

        <b-button variant="primary" @click="penumpang = 3">Set to 3</b-button>
        

        <pre class="bg-light dark p-3 m-2">{{ jsonData }}</pre>
    </div>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import vSelect from 'vue-select'
import { debounce } from 'debounce'

const axios = require('axios').default
const apishinta = axios.create({
    baseURL: 'http://192.168.146.23/apishinta/',
    timeout: 15000,
    headers: {
        'Authorization': 'Bearer token_admin'
    }
})

export default {
    components: {
        Datepicker,
        vSelect
    },
    data () {
        return {
            showAlert: true,
            dateOfBirth: '11-03-1991',
            flagDeklarasi: '',
            selectVal: [],
            numbers: ['Ten','Twenty','Thirty','Forty'],
            dataPenumpang: [],
            penumpang:null
        }
    },
    computed: {
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
    methods: {
        createOption (opt) {
            console.log("Created option:")
            console.log(opt)
            this.numbers.push(opt)
        },
        onSearchPenumpang (search, loading) {
            loading(true)
            if (search == '') {
                loading(false)
                return
            }
            this.searchPenumpang(search, loading, this)
        },
        searchPenumpang: debounce((search, loading, vm) => {
            apishinta.get('/penumpang', {
                params: {
                    number: 50,
                    q: search
                }
            })
            .then(e => {
                console.log('data')
                console.log(e)
                vm.dataPenumpang = e.data.data
                loading(false)
            })
            .catch(e => {
                console.log('error')
                console.log(e)

                loading(false)
            })
        }, 500),
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