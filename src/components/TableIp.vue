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
  >
    <!-- jenis dok -->
    <template #cell(instructable_type)="{ value }">
      <b-badge :variant="badgeVariant(value)">{{ value }}</b-badge>
    </template>
    <!-- custom cell for action -->
    <template #cell(action)="row">
      <div class="text-center">
        <!-- Ambil/Periksa button -->
        <b-button
          size="sm"
          variant="primary"
          :disabled="!canEdit(row.item)"
          class="shadow"
          @click="spawnLhp(row.item.instructable_uri)"
          v-if="canEdit(row.item)"
        >
          <font-awesome-icon icon="pencil-alt" />&nbsp;
          Ambil/Periksa
        </b-button>
        <!-- Lihat LHP -->
        <b-button v-else size="sm" variant="danger" class="shadow" @click="redirectToLhp(row.item.lhp.data.id)">
          <font-awesome-icon icon="eye" />&nbsp;
          Lihat LHP
        </b-button>
      </div>
    </template>
  </b-table>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import niceties from '../mixins/niceties'

export default {
  inheritAttrs: false,

  mixins: [axiosErrorHandler, niceties],

  data() {
    return {
      fields: [
        "nomor_lengkap",
        "tgl_dok",
        { label: "Jenis Dok", key: 'instructable_type', class: 'text-center' },
        {
          label: "Nama Pejabat",
          key: "nama_issuer"
        },
        {
          label: "NIP Pejabat",
          key: "nip_issuer"
        },
        "action"
      ]
    };
  },

  methods: {
    ...mapMutations(["setBusyState"]),

    redirectToLhp(id) {
      this.$router.push({
        path: `/lhp/${id}`
      });
    },

    spawnLhp(uri) {
      this.setBusyState(true);

      this.api
        .putLhp(`${uri}/lhp`, {
          lokasi: this.lokasi
        }, null)
        .then(e => {
          this.setBusyState(false);

          const uri = e.data.uri;

          // redirect to it
          this.$router.push({
            path: uri
          });
        })
        .catch(e => {
          this.setBusyState(false);
          this.handleError(e);
        });
    },

    canEdit(ip) {
      return ip.lhp ? !ip.lhp.data.is_locked : true;
    }
  },

  computed: {
    ...mapGetters(["api", "lokasi"])
  }
};
</script>