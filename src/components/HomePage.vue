<template>
    <b-container>
        <b-alert variant="success" :show="showAlert">
            Hello, world
        </b-alert>
        <b-btn size="sm" @click="showAlert = !showAlert">
            Toggle Alert
        </b-btn>
        <b-form-group 
            id="input-group-tgllahir"
            label="Tanggal Lahir"
            label-for="input-tgl-lahir"
            description="Tanggal lahir sesuai KTP">
            <datepicker
                id="input-tgl-lahir"
                v-model="dateOfBirth"></datepicker>
        </b-form-group>
        <b-form-group
            id="input-group-flags"
            label="Flag Deklarasi"
            label-for="select-flag"
            description="Flag Deklarasi CD">
            <select2 v-model="flagDeklarasi" multiple class="form-control" :state="false">
                <option value="IMPOR_UNTUK_DIPAKAI">Impor Utk Dpakai</option>
                <option value="BKC">BKC</option>
                <option value="UANG">UANG</option>
                <option value="NARKOTIKA">NARKOTIKA</option>
                <option value="KARANTINA">KARANTINA</option>
            </select2>
        </b-form-group>
        <p>
            Tanggal lahir: {{ dateOfBirth }} Flag deklarasi: {{ JSON.stringify(flagDeklarasi) }}
        </p>
    </b-container>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import Select2 from '@/components/Select2'

export default {
    components: {
        Datepicker,
        Select2
    },
    data () {
        return {
            showAlert: true,
            dateOfBirth: '11-03-1991',
            flagDeklarasi: ''
        }
    }
}
</script>