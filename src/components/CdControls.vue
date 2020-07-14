<template>
  <div class="text-right flex-grow-1 my-auto">
    <slot name="append"></slot>

    <b-button-group size="sm" :class="['shadow', 'mt-2', 'mt-md-0', { 'd-block' : vertical }]" :vertical="vertical">
      <!-- apabila dijadikan impor sementara -->
      <b-button variant="danger" :disabled="isLocked">
        <font-awesome-icon icon="plane-departure"></font-awesome-icon>Jaminkan (Impor Sementara)
      </b-button>

      <!-- titip (gk mampu/mau bayar) -->
      <b-button variant="dark" :disabled="isLocked" @click="$emit('showPenitipan')">
        <font-awesome-icon icon="lock"></font-awesome-icon>Titipkan
      </b-button>

      <!-- tunda pengeluaran -->
      <b-button
        variant="warning"
        :disabled="isLocked"
        @click="$emit('showPenundaan')"
      >
        <font-awesome-icon icon="hand-paper"></font-awesome-icon>Tunda Pengeluaran
      </b-button>

      <!-- apabila dibayar (Terbit SPPBMCP) -->
      <b-button variant="success" :disabled="false" @click="$emit('showPungutan')">
        <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
        <template v-if="isLocked">Lihat Pungutan</template>
        <template v-else>Tetapkan</template>
      </b-button>
    </b-button-group>

    <!-- tombol cetak -->
    <template v-if="isLocked">
      <b-dropdown
        right
        size="sm"
        variant="dark"
        class="shadow my-2"
      >
        <!-- text and icon for button -->
        <template v-slot:button-content>
          <font-awesome-icon icon="print"/>
          Cetak
        </template>
        <!-- opsi yang selalu ada -->
        <b-dropdown-item @click="$emit('printBppm')" v-if="data.bppm">Bukti Bayar (BPPM)</b-dropdown-item>

        <!-- lembar perhitungan -->
        <b-dropdown-item @click="$emit('printLembarHitungCd')">Lembar Penetapan</b-dropdown-item>
        <!-- opsi tergantung link yg ada -->
        <b-dropdown-item @click="$emit('printSppb')" v-if="data.sppb">SPPB</b-dropdown-item>
      </b-dropdown>
    </template>

    <!-- slot append -->
    <slot name="append">
    </slot>
  </div>
</template>

<script>
import docMethod from '../mixins/docMethod'

export default {
    mixins: [ docMethod ],
    props: {
        data: Object,
        vertical: {
          type: Boolean,
          default: false
        }
    },

    computed: {
      isDone () {
        return this.docHasLink(this.data, 'sspcp')
      },

      isLocked () {
        return this.data.is_locked
      }
    }
}
</script>