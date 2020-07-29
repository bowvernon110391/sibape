<template>
    <div>
        <b-card no-body class="rounded shadow">
            <!-- HEADER -->
            <b-card-header>
                <div class="d-sm-block d-md-flex my-2">
                    <!-- Banner at the top -->
                    <doc-banner doctype="PIBK" :data="dataPibk" :is-new="isNew" />
                    <!-- document controls -->
                </div>

                <!-- IP Controls -->

            </b-card-header>

            <!-- BODY -->
            <b-tabs card lazy v-model="tabId">
                <!-- Header -->
                <b-tab title="Header" active>
                    <pibk-contents :data="dataPibk" :disabled="disableInput"/>
                </b-tab>

                <template v-if="!isNew">
                    <!-- Barang -->
                    <b-tab title="Barang">
                        <view-detail-barang 
                            :uri="`/pibk/${id}/details`" 
                            :store-uri="`/pibk/${id}/penetapan`" 
                            :disabled="disableInput"
                            detailed-view
                        />
                    </b-tab>

                    <!-- Dokkap -->
                    <b-tab title="Dokkap">
                        <table-dokkap v-model="dataPibk.dokkap.data" :disabled="disableInput" />
                    </b-tab>

                    <!-- Lampiran -->
                    <b-tab title="Lampiran">
                        <attachment-bucket show :disabled="disableInput" :endpoint="`/pibk/${id}/lampiran`"/>
                    </b-tab>

                    <!-- Instruksi Pemeriksaan (KLO ADA) -->
                    <b-tab v-if="dataPibk.instruksi_pemeriksaan && !hideIp" title="Instruksi Pemeriksaan">
                        <b-row>
                            <b-col md="6">
                                <ip-contents :value="dataPibk.instruksi_pemeriksaan.data" disabled />
                            </b-col>
                        </b-row>
                    </b-tab>

                    <!-- LHP (KLO ADA) -->
                    <b-tab v-if="getLhp(dataPibk, true)" title="LHP">
                        <lhp-contents :value="getLhp(dataPibk, true)" disabled />
                        <hr/>
                        <attachment-bucket show disabled :endpoint="lhpAttachmentEndpoint(dataPibk)" />
                    </b-tab>
                </template>
            </b-tabs>

            <!-- FOOTER -->
            <b-card-footer footer-bg-variant="light" v-if="tabId == 0 || tabId == 2">
                <div>
                    <b-button class="shadow" variant="primary" :disabled="disableInput">
                        <font-awesome-icon icon="save"/>
                        Simpan
                    </b-button>
                </div>
            </b-card-footer>
        </b-card>
    </div>
</template>

<script>
import DocBanner from '@/components/DocBanner'
import PibkContents from '@/components/PibkContents'
import TableDokkap from '@/components/TableDokkap'
import AttachmentBucket from '@/components/AttachmentBucket'
import IpContents from '@/components/IpContents'
import LhpContents from '@/components/LhpContents'
import ViewDetailBarang from '@/views/ViewDetailBarang'

import axiosErrorHandler from '../mixins/axiosErrorHandler'
import docMethod from '../mixins/docMethod'

import { mapGetters, mapMutations } from 'vuex'

import defaultPibk from '../defaults/defaultPibk'

const cloneDeep = require('clone-deep')

export default {
    mixins: [
        axiosErrorHandler,
        docMethod
    ],

    components: {
        DocBanner,
        PibkContents,
        ViewDetailBarang,
        TableDokkap,
        AttachmentBucket,
        IpContents,
        LhpContents
    },

    data () {
        return {
            dataPibk: this.defaultData(),
            tabId: null
        }
    },

    computed: {
        // api and lokasi needed?
        ...mapGetters(['api']),

        // when to disable?
        disableInput() {
            return this.dataPibk.is_locked
        },

        // is new?
        isNew () {
            return this.id == 'new'
        }
    },

    methods: {
        ...mapMutations(['setBusyState']),

        defaultData () {
            return cloneDeep(defaultPibk)
        },

        loadPibkData(id) {
            if (id == 'new') {
                // init with default data
                this.dataPibk = this.defaultData()
                // set default airport to us
                this.dataPibk.kd_pelabuhan_tujuan = "IDCGK"

                return
            }

            // welp, call api then
            this.setBusyState(true)

            this.api.getPibkById(this.id)
            .then(e => {
                this.setBusyState(false)
                this.dataPibk = e.data.data
            })
            .catch(e => {
                this.setBusyState(false)
                this.handleError(e)

                // push to new if not found
                this.$router.push({
                    path: "/pibk/new"
                })
            })
        }
    },

    watch: {
        id: {
            immediate: true,
            handler (newVal) {
                this.loadPibkData(newVal)
            }
        }
    }
}
</script>