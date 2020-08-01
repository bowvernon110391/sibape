<template>
    <div class="text-right flex-grow-1 my-auto">
        <!-- button group -->
        <b-button-group size="sm" class="shadow mt-2 mt-md-0">
            <!-- view source? -->
            <b-button variant="warning" :disabled="!hasSource" @click="$emit('view-source')">
                <font-awesome-icon icon="eye"/>
                Lihat Dok Sumber
            </b-button>

            <!-- Tetapkan -->
            <b-button variant="success" @click="$emit('showPungutan')">
                <font-awesome-icon icon="money-check-alt"/>
                <template v-if="isLocked">Lihat Pungutan</template>
                <template v-else>Tetapkan</template>
            </b-button>
        </b-button-group>

        <!-- Tombol cetak2 -->
        <template v-if="isLocked">
            <b-dropdown
                right
                size="sm"
                variant="dark"
                class="shadow mt-2 mt-md-0"
            >
                <!-- text and icon for button -->
                <template #button-content>
                    <font-awesome-icon icon="print"/>
                    Cetak
                </template>
                <!-- opsi yang selalu ada -->
                <b-dropdown-item @click="$emit('printBppm')" v-if="data.bppm">Bukti Bayar (BPPM)</b-dropdown-item>

                <!-- lembar perhitungan -->
                <b-dropdown-item @click="$emit('printLembarHitungPibk')">Lembar Penetapan</b-dropdown-item>
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
        data: Object
    },

    computed: {
        isLocked () {
            return this.data.is_locked
        },

        hasSource () {
            return typeof this.data.source !== 'undefined'
        }
    }
}
</script>