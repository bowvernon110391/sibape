<template>
  <div class="text-right flex-grow-1 my-auto">
    <div class="mt-2 d-inline-block">
      <!-- Lihat dokumen sumber -->
      <template v-if="data">
        <b-button 
        variant="warning"
        class="shadow"
        size="sm"
        @click="handleClick"
        >
          <font-awesome-icon icon="eye" />&nbsp;Lihat Dokumen Sumber
        </b-button>
      </template>
      <!-- additional button in slot -->
      <slot></slot>
      {{ routerObject }}
      <!-- <pre>{{ JSON.stringify(routerObject, null, 2) }}</pre> -->
    </div>
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
      const r = this.$router.resolve(this.data.instructable_uri)

      console.log('resolved router object: ', r.resolved)
      return "RESOLVED"
    }
  }
};
</script>