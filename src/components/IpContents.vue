<template>
  <div>
    <!-- Tingkat Pemeriksaan -->
    <b-form-group label="Tingkat Pemeriksaan" description="misal: 10%, 100%" :disabled="disabled">
      <b-input-group size="sm">
        <b-form-input type="text" v-model="value.jumlah_periksa"/>
        <template #append>
          <b-input-group-text>%</b-input-group-text>
        </template>
      </b-input-group>
    </b-form-group>

    <!-- Ajukan Contoh -->
    <b-form-group label="Ajukan Contoh?" :disabled="disabled">
      <b-form-select size="sm" v-model="value.ajukan_contoh">
        <option value="Y">Ya</option>
        <option value="T" selected>Tidak</option>
      </b-form-select>
    </b-form-group>

    <!-- Ajukan foto -->
    <b-form-group label="Ambil Foto?" :disabled="disabled">
      <b-form-select size="sm" v-model="value.ajukan_foto">
        <option value="Y">Ya</option>
        <option value="T" selected>Tidak</option>
      </b-form-select>
    </b-form-group>

    <!-- Select Pemeriksa -->
    <b-form-group label="Pemeriksa" description="Tunjuk pemeriksa fisik" :disabled="disabled">
      <select-pemeriksa :disabled="disabled" v-model="value.pemeriksa_id"/>
    </b-form-group>

    <!-- Nip dan Nama Pejabat -->
    <b-row v-if="showIssuer">
      <b-col md="6">
        <b-form-group label="Pejabat Penerbit IP" disabled>
          <b-form-input type="text" size="sm" :value="value.nama_issuer"/> 
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="NIP" disabled>
          <b-form-input type="text" size="sm" :value="value.nip_issuer"/> 
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SelectPemeriksa from "@/components/SelectPemeriksa";

export default {
  props: {
    disabled: {
      type: [Boolean, String],
      default: false
    },
    value: {
      type: Object,
      default: null
    },
    showIssuer: {
      type: Boolean,
      default: false
    }
  },

  components: {
    SelectPemeriksa
  }
};
</script>