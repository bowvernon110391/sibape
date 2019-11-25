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
        v-on="$listeners"
        show-empty>
        <!-- nomor -->
        <template v-slot:cell(#)="row">
            {{ row.index + 1 }}
        </template>

        <!-- jenis detail sekunder -->
        <template v-slot:cell(jenis)="row">
            <select-jenis-detail-sekunder
                v-model="row.item.jenis"
                :disabled="disabled">
            </select-jenis-detail-sekunder>
        </template>

        <!-- data -->
        <template v-slot:cell(data)="row">
            <b-form-textarea v-model="row.item.data" :disabled="disabled">
            </b-form-textarea>
        </template>

        <!-- delete -->
        <template v-slot:cell(action)="row">
            <b-button size="sm" variant="danger" class="shadow" 
                :disabled="disabled" @click="deleteDetail(row.index)">
                <font-awesome-icon icon="trash-alt">
                </font-awesome-icon>
            </b-button>
        </template>

        <!-- empty -->
        <template v-slot:empty="row">
            <p class="text-center">Tidak ada data tambahan</p>
        </template>
    </b-table>
</template>

<script>
const cloneDeep = require('clone-deep')

import SelectJenisDetailSekunder from '@/components/SelectJenisDetailSekunder'

export default {
    inheritAttrs: false,
    components: {
        SelectJenisDetailSekunder
    },
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
            internalValue: this.value.length ? cloneDeep(this.value) : []
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
        // push new row into the back
        addNewDetail () {
            this.internalValue.push({
                id: null,
                jenis: null,
                data: ''
            })
        },

        // remove specified row
        async deleteDetail (id) {
            // alert("Deleting " + id)
            // console.log(`deleting sekunder ${id}`)
            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data ini? (${this.internalValue[id].jenis})`, {
                title: `Deleting data tambahan`,
                size: 'md',
                buttonSize: 'md',
                okVariant: 'danger',
                okTitle: 'YES',
                cancelTitle: 'NO',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: true
            })

            if (result) {
                this.internalValue.splice(id, 1)
            }
        }
    }
}
</script>