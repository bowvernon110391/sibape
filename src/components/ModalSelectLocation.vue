<template>
    <b-modal
        v-bind="$attrs"
        v-on="$listeners"
        :visible="value"
        @change="e => $emit('input', e)"
        header-bg-variant="light"
        centered>

        <!-- Head -->
        <template #modal-header>
            <h4>Select Location</h4>
        </template>

        <!-- Body -->
        <template>
            <!-- <p>Gotta put something in here</p> -->
            <b-form-group
                label="Pilih lokasi"
                description="Hanya berdampak pada saat input data">
                <b-form-select
                    :value="lokasi"
                    @input="setLokasi">

                    <option value="T2F">T2F</option>
                    <option value="T3">T3</option>
                    <option value="KANTOR">KANTOR</option>

                </b-form-select>
            </b-form-group>
        </template>
    </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    inheritAttrs: false,

    props: {
        value: {
            required: true
        }
    },

    computed: {
        ...mapGetters(['lokasi'])
    },

    methods: {
        ...mapMutations(['setLokasi'])
    }
}
</script>