<template>
  <!-- Wrapper -->
  <div class="wrapper">
    <!-- Sidebar Navigation -->
    <side-nav :options="menuOption">
      <template #header>
        <h3>
          <img src="@/assets/banner_icon.png" height="32px" />
          PATOPS
        </h3>
        <h6>versi {{ $store.getters.version }}</h6>
      </template>
    </side-nav>
    <!-- The content section houses page contents -->
    <div id="content" :class="[{ active: $store.getters.sidebar }]">
      <vuescroll :ops="scrollOptions">
        <div class="p-3">
          <!-- Real container -->
          <b-container fluid id="contents-section" class="mt-2">
            <!-- Navbar -->
            <navbar />
            <!-- Breadcrumb -->
            <breadcrumb class="mt-2 mb-3" />
            <!-- <span class="h4" v-if="$route.meta.title">{{ this.$route.meta.title }}</span>
            <hr />-->
            <h4 v-if="$route.meta.title">{{ this.$route.meta.title }}</h4>
            <hr />

            <!-- Per route view -->
            <router-view></router-view>
          </b-container>

          <div>
            <hr />&copy;
            <a href="mailto:duktek.soetta@customs.go.id">Duktek Soetta</a> 2019
          </div>
        </div>
      </vuescroll>
    </div>

    <modal-select-location id="modal-select-location" size="sm"></modal-select-location>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import Navbar from "@/components/Navbar";
import ModalSelectLocation from "@/components/ModalSelectLocation";
import SideNav from "@/components/SideNav";
import Breadcrumb from "@/components/Breadcrumb";

import vuescroll from "vuescroll";

import userChecker from "../mixins/userChecker";
import appMethod from "../mixins/appMethod";
import menuGenerator from "../mixins/menuGenerator";

import menuInput from "@/assets/menu.json";

export default {
  mixins: [userChecker, appMethod, menuGenerator],

  methods: {
    checkRole(roles) {
      var result = this.$store.getters.hasRole(roles);
      // console.log("Checking roles: ", roles, "result: ", result)
      // console.log("Checking against: ", this.$store.getters.roles)
      console.log(
        "Checking roles [ ",
        roles,
        "] <-> ",
        this.$store.getters.roles,
        " : ",
        result
      );
      return result;
    }
  },

  computed: {
    menuOption() {
      var result = [];
      menuInput.forEach(e => {
        this.processElement(result, e);
      });
      return result;
    },

    scrollOptions() {
      return {
        bar: {
          background: "#aaa"
        },
        scrollPanel: {
          scrollingX: false
        }
      };
    }
  },

  components: {
    Navbar,
    ModalSelectLocation,
    SideNav,
    Breadcrumb,
    vuescroll
  }
};
</script>
