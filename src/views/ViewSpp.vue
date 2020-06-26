<template>
  <div v-if="dataSpp.cd">
    <b-card no-body class="rounded shadow">
      <!-- HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <!-- Title banner at the top -->
          <doc-banner doctype="SPP" :data="dataSpp" :is-new="isNew" />

          <!-- show controls if it's not a new one -->
          <template v-if="!hideControls && !isNew && !readOnly">
            <!-- tombol controls -->
            <spp-controls :data="dataSpp" ref="tombolPenyelesaian" @printSpp="printSpp">
              <!-- IP Controls -->
              <ip-controls
                :disabled="docHasLink(dataSpp, 'pibk') || lhpIsLocked(dataSpp)"
                :uri="`/spp/${dataSpp.id}/ip`"
                :data="dataSpp.instruksi_pemeriksaan ? dataSpp.instruksi_pemeriksaan.data : null"
                @submit="loadSppData(dataSpp.id)"
              />
            </spp-controls>
          </template>
        </div>
      </b-card-header>

      <!-- Tabs -->
      <b-tabs card lazy v-model="tabId">
        <!-- Header -->
        <b-tab title="Header" active>
          <spp-contents :data="dataSpp" :disabled="disableInput" :is-new="isNew" />
        </b-tab>

        <!-- Barang baca dari cd -->
        <b-tab title="Barang" v-if="!isNew">
          <view-cd-details
            :cd-id="dataSpp.cd.data.id"
            :disabled="disableInput"
            hide-satuan
            hide-netto
          ></view-cd-details>
        </b-tab>

        <!-- Instruksi Pemeriksaan (KLO ADA) -->
        <b-tab v-if="dataSpp.instruksi_pemeriksaan && !hideIp" title="Instruksi Pemeriksaan">
          <b-row>
            <b-col md="6">
              <ip-contents :value="dataSpp.instruksi_pemeriksaan.data" disabled />
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>

      <!-- FOOTER (only if needed) -->
      <b-card-footer v-if="tabId == 0">
        <div>
          <b-button variant="primary" :disabled="disableInput" @click="onSave">
            <font-awesome-icon icon="save" />Simpan
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

// components
import { mapMutations, mapGetters } from "vuex";
import ViewCdDetails from "@/views/ViewCdDetails";

// utk menampilkan pdf
import ModalViewPdf from "@/components/ModalViewPdf";

// banner
import DocBanner from "@/components/DocBanner";

// controls
import SppControls from "@/components/SppControls";

// contents
import SppContents from "@/components/SppContents";

// Ip related
import IpControls from "@/components/IpControls";
import IpContents from "@/components/IpContents";

// the default cd header
import defaultSpp from "@/defaults/defaultSpp";

// for deep copy
const cloneDeep = require("clone-deep");

export default {
  mixins: [axiosErrorHandler, userChecker, docMethod],
  components: {
    ViewCdDetails,
    ModalViewPdf,
    DocBanner,
    SppControls,
    SppContents,
    IpControls,
    IpContents
  },
  data() {
    return {
      dataSpp: this.defaultData(),

      // for printing
      viewPrintDialog: false,
      pdfUrl: null,
      altFilename: "SPP",

      // tab id
      tabId: 0
    };
  },
  computed: {
    // pick api and lokasi from our store
    ...mapGetters(["api", "lokasi"]),

    // when to disable input?
    disableInput() {
      // only disable input if user can't edit
      // and the doc is locked
      return (!this.canEdit && this.dataSpp.is_locked) || this.readOnly;
    },

    // check if this is a new data
    isNew() {
      return this.id == "new";
    }
  },
  props: {
    id: [Number, String],

    hideControls: {
      type: Boolean,
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    },

    hideIp: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations(["setBusyState"]),
    defaultData: function() {
      return cloneDeep({
        ...defaultSpp,
        lokasi: this.lokasi
      });
    },

    displayJumlah(value, event) {
      return this.$options.filters.formatCurrency(value);
    },

    loadSppData(id) {
      if (id == "new") {
        console.log("Input SPP Baru di sini!");
        // 1st, init with empty data
        this.dataSpp = this.defaultData();
        // 2nd,

        return;
      }
      //
      this.setBusyState(true);
      // api
      const vm = this;
      this.api
        .getSppById(id)
        .then(e => {
          vm.setBusyState(false);
          vm.dataSpp = e.data.data;
        })
        .catch(e => {
          vm.setBusyState(false);
          vm.handleError(e);

          // kalo gk ketemu, replace ke new
          vm.$router.push({
            path: "/spp"
          });
        });
    },

    // when save button clicked
    onSave() {},

    // when print button clicked
    printSpp() {
      // set data
      this.pdfUrl = this.api.generatePdfUrl("spp", this.id);
      this.viewPrintDialog = true;
      this.altFilename = `spp-${this.id}`;
    }
  },
  created() {
    // this.setBusyState(true)
    this.loadSppData(this.id);
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
        this.loadSppData(newVal);
      }
    }
  }
};
</script>

<style>
</style>