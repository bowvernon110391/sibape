<template>
    <div>
        <p>
            Sistem Aplikasi Barang Penumpang. v[BETA]
        </p>

        <b-row>
            <b-col md="3">
                <b-form-group
                    label="Add attachment"
                    description="Add images or pdfs for attachments">
                    <file-reader
                        @load="onLoad"
                        @error="onError">
                    </file-reader>
                </b-form-group>
                
            </b-col>
        </b-row>

        <h5>Attachments</h5>
        
        <b-row>
            <b-col md="3" v-for="a in attachments" :key="a">
                <div class="rounded shadow">
                    <div class="bg-dark text-light rounded-top p-2">
                        {{ a.filename }}
                    </div>
                    <div class="bg-light rounded-bottom p-2">
                        Uploading...
                    </div>
                </div>
            </b-col>
        </b-row>
  </div>
        
        

        <!-- <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Drop or choose file here..."
            drop-placeholder="Drop here!"
            accept="application/pdf, image/*, application/json"
            >

        </b-form-file>

        <pre>{{ JSON.stringify(result, null, 4) }}</pre> -->

        <!-- <view-cd 
            :id="31"
            hide-banner
            hide-controls>
        </view-cd> -->
        <!-- <select-bpj 
            v-model="bpjId"
            :search-on-empty="!bpjId"></select-bpj>
        <input type="text" v-model="bpjId"/> -->
        <!-- <p>
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
        </p> -->
    </div>
</template>

<script>
import SelectBpj from '@/components/SelectBpj'
import ViewCd from '@/components/ViewCd'
import FileReader from '@/components/FileReader'

import { mapGetters } from 'vuex'

export default {
    components: {
        SelectBpj,
        ViewCd,
        FileReader
    },

    computed: {
        ...mapGetters(['api'])
    },

    data () {
        return {
            bpjId: null,
            dataString: 'http://apishinta.test/pdf?doc=sspcp&id=2',
            file: null,
            result: null,

            attachments: [
                {
                    filename: 'Some type of doc.pdf'
                },
                {
                    filename: 'Some type of doc.pdf'
                }
            ]
        }
    },

    methods: {
        onLoad(e) {
            console.log(e)

            this.attachments.push(e)
        },

        onError(e) {
            alert(e.message)
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
    },

}
</script>