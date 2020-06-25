<template>
  <div>
    <b-card no-body class="rounded shadow">
      <!-- HEADER -->
      <b-card-header>
        <div class="d-sm-block d-md-flex my-2">
          <!-- BANNER -->
          <doc-banner doctype="LHP" :data="dataLhp" :is-new="false" />

          <!-- CONTROLS -->
          <lhp-controls :data="dataLhp" />
        </div>
      </b-card-header>

      <!-- BODY, USE TABS -->
      <b-tabs card v-model="tabId">
        <!-- Header -->
        <b-tab title="LHP" active>
          <lhp-contents v-model="dataLhp" :disabled="disableInput" />
          <!-- <pre>{{ JSON.stringify(dataLhp, null, 2) }}</pre> -->
        </b-tab>

        <!-- Lampiran, only if id is valid -->
        <b-tab title="Lampiran" v-if="endpoint" lazy>
          <attachment-bucket show :disabled="disableInput" :endpoint="endpoint" />
        </b-tab>

        <!-- IP, klo valid -->
        <b-tab title="Instruksi Pemeriksaan" v-if="getValidIp">
          <b-row>
            <b-col md="6">
              <ip-contents show-issuer disabled :value="getValidIp" />
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>

      <!-- FOOTER -->
      <b-card-footer v-if="tabId == 0">
        <div>
          <b-button variant="primary" :disabled="disableInput" @click="onSave">
            <font-awesome-icon icon="save" />&nbsp;Simpan
          </b-button>
        </div>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>
import axiosErrorHandler from "../mixins/axiosErrorHandler";
import userChecker from "../mixins/userChecker";

import { mapGetters, mapMutations } from "vuex";

import LhpControls from '@/components/LhpControls'
import LhpContents from "@/components/LhpContents";
import IpContents from "@/components/IpContents";

import DocBanner from "@/components/DocBanner";

import AttachmentBucket from "@/components/AttachmentBucket";

import defaultLhp from "@/defaults/defaultLhp";

const cloneDeep = require("clone-deep");

export default {
  mixins: [axiosErrorHandler, userChecker],
  components: {
    LhpControls,
    LhpContents,
    IpContents,
    DocBanner,
    AttachmentBucket
  },

  props: {
    id: [Number, String]
  },

  // internal data
  data() {
    return {
      dataLhp: defaultLhp,
      tabId: 0
    };
  },

  computed: {
    ...mapGetters(["api", "lokasi"]),

    disableInput() {
      return this.dataLhp.is_locked;
    },

    endpoint() {
      if (isNaN(this.id)) {
        return null;
      }
      return `/lhp/${this.id}/lampiran`;
    },

    getValidIp() {
      return this.dataLhp.inspectable &&
        this.dataLhp.inspectable.data.pemeriksa_id
        ? this.dataLhp.inspectable.data
        : null;
    }
  },

  methods: {
    ...mapMutations(["setBusyState"]),
    // return default lhp
    defaultData: () => {
      return cloneDeep({
        ...defaultLhp,
        lokasi: this.lokasi
      });
    },

    // onSave
    onSave() {
      this.setBusyState(true)
      // we update while also lock it
      this.api.putLhp(this.dataLhp.instructable_uri + '/lhp', this.dataLhp, {
        lock: true
      })
      .then(e => {
        this.setBusyState(false)
        // just reload it
        this.loadLhpData(this.id)
      })
      .catch(e => {
        this.setBusyState(false)
        this.handleError(e)
      })
    },

    // load lhp data? by id
    loadLhpData(id) {
      console.log(`Loading lhp #${id}`);
      if (isNaN(id)) {
        return;
      }
      this.setBusyState(true);
      // call api
      this.api
        .getLhpById(id, {
          include: "inspectable"
        })
        .then(e => {
          this.setBusyState(false);
          this.dataLhp = e.data.data;
        })
        .catch(e => {
          this.setBusyState(false);
          this.handleError(e);
        });
    }
  },

  created() {
    // load data
    this.loadLhpData(this.id);
  },

  watch: {
    id: {
      handler(newVal) {
        this.loadLhpData(newVal);
      }
    }
  }
};
</script>