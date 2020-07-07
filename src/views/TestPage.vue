<template>
  <div>
    <page-perhitungan-impor :data="data_perhitungan" />
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
import PagePerhitunganImpor from "@/components/PagePerhitunganImpor"

const fileDownload = require("js-file-download");

export default {
  mixins: [axiosErrorHandler],

  components: {
    SelectJenisDokkap,
    SelectPemeriksa,
    IpControls,
    LhpContents,
    SelectJenisPungutan,
    PagePerhitunganCd,
    PagePerhitunganImpor
  },

  data() {
    return {
      data_perhitungan: {
        barang: [
          {
            tarif: {
              BM: {
                tarif: 5,
                jenis: "ADVALORUM"
              },
              PPN: {
                tarif: 10
              },
              PPnBM: {
                tarif: 40,
                jenis: null,
                bayar: 100,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0
              },
              PPh: {
                tarif: 7.5
              },
              BMTP: {
                tarif: 15,
                jenis: "ADVALORUM",
                bayar: 100,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0
              }
            },
            pungutan: [
              {
                bayar: 5000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 2,
                jenis_pungutan: {
                  id: 2,
                  kode: "BM",
                  nama: "Bea Masuk",
                  kode_akun: "412111",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              },
              {
                bayar: 15000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 5,
                jenis_pungutan: {
                  id: 5,
                  kode: "BMTP",
                  nama: "Bea Masuk Tindakan Pengamanan",
                  kode_akun: "412123",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              },
              {
                bayar: 12000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 8,
                jenis_pungutan: {
                  id: 8,
                  kode: "PPN",
                  nama: "PPN Impor",
                  kode_akun: "411212",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              },
              {
                bayar: 48000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 9,
                jenis_pungutan: {
                  id: 9,
                  kode: "PPnBM",
                  nama: "PPnBM Impor",
                  kode_akun: "411222",
                  created_at: "2020-07-07 17:40:53",
                  updated_at: "2020-07-07 17:40:53"
                }
              },
              {
                bayar: 9000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 7,
                jenis_pungutan: {
                  id: 7,
                  kode: "PPh",
                  nama: "PPh Impor",
                  kode_akun: "411123",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              }
            ],
            uraian: "Est.\n22.81 KG",
            jumlah_jenis_kemasan: "17.00 PK",
            jumlah_jenis_satuan: " ",
            hs_code: "25174900",
            hs_raw_code: "2517.49.00",
            fob: 539.2227,
            insurance: 92.5839,
            freight: 107.8013,
            cif: 739.6079,
            nilai_pabean: 98494.61949406,
            valuta: "JPY",
            ndpbm: 133.1714
          },
          {
            tarif: {
              BM: {
                tarif: 5,
                jenis: "ADVALORUM"
              },
              PPN: {
                tarif: 10
              },
              PPh: {
                tarif: 7.5
              }
            },
            pungutan: [
              {
                bayar: 5000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 2,
                jenis_pungutan: {
                  id: 2,
                  kode: "BM",
                  nama: "Bea Masuk",
                  kode_akun: "412111",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              },
              {
                bayar: 10000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 8,
                jenis_pungutan: {
                  id: 8,
                  kode: "PPN",
                  nama: "PPN Impor",
                  kode_akun: "411212",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              },
              {
                bayar: 8000,
                bebas: 0,
                tunda: 0,
                tanggung_pemerintah: 0,
                jenis_pungutan_id: 7,
                jenis_pungutan: {
                  id: 7,
                  kode: "PPh",
                  nama: "PPh Impor",
                  kode_akun: "411123",
                  created_at: "2020-07-07 17:40:52",
                  updated_at: "2020-07-07 17:40:52"
                }
              }
            ],
            uraian:
              "Minus ullam voluptate sed vitae est quis.\n0.76 KG\n------------------\nIMSI : Accusantium facilis adipisci itaque consectetur qui ut et voluptatem quas nesciunt fugit.\nIMSI : Sed non et cupiditate.\nIMSI : Quia voluptates sunt.\n",
            jumlah_jenis_kemasan: "7.00 PK",
            jumlah_jenis_satuan: " ",
            hs_code: "38249910",
            hs_raw_code: "3824.99.10",
            fob: 561.0877,
            insurance: 50.8508,
            freight: 65.8356,
            cif: 677.7741000000001,
            nilai_pabean: 90260.12578074001,
            valuta: "JPY",
            ndpbm: 133.1714
          }
        ],
        pungutan: {
          bayar: {
            BM: 10000,
            BMTP: 15000,
            PPN: 22000,
            PPnBM: 48000,
            PPh: 17000
          },
          bebas: {
            BM: 0,
            BMTP: 0,
            PPN: 0,
            PPnBM: 0,
            PPh: 0
          },
          tunda: {
            BM: 0,
            BMTP: 0,
            PPN: 0,
            PPnBM: 0,
            PPh: 0
          },
          tanggung_pemerintah: {
            BM: 0,
            BMTP: 0,
            PPN: 0,
            PPnBM: 0,
            PPh: 0
          }
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