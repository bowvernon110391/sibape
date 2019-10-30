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
          text-variant="danger"
          hide-header
          hide-footer>
          <!-- <b-progress :value="100" :max="100" animated variant="danger"></b-progress> -->
          <div class="text-center">
            <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
            <hr />
            <p>Please wait..</p>
          </div>
      </b-modal>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
</style>
