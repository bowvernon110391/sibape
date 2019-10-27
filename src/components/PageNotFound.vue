<template>
    <b-container>
        <div class="text-center">
            <b-card no-body style="max-width: 540px" class="mt-2 mt-md-5 mx-auto">
                <b-row no-gutters>
                    <b-col md="6">
                        <div class="fa fa-frown-o fa-10x">
                        </div>
                    </b-col>
                    <b-col md="6">
                        <b-card-body
                            title="404 Page Not Found">
                            <b-card-text>
                                Halaman yang ente cari kagak ketemu cuy :'(
                            </b-card-text>
                            <b-button variant="primary" to="/" @click="setBusy" :disabled="busy">
                                <span v-if="busy">
                                    Redirecting... <b-spinner small variant="light"></b-spinner>
                                </span>
                                <span v-else>
                                    Kembali ke Home
                                </span>
                            </b-button>
                        </b-card-body>
                    </b-col>
                </b-row>
            </b-card>
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'PageNotFound',
    data () {
        return {
            busy: false
        }
    },
    methods: {
        setBusy () {
            this.busy = true
            // alert('busy...')
        }
    }
}
</script>