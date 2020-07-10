<template>
  <div>
    <b-button v-b-modal.modal-select-lt>
      Select Lokasi Timbun
    </b-button>
    <modal-select-lokasi-timbun 
      id="modal-select-lt" 
      @select="e => tps = e"
      />
    <pre>{{ tps }}</pre>
    <pre>{{ $store.getters.lokasi }}</pre>
  </div>
</template>

<script>
import ModalSelectLokasiTimbun from '@/components/ModalSelectLokasiTimbun'

export default {
  components: {
    ModalSelectLokasiTimbun
  },

  data() {
    return {
      tps: null
    };
  }
};
</script>