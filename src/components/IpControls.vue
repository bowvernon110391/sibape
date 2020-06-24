<template>
  <div>
    <b-button class="shadow" size="sm" variant="success" v-bind="$attrs" v-on="$listeners" v-b-modal="'modalIp'">
      <font-awesome-icon icon="search" />&nbsp;
      Terbitkan IP
    </b-button>

    <!-- Modal -->
    <b-modal ref="ipModal" id="modalIp" centered header-bg-variant="light" title="Instruksi Pemeriksaan" :no-close-on-backdrop="busy" :no-close-on-esc="busy">
      <ip-contents :disabled="readOnly || busy" v-model="instruksi_pemeriksaan" />
      <template #modal-footer="{ cancel }">
        <b-button variant="primary" size="sm" :disabled="readOnly || busy" @click="terbitkanIp">
            <template v-if="busy">
                Processing...<b-spinner small/>
            </template>
            <template v-else>
                Terbitkan
            </template>
        </b-button>
        <b-button variant="secondary" size="sm" :disabled="busy" @click="cancel">Batal</b-button>
        <!-- <b-button variant="danger" size="sm" @click="busy = !busy">Toggle</b-button> -->
      </template>
    </b-modal>
  </div>
</template>

<script>
import IpContents from "@/components/IpContents";

import { mapGetters, mapMutations } from "vuex";

import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
  inheritAttrs: false,
  mixins: [axiosErrorHandler],
  props: {
    readOnly: {
      type: Boolean,
      default: false
    },

    uri: {
      type: String,
      required: true
    },

    data: {
        type: Object
    }
  },
  components: {
    IpContents
  },

  data() {
    return {
      instruksi_pemeriksaan: {
        jumlah_periksa: this.data? this.data.jumlah_periksa : "100",
        ajukan_contoh: this.data? this.data.ajukan_contoh : "T",
        ajukan_foto: this.data? this.data.ajukan_foto : "T",
        pemeriksa_id: this.data? this.data.pemeriksa_id : null
      },

      busy: false
    };
  },

  methods: {

    terbitkanIp() {
      //   console.log("data_ip: ", this.instruksi_pemeriksaan);
      this.busy = true
      // call api
      this.api
        .putIp(this.uri, this.instruksi_pemeriksaan)
        .then(e => {
            this.busy = false
            // success....show em also close modal
            this.$refs['ipModal'].hide()
            // show toast
            this.showToast('Berhasil', 'Instruksi Pemeriksaan berhasil diterbitkan!', 'success')
            // trigger input
            this.$emit('submit')
        })
        .catch(e => {
            this.busy = false
            this.handleError(e)
        });
    }
  },

  computed: {
    ...mapGetters(["api"])
  }
};
</script>