<template>
  <b-row>
    <b-col md="6">
      <b-form-group label="PJT" description="Perusahaan Jasa Titipan">
        <select-pjt 
          v-model="pjt_id"
          disabled
        />
      </b-form-group>
      <pre>{{ pjt_id }}</pre>
    </b-col>

    <b-col md="6">
      <b-form-group label="Gudang" description="Kode Gudang tempat barang ditimbun">
        <select-gudang
          v-model="gudang_id"
          :reduce="e => e.id"
          disabled
        />
      </b-form-group>
      <pre>{{ gudang_id }}</pre>
    </b-col>
  </b-row>
</template>

<script>
import ModalSelectLokasiTimbun from '@/components/ModalSelectLokasiTimbun'
import SelectPjt from '@/components/SelectPjt'
import SelectGudang from '@/components/SelectGudang'

export default {
  components: {
    ModalSelectLokasiTimbun,
    SelectPjt,
    SelectGudang
  },

  data() {
    return {
      tps: null,
      pjt_id: 4,
      gudang_id: 6
    };
  }
};
</script>