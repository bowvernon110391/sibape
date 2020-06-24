<template>
  <div>
    <ip-controls size="sm" uri="/cd/23/ip" />
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

import IpControls from '@/components/IpControls'

const fileDownload = require("js-file-download");

export default {
  mixins: [axiosErrorHandler],

  components: {
    SelectPemeriksa,
    IpControls
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