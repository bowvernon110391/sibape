<template>
    <b-card>
        <template v-slot:header>
            <div class="text-right">
                <b-button size="sm" variant="primary" :disabled="disabled">
                    <font-awesome-icon icon="plus-square">
                    </font-awesome-icon>
                    Tambah
                </b-button>
            </div>
        </template>
        <!-- the real deal goes here -->
        <!-- if empty, show alert -->
        <template v-if="!internalData.length">
            <b-alert show variant="secondary">
                Tidak ada data detail tambahan
            </b-alert>
        </template>
        <!-- otherwise, show data -->
        <template v-else>
            <b-card v-for="(ds, idx) in internalData" :key="ds.id" class="mb-2" no-body>
                <template v-slot:header>
                    <strong>{{ idx+1 }} {{ ds.jenis }}</strong>
                </template>
                <b-form-textarea v-model="ds.data" size="sm" class="rounded-0" :disabled="disabled"></b-form-textarea>
            </b-card>
        </template>
    </b-card>
</template>

<script>
const cloneDeep = require('clone-deep')

export default {
    props: ['value', 'disabled'],
    data () {
        return {
            internalData: cloneDeep(this.value)
        }
    },
    watch: {
        internalData: {
            deep: true,
            handler (newVal) {
                this.$emit('input', newVal)
            }
        }
    }
}
</script>