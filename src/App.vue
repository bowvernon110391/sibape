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
  name: 'App'
}
</script>

<style>
</style>
