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
        <p>
            Tanggal lahir: {{ dateOfBirth }}
        </p>
    </b-container>
</template>

<script>
import Datepicker from '@/components/Datepicker'

export default {
    components: {
        Datepicker
    },
    data () {
        return {
            showAlert: true,
            dateOfBirth: '11-03-1991'
        }
    }
}
</script>