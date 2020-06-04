<template>
    <b-card
        no-body>
        <!-- Title containing sync button -->
        <template #header>
            <h5 class="mb-0 d-inline">{{ title }}</h5>
            <div class="float-right d-inline-block">
                <!-- synchronizing indicator -->
                
                <template v-if="busy">
                    
                        <em>synchronizing</em> 
                        <div class="d-inline-block shadow-sm" style="width: 128px; vertical-align: middle">
                            <b-progress :value="100" variant="warning" striped animated></b-progress>
                        </div>
                    
                </template>

                <!-- toggle show/hide -->
                <b-button variant="dark" size="sm" class="mx-2 shadow-sm" 
                    @click="showAttachments = !showAttachments"
                    >
                    <font-awesome-icon :icon="showAttachments ? 'eye-slash' : 'eye'"/>
                </b-button>
                <!-- open upload dialog -->
                <b-button variant="primary" size="sm" :disabled="disabled" class="shadow-sm">
                    <font-awesome-icon icon="plus-square"/>
                    Upload
                </b-button>
                <!-- force sync -->
                <b-button variant="primary" size="sm" @click="synchronize" class="shadow-sm">
                    <font-awesome-icon icon="sync"/>
                    Sync
                </b-button>
            </div>
        </template>

        <!-- The body just contains the attachments -->
        <transition name="fade">
        <b-card-body v-if="showAttachments" class="position-relative">
            <template>
                <attachment-handler
                    v-for="(data) in attachments"
                    :key="data.id"
                    :initial-data="data">
                </attachment-handler>
            </template>

            <!-- blocker -->
            <transition name="fade">
            <div class="position-absolute blocker" v-if="busy">
                
            </div>
            </transition>
        </b-card-body>
        </transition>

    </b-card>
</template>

<script>
import AttachmentHandler from '@/components/AttachmentHandler'

const cloneDeep = require('clone-deep')

export default {
    components: {
        AttachmentHandler
    },

    props: {
        title: {
            type: String,
            default: 'Attachments'
        },

        targetUrlUpload: {
            type: String
        },

        targetUrlDownload: {
            type: String
        },

        initialData: {
            type: Array
        },

        disabled: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            attachments: this.initialData ? cloneDeep(this.initialData) : [], // empty initially
            showAttachments: true,
            busy: false
        }
    },

    methods: {
        synchronize () {
            // gotta check if targetUrl is there

            /* if (!this.targetUrlDownload) {
                // no url supplied, so just emit sync event
                this.$emit('synchronize')
                return
            } */

            // do the thing (call the API)
            this.setBusyState(true)
            setTimeout(e => {
                this.setBusyState(false)
            }, 5000)

        },

        // additional method so can be manipulated from outside
        setBusyState (flag) {
            this.busy = flag
        }
    }
}
</script>

<style scoped>
.blocker {
    background-color: rgba(0, 0, 0, 0.5);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-block;
}
</style>