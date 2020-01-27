<template>
    <div>
        <p>
            Sistem Aplikasi Barang Penumpang. v[BETA]
        </p>
        <!-- <select-bpj 
            v-model="bpjId"
            :search-on-empty="!bpjId"></select-bpj>
        <input type="text" v-model="bpjId"/> -->
        <p>
            <template v-if="dataString">
                <object 
                    :data="dataString"
                    type="application/pdf"
                    width="100%"
                    height="600px">
                    <embed
                        type="application/pdf"
                        :src="dataString"
                    >
                </object>
            </template>
            <template v-else>
                Loading PDF...
            </template>
        </p>
    </div>
</template>

<script>
import SelectBpj from '@/components/SelectBpj'
import { mapGetters } from 'vuex'

export default {
    components: {
        SelectBpj
    },

    computed: {
        ...mapGetters(['api'])
    },

    data () {
        return {
            bpjId: null,
            dataString: 'http://apishinta.test/pdf?doc=sspcp&id=2'
        }
    },

    mounted () {
        /* const vm = this
        this.api.getPdf('sspcp', 2)
        .then(e => {
            vm.dataString = 'base64,' + btoa(unescape(encodeURIComponent(e.data)))
            console.log(vm.dataString)
        })
        .catch(e => {
            alert("Failed to fetch PDF!")
        }) */
        alert(this.api.generatePdfUrl('sspcp', 2, {
            include:'lembar_perhitungan'
        }))
    }
}
</script>