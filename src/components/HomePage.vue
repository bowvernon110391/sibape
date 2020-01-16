<template>
    <div>
        <p>
            Homepage sekedar untuk testing. Nantinya berisi pengumuman.
        </p>
        <select-bpj 
            v-model="bpjId"
            :search-on-empty="!bpjId"></select-bpj>
        <input type="text" v-model="bpjId"/>
    </div>
</template>

<script>
import SelectBpj from '@/components/SelectBpj'

export default {
    components: {
        SelectBpj
    },

    data () {
        return {
            bpjId: null
        }
    }
}
</script>