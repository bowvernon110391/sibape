<template>
  <div class="text-right flex-grow-1 my-auto">
    <div class="mt-2 d-inline-block">
      <!-- Lihat dokumen sumber -->
      <template v-if="data">
        <b-button 
        variant="warning"
        class="shadow"
        size="sm"
        
        v-b-modal.source-doc
        >
          <font-awesome-icon icon="eye" />&nbsp;Lihat Dokumen Sumber
        </b-button>
      </template>
      <!-- additional button in slot -->
      <slot></slot>
      <!-- {{ routerObject }} -->
      <!-- <pre>{{ JSON.stringify(routerObject, null, 2) }}</pre> -->
    </div>

    <!-- View in Modal? -->
    <b-modal size="xl" id="source-doc" title="Dokumen Sumber" header-bg-variant="light" footer-bg-variant="light">
      <component :is="sourceObject" v-bind="sourceObjectParams">
      </component>

      <template #modal-footer="{ hide }">
        <div>
          <b-button variant="danger" size="sm" @click="hide">
            <font-awesome-icon icon="times"/>
              Tutup
          </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },

  methods: {
      handleClick() {
          if (this.data) {
              this.$router.push({
                  path: this.data.instructable_uri
              })
          }
      }
  },

  computed: {
    routerObject() {
      console.log('Source Component: ', this.sourceObject)
      console.log('Source Params: ', this.sourceObjectParams)
      return "RESOLVED"
    },

    sourceObject() {
      const comps = this.$router.getMatchedComponents(this.data.instructable_uri)
      const lastComp = comps[comps.length-1]

      return lastComp
    },

    sourceObjectParams() {
      const r = this.$router.resolve(this.data.instructable_uri)
      return {
        ...r.resolved.params,
        readOnly: true,
        hideIp: true
      }
    }
  }
};
</script>