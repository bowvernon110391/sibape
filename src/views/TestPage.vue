<template>
    <div>
        <p>Just some testin done here dude.</p>
        <p><select-pemeriksa v-model="pemeriksa_id"></select-pemeriksa></p>
        <div>
        </div>
        <p>ID Pemeriksa: {{ pemeriksa_id }}</p>
        <pre>{{ pemeriksa_id }}</pre>
    </div>
</template>

<script>
import SelectPemeriksa from '@/components/SelectPemeriksa'

export default {
    components: {
        SelectPemeriksa
    },

    data () {
        return {
            pemeriksa_id: 296
        }
    }
}
</script>