<template>
  <div>
    <!-- Nomor & Tgl Dokumen + Alamat -->
    <b-row>
      <!-- 1st col, nomor & tgl dokumen -->
      <b-col md="6">
        <b-form-group label="Nomor &amp; Tgl SPP">
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

      <!-- Penumpang -->
      <b-col md="6">
        <b-form-group label="Penumpang" label-for="penumpang">
          <select-penumpang-2
            v-if="data.source"
            v-model="dataPenumpang.data.id"
            id="penumpang"
            :disabled="disabled"
            :initial-options="dataPenumpang.data"
            :search-on-empty="isNew"
          ></select-penumpang-2>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Penumpang + No Identitas -->
    <b-row>
      <!-- 2nd col, jenis identitas -->
      <b-col md="6">
        <b-form-group label="Alamat" label-for="alamat">
          <b-form-textarea :disabled="disabled" v-model="data.source.data.alamat"></b-form-textarea>
        </b-form-group>
      </b-col>

      <b-col md="6">
        <b-form-group label="Asal/Country of origin" label-for="negara-asal">
          <!-- <b-form-input
                        v-model="data.negara_asal.data.kode"
                        type="text"
                        id="negara-asal"
          :disabled="disabled"></b-form-input>-->
          <select-negara
            v-model="data.negara_asal.data.kode"
            id="negara-asal"
            :disabled="disabled"
          ></select-negara>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- No Flight + Keterangan? -->
    <b-row>
      <!-- Nomor Flight -->
      <b-col md="6">
        <b-form-group label="Flight/Voyage No.">
          <b-input-group>
            <b-form-input v-model="data.source.data.no_flight" :disabled="disabled" />
            <template v-slot:append>
              <select-airline
                :tabindex="9999"
                style="margin: 0 2px; width: 100%"
                :disabled="disabled"
                v-model="data.source.data.kd_airline"
              />
            </template>
          </b-input-group>
        </b-form-group>
      </b-col>

      <!-- Keterangan -->
      <b-col md="6">
        <b-form-group label="Keterangan" label-for="keterangan">
          <b-form-textarea id="keterangan" v-model="data.keterangan" :disabled="disabled"></b-form-textarea>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import SelectNegara from '@/components/SelectNegara'
import SelectAirline from '@/components/SelectAirline'
import Datepicker from '@/components/Datepicker'

export default {
    props: {
        data: Object,
        disabled: [Boolean,String,Number],
        isNew: Boolean
    },

    components: {
        SelectPenumpang2,
        SelectNegara,
        SelectAirline,
        Datepicker
    },

    computed: {
        dataPenumpang() {
            return this.data.source.data.penumpang ? this.data.source.data.penumpang : this.data.source.data.importir
        }
    }
}
</script>
