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
                <div>
                    <a :href="internalData.url" target="__blank">{{ internalData.filename }}</a>
                </div>
                <object :data="internalData.url" width="300" height="200" @click="handleClick">
                    <a :href="internalData.url" target="__blank">{{ internalData.filename }}</a>
                </object>
                <!-- Also try to show it here perhaps? -->

            </template>
        </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import { mapGetters } from 'vuex'

const cloneDeep = require('clone-deep')

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
        },

        initialData: {
            type: Object,
            default: null
        },

        endpoint: {
            type: String,
            default: null
        }
    },

    data () {
        return {
            isUploading: false,     // flag for when we're uploading
            progress: 0,            // progress bar value
            internalData: this.initialData ? cloneDeep(this.initialData) : null // if we were given initial data, use it
        }
    },

    computed: {
        ...mapGetters(['api'])
    },

    methods: {
        handleClick (e) {
            // show alert first
            // alert('I got clicked!')
            this.$bvModal.show('loading-screen')
        },

        onProgress (e) {
            this.progress = Math.round(e.loaded / e.total * 100)
        },

        // process upload a file
        // @nv : the object containing file information
        processUpload (nv) {
            // if we're in uploading state, do nothing
            if (this.isUploading) {
                return
            }

            // if no file given, use uploadData property
            nv = nv || this.uploadData

            const vm = this
            // directly set mode to uploading
            // if we have no id and we have data to upload
            //   and we either have (doctype and docid) or (endpoint)
            if (!this.id && nv && ( (this.docType && this.docId) || this.endpoint) ) {
                // no id, but we have upload data and target
                this.isUploading = true

                console.log('Upload started!')

                // call api, and sheit
                // if we're using doctype and id
                var uploadPromise = null
                if (this.docType && this.docId) {
                    uploadPromise = this.api.attachFile(this.docType,
                                    this.docId,
                                    this.uploadData,
                                    this.onProgress)
                } else if (this.endpoint) {
                    uploadPromise = this.api.attachFileToUri(this.endpoint,
                                    this.uploadData,
                                    this.onProgress)
                }
                
                uploadPromise.then(e => {
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

object:hover {
    cursor: pointer;
}
</style>