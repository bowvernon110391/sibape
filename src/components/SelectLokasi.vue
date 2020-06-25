<template>
  <b-form-select v-bind="$attrs" v-on="$listeners">
    <option value="T2F">T2F</option>
    <option value="T3">T3</option>
    <option value="KANTOR">KANTOR</option>
  </b-form-select>
</template>

<script>
export default {
    inheritAttrs: false
}
</script>