<template>
  <div>
    <pre>{{ currentRoute }}</pre>
    <pre></pre>
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
          <b-button variant="warning" class="shadow" :disabled="busy" @click="redirect">Redirect</b-button>
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
    <div v-if="excelData">
      <hr />
      <h5>Parsed Data</h5>
      <b-table responsive small hover head-variant="dark" striped :items="excelData"></b-table>
    </div>
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

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
      excelData: null
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
    }
  }
};
</script>