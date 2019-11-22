const axiosErrorHandler = {
    methods: {
        // show success message
        showToast(title,message,variant) {
            this.$bvToast.toast(message, {
                title: title,
                autoHideDelay: 5000,
                appendToast: true,
                toaster: 'b-toaster-top-center',
                variant: variant
            })
        },
        // show floating error
        showError(code, message) {
            this.showToast(`Error (${code})`, message, 'danger')
        },
        // handle error from axios
        handleError (e) {
            var code = 0
            var msg = '<GENERIC ERROR TEXT>'
            // e is axios error
            if (e.response) {
                // got response
                if (e.response.data && e.response.data.error) {
                    // stylized error
                    code = e.response.data.error.http_code
                    msg = e.response.data.error.message
                } else {
                    code = e.status
                    msg = e.statusText
                }
            } else {
                code = '?'
                msg = e.toString()
            }

            // show floating text
            this.showError(code, msg)
        }
    }
}

export default axiosErrorHandler