<template>
  <b-modal
    v-bind="$attrs"
    v-on="$listeners"
    :visible="value"
    @change="e => $emit('input', e)"
    header-bg-variant="light"
    centered
  >
    <!-- Head -->
    <template #modal-header>
      <h4>Select Location</h4>
    </template>

    <!-- Body -->
    <template>
      <!-- <p>Gotta put something in here</p> -->
      <b-form-group label="Pilih lokasi" description="Hanya berdampak pada saat input data">
        <select-lokasi 
          :value="lokasi" 
          @input="setLokasi" 
          :reduce="e => e.kode"
          />
        
      </b-form-group>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

// SelectLokasi
import SelectLokasi from "@/components/SelectLokasi";

export default {
  inheritAttrs: false,

  components: {
    SelectLokasi
  },

  props: {
    value: {}
  },

  computed: {
    ...mapGetters(["lokasi"])
  },

  methods: {
    ...mapMutations(["setLokasi"])
  }
};
</script>