<template>
  <div class="wrapper">
    <side-nav :options="menuOption">
      <template #header>
        <img src="@/assets/logo.png" height="40px" />
        <h3>Is this okay?</h3>
        <h6>
          <font-awesome-icon icon="user-secret" />nope.
        </h6>
      </template>
    </side-nav>
    <div id="content" :class="[{ active: $store.getters.sidebar }, 'p-3']">
      <navbar />
      <b-container id="contents-section" class="pt-2" fluid>
        <!-- breadcrumb -->
        <b-breadcrumb class="border rounded bg-light shadow">
          <b-breadcrumb-item
            v-for="(bc, id) in this.validBreadCrumbs"
            :key="id"
            :to="bc.path"
            :disabled="bc.disabled"
            :active="bc.disabled"
          >{{ bc.title }}</b-breadcrumb-item>
        </b-breadcrumb>
        <!-- <span class="h4" v-if="$route.meta.title">{{ this.$route.meta.title }}</span>
        <hr />-->
        <h4 v-if="$route.meta.title">{{ this.$route.meta.title }}</h4>
        <hr />
        <router-view></router-view>
      </b-container>

      <b-container fluid>
        <hr />&copy;
        <a href="mailto:duktek.soetta@customs.go.id">Duktek Soetta</a> 2019
      </b-container>
    </div>

    <modal-select-location id="modal-select-location" size="sm"></modal-select-location>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Navbar from "@/components/Navbar";
import ModalSelectLocation from "@/components/ModalSelectLocation";
import SideNav from "@/components/SideNav";

import userChecker from "../mixins/userChecker";
import appMethod from "../mixins/appMethod";
import menuGenerator from "../mixins/menuGenerator";

import menuInput from "@/assets/menu.json";

export default {
  mixins: [userChecker, appMethod, menuGenerator],

  data() {
    return {
      menuInput: menuInput
    };
  },

  computed: {
    menuOption() {
      var result = [];
      this.menuInput.forEach(e => {
        this.processElement(result, e);
      });
      return result;
    }
  },

  components: {
    Navbar,
    ModalSelectLocation,
    SideNav
  }
};
</script>
