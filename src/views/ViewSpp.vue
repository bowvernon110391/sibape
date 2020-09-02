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
            <spp-controls 
              :data="dataSpp" 
              ref="tombolPenyelesaian" 
              @printSpp="printSpp" 
              @view-pibk="$router.push(`/pibk/${dataSpp.pibk.data.id}`)"
              @create-pibk="viewCreatePibkDialog = true"
              @restore-cd="onRestoreCd"
            >
              <div class="d-inline-block my-2">
              <!-- IP Controls -->
              <ip-controls
                :disabled="docHasLink(dataSpp, 'pibk') || lhpIsLocked(dataSpp)"
                :uri="`/spp/${dataSpp.id}/ip`"
                :data="dataSpp.instruksi_pemeriksaan ? dataSpp.instruksi_pemeriksaan.data : null"
                @submit="loadSppData(dataSpp.id)"
              />
              </div>
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
          <view-detail-barang 
            :uri="`/cd/${dataSpp.cd.data.id}/details`" 
            :store-uri="`/cd/${dataSpp.cd.data.id}/penetapan`" 
            disabled
            />
        </b-tab>

        <!-- status -->
        <b-tab title="Status">
          <status-timeline :data="dataSpp.status.data"/>
        </b-tab>

        <!-- Instruksi Pemeriksaan (KLO ADA) -->
        <b-tab v-if="dataSpp.instruksi_pemeriksaan && !hideIp" title="Instruksi Pemeriksaan">
          <b-row>
            <b-col md="6">
              <ip-contents :value="dataSpp.instruksi_pemeriksaan.data" disabled />
            </b-col>
          </b-row>
        </b-tab>

        <!-- LHP (KLO DH SIAP) -->
        <b-tab v-if="getLhp(dataSpp, true)" title="LHP">
          <lhp-contents :value="getLhp(dataSpp, true)" disabled />
          <hr />
          <attachment-bucket show disabled :endpoint="lhpAttachmentEndpoint(dataSpp)" />
        </b-tab>
      </b-tabs>

      <!-- FOOTER (only if needed) -->
      <b-card-footer v-if="tabId == 0">
        <div>
          <b-button variant="primary" :disabled="disableInput" @click="onSave">
            <font-awesome-icon icon="save"/>
            Simpan
          </b-button>
        </div>
      </b-card-footer>
    </b-card>

    <!-- PRINT MODAL -->
    <modal-view-pdf v-model="viewPrintDialog" :url="pdfUrl" :alt-filename="altFilename"></modal-view-pdf>

    <!-- CREATE PIBK DIALOG -->
    <modal-dialog-create-pibk
      size="xl"
      centered
      v-model="viewCreatePibkDialog"
      @submit="onCreatePibk"
    />
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
import ViewDetailBarang from "@/views/ViewDetailBarang";
import StatusTimeline from '@/components/StatusTimeline'

// utk menampilkan pdf
import ModalViewPdf from "@/components/ModalViewPdf";

// utk nerbitin PIBK
import ModalDialogCreatePibk from '@/components/ModalDialogCreatePibk'

// banner
import DocBanner from "@/components/DocBanner";

// controls
import SppControls from "@/components/SppControls";

// contents
import SppContents from "@/components/SppContents";

// Ip related
import IpControls from "@/components/IpControls";
import IpContents from "@/components/IpContents";

import AttachmentBucket from '@/components/AttachmentBucket'
import LhpContents from "@/components/LhpContents";

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
    IpContents,
    AttachmentBucket,
    LhpContents,
    ViewDetailBarang,
    StatusTimeline,
    ModalDialogCreatePibk
  },
  data() {
    return {
      dataSpp: this.defaultData(),

      // for printing
      viewPrintDialog: false,
      pdfUrl: null,
      altFilename: "SPP",

      // tab id
      tabId: 0,

      viewCreatePibkDialog: false
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

    // when restore cd clicked
    async onRestoreCd() {
      var result = await this.$bvModal.msgBoxConfirm(
          `Selesaikan dengan Customs Declaration?`, {
              title: `Restore data Customs Declaration`,
              size: 'md',
              buttonSize: 'md',
              okVariant: 'danger',
              okTitle: 'YES',
              cancelTitle: 'NO',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true
          }
      )

      if (result) {
        // alert("Delete SPP + Redirect to CD");
        // spinner
        this.setBusyState(true)
        
        // delete spp then redirect to CD
        this.api.deleteSpp(this.dataSpp.id)
        .then(e => {
          
          this.setBusyState(false)
          // redirect @next tick
          this.$nextTick(() => {
            this.$router.replace(`/cd/${this.dataSpp.cd.data.id}`)
          })
          
        })
        .catch(e => {
          this.setBusyState(false)
          this.handleError(e)
        })
      }
    },

    // when save button clicked
    onSave() {},

    // when print button clicked
    printSpp() {
      // set data
      this.pdfUrl = this.api.generatePdfUrl("spp", this.id);
      this.viewPrintDialog = true;
      this.altFilename = `spp-${this.id}`;
    },

    // when creating pibk
    onCreatePibk(data) {
      console.log('data-create-pibk: ', data)

      this.setBusyState(true)
      // call it
      this.api.putEndpoint(`/spp/${this.dataSpp.id}/pibk`, data)
      .then(e => {
        this.setBusyState(false)
        // redirect to page and say something nice?
        this.showToast(
          'PIBK created',
          `Berhasil menerbitkan PIBK #${e.data.id} dari SPP #${this.dataSpp.id}`,
          'success'
        )
        this.$nextTick(() => {
          this.$router.push(e.data.uri)
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
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