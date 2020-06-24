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
    }
  },

  components: {
    SelectPemeriksa
  }
};
</script>