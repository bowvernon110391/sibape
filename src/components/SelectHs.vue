<template>
   <api-select
      label="uraian"
      :reduce="e => e.kode"
      :search-callback="searchHS"
      :sync-callback="searchHS"
      :clear-search-on-select="true"
      v-bind="$attrs"
      v-on="$listeners"
      >
      <template v-slot:option="opt">
         <div :class="[{ 'text-muted': !opt.usable, 'text-dark': opt.usable }, 'clearfix']" :style="opt.usable ? {fontWeight: 'bold'} : {fontSize: '0.75em'}">
               <span v-if="opt.jenis_tarif == 'SPESIFIK'">
                  <strong class="float-right text-danger">(SPESIFIK)</strong>
               </span>
               <b-col md="2">
                  {{ opt.raw_code }}
               </b-col>
               <b-col md="6">
                  {{ opt.uraian }}
               </b-col>
               <b-col md="4" v-if="opt.usable">
                  (bm: {{ opt.jenis_tarif=='SPESIFIK' ? 'Rp.' + opt.bm_tarif + ' ' +opt.satuan_spesifik : opt.bm_tarif }}, ppn: {{ opt.ppn_text }}, ppnbm: {{ opt.ppnbm_text }} )
               </b-col>
         </div>
      </template>
      <template v-slot:selected-option="opt">
         <div>
               <strong>{{ opt.raw_code }}: {{ opt.uraian }} (bm: {{ opt.jenis_tarif=='SPESIFIK' ? 'Rp.' + opt.bm_tarif + ' ' +opt.satuan_spesifik : opt.bm_tarif }}, ppn: {{ opt.ppn_text }}, ppnbm: {{ opt.ppnbm_text }} )</strong>
         </div>
         <!-- <div v-else>
               synchronizing...<b-spinner small variant="danger"></b-spinner>
         </div> -->
      </template>                
   </api-select>
</template>

<script>
import ApiSelect from '@/components/ApiSelect'
import { mapGetters } from 'vuex'
import axiosErrorHandler from '../mixins/axiosErrorHandler'

export default {
   inheritAttrs: false,
   mixins: [ axiosErrorHandler ],
   components: {
      ApiSelect
   },
   computed: {
      ...mapGetters(['api'])
   },
   methods: {
      searchHS (q, spinner, vm) {
         spinner(true)
         this.api.getHS({
               q: q,
               number: 150
         })
         .then(e => {
               spinner(false)
               vm.setOptions(e.data.data)
         })
         .catch(e => {
               spinner(false)
               // alert("Failed to get hs!")
               this.handleError(e)
         })
      }
   }
}
</script>