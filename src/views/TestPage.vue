<template>
  <div>
    <lhp-contents v-model="lhpData" disabled />
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

import IpControls from "@/components/IpControls";

import LhpContents from "@/components/LhpContents";

const fileDownload = require("js-file-download");

export default {
  mixins: [axiosErrorHandler],

  components: {
    SelectPemeriksa,
    IpControls,
    LhpContents
  },

  data() {
    return {
      pemeriksa_id: 296,
      processing: false,
      busy: false,
      uploaded: 0,
      excelFile: null,
      excelData: null,
      downloading: false,

      lhpData: {
        id: 5,
        no_dok: 7,
        tgl_dok: "2020-06-25",
        nomor_lengkap: "LHP-000007/SH/2020",
        isi: "asdasdasdasa adasdasdasdas",
        pemeriksa_id: 612,
        pemeriksa: {
          nama: "Tri Mulyadi Wibowo",
          nip: "199103112012101001"
        },
        lokasi: "T2F",
        instructable_uri: "/cd/25",
        last_status: {
          status: "CLOSED",
          created_at: "2020-06-25 14:46:14"
        },
        is_locked: true,
        created_at: "2020-06-25 14:24:00",
        updated_at: "2020-06-25 14:45:28",
        lampiran: {
          data: []
        },
        status: {
          data: [
            {
              id: 68,
              status: "CLOSED",
              created_at: "2020-06-25 14:46:14"
            },
            {
              id: 66,
              status: "CREATED",
              created_at: "2020-06-25 14:24:00",
              detail: {
                data: {
                  id: 20,
                  keterangan: "mulai diperiksa oleh tri.mulyadi",
                  other_data: null,
                  created_at: "2020-06-25 14:24:00",
                  updated_at: "2020-06-25 14:24:00"
                }
              }
            }
          ]
        }
      }
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