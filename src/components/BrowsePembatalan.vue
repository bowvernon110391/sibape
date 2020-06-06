<template>
    <div>
        <div class="mb-2">
            <!-- must show new pembatalan modal input here -->
            <b-button variant="primary" class="shadow" @click="createNewPembatalan">
                <font-awesome-icon icon="plus-square"></font-awesome-icon> Input Surat Pembatalan
            </b-button>
        </div>
        <!-- di dalem div, ada paginated browser -->
        <paginated-browser
            :data-callback="getPembatalan"
            ref="browserPembatalan">
            <!-- di tengahnya, ada tabel -->
            <template v-slot:default="{ data, pagination }">
                <!-- <table-cd :items="data"
                    @deleteHeader="deletePembatalan"></table-cd> -->
                <!-- <pre>{{ JSON.stringify(data, null, 4) }}</pre> -->
                <table-pembatalan 
                    :items="data"
                    @deleteHeader="deletePembatalan"
                    @editHeader="editPembatalan"
                    @lockHeader="lockPembatalan"></table-pembatalan>
                    
            </template>
        </paginated-browser>

        <!-- the modal view of pembatalan goes here -->
        <b-modal
            size="lg"
            v-model="viewPembatalan.show">
            <template #modal-title>
                {{ viewPembatalan.disabled ? 'View' : 'Edit' }} Pembatalan
            </template>

            <template #modal-footer>
                <b-button
                    @click="handleSave"
                    variant="primary"
                    :disabled="viewPembatalan.disabled">
                    <font-awesome-icon icon="save">
                    </font-awesome-icon>
                    Simpan
                </b-button>
            </template>

            <view-pembatalan
                :id="viewPembatalan.id"
                ref="viewPembatalan"
                @disableEdit="e => { viewPembatalan.disabled = e }"
                @dataSave="onDataSave"
                />
        </b-modal>
    </div>
</template>

<script>
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import userChecker from '../mixins/userChecker'
import { mapGetters, mapMutations } from 'vuex'
import PaginatedBrowser from '@/components/PaginatedBrowser'
// import TableCd from '@/components/TableCd'
import TablePembatalan from '@/components/TablePembatalan'
import ViewPembatalan from '@/components/ViewPembatalan'

export default {
    mixins: [ axiosErrorHandler, userChecker ],
    components: {
        PaginatedBrowser,
        // TableCd
        TablePembatalan,
        ViewPembatalan
    },
    computed: {
        ...mapGetters(['api']),
    },
    methods: {
        // grab some from store
        ...mapMutations(['setBusyState']),

        debug(e) {
            console.log(e)
        },

        // ambil data cd
        getPembatalan (q, spinner, vm) {
            spinner(true)
            this.api.getPembatalan({
                ...q,
                include: 'status'
            })
            .then(e => {
                // console.log("Got cd data:")
                // console.log(e.data.data)
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // hapus data cd
        deletePembatalan (id) {
            // alert(`Delete Cd #${id}`)
            // loading screen
            this.setBusyState(true)

            // delet dis
            this.api.deletePembatalan(id)
            .then(e => {
                // stop loading
                this.setBusyState(false)
                // give warning
                this.showToast(`Data deleted`, `Pembatalan #${id} deleted successfully`, 'warning')
                // force reload current page?
                this.$refs.browserPembatalan.stayAtCurrentPage(-1)
            })
            .catch(e => {
                // stop loading
                this.setBusyState(false)
                // handle error
                this.handleError(e)
            })
        },

        // edit pembatalan
        editPembatalan (id) {
            // alert(`Editing Pembatalan #${id}`)

            this.viewPembatalan.id = id
            this.viewPembatalan.show = true
        },

        // kunci pembatalan
        lockPembatalan (id) {
            // set spinner
            this.setBusyState(true)
            // call api
            this.api.lockPembatalan(id)
            .then(e => {
                // if success, stop spinner
                this.setBusyState(false)
                // - also refresh
                this.$refs.browserPembatalan.stayAtCurrentPage(-1)
            })
            .catch(e => {
                // else also stop spinner
                this.setBusyState(false)
            })
        },

        // save pembatalan
        handleSave () {
            this.$refs.viewPembatalan.onSave()
        },

        createNewPembatalan () {
            this.viewPembatalan.id = null
            this.viewPembatalan.disabled = false
            this.viewPembatalan.show = true
        },

        onDataSave(e) {
            // close modal, and refresh
            this.viewPembatalan.show = false
            if (e.new) {
                this.showToast(`Pembatalan created`, `Created Pembatalan #${e.id}`, 'success')
            } else {
                this.showToast(`Pembatalan saved`, `Saved Pembatalan #${e.id}`, 'success')
            }

            // reload
            this.$refs.browserPembatalan.stayAtCurrentPage(0)
        }
    },
    data () {
        return {
            viewPembatalan: {
                id: null,
                show: false,
                disabled: false
            }
        }
    },
    watch: {
        'viewPembatalan.disabled': {
            immediate: true,
            handler (e) {
                console.log('Disabled changed to ->', e)
            }
        }
    }
}
</script>