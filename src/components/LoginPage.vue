<template>
    <b-container>
        <b-form @submit.prevent="processLogin">
            <b-form-group
                label="Username"
                label-for="username"
                description="Username SSO">
                <b-form-input
                    id="username"
                    v-model.trim="username"
                    required
                    placeholder="Username sesuai SSO..."
                    type="text"></b-form-input>
            </b-form-group>
            <b-form-group
                label="Password"
                label-for="password"
                description="Password sesuai SSO">
                <b-form-input
                    id="password"
                    v-model.trim="password"
                    required
                    placeholder="Password sesuai SSO..."
                    type="password"></b-form-input>
            </b-form-group>
            <b-alert :show="errorMsg.length" variant="danger">{{ errorMsg }}</b-alert>
            <div>
                <b-button type="submit" variant="primary">Login</b-button>
                <!-- <a href="./static/sso/api.php">SSO API</a> -->
                <b-button type="button" variant="dark" @click="getUserInfo">Get UserInfo</b-button>
            </div>
        </b-form>
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
            errorMsg: ''
        }
    },
    methods: {
        processLogin () {
            if (!this.attached) {
                alert('SSO not attached, would cause error')
            }

            this.errorMsg = ''

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

                    // store at central store
                    this.$store.commit('setUserInfo', e.data)

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
    }
}
</script>