<template>
    <api-select
        id="api-multiselect"
        :reduce="e => e.nama"
        label="nama"
        :search-callback="searchKategori"
        :sync-callback="searchKategori"
        taggable
        multiple
        :create-option="createKategori"
        :clear-search-on-select="true"
        v-bind="$attrs"
        v-on="$listeners"
        :value="value"
        @input="updateValue">
        <!-- Slot -->
        <template v-slot:option="opt">
            <template v-if="opt.id">
                <span>{{ opt.nama }}</span>
            </template>
            <template v-else>
                <span><strong>Tambahkan</strong> {{ opt.nama }}...</span>
            </template>
        </template>
    </api-select>
</template>

<script>
import ApiSelect from '@/components/ApiSelect'
import { mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
    inheritAttrs: false,
    mixins: [ axiosErrorHandler ],
    props: [ 'value' ],
    components: {
        ApiSelect
    },
    computed: {
        ...mapGetters(['api'])
    },
    methods: {
        // update value
        updateValue (val) {
            this.$emit('input', val)
        },

        // create kategori
        createKategori (value) {
            var requestData = {
                id: 0,
                nama: value
            }

            // call api to create kategori
            var vm = this
            this.api.createKategori(requestData)
                .then(e => {
                    // clear selection
                    // vm.$refs.selectKategori.onEscape()
                    // gotta push manually?
                    // vm.kategori.push(value)
                    this.updateValue([...this.value, value])
                    // vm.kategori = vm.kategori.push(e.data.id)
                    // requestData.id = e.data.id
                    // when successful, reset data
                    this.showToast('Added Kategori', `Kategori ${value} added`, 'success')
                })
                .catch(e => {
                    // alert(`Gagal menambah tag: ${value}`)
                    this.handleError(e)
                })
            return {
                id: 0,
                nama: ''
            }
        },

        // search kategori
        searchKategori (q, spinner, vm) {
            spinner(true)
            this.api.getKategori()
                .then(e => {
                    vm.setOptions(e.data.data)
                    spinner(false)
                })
                .catch(e => {
                    spinner(false)
                    // alert('Failed to get kategori')
                    this.handleError(e)
                })
        }
    }
}
</script>