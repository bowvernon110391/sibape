<template>
   <api-select
      label="uraian"
      :reduce="e => e.id"
      :selectable="e => e.usable"
      :get-option-key="e => e.id"
      :search-callback="searchHS"
      :sync-callback="syncHS"
      v-bind="$attrs"
      v-on="$listeners"
      >
      <template v-slot:option="opt">
         <div :class="[{ 'text-muted': !opt.usable, 'text-dark': opt.usable }, 'clearfix']" :style="opt.usable ? {fontWeight: 'bold'} : {fontSize: '0.75em'}">
               <span v-if="opt.jenis_tarif == 'SPESIFIK'">
                  <strong class="float-right text-danger">(SPESIFIK)</strong>
               </span>
               <p>
                  {{ opt.raw_code }}
               </p>
               <p>
                  {{ opt.uraian }}
               </p>
               <p v-if="opt.usable" class="mt-0">
                  (bm: {{ opt.jenis_tarif=='SPESIFIK' ? 'Rp.' + opt.bm_tarif + ' ' +opt.satuan_spesifik : opt.bm_tarif }}, ppn: {{ opt.ppn_text }}, ppnbm: {{ opt.ppnbm_text }} )
               </p>
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
      },

      syncHS (q, spinner, vm) {
         spinner(true)
         this.api.getHSById(q)
         .then(e => {
            spinner(false)
            vm.setOptions([e.data.data])
         })
         .catch(e => {
            spinner(false)
            this.handleError(e)
         })
      }
   }
}
</script>