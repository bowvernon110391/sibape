<template>
    <div>
        <navbar/>
        <b-container id="contents-section" class="pt-2" fluid>
            <!-- breadcrumb -->
            <b-breadcrumb class="border rounded bg-light shadow">
                <b-breadcrumb-item v-for="(bc, id) in this.validBreadCrumbs" :key="id" :to="bc.path" :disabled="bc.disabled" :active="bc.disabled">{{ bc.title }}</b-breadcrumb-item>
            </b-breadcrumb>
            <!-- <span class="h4" v-if="$route.meta.title">{{ this.$route.meta.title }}</span>
            <hr /> -->
            <h4 v-if="$route.meta.title">{{ this.$route.meta.title }}</h4>
            <hr>
            <router-view></router-view>
        </b-container>
            
        <b-container fluid>
            <hr>
            &copy; <a href="mailto:duktek.soetta@customs.go.id">Duktek Soetta</a> 2019
        </b-container>

        <modal-select-location
            id="modal-select-location"
            size="sm">
        </modal-select-location>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import Navbar from '@/components/Navbar'
import ModalSelectLocation from '@/components/ModalSelectLocation'

import userChecker from '../mixins/userChecker'
import appMethod from '../mixins/appMethod'

export default {
    mixins: [ userChecker, appMethod ],

    components: {
        Navbar,
        ModalSelectLocation
    }
}
</script>

<style scoped>
#navbar {
    box-shadow: 0 1px 8px 4px rgba(0, 0, 0, 0.5);
    /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#45484d+0,000000+100;Black+3D+%231 */
background: #45484d; /* Old browsers */
background: -moz-linear-gradient(top,  #45484d 0%, #000000 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top,  #45484d 0%,#000000 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  #45484d 0%,#000000 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#45484d', endColorstr='#000000',GradientType=0 ); /* IE6-9 */

}

.banner-text {
    margin-left: .25em;
}

.smol-text {
    font-size: .75em;
    margin-bottom: 0;
    line-height: .5em;
}
</style>