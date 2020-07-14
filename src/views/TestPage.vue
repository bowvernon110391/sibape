<template>
  <b-row>
    <b-col md="6">
      <b-form-group label="PJT" description="Perusahaan Jasa Titipan">
        <select-pjt 
          v-model="pjt_id"
        />
      </b-form-group>
      <pre>{{ pjt_id }}</pre>
    </b-col>
  </b-row>
</template>

<script>
import ModalSelectLokasiTimbun from '@/components/ModalSelectLokasiTimbun'
import SelectPjt from '@/components/SelectPjt'

export default {
  components: {
    ModalSelectLokasiTimbun,
    SelectPjt
  },

  data() {
    return {
      tps: null,
      pjt_id: 4
    };
  }
};
</script>