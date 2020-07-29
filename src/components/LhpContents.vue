<template>
  <div v-if="value">
    <b-row>
      <!-- Lokasi Pemeriksaan -->
      <b-col md="6">
        <b-form-group label="Lokasi Pemeriksaan">
          <select-lokasi size="sm" v-model="value.lokasi" :reduce="e => e.kode" :disabled="disabled"/>
        </b-form-group>
      </b-col>
      <!-- Waktu Mulai Periksa dan Selesai -->
      <b-col md="3" v-if="value.created_at && !hideWaktuPemeriksaan">
          <b-form-group label="Waktu Mulai Periksa" disabled>
              <b-form-input size="sm" type="text" class="text-center" v-model="value.created_at" />
          </b-form-group>
      </b-col>
      <b-col md="3" v-if="value.is_locked && !hideWaktuPemeriksaan">
          <b-form-group label="Waktu Selesai Periksa" disabled>
              <b-form-input size="sm" type="text" class="text-center" v-model="value.updated_at" />
          </b-form-group>
      </b-col>
    </b-row>

    <!-- Isi -->
    <b-form-group label="Hasil Pemeriksaan" :disabled="disabled">
      <b-form-textarea size="sm" rows="4" v-model="value.isi" />
    </b-form-group>

    <!-- Nip dan Nama pemeriksa -->
    <b-row v-if="value.pemeriksa">
        <b-col md="6">
            <b-form-group label="Nama Pemeriksa" disabled>
                <b-form-input size="sm" class="text-center" v-model="value.pemeriksa.nama"/>
            </b-form-group>
        </b-col>
        <b-col md="6">
            <b-form-group label="NIP" disabled>
                <b-form-input size="sm" class="text-center" v-model="value.pemeriksa.nip"/>
            </b-form-group>
        </b-col>
    </b-row>
  </div>
</template>

<script>
import SelectLokasi from "@/components/SelectLokasi";

export default {
  components: {
    SelectLokasi
  },
  props: {
    disabled: {
      type: [Boolean, String],
      default: false
    },
    value: {
      type: Object,
      default: null
    },
    hideWaktuPemeriksaan: {
        type: Boolean,
        default: false
    }
  }
};
</script>