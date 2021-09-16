<template>
  <li>
    <router-link v-if="to && !hasUrl" :to="to" tag="a" active-class="active-route" @click.native="handleRouteClick">
      <!-- <span v-if="icon" v-html="icon"></span> -->
      <c-icon :icon="icon" v-if="icon"/>
      {{ text }}
      <!-- spawn dynamic components here -->
    </router-link>
    <a v-else-if="hasUrl" :href="to" target="_blank" rel="noreferrer" @click="handleRouteClick">
        <c-icon :icon="icon" v-if="icon"/>
        {{ text }}
    </a>
    <a v-else :class="{ 'dropdown-toggle': children }" @click="handleClick">
      <!-- <span v-if="icon" v-html="icon"></span> -->
      <c-icon :icon="icon" v-if="icon"/>
      {{ text }}
    </a>
    <template v-if="children">
      <b-collapse v-model="showChildren">
        <SideNavItemList :option="children"></SideNavItemList>
      </b-collapse>
    </template>
  </li>
</template>

<script>
import SideNavItemList from "@/components/SideNavItemList"
import CIcon from './CIcon.vue';

export default {
  name: 'SideNavItem',
  components: {
    SideNavItemList,
    CIcon
  },
  props: {
    children: {
      type: Array,
      default: null
    },
    text: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    }
  },

  data() {
    return {
      id: null,
      showChildren: false
    };
  },

  computed: {
      hasUrl() {
          return this.to && (this.to.match(/(^https?)\:([^\s]+)/i) != null)
      }
  },

  methods: {
    handleClick() {
      this.showChildren = !this.showChildren;
    //   alert("CLIIICK" + String(this.show));
    },

    handleRouteClick() {
        if (this.$store.getters.mobileScreen) {
            // hide on mobile
            console.log('nav item route clicked. hide sidebar...')
            this.$store.commit('setSidebarActive', false)
        }
    }
  },

  mounted() {
    this.id = this._uid;
  },

  beforeCreate: function () {
      this.$options.components.SideNavItemList = require('./SideNavItemList.vue').default
  }
};
</script>
