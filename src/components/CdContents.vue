<template>
  <div>
    <b-row>
      <b-col sm="12">
        <b-form-group label="Flag Deklarasi" description="Flag deklarasi sesuai form cd">
          <b-form-checkbox-group
            :options="flagDeklarasi"
            stacked
            :disabled="disabled"
            v-model="data.declare_flags"
          ></b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>
    <hr />
    <!-- Nomor & Tgl Dokumen + Alamat -->
    <b-row>
      <!-- 1st col, nomor & tgl dokumen -->
      <b-col md="6">
        <b-form-group label="Nomor &amp; Tgl. Dokumen">
          <b-input-group>
            <b-form-input
              class="rounded-left flex-grow-1"
              v-model="data.nomor_lengkap"
              type="text"
              disabled
            ></b-form-input>
            <template v-slot:append>
              <datepicker
                class="rounded-right"
                id="tgl_dok"
                v-model="data.tgl_dok"
                :disabled="disabled"
                style="max-width: 150px"
              ></datepicker>
            </template>
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- 2nd col, alamat -->
      <b-col md="6">
        <b-form-group label="Alamat" label-for="alamat">
          <b-form-textarea id="alamat" v-model="data.alamat" :disabled="disabled"></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Penumpang + NIB -->
    <b-row>
      <b-col md="6">
        <b-form-group label="Penumpang" label-for="penumpang">
          <select-penumpang-2
            v-model="data.penumpang_id"
            id="penumpang"
            :disabled="disabled"
            :initial-options="data.penumpang.data"
            :search-on-empty="isNew"
          ></select-penumpang-2>
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group :label="labelNpwp" label-for="npwp_nib">
          <b-form-input
            v-model="data.npwp_nib"
            type="text"
            id="npwp_nib"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Nomor & Tgl Flight + Airport -->
    <b-row>
      <b-col md="6">
        <!-- No tgl flight -->
        <b-row>
          <b-col>
            <b-form-group label="Nomor &amp; Tgl. Flight">
              <b-input-group>
                <b-form-input
                  v-model="data.no_flight"
                  type="text"
                  id="no_flight"
                  class="md-3"
                  :disabled="disabled"
                ></b-form-input>
                <template v-slot:append>
                  <!-- <b-form-select style="min-width: 250px" class="d-none d-sm-block"></b-form-select> -->
                  <select-airline
                    :tabindex="9999"
                    style="min-width: 250px; margin: 0 2px;"
                    :disabled="disabled"
                    v-model="data.kd_airline"
                    class="d-none d-sm-block"
                  ></select-airline>

                  <datepicker
                    v-model="data.tgl_kedatangan"
                    id="tgl_kedatangan"
                    :disabled="disabled"
                    style="max-width: 150px"
                  ></datepicker>
                </template>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <!-- bagasi dibawa + tdk dbawa (lnf) -->
        <b-row>
          <b-col>
            <b-form-group label="Bagasi dibawa">
              <b-form-input
                class="text-right"
                size="sm"
                :disabled="disabled"
                v-model="data.jml_bagasi_dibawa"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="Bagasi tertinggal">
              <b-form-input
                class="text-right"
                size="sm"
                :disabled="disabled"
                v-model="data.jml_bagasi_tdk_dibawa"
              ></b-form-input>
            </b-form-group>
          </b-col>

          <b-col>
            <!-- Pembebasan select. Disabled if commercial, also set to 0 if commercial -->
            <b-form-group label="Pembebasan (USD)">
              <!-- <b-form-select size="sm" :disabled="disabled || isCommercial" v-model="data.pembebasan">
                                <option value="0">0</option>
                                <option value="50" :disabled="isCommercial">50</option>
                                <option value="500" :disabled="isCommercial">500</option>
                                <option value="1000" :disabled="isCommercial">1000</option>
              </b-form-select>-->
              <b-form-input
                :disabled="disabled || isCommercial"
                size="sm"
                v-model="data.pembebasan"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>

      <!-- airport asal + tujuan -->
      <b-col md="6">
        <b-row>
          <b-col>
            <b-form-group label="Airport asal" label-for="kd_pelabuhan_asal">
              <!-- <b-input-group prepend="Dari" class="mb-2"> -->
              <!-- <b-form-input v-model="data.kd_pelabuhan_asal" id="kd_pelabuhan_asal" type="text" :disabled="disabled"></b-form-input> -->
              <select-pelabuhan
                id="kd_pelabuhan_asal"
                v-model="data.kd_pelabuhan_asal"
                :disabled="disabled"
                :initial-options="data.pelabuhan_asal.data"
                :search-on-empty="isNew"
              ></select-pelabuhan>
              <!-- <b-input-group-prepend is-text>
                                    Ke
              </b-input-group-prepend>-->
              <!-- <b-form-input v-model="data.kd_pelabuhan_tujuan" id="kd_pelabuhan_tujuan" type="text" :disabled="disabled"></b-form-input> -->
              <!-- </b-input-group> -->
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group label="Airport Tujuan" label-for="kd_pelabuhan_tujuan">
              <select-pelabuhan
                id="kd_pelabuhan_tujuan"
                v-model="data.kd_pelabuhan_tujuan"
                :disabled="disabled"
                :initial-options="data.pelabuhan_tujuan.data"
                :search-on-empty="isNew"
              ></select-pelabuhan>
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <!-- Jml anggota keluarga + Flag deklarasi -->
    <b-row>
      <!-- Jml Keluarga -->
      <b-col md="2" sm="6">
        <b-form-group label="Jumlah Penumpang" description="at the time of arrival">
          <b-form-input
            type="number"
            class="text-right"
            v-model="data.jml_anggota_keluarga"
            :disabled="disabled"
            size="sm"
          ></b-form-input>
        </b-form-group>
      </b-col>

      <!-- Tarif PPh -->
      <b-col md="2" sm="6">
        <b-form-group label="Tarif PPh (%)">
          <!-- <b-form-select v-model="data.pph_tarif" :disabled="disabled" size="sm">
                        <option value="2.5">2.5</option>
                        <option value="7.5">7.5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="22.5">22.5</option>
          </b-form-select>-->
          <v-select
            v-model="data.pph_tarif"
            taggable
            push-tags
            :options="pphOptions"
            :disabled="disabled"
          ></v-select>
        </b-form-group>
      </b-col>

      <!-- KOLI -->
      <b-col md="2" sm="6">
        <b-form-group label="Koli">
          <b-form-input :disabled="disabled" size="sm" v-model="data.koli"/>
        </b-form-group>
      </b-col>

      <!-- Lokasi -->
      <b-col md="6">
        <b-form-group label="Lokasi">
          <select-lokasi
            size="sm"
            :disabled="disabled"
            :reduce="e => e.kode"
            v-model="data.lokasi"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import Datepicker from '@/components/Datepicker'
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import SelectAirline from '@/components/SelectAirline'
import SelectPelabuhan from '@/components/SelectPelabuhan'
import SelectLokasi from '@/components/SelectLokasi'

export default {
    // COMPONENTS USED
    components: {
        vSelect,
        Datepicker,
        SelectPenumpang2,
        SelectAirline,
        SelectPelabuhan,
        SelectLokasi
    },

    // PROPERTIES
    props: {
        disabled: Boolean,
        data: {
            type: Object,
            required: true
        },
        isNew: {
            type: Boolean
        }
    },

    // INTERNAL DATA
    data () {
        return {
            flagDeklarasi: [
                { text: 'Barang yang diatur karantina', value: "KARANTINA"},
                { text: 'Narkotika dan/atau obat-obatan', value: "NARKOTIKA"},
                { text: 'Barang Kena Cukai', value: "BKC"},
                { text: 'Pembawaan Mata Uang', value: "UANG"},
                { text: 'Barang-barang yang bukan untuk penggunaan pribadi (Non-personal use)', value: "KOMERSIL"},
                { text: 'Barang impor untuk dipakai (personal use)', value: "IMPOR_UNTUK_DIPAKAI"}
            ]
        }
    },

    // COMPUTED PROPERTIES
    computed: {
        // default pphOptions...
        pphOptions () {
            var options = [
                2.5,
                7.5,
                10,
                15,
                20,
                ...this.data.pph_tarif
            ]

            return options
        },

        // Check if CD contains commercial flags
        isCommercial () {
            var commercial = this.data.declare_flags.includes("KOMERSIL")

            // if flag set, reset pembebasan to 0
            if (commercial) {
                this.data.pembebasan = 0
            }

            return commercial
        },

        // Auto detect isi kolom npwp_nib
        labelNpwp () {
           var defaultLabel = 'NPWP/NIB/NIK'
           if (!this.data.npwp_nib) {
              return defaultLabel
           }
           
           switch (this.data.npwp_nib.replace(/\.\-/i, '').length) {
              case 6:
              case 8:
                 return 'NIK'
               case 13:
                  return 'NIB'
               case 15:
                  return 'NPWP'
           }
           return defaultLabel
        },

        // the 2 digit of airline
        airlineCode () {
            if (this.data.no_flight && this.data.no_flight.length >= 2) {
                return this.data.no_flight.substring(0, 2).toUpperCase()
            }

            return null
        },
    },

    // WATCHERS!
    watch: {
        'data.no_flight': {
            immediate: true,
            deep: true,
            handler(newVal) {
                this.data.kd_airline = this.airlineCode
            }
        }
    }
}
</script>