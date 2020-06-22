<template>
  <div>
    <b-card no-body class="rounded shadow">
      <!-- CARD HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <h4
            :class="[ 'd-inline-block', 'bg-primary', 'my-auto', 'text-light', 'p-2', 'shadow', 'border', 'border-dark', 'rounded']"
          >
            CD #2331
            <b-badge variant="light">
              <font-awesome-icon icon="lock-open"></font-awesome-icon>OPEN
            </b-badge>
          </h4>
          <!-- buttons? -->
          <div class="text-right flex-grow-1 my-auto" ref="btnGroupPenyelesaian">
            <b-button-group size="sm" class="shadow mt-2 mt-md-0">
              <!-- apabila dijadikan impor sementara -->
              <b-button variant="danger">
                <font-awesome-icon icon="plane-departure"></font-awesome-icon>Jaminkan (Impor Sementara)
              </b-button>

              <!-- titip (gk mampu/mau bayar) -->
              <b-button variant="dark">
                <font-awesome-icon icon="lock"></font-awesome-icon>Titipkan
              </b-button>

              <!-- tunda pengeluaran -->
              <b-button variant="warning">
                <font-awesome-icon icon="hand-paper"></font-awesome-icon>Tunda Pengeluaran
              </b-button>

              <!-- apabila dibayar (Terbit SPPBMCP) -->
              <b-button variant="success" :disabled="false">
                <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
                <template v-if="true">Lihat Pungutan</template>
                <template v-else>Bayar</template>
              </b-button>
            </b-button-group>

            <!-- tombol cetak -->
            <template v-if="true">
              <b-dropdown
                size="sm"
                split
                split-variant="dark"
                variant="dark"
                class="shadow mt-2 mt-md-0"
                right
              >
                <!-- text and icon for button -->
                <template v-slot:button-content>
                  <font-awesome-icon icon="print"></font-awesome-icon>Cetak
                </template>
                <!-- opsi yang selalu ada -->
                <b-dropdown-item>Bukti Bayar</b-dropdown-item>

                <!-- lembar perhitungan -->
                <b-dropdown-item>Lembar Perhitungan</b-dropdown-item>
                <!-- SSPCP -->
                <template v-if="1">
                  <b-dropdown-item>BPJ (jaminan)</b-dropdown-item>
                </template>
              </b-dropdown>
            </template>
          </div>
        </div>
      </b-card-header>

      <!-- CARD BODY -->
      <b-tabs card>
        <!-- first tab -->
        <b-tab title="Form" active>
          <!-- <b-card-text> -->
          <b-form class="position-relative" @submit.prevent="onSubmit">
            <b-row>
              <b-col md="6">
                <b-form-group label="Upload Excel Kurs">
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      <font-awesome-icon icon="trash-alt" />
                    </b-input-group-prepend>
                    <b-form-file v-model="excelFile" :disabled="busy" accept=".xlsx, .xls"></b-form-file>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="6">
                <b-button type="submit" variant="primary" class="shadow mr-2" :disabled="busy">Parse</b-button>
                <b-button
                  variant="danger"
                  class="shadow mr-2"
                  :disabled="busy"
                  @click="excelData = null"
                >Clear Data</b-button>
                <b-button
                  variant="warning"
                  class="shadow mr-2"
                  :disabled="busy"
                  @click="redirect"
                >Redirect</b-button>
                <b-button
                  variant="info"
                  class="shadow"
                  :disabled="downloading"
                  @click="downloadKurs"
                >
                  Download Kurs
                  <b-spinner variant="light" small v-if="downloading" />
                </b-button>
              </b-col>
            </b-row>

            <!-- The overlay -->
            <b-overlay no-wrap :show="busy" variant="dark" opacity="0.5" rounded="lg">
              <template #overlay>
                <!-- yes/no dialog -->
                <div v-if="!processing" ref="dialog" tabindex="-1" class="text-center p-4">
                  <p>
                    <strong id="form-confirm-label">Are you sure?</strong>
                  </p>
                  <div class="d-flex">
                    <b-button variant="danger" class="mr-3" @click="busy = false">Nope</b-button>
                    <b-button variant="success" @click="onProcess">Yep</b-button>
                  </div>
                </div>
                <!-- Progress bar -->
                <div v-else class="text-center p-4 bg-primary text-light rounded shadow">
                  <h1 style="font-size: 4em;">
                    <font-awesome-icon icon="cloud-download-alt" />
                  </h1>
                  <div class="mb-3">Uploading...</div>
                  <b-progress
                    striped
                    animated
                    min="0"
                    max="100"
                    :value="uploaded"
                    variant="danger"
                    height="4px"
                    class="mx-n4 rounded-0 shadow"
                  />
                </div>
              </template>
            </b-overlay>
          </b-form>
          <!-- </b-card-text> -->
        </b-tab>
        <!-- Second tab? -->
        <b-tab title="Data">
          <!-- <b-card-text> -->
          <div v-if="excelData">
            <h5>Parsed Data</h5>
            <b-table
              responsive
              small
              hover
              head-variant="dark"
              bordered
              striped
              :items="excelData"
              class="rounded shadow"
            ></b-table>
          </div>
          <div v-else class="text-center">
            <b-alert
              variant="danger"
              title="No Data"
              show
            >No data loaded. Might wanna try parse some excel from the form tab?</b-alert>
          </div>
          <!-- </b-card-text> -->
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

const fileDownload = require("js-file-download");

export default {
  mixins: [axiosErrorHandler],

  components: {
    SelectPemeriksa
  },

  data() {
    return {
      pemeriksa_id: 296,
      processing: false,
      busy: false,
      uploaded: 0,
      excelFile: null,
      excelData: null,
      downloading: false
    };
  },

  computed: {
    ...mapGetters(["api"]),

    currentRoute() {
      console.log(this.$route);
      const m = this.$route.query;
      return JSON.stringify(m, null, 4);
    }
  },

  methods: {
    onSubmit() {
      this.busy = true;
      this.processing = false;
    },

    onProgress(e) {
      this.uploaded = Math.round((e.loaded / e.total) * 100);
    },

    onProcess() {
      if (!this.excelFile) {
        this.processing = this.busy = false;
        return;
      }

      this.processing = true;
      this.uploaded = 0;

      // make a new file reader?
      this.api
        .attachRawFileToUri("/excel/kurs", this.excelFile, this.onProgress)
        .then(e => {
          this.processing = this.busy = false;
          this.showToast(
            "Upload successfull!",
            "Excel file uploaded. Data is shown below",
            "success"
          );
          console.log(e.data);
          this.excelData = e.data.data;
        })
        .catch(e => {
          this.processing = this.busy = false;
          this.handleError(e);
        });
    },

    redirect() {
      this.$router.push({
        path: `/test?q=someshit`
      });
    },

    downloadKurs() {
      // this.busy = true
      this.downloading = true;

      var vm = this;

      this.api
        .downloadUri("/excel/kurs")
        .then(e => {
          console.log(e);
          var contentDisposition = e.headers["content-disposition"];
          var filename = contentDisposition.match(/filename=(.+);?$/i)[1];
          // alert("Downloaded!! (" + filename + ")")
          // this.busy = false
          console.log("raw: ");
          console.log(e.data);

          fileDownload(new Blob([e.data]), filename);
          this.downloading = false;
        })
        .catch(e => {
          // alert("Error bitch")
          console.log(e.response);
          vm.handleError(e);
          this.downloading = false;
          // this.busy = false
        });
    }
  }
};
</script>