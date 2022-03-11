<template>
  <div>
    <b-card no-body class="rounded shadow">
      <!-- HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <!-- Title at the top, showing lock status too -->
          <doc-banner doctype="CD" :data="dataCd" :is-new="isNew" v-if="!hideBanner" />
          <template v-if="!hideControls && !isNew && !readOnly">
            <div
              class="d-inline-block d-md-none"
              style="height:1px"
              v-b-visible.once="breakpointChange"
            >
            </div>
            <!-- <pre>{{ isXs }}</pre> -->
            <!-- Tombol Penyelesaian? -->
            <cd-controls
              :data="dataCd"
              ref="tombolPenyelesaian"
              @showPenitipan="showPenitipan"
              @showPenundaan="showPenundaan"
              @showPungutan="showPungutan"
              @printBppm="printBppm"
              @printLembarHitungCd="printLembarHitungCd"
              @printSppb="printSppb"
              :vertical="isXs"
            />
          </template>
        </div>

        <!-- IP Controls -->
        <div class="mt-n2 mt-md-n3 text-right" v-if="!readOnly">
          <ip-controls
            :disabled="disableInput || lhpIsLocked(dataCd)"
            :uri="`/cd/${dataCd.id}/ip`"
            :data="dataCd.instruksi_pemeriksaan ? dataCd.instruksi_pemeriksaan.data : null"
            @submit="loadCdData(dataCd.id)"
            class="d-inline-block my-2"
          />

          <!-- Payment controls (only if penetapan is done)-->
          <payment-controls v-if="dataCd.is_locked"
            :disabled="isPaid(dataCd)"
            class="d-inline-block my-2"

            @createBppm="createBppm"
            @createBilling="viewBilling = true"
          />

          <!-- terbitkan SPPB -->
          <b-button
            size="sm"
            class="shadow my-2"
            variant="primary"
            v-if="isPaid(dataCd)"
            :disabled="Boolean(dataCd.sppb)"
            @click="createSppb"
            >
            <font-awesome-icon icon="check-circle"/>
            Terbitkan SPPB
          </b-button>
        </div>
      </b-card-header>

      <!-- Header tab -->
      <b-tabs card lazy v-model="tabId">
        <b-tab title="Header" active>
          <cd-contents :data="dataCd" :disabled="disableInput" />
        </b-tab>

        <!-- If this is not a new document, show additional tabs -->
        <template v-if="!isNew">
          <!-- Detail Barang -->
          <b-tab title="Barang">
            <!-- <view-cd-details :cd-id="id" :disabled="disableInput" hide-satuan hide-netto></view-cd-details> -->
            <view-detail-barang :show-pembebasan="dataCd.pembebasan > 0" :uri="`/cd/${id}/details`" :store-uri="`/cd/${id}/penetapan`" :disabled="disableInput" />
          </b-tab>

          <!-- Dokkap -->
          <b-tab title="Dokkap">
            <table-dokkap v-model="dataCd.dokkap.data" :disabled="disableInput"/>
            <!-- <pre>{{ JSON.stringify(dataCd.dokkap.data, null, 2) }}</pre> -->
          </b-tab>

          <!-- Lampiran -->
          <b-tab title="Lampiran">
            <attachment-bucket show :disabled="disableInput" :endpoint="endpoint" />
          </b-tab>

          <!-- Status -->
          <b-tab title="Status">
            <status-timeline :data="dataCd.status.data"/>
          </b-tab>

          <!-- Instruksi Pemeriksaan (KLO ADA) -->
          <b-tab v-if="dataCd.instruksi_pemeriksaan && !hideIp" title="Instruksi Pemeriksaan">
            <b-row>
              <b-col md="6">
                <ip-contents :value="dataCd.instruksi_pemeriksaan.data" disabled />
              </b-col>
            </b-row>
          </b-tab>
        </template>

        <!-- LHP (KLO DH SIAP) -->
        <b-tab v-if="getLhp(dataCd, true)" title="LHP">
          <lhp-contents :value="getLhp(dataCd, true)" disabled />
          <hr />
          <attachment-bucket show disabled :endpoint="lhpAttachmentEndpoint(dataCd)" />
        </b-tab>
      </b-tabs>

      <!-- CARD'S FOOTER -->
      <b-card-footer footer-bg-variant="light" v-if="tabId == 0 || tabId == 2">
        <div>
          <b-button @click="onSave" class="shadow" variant="primary" :disabled="disableInput">
            <font-awesome-icon icon="save"></font-awesome-icon>
            Simpan
          </b-button>
        </div>
      </b-card-footer>
    </b-card>
    <!-- paginated utk data detail -->
    <template v-if="!isNew">
      <!-- modal view utk perhitungan -->
      <template v-if="!isNew">
        <!-- Tampilkan perhitungan -->
        <modal-view-perhitungan
          :uri="`/cd/${dataCd.id}`"
          size="xl"
          v-model="viewPungutan"
          :simulate="!dataCd.is_locked"
        ></modal-view-perhitungan>

        <!-- Tampilkan SPP -->
        <modal-view-spp
          :source-id="dataCd.id"
          :source-type="'cd'"

          size="xl"
          :simulate="!docHasLink(dataCd, 'spp')"
          v-model="viewSpp"
        ></modal-view-spp>

        <!-- Tampilkan dialog ST -->
        <modal-view-st
          :cd-id="dataCd.id"
          size="xl"
          :simulate="!docHasLink(dataCd, 'st')"
          v-model="viewSt"
        ></modal-view-st>
      </template>
    </template>
    <!-- <pre>{{ dataCd }}</pre> -->

    <!-- PRINT MODAL -->
    <modal-view-pdf v-model="viewPrintDialog" :url="pdfUrl" :alt-filename="altFilename"></modal-view-pdf>

    <!-- MODAL SELECT LOKASI (UTK SPPB) -->
    <!-- <modal-select-lokasi-timbun
      id="modal-select-lokasi-timbun"
      centered
      @select="createSppb"
    /> -->

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
// mixins
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import userChecker from "../mixins/userChecker";
import docMethod from "../mixins/docMethod";

// components
import { mapMutations, mapGetters } from "vuex";

import PaginatedBrowser from "@/components/PaginatedBrowser";
// import ViewCdDetails from "@/views/ViewCdDetails";
import ViewDetailBarang from '@/views/ViewDetailBarang';

import DocBanner from "@/components/DocBanner";
import CdControls from "@/components/CdControls";
import CdContents from "@/components/CdContents";

import IpControls from "@/components/IpControls";
import IpContents from "@/components/IpContents";

import PaymentControls from '@/components/PaymentControls'

// utk menampilkan pungutan
import ModalViewPerhitungan from "@/components/ModalViewPerhitungan";

// ndpbm (USD)
import SelectKurs from "@/components/SelectKurs";

// untuk menampilkan cetakan PDF
import ModalViewPdf from "@/components/ModalViewPdf";

// untuk menampilkan spp
import ModalViewSpp from "@/components/ModalViewSpp";

// untuk menampilkan st
import ModalViewSt from "@/components/ModalViewSt";

// untuk handle lampiran
import AttachmentBucket from "@/components/AttachmentBucket";

// the default cd header
import defaultCd from "@/defaults/defaultCd";

// import LHPView
// import ViewLhp from '@/views/ViewLhp'
import LhpContents from "@/components/LhpContents";

import TableDokkap from '@/components/TableDokkap';

// import ModalSelectLokasiTimbun from '@/components/ModalSelectLokasiTimbun'

import ModalDialogBilling from '@/components/ModalDialogBilling'

import StatusTimeline from '@/components/StatusTimeline'

// for deep copy
const cloneDeep = require("clone-deep");

export default {
  mixins: [axiosErrorHandler, userChecker, docMethod],
  components: {
    PaginatedBrowser,
    // ViewCdDetails,
    ViewDetailBarang,
    ModalViewPerhitungan,
    ModalViewPdf,
    ModalViewSpp,
    ModalViewSt,
    AttachmentBucket,
    DocBanner,
    CdControls,
    CdContents,
    IpControls,
    IpContents,
    // ViewLhp
    LhpContents,
    TableDokkap,
    PaymentControls,
    // ModalSelectLokasiTimbun,
    ModalDialogBilling,
    StatusTimeline
  },
  data() {
    return {
      dataCd: this.defaultData(),

      // pungutan data
      viewPungutan: false,

      // print data
      viewPrintDialog: false,
      pdfUrl: null,
      altFilename: "SSPCP",

      // SPP
      viewSpp: false,

      // ST
      viewSt: false,

      // Tab Id
      tabId: 0,

      viewBilling: false,

      isXs: false
    };
  },
  computed: {
    // pick api and lokasi from our store
    ...mapGetters(["api", "lokasi"]),

    // when to disable input?
    disableInput() {
      // only disable input if user can't edit
      // and the doc is locked
      return (!this.canEdit && this.dataCd.is_locked) || this.readOnly;
    },

    // check if this is a new data
    isNew() {
      return this.id == "new" || !this.dataCd.id;
    },

    // endpoint utk attachment
    endpoint() {
      return this.dataCd.id ? `/cd/${this.dataCd.id}/lampiran` : null;
    }
  },

  methods: {
    ...mapMutations(["setBusyState"]),
    loadCdDetails(q, spinner, vm) {
      if (this.id != "new") {
        var me = this;
        spinner(true);

        this.api
          .getCdDetails(this.id, q)
          .then(e => {
            spinner(false);
            vm.setData(e.data.data);
            vm.setTotal(e.data.meta.pagination.total);
          })
          .catch(e => {
            spinner(false);
            me.handleError(e);
          });
      }
    },
    defaultData: function() {
      return cloneDeep({
        ...defaultCd,
        lokasi: this.lokasi
      });
    },
    loadCdData(cdId) {
      if (cdId == "new") {
        console.log("Input CD Baru di sini!");
        // 1st, init with empty data
        this.dataCd = this.defaultData();
        // 2nd, set default airport?
        this.dataCd.kd_pelabuhan_tujuan = "IDCGK";

        return;
      }
      //
      this.setBusyState(true);
      // api
      const vm = this;
      this.api
        .getCdById(cdId)
        .then(e => {
          vm.setBusyState(false);
          vm.dataCd = e.data.data;
        })
        .catch(e => {
          vm.setBusyState(false);
          vm.handleError(e);

          // kalo gk ketemu, replace ke new
          vm.$router.push({
            path: "/cd/new"
          });
        });
    },

    // when save button clicked
    onSave() {
      this.setBusyState(true);
      const vm = this;
      // kalo id dataCd null, berarti buat baru
      if (!this.dataCd.id) {
        this.api
          .createCd(this.dataCd)
          .then(e => {
            vm.setBusyState(false);
            var newId = e.data.id;
            vm.showToast(
              "Data CD Tersimpan!",
              `Data Cd tersimpan dengan id #${newId}`,
              "success"
            );
            // re route
            this.$router.replace({
              name: "ViewCd",
              params: {
                id: newId
              }
            });
          })
          .catch(e => {
            vm.setBusyState(false);
            vm.handleError(e);
          });
      } else {
        // klo udh ada id, berarti simpan
        this.api
          .updateCd(this.id, this.dataCd)
          .then(e => {
            vm.setBusyState(false);
            vm.showToast(
              "Data CD terupdate!",
              `Berhasil mengupdate data CD #${vm.id}`,
              "success"
            );
            // reload biar sinkron?
            vm.loadCdData(vm.id);
          })
          .catch(e => {
            vm.setBusyState(false);
            vm.handleError(e);
          });
      }
    },

    // when the detail is changed, what do?
    // well, we reload the current paginated data
    onDetailChange(id) {
      // alert('Detail changed! -> #' + id)
      this.$refs.detailBrowser.loadData();
    },

    // tampilkan perhitungan
    showPungutan() {
      // tergantung status cd
      this.viewPungutan = true;
    },

    // show penundaan
    showPenundaan() {
      this.viewSpp = true;
    },

    // show st
    showPenitipan() {
      this.viewSt = true;
    },

    // print sspcp
    printBppm() {
      // let's set data
      this.pdfUrl = this.api.generatePdfUrl('bppm', this.dataCd.bppm.data.id);
      this.viewPrintDialog = true;
      this.altFilename = "bppm-" + this.dataCd.bppm.data.id;
    },

    // print lembar perhitungan cd
    printLembarHitungCd() {
      // simple, just generate pdfUrl manually
      this.pdfUrl = this.api.generatePdfUrl("lembarhitungcd", this.id);
      this.viewPrintDialog = true;
      this.altFilename = "lembarhitungcd-" + this.id;
    },

    // print sppb
    printSppb() {
      this.pdfUrl = this.api.generatePdfUrl("sppb", this.dataCd.sppb.data.id)
      this.viewPrintDialog = true
      this.altFilename = "sppb-" + this.dataCd.sppb.data.id
    },

    // create BPPM
    createBppm() {
      this.setBusyState(true)
      this.api.putEndpoint(`/cd/${this.dataCd.id}/bppm`, {
        lokasi: this.lokasi
      })
      .then(e => {
        this.setBusyState(false)
        // show toast, and reload data
        this.showToast('BPPM berhasil diterbitkan', `BPPM terbit dengan id #${e.data.id}`, 'success')
        this.$nextTick(() => {
          this.loadCdData(this.dataCd.id)
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
      this.api.putEndpoint(`/cd/${this.dataCd.id}/sppb`)
      .then(e => {
        this.setBusyState(false)
        this.showToast('SPPB', 'SPPB berhasil diterbitkan', 'success')
        this.$nextTick(() => {
          this.loadCdData(this.dataCd.id)
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    // input data billing
    createBilling(data) {
      console.log('billing data: ', data)
      this.setBusyState(true)
      // call api
      this.api.postEndpoint(`/cd/${this.dataCd.id}/billing`, data)
      .then(e => {
        this.setBusyState(false)
        this.showToast('Billing tersimpan', `Data Billing untuk CD #${this.dataCd.id} tersimpan`, 'success')
        this.$nextTick(() => {
          this.loadCdData(this.dataCd.id)
        })
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    // change breakpoint
    breakpointChange(v) {
      this.isXs = v
    }
  },
  created() {
    // this.setBusyState(true)
    this.loadCdData(this.id);
  },
  mounted() {
    // this.setBusyState(false)
    // // console.log(this.$route);
    // console.log('Data CD:')
    // console.log(this.dataCd)
    // console.log(this.id)
    // console.log(Number(this.id))
  },
  watch: {
    id: {
      immediate: false,
      handler(newVal) {
        this.loadCdData(newVal);
      }
    },

    viewPungutan(newVal, oldVal) {
      if (!newVal) {
        // alert("Closing view pungutan, reload pls")
        this.loadCdData(this.id);
      }
    }
  }
};
</script>

<style>
.perhitungan {
  position: relative;
}

.perhitungan::after {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 1.2em;
  content: "Rp.";
}
</style>
