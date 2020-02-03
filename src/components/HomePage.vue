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
        
        <div class="mt-3">
            <template v-for="(a) in attachments">

                <attachment-handler 
                    :key="a.filename"
                    :upload-data="a"
                    doc-type="cd"
                    doc-id="2">
                </attachment-handler>

            </template>
        </div>
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
</template>

<script>
import SelectBpj from '@/components/SelectBpj'
import ViewCd from '@/components/ViewCd'
import FileReader from '@/components/FileReader'
import AttachmentHandler from '@/components/AttachmentHandler'

import { mapGetters } from 'vuex'

export default {
    components: {
        SelectBpj,
        ViewCd,
        FileReader,
        AttachmentHandler
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