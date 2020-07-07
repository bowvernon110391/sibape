<template>
  <div>
    <page-perhitungan-cd :data="data_perhitungan" />
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";
import { mapGetters } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";

import IpControls from "@/components/IpControls";

import LhpContents from "@/components/LhpContents";

import SelectJenisDokkap from "@/components/SelectJenisDokkap";

import SelectJenisPungutan from "@/components/SelectJenisPungutan";

import PagePerhitunganCd from "@/components/PagePerhitunganCd";

const fileDownload = require("js-file-download");

export default {
  mixins: [axiosErrorHandler],

  components: {
    SelectJenisDokkap,
    SelectPemeriksa,
    IpControls,
    LhpContents,
    SelectJenisPungutan,
    PagePerhitunganCd
  },

  data() {
    return {
      data_perhitungan: {
        pembebasan: 500,
        ndpbm: 14253,
        nilai_pembebasan_idr: 7126500,
        nilai_dasar_idr: 1738879.3583549988,
        nilai_impor: 1912879.3583549988,
        tarif_bm: 10,
        tarif_pph: 7.5,
        pungutan: {
          bm: 174000,
          ppn: 192000,
          pph: 144000
        },
        total: 510000,
        barang: [
          {
            uraian:
              "In veniam non omnis ut.\n20.20 KG\n------------------\nMAC ADDRESS : Blanditiis dignissimos numquam cumque dolor.\n",
            jumlah_jenis_kemasan: "14.00 PK",
            jumlah_jenis_satuan: " ",
            hs_code: "72202010",
            hs_raw_code: "7220.20.10",
            fob: 552.2087,
            insurance: 56.1025,
            freight: 24.8249,
            cif: 633.1360999999999,
            nilai_pabean: 6480496.208354999,
            valuta: "SGD",
            ndpbm: 10235.55
          },
          {
            uraian: "Snake Venom\n5.00 KG",
            jumlah_jenis_kemasan: "2.00 BX",
            jumlah_jenis_satuan: " ",
            hs_code: "02109990",
            hs_raw_code: "0210.99.90",
            fob: 233,
            insurance: 0,
            freight: 0,
            cif: 233,
            nilai_pabean: 2384883.15,
            valuta: "SGD",
            ndpbm: 10235.55
          }
        ]
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