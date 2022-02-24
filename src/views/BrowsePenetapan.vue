<template>
    <div>
        <!-- Button control -->
        <!-- <div class="mb-2">
            <b-button variant="primary" class="shadow"
                @click="grabKurs">
                <font-awesome-icon icon="cloud-download-alt"></font-awesome-icon>
                Tarik dari Situs BKF
            </b-button>
        </div> -->
        <!-- paginated browser -->
        <paginated-browser
            :data-callback="getPenetapanBarang"
            ref="penetapanBrowser">

            <!-- additional control? -->
            <template #append-search-param>
              <b-col>
                <hr/>
                <b-form-group label="Kategori" label-cols="1">
                  <select-kategori v-model="kategori"/>
                </b-form-group>
                <!-- <pre>{{ kategori }}</pre> -->
              </b-col>
            </template>

            <template v-slot:default="{ data }">
                <!-- table penetapan -->
                <table-penetapan
                    :items="data"
                    >
                </table-penetapan>
            </template>
        </paginated-browser>

        <!-- confirm box -->
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import SelectKategori from '@/components/SelectKategori'
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import TablePenetapan from '@/components/TablePenetapan'
import { mapGetters, mapMutations } from 'vuex'

export default {
    mixins: [axiosErrorHandler],
    components: {
        PaginatedBrowser,
        SelectKategori,
        TablePenetapan
    },
    data: () => ({
      kategori: []
    }),
    methods: {
        // grab set busy state
        ...mapMutations(['setBusyState']),

        // panggil api utk ambil data kurs
        getPenetapanBarang(q, spinner, vm) {
            spinner(true)

            var me = this

            this.api.getPenetapanBarang({
              ...q,
              category: this.kategori,
              include: 'kategori'
            })
            .then(e => {
                spinner(false)

                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)
            })
            .catch(e => {
                spinner(false)
                me.handleError(e)
            })
        },
    },
    computed: {
        ...mapGetters(['api'])
    }
}
</script>
