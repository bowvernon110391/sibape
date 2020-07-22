<template>
  <div class="text-right flex-grow-1 my-auto">
    <!-- buatkan / lihat pibk -->
    <b-button variant="success" class="shadow my-2 my-md-0" size="sm">
      <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
      <template v-if="docHasLink(data, 'pibk')">Lihat PIBK</template>
      <template v-else>Buatkan PIBK</template>
    </b-button>

    <!-- slot -->
    <slot>
    </slot>

    <!-- apabila dijadikan impor sementara -->
    <b-button variant="dark" @click="$emit('printSt')" class="shadow my-auto" size="sm">
      <font-awesome-icon icon="print"/>
      Cetak
    </b-button>
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