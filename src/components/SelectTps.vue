<template>
  <v-select
    :options="tps"
    label="kode"
    v-on="$listeners"
    v-bind="$attrs"
    :filter-by="filterTps"
  >
    <template #option="opt">
      <strong>{{ opt.kode }}</strong> - {{ opt.nama }}
    </template>
    <template #selected-option="opt">
      <strong>{{ opt.kode }}</strong> - {{ opt.nama }}
    </template>
  </v-select>
</template>

<script>

import { mapGetters, mapMutations } from 'vuex';
import axiosErrorHandler from '../mixins/axiosErrorHandler'
import vSelect from 'vue-select'

export default {
    inheritAttrs: false,

    mixins: [
      axiosErrorHandler
    ],

    components: {
      vSelect
    },

    methods: {
      ...mapMutations(['setRefDataTps']),

      filterTps(option, label, search) {
        return option.kode.toLowerCase().indexOf(search.toLowerCase()) > -1
            || option.nama.toLowerCase().indexOf(search.toLowerCase()) > -1
      }
    },

    computed: {
      ...mapGetters(['api', 'tps']),
    },

    created: function () {
      if (!this.tps.length) {
        // fetch for first time
        this.api.getTps()
        .then(e => {
          this.setRefDataTps(e.data.data)
        })
        .catch(e => {
          this.handleError(e)
        })
      }
    }
}
</script>