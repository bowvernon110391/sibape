<template>
        <div :class=" [isUploading ? 'd-block' : 'd-inline-block', 'text-dark', 'bg-light', 'rounded p-2', 'my-1', 'mx-1', 'shadow', 'border', 'border-dark']">
            <template v-if="isUploading">
                <div>
                    <div class="progress">
                        <!-- the bar inside -->
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                            role="progressbar"
                            :style="'width: ' + progress + '%'">
                            {{ uploadData.filename }} ({{ Math.round(uploadData.filesize/1024) }} K) {{ progress }} %
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="internalData">
                <a :href="internalData.url" target="__blank">{{ internalData.filename }}</a>
            </template>
        </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'


export default {
    mixins: [
        axiosErrorHandler
    ],
    components: {
    },
    props: {
        uploadData: {
            type: Object,
            default: null
        },

        id: {
            type: [String, Number],
            default: null
        },

        docType: {
            type: [String],
            default: null
        },

        docId: {
            type: [String, Number],
            default: null
        },

        value: {
            type: Object
        }
    },

    data () {
        return {
            isUploading: false,
            progress: 0,
            internalData: null
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        onProgress (e) {
            this.progress = Math.round(e.loaded / e.total * 100)
        },

        processUpload (nv) {
            if (this.isUploading) {
                return
            }

            nv = nv || this.uploadData

            const vm = this
            // directly set mode to uploading
            if (!this.id && nv && this.docType && this.docId) {
                // no id, but we have upload data and target
                this.isUploading = true

                console.log('Upload started!')

                // call api, and sheit
                this.api.attachFile(this.docType,
                                    this.docId,
                                    this.uploadData,
                                    this.onProgress)
                .then(e => {
                    console.log('Upload success!')
                    console.log(e.data)
                    vm.internalData = e.data.data
                    vm.isUploading = false

                    vm.$emit('load', {
                        upload: vm.uploadData,
                        download: e.data.data
                    })
                })
                .catch(e => {
                    vm.handleError(e)

                    vm.isUploading = false
                    vm.$emit('error', e)
                })
            }
        }
    },

    mounted () {
        // what happens when we're mounted? nothing I guess
        if (this.uploadData && !this.internalData) {
            this.processUpload()
        } else if (this.value) {
            // copy to internal data
            this.internalData = this.value
        }
    },

    /* watch: {
        uploadData: {
            deep: true,
            immediate: false,
            handler: function (nv, ov) {
                this.processUpload(nv)
            }
        }
    } */
}
</script>

<style scoped>
.broken {
    max-width: 300px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.progress-barr {
    max-width: 400px;
    display: inline-block;
}
</style>