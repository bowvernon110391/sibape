<template>
  <div id="app">
    <router-view/>
    <b-modal 
          v-model="this.$store.state.busy"
          id="loading-screen"
          centered 
          title="Loading..."
          no-close-on-backdrop
          ok-disabled
          hide-header-close
          size="sm"
          variant="danger"
          text-variant="danger">
          <!-- <b-progress :value="100" :max="100" animated variant="danger"></b-progress> -->
          <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
          <hr />
          <p>Please wait..</p>
      </b-modal>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    // show floating error
    showError(code, message) {
        this.$bvToast.toast(message, {
            title: `Error(${code})`,
            autoHideDelay: 5000,
            appendToast: true,
            toaster: 'b-toaster-top-center',
            variant: 'danger'
        })
    },
    handleError (e) {
        var code = 0
        var msg = '<GENERIC ERROR TEXT>'
        // e is axios error
        if (e.response) {
            // got response
            if (e.response.data) {
                // stylized error
                code = e.response.data.error.http_code
                msg = e.response.data.error.message
            } else {
                code = e.status
                msg = e.statusText
            }
        } else {
            code = '?'
            msg = e.toString()
        }

        // show floating text
        this.showError(code, msg)
    }
  }
}
</script>

<style>
</style>
