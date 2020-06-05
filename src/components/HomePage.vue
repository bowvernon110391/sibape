<template>
    <div>
        <p>
            Sistem Aplikasi Barang Penumpang. v[BETA]
        </p>

        <template v-if="testingMode">
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

        <hr>

        <template v-for="(a, id) in attachments">

            <attachment-handler 
                :key="a.filename"
                :upload-data="a"
                endpoint="/cd/2/lampiran"
                @error="removeAttachment(id, $event)"
                >
            </attachment-handler>

        </template>

        <hr>
        <attachment-bucket
            :endpoint="'/cd/2/lampiran'"
            
            :title="'Lampiran CD #2'"
        />

        <!-- <h5>Attachments</h5>
        
        <div class="mt-3">
            <template v-if="testData">
                <attachment-handler
                    v-for="(data) in testData.data"
                    :key="data.id"
                    :initial-data="data"
                />
            </template>

            <pre>{{ testData }}</pre>

            <template v-for="(a, id) in attachments">

                <attachment-handler 
                    :key="a.filename"
                    :upload-data="a"
                    doc-type="cd"
                    doc-id="2"
                    @error="removeAttachment(id, $event)"
                    >
                </attachment-handler>

            </template>
        </div>

        <h5>Select Airline</h5>
        <div>
            <select-airline v-model="airline"></select-airline>
        </div>
        <div>
            <input v-model="airline">
        </div> -->

        <!-- <hr>
        <h5>Webcam Test</h5>
        <b-row>
            <b-col md="6">
                <web-cam
                    ref="webcam"
                    :device-id="camId"
                    width="100%"
                    :resolution="{ width: '800', height: '600' }"
                    
                    @error="camError"
                    @cameras="cameraEnum"
                    @camera-change="cameraChange"
                />
            </b-col>

            <b-col md="6">
                <figure class="figure">
                    <img :src="img" class="img-fluid"/>
                </figure>
            </b-col>
        </b-row>
        <b-row>
            <b-col md="6">
                <select v-model="camera">
                    <option>-- Select Device --</option>
                    <option 
                        v-for="device in devices"
                        :key="device.deviceId"
                        :value="device.deviceId">
                        {{ device.label }}
                    </option>
                </select>
            </b-col>

            <b-col md="12">
                <b-button variant="primary" size="sm" @click="captureImage">SNAP!</b-button>
                <b-button variant="danger" size="sm" @click="camStopped">Stop</b-button>
                <b-button variant="success" size="sm" @click="camStarted">Start</b-button>
            </b-col>
        </b-row> -->
        </template>
        
  </div>
</template>

<script>
import SelectBpj from '@/components/SelectBpj'
import ViewCd from '@/components/ViewCd'
import FileReader from '@/components/FileReader'
import AttachmentHandler from '@/components/AttachmentHandler'

import SelectAirline from '@/components/SelectAirline'

import { mapGetters } from 'vuex'

import axiosErrorHandler from '../mixins/axiosErrorHandler'

import { WebCam } from 'vue-web-cam'

import AttachmentBucket from '@/components/AttachmentBucket'

export default {
    mixins: [
        axiosErrorHandler
    ],
    components: {
        SelectBpj,
        ViewCd,
        FileReader,
        AttachmentHandler,
        SelectAirline,
        WebCam,
        AttachmentBucket
    },

    computed: {
        ...mapGetters(['api'])
    },

    data () {
        return {
            testingMode: true,
            bpjId: null,
            dataString: 'http://apishinta.test/pdf?doc=sspcp&id=2',
            file: null,
            result: null,

            airline: null,

            attachments: [
            ],

            camId: null,
            camera: null,
            devices: [],
            img: null,

            testData: null
        }
    },

    methods: {
        makeid(length) {
            var result           = ''
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            var charactersLength = characters.length
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength))
            }
            return result
        },


        onLoad(e) {
            console.log(e)

            this.attachments.push(e)
        },

        onError(e) {
            alert(e.message)
        },

        removeAttachment(id, e) {
            // find the id, and remove it
            if (id > -1 && id < this.attachments.length) {
                var removed = this.attachments.splice(id, 1)
            }
            // alert(`to remove: ${id}`)
            console.log('post removal:')
            console.log(this.attachments)

            console.log(e)

            this.handleError(e)
            
        },

        camStarted () {
            this.$refs.webcam.start()
            console.log("Camera started!")
        },

        camStopped () {
            this.$refs.webcam.stop()
            console.log("Camera stopped!")
        },

        captureImage () {
            this.img = this.$refs.webcam.capture()

            const filename = this.makeid(16) + ".jpg"
            // alert(filename)

            // make a new object to upload 
            var upload = {
                blob: this.img,
                blobsize: this.img.length,
                filesize: this.img.length,
                type: 'image/jpeg',
                filename: filename
            }

            this.attachments.push(upload)
        },

        cameraEnum (cameras) {
            this.devices = cameras
            console.log("Enumerated cameras!", cameras)
        },

        camError (e) {
            console.log("Camera error", e)
        },

        cameraChange (deviceId) {
            this.camId = deviceId
            this.camera = deviceId
            console.log("Camera changed!", deviceId)
        }
    },

    created () {
        // grab some attachment data
        const vm = this

        this.api.getCdById(2)
        .then(e => {
            vm.testData = e.data.data.lampiran
        })
        .catch(e => {
            vm.handleError(e)
        })
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

    watch: {
        camera: function (newVal) {
            this.camId = newVal
        },

        devices: function(nv) {
            const [first,...last] = this.devices
            if (first) {
                this.camera = first.deviceId
            }
        }
    }
}
</script>