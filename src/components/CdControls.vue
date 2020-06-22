<template>
  <div class="text-right flex-grow-1 my-auto">
    <b-button-group size="sm" class="shadow mt-2 mt-md-0">
      <!-- apabila dijadikan impor sementara -->
      <b-button variant="danger" :disabled="docHasLink(data,'bpj')">
        <font-awesome-icon icon="plane-departure"></font-awesome-icon>Jaminkan (Impor Sementara)
      </b-button>

      <!-- titip (gk mampu/mau bayar) -->
      <b-button variant="dark" :disabled="docHasLink(data,'st')" @click="$emit('showPenitipan')">
        <font-awesome-icon icon="lock"></font-awesome-icon>Titipkan
      </b-button>

      <!-- tunda pengeluaran -->
      <b-button
        variant="warning"
        :disabled="docHasLink(data,'spp')"
        @click="$emit('showPenundaan')"
      >
        <font-awesome-icon icon="hand-paper"></font-awesome-icon>Tunda Pengeluaran
      </b-button>

      <!-- apabila dibayar (Terbit SPPBMCP) -->
      <b-button variant="success" :disabled="false" @click="$emit('showPungutan')">
        <font-awesome-icon icon="money-check-alt"></font-awesome-icon>
        <template v-if="docHasLink(data,'sspcp')">Lihat Pungutan</template>
        <template v-else>Bayar</template>
      </b-button>
    </b-button-group>

    <!-- tombol cetak -->
    <template v-if="docHasLink(data,'sspcp')">
      <b-dropdown
        right
        size="sm"
        split
        split-variant="dark"
        variant="dark"
        class="shadow mt-2 mt-md-0"
        @click="$emit('printSspcp')"
      >
        <!-- text and icon for button -->
        <template v-slot:button-content>
          <font-awesome-icon icon="print"></font-awesome-icon>Cetak
        </template>
        <!-- opsi yang selalu ada -->
        <b-dropdown-item @click="$emit('printSspcp')">Bukti Bayar</b-dropdown-item>

        <!-- lembar perhitungan -->
        <b-dropdown-item @click="$emit('printLembarHitungCd')">Lembar Perhitungan</b-dropdown-item>
        <!-- opsi tergantung link yg ada -->
      </b-dropdown>
    </template>
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