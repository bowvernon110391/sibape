<template>
    <b-table
        responsive="sm"
        :fields="fields"
        :items="internalValue"
        striped
        hover
        outlined
        small
        primary-key="id"
        head-variant="dark"
        bordered
        v-bind="$attrs"
        v-on="$listeners">
        <!-- nomor -->
        <template v-slot:cell(#)="row">
            {{ row.index + 1 }}
        </template>

        <!-- data -->
        <template v-slot:cell(data)="row">
            <b-form-textarea v-model="row.item.data" :disabled="disabled">
            </b-form-textarea>
        </template>

        <!-- delete -->
        <template v-slot:cell(action)="row">
            <b-button size="sm" variant="danger" class="shadow" :disabled="disabled">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>
        </template>

        <!-- empty -->
        <template v-slot:empty="scope">
            Tidak ada data tambahan
        </template>
        <template v-slot:emptyfiltered="scope">
            Tidak ada data tambahan
        </template>
    </b-table>
</template>

<script>
const cloneDeep = require('clone-deep')

export default {
    inheritAttrs: false,
    props: {
        value: {
            type: Array,
            default: []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            fields: [
                '#', 'jenis', 'data', { label: '', key: 'action' }
            ],
            internalValue: cloneDeep(this.value)
        }
    },
    watch: {
        internalValue: {
            handler (newVal) {
                // console.log('internalValue change')
                this.$emit('input', newVal)
            },
            deep: true
        }
    },
    methods: {
        addNewDetail () {
            this.internalValue.push({
                id: null,
                jenis: null,
                data: ''
            })
        }
    }
}
</script>