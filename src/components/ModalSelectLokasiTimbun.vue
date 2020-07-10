<template>
  <b-modal 
    v-bind="$attrs" 
    v-on="$listeners"
    footer-bg-variant="light"
    header-bg-variant="light"
    ref="modal">
    <!-- Head -->
    <template #modal-header>
      <h4>Pilih Lokasi Timbun</h4>
    </template>

    <!-- BODY -->
    <!-- <pre>{{ lokasi_type }}</pre>
    <pre>{{ lokasi_kode }}</pre> -->
    <!-- type of lokasi -->
    <b-form-group label="Lokasi Barang di">
        <b-form-radio-group v-model="lokasi_type">
            <b-form-radio value="App\Lokasi">Wilayah Kerja</b-form-radio>
            <b-form-radio value="App\TPS">TPS</b-form-radio>
        </b-form-radio-group>
    </b-form-group>

    <!-- if lokasi -->
    <b-form-group label="Lokasi" v-if="lokasi_type == `App\\Lokasi`">
        <select-lokasi
            v-model="lokasi_kode"
            :reduce="e => e.kode"
        />
    </b-form-group>

    <!-- if tps -->
    <b-form-group label="TPS" v-else>
        <select-tps
            v-model="lokasi_kode"
            :reduce="e => e.kode"
        />
    </b-form-group>

    <!-- Footer -->
    <template #modal-footer>
        <b-button 
            variant="primary"
            size="sm"
            @click="handleOk"
            >
            <font-awesome-icon icon="save"/>
            Simpan
        </b-button>
    </template>
  </b-modal>
</template>

<script>
import SelectLokasi from '@/components/SelectLokasi'
import SelectTps from '@/components/SelectTps'

export default {
  inheritAttrs: false,

  components: {
      SelectLokasi,
      SelectTps
  },

  data() {
    return {
      lokasi_type: 'App\\Lokasi',
      lokasi_kode: this.$store.getters.lokasi
    };
  },

  methods: {
      handleOk() {
          this.$refs['modal'].hide()
          this.$emit('select', {
              lokasi_type: this.lokasi_type,
              lokasi_kode: this.lokasi_kode,
          })
      }
  },

  watch: {
      lokasi_type: {
          handler: function (val) {
              this.lokasi_kode = null
          }
      },

      value: {
          handler: function (val) {
              if (val) {
                  this.lokasi_type = 'App\\Lokasi'
                  this.lokasi_kode = this.$store.getters.lokasi
              }
          }
      }
  }
};
</script>