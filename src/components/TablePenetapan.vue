<template>
    <b-table
        responsive="sm"
        table-class="shadow"
        head-variant="dark"
        bordered
        outlined
        striped
        small
        hover
        primary-key="id"
        :fields="fields"
        v-bind="$attrs"
        v-on="$listeners"
        tbody-tr-class="text-center"
        thead-tr-class="text-center">

        <!-- dok asal -->
        <template #cell(header_info)="{ value }">
            <template v-if="value.data.valid">
                <div>
                    <span>
                       {{ value.data.nomor_lengkap }}
                    </span>
                </div>
                <div>
                    <!-- <datepicker v-model="value.data.tgl_dok" disabled/> -->
                    <font-awesome-icon icon="calendar-alt"/>
                    {{ value.data.tgl_dok }}
                </div>
                <hr/>
                <b-button variant="secondary" class="shadow"
                    :to="value.data.header_type.split('\\')[1].toLowerCase() + '/' + value.data.header_id"
                    target="_blank">
                    <font-awesome-icon icon="eye"/>
                    Lihat Dok
                    <b-badge variant="light">{{ value.data.header_type.split('\\')[1] }}</b-badge>
                </b-button>
            </template>
            <template v-else>
                <b-button :disabled="true" variant="secondary">
                    <font-awesome-icon icon="eye-slash"/>
                    Dok tidak ditemukan
                </b-button>
            </template>
        </template>

        <!-- uraian -->
        <template #cell(uraian)="{ value, item }">
          <div style="white-space: pre-line; text-align:left;">{{ uraianDanBruto(value) }}</div>
          <template v-if="item.kategori.data && item.kategori.data.length">
            <div style="margin-top: 0.25rem; text-align: left; display: flex; justify-items: space-around;">
              <b-badge
                v-for="(d, id) in item.kategori.data" :key="id" :variant="badgeVariant(d.nama)"
                style="margin-right: 0.2rem;"
                >
                {{ d.nama }}
              </b-badge>
            </div>
          </template>
        </template>
        <!-- quantity -->
        <template #cell(jumlah)="{ item }">
          <div>
            {{ item.jumlah_jenis_kemasan }}
          </div>
          <div>
            {{ item.jumlah_jenis_satuan }}
          </div>
        </template>

        <!-- price -->
        <template #cell(harga)="{ item }">
          {{ item.fob | formatCurrency }} <strong>{{ item.valuta }}</strong>
        </template>

        <!-- tarif -->
        <template #cell(hs_tarif)="{ item }">
          <div>
            <u>{{ item.hs_raw_code }}</u>
          </div>
          <hr/>
          <div v-for="(k, id) in Object.keys(item.tarif.data)" :key="id">
            <div>
              <strong>{{ k }} : </strong>
              <!-- spesifik kah? -->
              <template v-if="item.tarif.data[k].jenis == 'SPESIFIK'">
                <span>{{ item.tarif.data[k].tarif | formatCurrency | displayRupiah }}</span>
                <strong>(SPESIFIK)</strong>
              </template>
              <!-- klo umum, ya tampilin % -->
              <template v-else>
                <span>{{ item.tarif.data[k].tarif }}</span> %
              </template>
            </div>
          </div>
        </template>

        <!-- tgl_penetapan -->
        <template #cell(updated_at)="{ value }">
          {{ dateOnly(value) }}
        </template>

    </b-table>
</template>

<script>
import niceties from '../mixins/niceties'
// import Datepicker from './Datepicker.vue'

export default {
    inheritAttrs: false,
    components: {
        // Datepicker
    },
    mixins: [
      niceties
    ],
    data () {
        return {
            fields: [
                {
                    key: 'header_info',
                    label: 'Dok Asal'
                },
                'uraian',
                'jumlah',
                'harga',
                {
                  key: 'hs_tarif',
                  label: 'HS & Tarif'
                },
                {
                  key: 'updated_at',
                  label: 'Tgl Penetapan'
                },
            ]
        }
    },

    methods: {
        uraianDanBruto(uraian) {
          let words =  uraian.split("\n")
          return words[0] + "\n" + words[1]
        },

        dateOnly(datetime) {
          return datetime.split(' ')[0]
        }
    }
}
</script>
