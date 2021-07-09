<template>
    <div>
        <!-- Title -->
        <slot name="title"><h5>Detil Barang</h5></slot>

        <!-- button utk tambah barang -->
        <div class="my-2">
            <b-button variant="primary" class="shadow" :disabled="disabled" @click="onCreate">
                <font-awesome-icon icon="plus-square"/>&nbsp;Tambah Barang
            </b-button>
        </div>

        <!-- Paginated browser -->
        <paginated-browser
            :data-callback="loadDetailBarang"
            :search-date-range="false"
            :search-box="false"
            ref="detailBrowser">
            <template #default="{ data, pagination }">
                <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
                <table-detail-barang
                :items="data"
                :pagination="pagination"
                :disabled="disabled"
                @delete="deleteBarang"
                @view="viewBarang"
                @edit="editBarang"
                :hide-satuan="!detailedView"
                :show-pembebasan="showPembebasan"
                />
            </template>
        </paginated-browser>

        <!-- MODAL -->
        <b-modal
        id="modalDetailBarang"
        header-bg-variant="light"
        footer-bg-variant="light"
        :title="modalTitle"
        v-model="showModal"
        size="xl"
        no-close-on-esc
        >
            <detail-barang-contents :disabled="!editMode || modalBusy" v-model="currentItem" :hide-satuan="!detailedView" :hide-netto="!detailedView" :showFasilitas="showFasilitas"/>

            <!-- Footer -->
            <template #modal-footer="{ cancel }">
                <b-button variant="danger" @click="cancel" size="sm" :disabled="modalBusy">
                    <font-awesome-icon icon="times" />&nbsp;Cancel
                </b-button>
                <b-button variant="primary" :disabled="disabled || modalBusy" size="sm" @click="onSave">
                    <template v-if="!modalBusy">
                        <font-awesome-icon icon="save" />&nbsp;Simpan
                    </template>
                    <template v-else>
                        <b-spinner small/>&nbsp;Menyimpan...
                    </template>
                </b-button>
            </template>
        </b-modal>
    </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import PaginatedBrowser from '@/components/PaginatedBrowser'
import TableDetailBarang from '@/components/TableDetailBarang'
import DetailBarangContents from '@/components/DetailBarangContents'

import defaultDetailBarang from '../defaults/defaultDetailBarang'
const cloneDeep = require('clone-deep')

export default {
    inheritAttrs: false,

    mixins: [axiosErrorHandler],

    props: {
        uri: {
            type: String,
            required: true
        },

        storeUri: {
            type: String,
            required: true
        },

        disabled: {
            type: Boolean,
            default: false
        },

        detailedView: {
            type: Boolean,
            default: false
        },

        showPembebasan: {
            type: Boolean,
            default: false
        },

        showFasilitas: {
          type: Boolean,
          default: false
        }
    },

    components: {
        PaginatedBrowser,
        TableDetailBarang,
        DetailBarangContents
    },

    data() {
        return {
            initialHash: null,
            currentItem: null,
            showModal: false,
            editMode: false,
            modalBusy: false
        }
    },

    computed: {
        ...mapGetters(['api']),

        modalTitle() {
            if (this.currentItem && this.currentItem.id) {
                return (this.editMode ? 'Edit Item ' : 'View Item') + ` #${this.currentItem.id}`
            }
            return 'Tambah Data Barang'
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        handleRefresh() {
            this.$refs.detailBrowser.stayAtCurrentPage(0)
        },

        loadDetailBarang(q, spinner, vm) {
            spinner(true)

            this.api.instance.get(this.uri, {
                params: q
            })
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // OUR HANDLERS!!
        async deleteBarang(data) {
            // alert("deleting " + data.id)

            var result = await this.$bvModal.msgBoxConfirm(`Yakin mau menghapus data barang ini? (${data.id})`, {
                title: `Menghapus Detail Barang #${data.id}`,
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
                this.setBusyState(true)
                this.api.deletePenetapanBarang(data.id)
                .then(e => {
                    this.setBusyState(false)
                    this.$refs.detailBrowser.stayAtCurrentPage(-1)
                })
                .catch(e => {
                    this.setBusyState(false)
                    this.handleError(e)
                })
            }
        },

        viewBarang(data) {
            this.currentItem = data
            this.editMode = false
            this.showModal = true
        },

        editBarang(data) {
            this.initialHash = JSON.stringify(data)
            this.currentItem = data
            this.editMode = true
            this.showModal = true
        },

        onSave() {
            // either save or update...depending on the currentItem?
            if (this.currentItem.id) {
                // alert("Gotta save!")
                this.modalBusy = true
                this.api.updatePenetapanBarang(this.currentItem.id, this.currentItem)
                .then(e => {
                    this.modalBusy = false
                    // close our window?
                    this.showModal = false
                    // show toast
                    this.showToast('Saved!', `Detail Barang #${this.currentItem.id} Saved!`, 'success')
                })
                .catch(e => {
                    this.modalBusy = false
                    this.handleError(e)
                })
            } else {
                // alert("Gotta create and store @ " + this.storeUri)
                this.modalBusy = true
                this.api.storePenetapanBarang(this.storeUri, this.currentItem)
                .then(e => {
                    this.modalBusy = false
                    this.showModal = false

                    this.showToast('Created!', `Created Detail Barang #${e.data.id}!`, 'success')

                    // move to end page
                    this.initialHash = JSON.stringify(this.currentItem)
                    this.$refs.detailBrowser.stayAtCurrentPage(1)
                })
                .catch(e => {
                    this.modalBusy = false
                    this.handleError(e)
                })
            }
        },

        onCreate() {
            this.currentItem = cloneDeep(defaultDetailBarang)
            this.editMode = true
            this.initialHash = JSON.stringify(this.currentItem)
            this.showModal = true
        }
    },

    watch: {
        showModal: {
            handler(nv) {
                if (!nv) {
                    // we're closing...check if we're dirty...
                    const newHash = JSON.stringify(this.currentItem)
                    if (newHash !== this.initialHash) {
                        // alert("DIRTY!!!")
                        // it's dirty!!! refresh
                        this.handleRefresh()
                    }
                }
            }
        }
    }
}
</script>
