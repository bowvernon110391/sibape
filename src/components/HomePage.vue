<template>
    <b-container>
        <b-alert variant="success" :show="showAlert">
            Hello, world
        </b-alert>
        <b-btn size="sm" @click="showAlert = !showAlert">
            Toggle Alert
        </b-btn>
    </b-container>
</template>

<script>

export default {
    data () {
        return {
            showAlert: true
        }
    }
}
</script>