<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" id="navbar">
            <b-container>
                <b-navbar-brand to="/">
                    <img style="max-height: 25px;" src="../assets/banner_icon.png"/>
                </b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item-dropdown text="Dokumen">
                            <b-dropdown-item to="/cd">💰Customs Declaration (CD)</b-dropdown-item>
                            <b-dropdown-item to="/sbp">👮Bukti Penindakan (SBP)</b-dropdown-item>
                            <b-dropdown-item to="/is">⏲️Impor Sementara (IS)</b-dropdown-item>
                            <b-dropdown-item to="/spmb">🛫SPMB</b-dropdown-item>
                            <b-dropdown-item to="/st">🛅Surat Titipan (ST)</b-dropdown-item>
                            <b-dropdown-item to="/spp">✋Surat Penundaan Pengeluaran (SPP)</b-dropdown-item>
                            <b-dropdown-item to="/bc32">💸Pembawaan Mata Uang (BC32)</b-dropdown-item>
                            <!-- <b-dropdown-item to="/sspcp">💸SSPCP</b-dropdown-item> -->
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                    
                    <b-navbar-nav>                        
                        <b-nav-item-dropdown text="Referensi">
                            <b-dropdown-item to="/penumpang">👨Penumpang</b-dropdown-item>
                            <b-dropdown-item to="/kurs">💲Kurs</b-dropdown-item>
                            <b-dropdown-item to="/bpj">📝Jaminan</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>

                    <b-navbar-nav>
                        <!-- <b-nav-item href="#">Lost & Found</b-nav-item> -->
                        <b-nav-item href="#">Laporan</b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <template v-slot:button-content>
                                <span><font-awesome-icon icon="user-circle"></font-awesome-icon> {{ userInfo.name }} @ {{ lokasi }}</span>
                            </template>
                            <b-dropdown-item to="/profile"><font-awesome-icon icon="user"></font-awesome-icon> Profile</b-dropdown-item>
                            <b-dropdown-item to="/resetpassword"><font-awesome-icon icon="lock"></font-awesome-icon> Reset Password</b-dropdown-item>
                            <b-dropdown-item @click="logout"><font-awesome-icon icon="power-off"></font-awesome-icon> Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <b-container id="contents-section" class="pt-2">
            <!-- breadcrumb -->
            <b-breadcrumb class="border rounded bg-light shadow">
                <b-breadcrumb-item v-for="(bc, id) in this.validBreadCrumbs" :key="id" :to="bc.path" :disabled="bc.disabled" :active="bc.disabled">{{ bc.title }}</b-breadcrumb-item>
            </b-breadcrumb>
            <span class="h4 data-title">{{ this.$route.meta.title }}</span>
            <hr />
            <router-view></router-view>
        </b-container>
            
        <b-container>
            <hr />
            &copy; <a href="mailto:duktek.soetta@customs.go.id">Duktek Soetta</a> 2019
        </b-container>
    </div>
</template>

<script>
const axios = require('axios').default

export default {
    methods: {
        // to logout of sso session
        logout () {
            this.$store.commit('setBusyState', true)

            // call api
            axios({
                method: 'post',
                url: '/static/sso/api.php?command=logout'
            })
            .then(e => {
                this.$store.commit('setBusyState', false)
                // clear local data
                this.$store.commit('clearLocalData')
                // success. return to login page?
                // also might want to cleanup store data
                this.$router.push({
                    path: '/login'
                })
            })
            .catch(e => {
                this.$store.commit('setBusyState', false)
                // failed. you may try again
            })
        }
    },
    computed: {
        validBreadCrumbs () {
            var validBreadCrumbs = this.$route.matched
                                .filter(e=>e.meta.breadcrumb)
                                .map(e=>( { path: e.path.length ? e.path : '/', title: e.meta.breadcrumb, disabled: false} ));

            validBreadCrumbs[validBreadCrumbs.length-1].disabled = true;
            validBreadCrumbs[validBreadCrumbs.length-1].path = null;

            console.log('<<MainApp>>')
            console.log(this.$route)
            console.log(this.$route.matched.filter(e => e.meta.breadcrumb));
            console.log('<</MainApp>>')
            return validBreadCrumbs;
        },
        userInfo () {
            return this.$store.state.userInfo
        },
        lokasi () {
            return this.$store.getters.lokasi
        }
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
</style>