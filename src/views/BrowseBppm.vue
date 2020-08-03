<template>
    <div>
        <div class="mb-2 text-right">
            <!-- Upload billing -->
            <b-button
                variant="danger"
                class="shadow"
                v-b-tooltip.hover
                title="Upload data billing untuk menutup BPPM"
                v-b-modal.modalImport
            >
                <font-awesome-icon icon="cloud-upload-alt"/>
                Upload Data Billing
            </b-button>
            <!-- Download excel -->
            <b-button 
                variant="success"
                class="shadow"
                :disabled="!can_download"
                v-b-tooltip.hover
                title="Download data BPPM dalam bentuk excel (hint: bisa jadi bahan upload data billing)"
                @click="downloadExcel"
                >
                <font-awesome-icon icon="file-excel"/>
                Download Excel
            </b-button>
        </div>
        <paginated-browser
        ref="browser"
        :data-callback="loadBppmData"
        >
            <!-- append search param -->
            <template #append-search-param>
                <b-col md="12">
                    <hr/>
                </b-col>
                <!-- status billing -->
                <b-col md="4">
                    <b-form-group label="Status Billing" label-cols-md="4">
                        <b-form-select v-model="billing_status">
                            <b-form-select-option :value="null">Semua</b-form-select-option>
                            <b-form-select-option :value="true">Sudah Billing</b-form-select-option>
                            <b-form-select-option :value="false">Belum Billing</b-form-select-option>
                        </b-form-select>
                    </b-form-group>
                </b-col>
                <!-- deep query -->
                <b-col md="4">
                    
                    <b-form-checkbox switch v-model="deep_query" v-b-tooltip.hover title="Query Dok Sumber juga (WARNING:SLOW)">
                        Deep Query
                    </b-form-checkbox>
                    
                </b-col>
            </template>
            <!-- show data -->
            <template #default="{ data, pagination }">
                <!-- table here -->
                <b-table
                    head-variant="dark"
                    small
                    hover
                    striped
                    table-class="shadow"
                    bordered
                    responsive="sm"

                    :fields="fields"
                    :items="data"
                >
                    <!-- no + tgl bppm -->
                    <template #cell(nomor_lengkap)="{ item }">
                        <div>
                            <b-badge variant="dark">
                                {{ item.nomor_lengkap }}
                            </b-badge>
                        </div>
                        <div>
                            <b-badge variant="secondary">
                                {{ item.tgl_dok }}
                            </b-badge>
                        </div>
                    </template>

                    <!-- dok sumber -->
                    <template #cell(payable)="{ item }">
                        <b-button
                            v-if="item.payable_uri"
                            size="sm"
                            :to="item.payable_uri"
                            :variant="badgeVariant('sr'+item.payable_type)"
                            v-b-tooltip.hover
                            title="Lihat Dok Sumber"
                            class="shadow"
                        >
                            <font-awesome-icon icon="eye"/>
                            {{ item.jenis_dokumen_lengkap_payable }}
                        </b-button>

                        <!-- nomor + tgl -->
                        <div>
                            <!-- <b-badge variant="primary">Nomor</b-badge> -->
                            <b-badge :variant="badgeVariant(item.nomor_lengkap_payable)">
                                {{ item.nomor_lengkap_payable }}
                            </b-badge>
                        </div>
                        <div>
                            <!-- <b-badge variant="danger">Tanggal</b-badge> -->
                            <b-badge :variant="badgeVariant(item.tgl_dok_payable)">
                                {{ item.tgl_dok_payable }}
                            </b-badge>
                        </div>
                    </template>

                    <!-- payer -->
                    <template #cell(payer)="{ value }">
                        <div>
                            <b-badge :variant="badgeVariant(value.nama)">{{ value.nama }}</b-badge>
                        </div>
                        <div>
                            <b-badge :variant="badgeVariant(value.jenis_identitas)">
                                {{ value.jenis_identitas }} : {{ value.no_identitas }}
                            </b-badge>
                        </div>
                        <div>
                            <b-badge variant="danger">
                                NPWP : {{ value.npwp }}
                            </b-badge>
                        </div>
                        <div>
                            <p>
                                🏠{{ value.alamat }}
                            </p>
                        </div>
                    </template>

                    <!-- billing -->
                    <template #cell(billing)="{ value }">
                        <div v-if="!value.data.length">
                            -
                        </div>
                        <div v-else>
                            <!-- loop over all data -->
                            <div v-for="(b, id) in value.data" :key="b.id">
                                <hr v-if="id">
                                <!-- what do we write here? -->
                                <!-- nomor -->
                                <div>
                                    <b-badge variant="dark">
                                        nomor: {{ b.nomor }}
                                    </b-badge>
                                </div>
                                <!-- tanggal -->
                                <div>
                                    <b-badge variant="secondary">
                                        tanggal: {{ b.tanggal }}
                                    </b-badge>
                                </div>
                                <!-- NTB -->
                                <div>
                                    <b-badge variant="danger">
                                        NTB: {{ b.ntb }}
                                    </b-badge>
                                </div>
                                <!-- NTPN -->
                                <div>
                                    <b-badge variant="success">
                                        NTPN: {{ b.ntpn }}
                                    </b-badge>
                                </div>
                                <!-- NTPN -->
                                <div>
                                    <b-badge variant="warning">
                                        tanggal: {{ b.tgl_ntb || b.tgl_ntpn }}
                                    </b-badge>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- pejabat -->
                    <template #cell(pejabat)="{ value }">
                        <div>
                            <b-badge :variant="badgeVariant(value.data.name)">
                                {{ value.data.name }}
                            </b-badge>
                        </div>
                        <div>
                            <b-badge :variant="badgeVariant(value.data.nip)">
                                {{ value.data.nip }}
                            </b-badge>
                        </div>
                    </template>

                </b-table>
            </template>
        </paginated-browser>

        <!-- modal utk upload -->
        <b-modal
        id="modalImport"
        ref="modalImport"
        footer-bg-variant="light"
        header-bg-variant="light"
        title="Import Data Billing"
        centered
        :no-close-on-backdrop="uploading"
        :no-close-on-esc="uploading"
        >
            <!-- custom footer -->
            <template #modal-footer>
                <b-button size="sm" variant="primary" @click="uploadDataBilling" :disabled="uploading">
                    <template v-if="!uploading">
                        <font-awesome-icon icon="cloud-upload-alt"/>
                        Upload
                    </template>
                    <template v-else>
                        <b-spinner small/>
                        Uploading...
                    </template>
                </b-button>
            </template>

            <!-- only contain file -->
            <b-form-group>
                <template #label>
                    Browse File Excel (<a href="/static/contoh-input-data-billing.xlsx">Contoh File</a>)
                </template>

                <b-file
                    required
                    v-model="file_input"
                    accept=".xls, .xlsx"
                    :disabled="uploading"
                />
            </b-form-group>
        </b-modal>
    </div>
</template>

<script>
import PaginatedBrowser from '@/components/PaginatedBrowser'
import { mapGetters, mapMutations } from 'vuex'

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import niceties from '../mixins/niceties'

const fileDownload = require('js-file-download')

export default {
    mixins: [
        axiosErrorHandler,
        niceties
    ],

    components: {
        PaginatedBrowser
    },

    data () {
        return {
            // query data
            deep_query: false,  // do not use deep query
            billing_status: null, // do not care about billing status

            can_download: false,

            file_input: null,
            uploading: false
        }
    },

    computed: {
        ...mapGetters(['api']),

        fields () {
            return [
                { key: 'nomor_lengkap', class: 'text-center' },
                // { key: 'tgl_dok', class: 'text-center' },
                { key: 'payable', label: 'Dok Sumber', class: 'text-center' },
                { key: 'payer', label: 'Pembayar' },
                { key: 'billing', class: 'text-center' },
                { key: 'pejabat', class: 'text-center' },
            ]
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        // load data
        loadBppmData(q, spinner, vm) {
            spinner(true)
            this.api.getBppm({
                ...q,
                deep: this.deep_query,
                'billing-status': this.billing_status,
                include: 'billing'
            })
            .then(e => {
                spinner(false)
                vm.setData(e.data.data)
                vm.setTotal(e.data.meta.pagination.total)

                this.can_download = e.data.meta.pagination.total > 0
            })
            .catch(e => {
                spinner(false)
                this.handleError(e)
            })
        },

        // upload data billing
        uploadDataBilling () {
            this.uploading = true
            this.api.attachRawFileToUri('/excel/billing', this.file_input)
            .then(e => {
                // gotta say something about that?
                this.uploading = false
                this.file_input = null
                
                this.showToast(
                    `Import Berhasil`,
                    `Total : ${e.data.total} billing, \nInserted : ${e.data.inserted} billing, \nOmitted : ${e.data.omitted} billing`,
                    'success'
                )

                // now we hide modal and reload
                this.$nextTick(() => {
                    this.$refs.modalImport.hide()
                    this.$refs.browser.loadData()
                })
            })
            .catch(e => {
                this.handleError(e)
                this.uploading = false
            })
        },

        // download excel
        downloadExcel() {
            // grab all parameter then
            

            var queryData = {
                ...this.$refs.browser.browseData,
                deep: this.deep_query,
                'billing-status': this.billing_status
            }

            console.log('query data: ', queryData)

            // call api using this endpoint?
            this.setBusyState(true)

            this.api.downloadUri('/excel/bppm', {}, 35000, queryData)
            .then(e => {
                this.setBusyState(false)
                // save the file though
                fileDownload(e.data, 'BPPM.xlsx')
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)
            })
        }
    },

    watch: {
        billing_status: {
            handler(nv) {
                this.$refs.browser.loadData()
            }
        }
    }
}
</script>