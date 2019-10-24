<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="dark" class="mb-2">
            <b-container>
                <b-navbar-brand to="/"><i class="fa fa-user"></i> SiBAPE</b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav>
                        <b-nav-item-dropdown text="Dokumen">
                            <b-dropdown-item to="/cd">Customs Declaration</b-dropdown-item>
                        </b-nav-item-dropdown>
                        
                        <b-nav-item-dropdown text="Referensi">
                            <b-dropdown-item to="/penumpang">Penumpang</b-dropdown-item>
                            <b-dropdown-item to="/kurs">Kurs</b-dropdown-item>
                            <b-dropdown-divider></b-dropdown-divider>
                            <b-dropdown-item>Settings</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
        <!-- <ul>
            <li v-for="(r, id) in $route.matched" :key="id">
                {{ r.meta.breadcrumb }}
            </li>
        </ul> -->
        <b-container>
            <b-breadcrumb>
                <b-breadcrumb-item v-for="(bc, id) in this.validBreadCrumbs" :key="id" :to="bc.path" :disabled="bc.disabled" :active="bc.disabled">{{ bc.title }}</b-breadcrumb-item>
            </b-breadcrumb>
        </b-container>
        <router-view></router-view>
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
            <b-spinner variant="primary"></b-spinner>
            <template v-slot:modal-footer>
                <!-- <b-button type="button" variant="danger" size="sm">Abort</b-button> -->
                <p>Please wait...</p>
            </template>
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
        }
    }
}
</script>