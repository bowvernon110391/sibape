<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
            <b-container>
                <b-navbar-brand to="/">
                    <img style="max-height: 25px;" src="../assets/logo.png"/>
                </b-navbar-brand>
                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item-dropdown text="Dokumen">
                            <b-dropdown-item to="/cd">Browse Customs Declaration</b-dropdown-item>
                            <b-dropdown-item to="/cd">Impor Sementara</b-dropdown-item>
                            <b-dropdown-item to="/cd">SPMB</b-dropdown-item>
                            <b-dropdown-item to="/cd">SSPCP</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                    
                    <b-navbar-nav>                        
                        <b-nav-item-dropdown text="Referensi">
                            <b-dropdown-item to="/penumpang">Penumpang</b-dropdown-item>
                            <b-dropdown-item to="/kurs">Kurs</b-dropdown-item>
                            <b-dropdown-item to="/kurs">Valas</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>

                    <b-navbar-nav>
                        <!-- <b-nav-item href="#">Lost & Found</b-nav-item> -->
                        <b-nav-item href="#">Laporan</b-nav-item>
                    </b-navbar-nav>

                    <b-navbar-nav class="ml-auto">
                        <b-nav-item-dropdown right>
                            <template v-slot:button-content>
                                <span>{{ userInfo.name }}</span>
                            </template>
                            <b-dropdown-item href="#">Profile</b-dropdown-item>
                            <b-dropdown-item href="#">Reset Password</b-dropdown-item>
                            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <b-container>
            <!-- breadcrumb -->
            <b-breadcrumb>
                <b-breadcrumb-item v-for="(bc, id) in this.validBreadCrumbs" :key="id" :to="bc.path" :disabled="bc.disabled" :active="bc.disabled">{{ bc.title }}</b-breadcrumb-item>
            </b-breadcrumb>
            <span class="h4 data-title">{{ this.$route.meta.title }}</span>
            <hr />
            <router-view></router-view>
        </b-container>
            
        <b-container>
            <hr />
            @ footer 2019
        </b-container>
        <b-modal 
            v-model="this.$store.state.busy"
            id="loading-screen"
            centered 
            title="Loading..."
            no-close-on-backdrop
            ok-disabled
            hide-header-close
            size="sm"
            variant="danger"
            text-variant="danger">
            <!-- <b-progress :value="100" :max="100" animated variant="danger"></b-progress> -->
            <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
            <hr />
            <p>Please wait..</p>
        </b-modal>
    </div>
</template>

<script>
export default {
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
        }
    }
}
</script>