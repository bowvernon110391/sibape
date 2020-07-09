<template>
  <div class="text-right flex-grow-1 my-2">
    <b-button-group size="sm" class="shadow">
      <!-- buatkan / lihat pibk -->
      <b-button variant="success">
        <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
        <template v-if="docHasLink(data, 'pibk')">Lihat PIBK</template>
        <template v-else>Buatkan PIBK</template>
      </b-button>
    </b-button-group>

    <!-- slot -->
    <slot>
    </slot>

    <b-button-group size="sm" class="shadow">
      <!-- apabila dijadikan impor sementara -->
      <b-button variant="dark" @click="$emit('printSpp')">
        <font-awesome-icon icon="print"></font-awesome-icon>Cetak
      </b-button>
    </b-button-group>
  </div>
</template>

<script>
import docMethod from '../mixins/docMethod'

export default {
    mixins: [ docMethod ],
    props: {
        data: Object
    }
}
</script>