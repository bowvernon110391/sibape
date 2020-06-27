<template>
  <div>
    <p class="text-right" v-if="!disabled">
      <b-button size="sm" variant="primary" class="shadow" :disabled="disabled" @click="addRow">
        <font-awesome-icon icon="plus-square" />&nbsp;Tambah
      </b-button>
    </p>
    <b-table
      small
      hover
      striped
      bordered
      head-variant="dark"
      class="shadow"
      :items="value"
      :fields="fields"
      show-empty
    >
      <!-- EMPTY SLOT -->
      <template #empty>
        <b-alert variant="warning" show class="m-0">Tidak ada dokkap untuk dokumen ini</b-alert>
      </template>

      <!-- custom row number -->
      <template #cell(no)="row">{{ row.index + 1 }}</template>

      <!-- Jenis Dokkap -->
      <template #cell(jenis_dokkap_id)="row">
        <select-jenis-dokkap v-model="row.item.jenis_dokkap_id" :disabled="disabled" />
      </template>

      <!-- Nomor dokumen should use edit -->
      <template #cell(nomor_lengkap)="row">
        <b-form-input type="text" v-model="row.item.nomor_lengkap" :disabled="disabled" />
      </template>

      <!-- Tgl dokumen use datepicker -->
      <template #cell(tgl_dok)="row">
        <datepicker v-model="row.item.tgl_dok" :disabled="disabled" />
      </template>

      <!-- Action for delete only for now -->
      <template #cell(action)="row">
        <div class="text-center">
          <b-button
            size="sm"
            variant="danger"
            class="shadow"
            :disabled="disabled"
            @click="delRow(row.item)"
          >
            <font-awesome-icon icon="trash-alt" />
          </b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import SelectJenisDokkap from "@/components/SelectJenisDokkap";
import Datepicker from "@/components/Datepicker";

export default {
  inheritAttrs: false,

  components: {
    SelectJenisDokkap,
    Datepicker
  },

  props: ["value", "disabled"],

  data() {
    return {
      fields: [
        { label: "No.", key: "no" },
        { label: "Jenis Dokumen Pelengkap", key: "jenis_dokkap_id" },
        { label: "Nomor Dokumen", key: "nomor_lengkap" },
        { label: "Tanggal", key: "tgl_dok", class: "datepicker-width" },
        { label: "Action", key: "action" }
      ]
    };
  },

  methods: {
    addRow() {
      this.value.push({
        id: null,
        nomor_lengkap: null,
        tgl_dok: null,
        jenis_dokkap_id: null
      });
    },

    async delRow(obj) {
      // just remove it from its value array
      var id = this.value.findIndex(e => e === obj);

      if (id < 0) return;

      var result = await this.$bvModal.msgBoxConfirm(
        `Yakin mau menghapus dokkap ini?`,
        {
          title: `Menghapus Dokkap #${id+1}`,
          size: "md",
          buttonSize: "md",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        }
      );

      if (result) {
          this.value.splice(id, 1)
      }
    }
  }
};
</script>