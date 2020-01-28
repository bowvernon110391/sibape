<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        header-bg-variant="light"
        size="xl"
        centered
        hide-footer
        :title="title"
        @change="e => $emit('input', e)">

        <!-- embed pdf -->
        <object
            type="application/pdf"
            width="100%"
            height="500px"
            :data="url">
            <embed
                type="application/pdf"
                :src="url">
        </object>

    </b-modal>
</template>

<script>
export default {
    inheritAttrs: false,

    props: {
        url: {
            type: String,
            default: null
        },

        title: {
            type: String,
            default: "PDF Viewer"
        },

        value: {
            type: [Boolean,Number,String],
            required: true
        }
    }
}
</script>