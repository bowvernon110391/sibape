<template>
    <b-container md="6" class="mt-2 mt-md-4 col-md-4 col-sm-12">
        <b-card
            header-bg-variant="dark"
            header-text-variant="light"
            footer-bg-variant="dark"
            footer-text-variant="light"
            class="shadow">
            <template v-slot:header>
                <h2>
                    <img src="../assets/logo.png" width="64px" class="mr-2">Login PATOPS
                </h2>
            </template>
            <template v-slot:footer>
                &copy; Duktek Soetta 2019
            </template>
            <!-- <b-card-title>
                Login SiBAPE
            </b-card-title> -->
            <b-form @submit.prevent="processLogin">
                <b-form-group
                    label="Username"
                    label-for="username"
                    description="Username SSO">
                    <b-input-group>
                        <b-form-input
                            id="username"
                            v-model.trim="username"
                            required
                            placeholder="Username sesuai SSO..."
                            type="text"
                            :disabled="!loginReady"></b-form-input>
                        <b-input-group-append>
                            <b-input-group-text>
                                <font-awesome-icon icon="user"></font-awesome-icon>
                            </b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                    
                </b-form-group>
                <b-form-group
                    label="Password"
                    label-for="password"
                    description="Password sesuai SSO">
                    <b-input-group>
                        <b-form-input
                            id="password"
                            v-model.trim="password"
                            required
                            placeholder="Password sesuai SSO..."
                            type="password"
                            :disabled="!loginReady"></b-form-input>
                        <b-input-group-append>
                            <b-input-group-text>
                                <font-awesome-icon icon="lock"></font-awesome-icon>
                            </b-input-group-text>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
                <b-form-group
                    label="Lokasi"
                    label-for="lokasi">
                    <b-form-select id="lokasi" required v-model="lokasi" :disabled="!loginReady">
                        <option :value="null">Pilih lokasi...</option>
                        <option value="T2F">T2F</option>
                        <option value="T3">T3</option>
                        <option value="KANTOR">KANTOR</option>
                        <option value="TPP">TPP</option>
                        <option value="GUDANG">GUDANG</option>
                    </b-form-select>
                </b-form-group>
                <b-alert :show="errorMsg.length" variant="danger">{{ errorMsg }}</b-alert>
                <div>
                    <b-button type="submit" variant="primary" :disabled="!loginReady">{{ loginButtonText }}<b-spinner small variant="light" v-if="!loginReady"></b-spinner></b-button>
                    <!-- <a href="./static/sso/api.php">SSO API</a> -->
                    <!-- <b-button type="button" variant="dark" @click="getUserInfo">Get UserInfo</b-button> -->
                </div>
            </b-form>
        </b-card>
        
        <!-- <pre>{{ JSON.stringify(userInfo) }}</pre> -->
    </b-container>
</template>

<script>
const axios = require('axios').default

export default {
    data () {
        return {
            username: '',
            password: '',
            attached: false,
            userInfo: null,
            errorMsg: '',
            loginStatus: 'Attaching',
            lokasi: null
        }
    },
    computed: {
        environment: function () {
            console.log(process)
            return process.NODE_ENV
        },
        loginButtonText () {
            if (this.loginStatus.length) {
                // still busy, return it
                return this.loginStatus
            } else {
                return "Login"
            }
        },
        loginReady () {
            return this.loginStatus.length == 0
        }
    },
    methods: {
        processLogin () {
            if (!this.loginReady) {
                alert('Login IS NOT READY BIATCH!!')
            }

            // set some status
            this.errorMsg = ''
            this.loginStatus = 'Logging in... '

            const fd = new FormData()
            fd.set('username', this.username)
            fd.set('password', this.password)

            axios({
                method: 'post',
                url: '/static/sso/api.php?command=login',
                data: fd,
                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            })
                .then( (e) => {
                    console.log('login success')
                    console.log(e)
                    // store user info locally
                    this.userInfo = e.data
                    this.errorMsg = ''
                    this.loginStatus = 'Redirecting to homepage... '

                    // store at central store
                    this.$store.commit('setUserInfo', e.data)
                    this.$store.commit('setLokasi', this.lokasi)

                    // redirect to home?
                    this.$router.push({
                        path: '/'
                    })
                })
                .catch( (e) => {
                    console.log('login error')
                    console.log(e.response)
                    if (e.response) {
                        // got some response with the error
                        this.errorMsg = e.response.data.error
                    } else {
                        this.errorMsg = e
                    }
                    this.loginStatus = ''
                })
        },
        getUserInfo () {
            axios({
                method: 'get',
                url: '/static/sso/api.php?command=getUserInfo'
            })
            .then((e) => {
                this.userInfo = e
            })
            .catch((e) => {
                alert(e.data)
            })
        }
    },
    created () {
        var vm = this

        // first, attaching
        this.loginStatus = "Attaching Session... "
        $.ajax({
            url: '/static/sso/api.php?command=attach',
            crossDomain: true,
            dataType: 'jsonp'
        })
        .done(function(data) {
            console.log('success')
            console.log(data)
            vm.attached = true
        })
        .fail(function(jqxhr) {
            console.log('error')
            console.log(jqxhr)
        })
        .always(function () {
            vm.loginStatus = ''
        })
    }
}
</script>