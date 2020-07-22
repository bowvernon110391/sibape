<template>
  <div v-if="dataSt.cd">
    <b-card no-body class="rounded shadow">
      <!-- HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <!-- BANNER -->
          <doc-banner doctype="ST" :data="dataSt" :is-new="isNew" />

          <!-- CONTROLS -->
          <template v-if="!hideControls && !isNew && !readOnly">
            <!-- ST CONTROLS HERE -->
            <st-controls :data="dataSt" ref="tombolPenyelesaian" @printSt="printSt" >
              <div class="d-inline-block my-2">
              <!-- IP Controls -->
              <ip-controls
                :disabled="docHasLink(dataSt, 'pibk') || lhpIsLocked(dataSt)"
                :uri="`/st/${dataSt.id}/ip`"
                :data="dataSt.instruksi_pemeriksaan ? dataSt.instruksi_pemeriksaan.data : null"
                @submit="loadStData(dataSt.id)"
              />
              </div>
            </st-controls>
          </template>
        </div>
        <div class="text-right mt-md-n2 mt-xs-auto">
          
        </div>
      </b-card-header>

      <!-- BODY, USE TABS -->
      <b-tabs card lazy v-model="tabId">
        <!-- Header -->
        <b-tab title="Header" active>
          <st-contents :data="dataSt" :disabled="disableInput" :is-new="isNew" />
        </b-tab>

        <!-- Barang dari cd -->
        <b-tab title="Barang" v-if="!isNew">
          <view-detail-barang 
            :uri="`/cd/${dataSt.cd.data.id}/details`" 
            :store-uri="`/cd/${dataSt.cd.data.id}/penetapan`" 
            disabled
            />
        </b-tab>

        <!-- Instruksi Pemeriksaan (KLO ADA) -->
        <b-tab v-if="dataSt.instruksi_pemeriksaan && !hideIp" title="Instruksi Pemeriksaan">
          <b-row>
            <b-col md="6">
              <ip-contents :value="dataSt.instruksi_pemeriksaan.data" disabled />
            </b-col>
          </b-row>
        </b-tab>

        <!-- LHP (KLO DH SIAP) -->
        <b-tab v-if="getLhp(dataSt, true)" title="LHP">
          <lhp-contents :value="getLhp(dataSt, true)" disabled />
          <hr />
          <attachment-bucket show disabled :endpoint="lhpAttachmentEndpoint(dataSt)" />
        </b-tab>
      </b-tabs>

      <!-- FOOTER (only if needed) -->
      <b-card-footer v-if="tabId == 0">
        <div>
          <b-button variant="primary" :disabled="disableInput" @click="onSave">
            <font-awesome-icon icon="save" /> Simpan
          </b-button>
        </div>
      </b-card-footer>
    </b-card>

    <!-- PRINT MODAL -->
    <modal-view-pdf v-model="viewPrintDialog" :url="pdfUrl" :alt-filename="altFilename"></modal-view-pdf>
  </div>
</template>

<script>
// mixins
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import userChecker from "../mixins/userChecker";
import docMethod from '../mixins/docMethod';

import { mapMutations, mapGetters } from "vuex";
import ViewCdDetails from "@/views/ViewCdDetails";
import ViewDetailBarang from '@/views/ViewDetailBarang';

import DocBanner from "@/components/DocBanner";

import StControls from "@/components/StControls";
import StContents from "@/components/StContents";

// Ip related
import IpControls from "@/components/IpControls";
import IpContents from "@/components/IpContents";

// utk menampilkan pdf
import ModalViewPdf from "@/components/ModalViewPdf";

import AttachmentBucket from '@/components/AttachmentBucket'

// the default cd header
// import defaultSpp from './defaultSpp.json'
import defaultSt from "@/defaults/defaultSt";

import LhpContents from "@/components/LhpContents";

// for deep copy
const cloneDeep = require("clone-deep");

export default {
  mixins: [axiosErrorHandler, userChecker, docMethod],
  components: {
    ViewCdDetails,
    ModalViewPdf,
    DocBanner,
    StControls,
    StContents,
    IpControls,
    IpContents,
    LhpContents,
    AttachmentBucket,
    ViewDetailBarang
  },
  data() {
    return {
      dataSt: this.defaultData(),

      // for printing
      viewPrintDialog: false,
      pdfUrl: null,
      altFilename: "ST",

      // tabId
      tabId: 0
    };
  },
  computed: {
    // pick api and lokasi from our store
    ...mapGetters(["api", "lokasi", 'safeMode']),

    // when to disable input?
    disableInput() {
      // only disable input if user can't edit
      // and the doc is locked
      return (!this.canEdit && this.dataSt.is_locked) || this.readOnly;
    },

    // check if this is a new data
    isNew() {
      return this.id == "new";
    }
  },
  
  methods: {
    ...mapMutations(["setBusyState"]),
    defaultData: function() {
      return cloneDeep({
        ...defaultSt,
        lokasi: this.lokasi
      });
    },

    displayJumlah(value, event) {
      return this.$options.filters.formatCurrency(value);
    },

    loadStData(id) {
      if (id == "new") {
        console.log("Input SPP Baru di sini!");
        // 1st, init with empty data
        this.dataSt = this.defaultData();
        // 2nd,

        return;
      }
      //
      this.setBusyState(true);
      // api
      const vm = this;
      this.api
        .getStById(id)
        .then(e => {
          vm.setBusyState(false);
          vm.dataSt = e.data.data;
        })
        .catch(e => {
          vm.setBusyState(false);
          vm.handleError(e);

          // kalo gk ketemu, replace ke new
          vm.$router.push({
            path: "/st"
          });
        });
    },

    // when save button clicked
    onSave() {},

    // when print button clicked
    printSt() {
      // set data
      this.pdfUrl = this.api.generatePdfUrl("st", this.id);
      this.viewPrintDialog = true;
      this.altFilename = `st-${this.id}`;
    },

    // check if cd has some related documents
    stHasLink: function(rel) {
      if (this.dataSt.links) {
        // check by filtering it
        return this.dataSt.links.filter(e => e.rel == rel).length > 0;
      }
      return false;
    },

    // grab link detail
    stGetLinkDetails: function(rel) {
      if (this.dataSt.links) {
        var filtered = this.dataSt.links.filter(e => e.rel == rel);

        if (filtered.length) {
          var link = filtered[0];
          return {
            doctype: link.rel,
            id: link.uri.match(/^\/.+\/(\d+)$/i)[1]
          };
        }
      }
      return false;
    }
  },
  created() {
    // this.setBusyState(true)
    this.loadStData(this.id);
  },
  mounted() {
    // this.setBusyState(false)
    // // console.log(this.$route);
    // console.log('Data CD:')
    // console.log(this.id)
    // console.log(Number(this.id))
  },
  watch: {
    id: {
      immediate: false,
      handler(newVal) {
        this.loadStData(newVal);
      }
    }
  }
};
</script>

<style>
</style>