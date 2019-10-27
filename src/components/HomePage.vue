<template>
    <div>

                <datepicker>
            
        </datepicker>
        <b-alert variant="success" :show="showAlert">
            Hello, world
        </b-alert>
        <b-btn size="sm" @click="showAlert = !showAlert">
            Toggle Alert
        </b-btn>

        <b-form-group
            label="Some selection in normal select"
            label-for="select1"
            description="Select some options">
            <b-select v-model="selectVal" id="select1" :state="selectValid" multiple>
                <option value="1">text 1</option>
                <option value="2">text 2</option>
                <option value="3">text 3</option>
            </b-select>
            <b-form-invalid-feedback :state="selectValid">
                Gotta select two or more, pal
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
            label="Some selection in select2"
            label-for="select2"
            description="Select some options">
            <select2 class="form-control" v-model="selectVal" id="select2" :state="selectValid" multiple>
                <option value="1">text 1</option>
                <option value="2">text 2</option>
                <option value="3">text 3</option>
            </select2>
            <b-form-invalid-feedback :state="selectValid">
                Gotta select two or more, pal
            </b-form-invalid-feedback>
        </b-form-group>
        

        <pre>{{ jsonData }}</pre>
    </div>
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
            flagDeklarasi: '',
            selectVal: []
        }
    },
    computed: {
        jsonData () {
            return JSON.stringify(this.$data, null, 2)
        },
        selectValid: function () {
            return this.selectVal.length >= 2
        }
    }
}
</script>