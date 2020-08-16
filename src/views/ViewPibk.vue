<template>
  <div>
    <b-card no-body class="rounded shadow">
      <!-- HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <!-- Banner at the top -->
          <doc-banner doctype="PIBK" :data="dataPibk" :is-new="isNew" />
          <!-- document controls -->
          <template v-if="!hideControls && !isNew && !readOnly">
            <pibk-controls 
                :data="dataPibk" 
                ref="tombolPenyelesaian" 
                @showPungutan="showPungutan" 

                @printBppm="printBppm"
                @printSppb="printSppb"
                @printLembarHitungPibk="printLembarHitungPibk"

                @view-source="$router.push(`${dataPibk.source_uri}`)"
            />
          </template>
        </div>

        <!-- IP Controls -->
        <div class="mt-n2 mt-md-n3 text-right" v-if="!readOnly && !isNew">
          <ip-controls
            :disabled="disableInput || lhpIsLocked(dataPibk)"
            :uri="`/pibk/${dataPibk.id}/ip`"
            :data="dataPibk.instruksi_pemeriksaan ? dataPibk.instruksi_pemeriksaan.data : null"
            @submit="loadPibkData(dataPibk.id)"
            class="d-inline-block my-2"
          />

          <!-- Payment controls (only if penetapan is done)-->
          <payment-controls
            v-if="dataPibk.is_locked"
            :disabled="isPaid(dataPibk)"
            class="d-inline-block my-2"
            @createBppm="createBppm"
            @createBilling="viewBilling = true"
          />

          <!-- terbitkan SPPB -->
          <b-button 
            size="sm"
            class="shadow my-2"
            variant="primary"
            v-if="isPaid(dataPibk)"
            :disabled="Boolean(dataPibk.sppb)"
            @click="createSppb"
            >
            <font-awesome-icon icon="check-circle"/>
            Terbitkan SPPB
          </b-button>
        </div>
      </b-card-header>

      <!-- BODY -->
      <b-tabs card lazy v-model="tabId">
        <!-- Header -->
        <b-tab title="Header" active>
          <pibk-contents :data="dataPibk" :disabled="disableInput" />
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
            <attachment-bucket show :disabled="disableInput" :endpoint="`/pibk/${id}/lampiran`" />
          </b-tab>

          <!-- status -->
          <b-tab title="Status">
            <status-timeline :data="dataPibk.status.data"/>
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
            <hr />
            <attachment-bucket show disabled :endpoint="lhpAttachmentEndpoint(dataPibk)" />
          </b-tab>
        </template>
      </b-tabs>

      <!-- FOOTER -->
      <b-card-footer footer-bg-variant="light" v-if="tabId == 0 || tabId == 2">
        <div>
          <b-button class="shadow" variant="primary" :disabled="disableInput" @click="onSave">
            <font-awesome-icon icon="save" />Simpan
          </b-button>
        </div>
      </b-card-footer>
    </b-card>

    <!-- apa2 yg ada klo pibk bukan input baru -->
    <template v-if="!isNew">
      <!-- modal view perhitungan -->
      <modal-view-perhitungan
        :uri="`/pibk/${dataPibk.id}`"
        size="xl"
        v-model="viewPungutan"
        :simulate="!dataPibk.is_locked"
      />
    </template>

    <!-- PRINT MODAL -->
    <modal-view-pdf
        v-model="viewPrintDialog"
        :url="pdfUrl"
        :alt-filename="altFilename"
    />

    <!-- Modal DIalog Billing -->
    <modal-dialog-billing
      id="modal-dialog-billing"
      centered
      @select="createBilling"
      v-model="viewBilling"
      size="sm"
    />
  </div>
</template>

<script>
import DocBanner from "@/components/DocBanner";
import PibkContents from "@/components/PibkContents";
import PibkControls from "@/components/PibkControls";
import TableDokkap from "@/components/TableDokkap";
import AttachmentBucket from "@/components/AttachmentBucket";
import IpControls from "@/components/IpControls";
import IpContents from "@/components/IpContents";
import LhpContents from "@/components/LhpContents";
import ViewDetailBarang from "@/views/ViewDetailBarang";

import PaymentControls from '@/components/PaymentControls'

// utk menampilkan pungutan
import ModalViewPerhitungan from "@/components/ModalViewPerhitungan";

// blling input
import ModalDialogBilling from '@/components/ModalDialogBilling'

// PRINT MODAL
import ModalViewPdf from '@/components/ModalViewPdf'

import StatusTimeline from '@/components/StatusTimeline'

import axiosErrorHandler from "../mixins/axiosErrorHandler";
import docMethod from "../mixins/docMethod";
import userChecker from '../mixins/userChecker'

import { mapGetters, mapMutations } from "vuex";

import defaultPibk from "../defaults/defaultPibk";

const cloneDeep = require("clone-deep");

export default {
  mixins: [axiosErrorHandler, docMethod, userChecker],

  components: {
    DocBanner,
    PibkContents,
    ViewDetailBarang,
    TableDokkap,
    AttachmentBucket,
    IpContents,
    LhpContents,
    PibkControls,
    ModalViewPerhitungan,
    IpControls,
    ModalViewPdf,
    PaymentControls,
    ModalDialogBilling,
    StatusTimeline
  },

  data() {
    return {
      dataPibk: this.defaultData(),
      tabId: null,

      viewPungutan: false,

      viewPrintDialog: false,
      pdfUrl: null,
      altFilename: null,

      viewBilling: false
    };
  },

  computed: {
    // api and lokasi needed?
    ...mapGetters(["api"]),

    // when to disable?
    disableInput() {
      return (!this.canEdit && this.dataPibk.is_locked) || this.readOnly;
    },

    // is new?
    isNew() {
      return this.id == "new";
    },
  },

  methods: {
    ...mapMutations(["setBusyState"]),

    // returns default pibk data
    defaultData() {
      return cloneDeep(defaultPibk);
    },

    // load pibk data based on id
    loadPibkData(id) {
      if (id == "new") {
        // init with default data
        this.dataPibk = this.defaultData();
        // set default airport to us
        this.dataPibk.kd_pelabuhan_tujuan = "IDCGK";

        return;
      }

      // welp, call api then
      this.setBusyState(true);

      this.api
        .getPibkById(this.id)
        .then((e) => {
          this.setBusyState(false);
          this.dataPibk = e.data.data;
        })
        .catch((e) => {
          this.setBusyState(false);
          this.handleError(e);

          // push to new if not found
          this.$router.push({
            path: "/pibk/new",
          });
        });
    },

    // when save button clicked
    onSave() {
      console.log("data: ", this.dataPibk);

      // do it
      this.setBusyState(true);
      if (!this.dataPibk.id) {
        // id null, means create new
        this.api
          .storePibk(this.dataPibk)
          .then((e) => {
            this.setBusyState(false);
            // what to do next? reload
            this.showToast(
              "Data PIBK tersimpan!",
              `Data PIBK tersimpan dengan id #${e.data.id}`,
              "success"
            );
            // re route
            this.$router.replace({
              name: "ViewPibk",
              params: {
                id: e.data.id,
              },
            });
          })
          .catch((e) => {
            this.setBusyState(false);
            this.handleError(e);
          });
      } else {
        // id is set, means save it
        this.api
          .updatePibk(this.id, this.dataPibk)
          .then((e) => {
            this.setBusyState(false);
            this.showToast(
              "Data PIBK terupdate!",
              `Berhasil mengupdate data PIBK #${this.id}`,
              "success"
            );
            // reload
            this.loadPibkData(this.id);
          })
          .catch((e) => {
            this.setBusyState(false);
            this.handleError(e);
          });
      }
    },

    // show pungutan dialog
    showPungutan() {
      this.viewPungutan = true;
    },

    // print sspcp
    printBppm() {
      // let's set data
      this.pdfUrl = this.api.generatePdfUrl('bppm', this.dataPibk.bppm.data.id);
      this.viewPrintDialog = true;
      this.altFilename = "bppm-" + this.dataPibk.bppm.data.id;
    },

    // print lembar perhitungan PIBK
    printLembarHitungPibk() {
      // just generate url
      this.pdfUrl = this.api.generatePdfUrl("lembarhitungpibk",this.id)
      this.viewPrintDialog = true
      this.altFilename = "lembarhitungpibk-" + this.id;
    },

    // print sppb
    printSppb() {
      this.pdfUrl = this.api.generatePdfUrl("sppb", this.dataPibk.sppb.data.id)
      this.viewPrintDialog = true
      this.altFilename = "sppb-" + this.dataPibk.sppb.data.id
    },

    // create BPPM
    createBppm() {
      this.setBusyState(true);
      this.api
        .putEndpoint(`/pibk/${this.dataPibk.id}/bppm`, {
          lokasi: this.lokasi,
        })
        .then((e) => {
          this.setBusyState(false);
          // show toast, and reload data
          this.showToast(
            "BPPM berhasil diterbitkan",
            `BPPM terbit dengan id #${e.data.id}`,
            "success"
          );
          this.$nextTick(() => {
            this.loadPibkData(this.dataPibk.id);
          });
        })
        .catch((e) => {
          this.setBusyState(false);
          this.handleError(e);
        });
    },

    // input data billing
    createBilling(data) {
      console.log('billing data: ', data)
      this.setBusyState(true)
      // call api
      this.api.postEndpoint(`/pibk/${this.dataPibk.id}/billing`, data)
      .then(e => {
        this.setBusyState(false)
        this.showToast('Billing tersimpan', `Data Billing untuk PIBK #${this.dataPibk.id} tersimpan`, 'success')
        this.$nextTick(() => {
          this.loadPibkData(this.dataPibk.id)
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    // create SPPB
    createSppb() {
      this.setBusyState(true)

      // call api
      this.api.putEndpoint(`/pibk/${this.dataPibk.id}/sppb`)
      .then(e => {
        this.setBusyState(false)
        this.showToast('SPPB', 'SPPB berhasil diterbitkan', 'success')
        this.$nextTick(() => {
          this.loadPibkData(this.dataPibk.id)
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },
  },

  watch: {
    id: {
      immediate: true,
      handler(newVal) {
        this.loadPibkData(newVal);
      },
    },

    viewPungutan(newVal, oldVal) {
      if (!newVal) {
        // alert("Closing view pungutan, reload pls")
        this.loadPibkData(this.id);
      }
    }
  }
};
</script>