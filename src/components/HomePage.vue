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

        <select2 class="form-control" multiple>
            <option value="1">text 1</option>
            <option value="2">text 2</option>
            <option value="3">text 3</option>
        </select2>


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
            flagDeklarasi: ''
        }
    }
}
</script>