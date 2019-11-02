const axios = require('axios').default

/**
 * apiSibape : class merepresentasikan api-backend sibape
 * @param {*} url : url backend
 * @param {*} timeout : timeout per request (jgn ngandelin kecepatan server, gunakan akal sehat)
 */
class ApiSibape {
    // private instance. made when initialized I guess
    constructor(url, timeout) {
        this.instance = axios.create({
            baseURL: url,
            timeout: timeout
        })
    }

    // setToken (token) : ngeset semua access token tiap request    
    setToken (token) {
        this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // getKurs (param) : GET /kurs. param = data, e.g. { q:'CNY', tanggal:'2019-01-01' }
    getKurs (param) {
        return this.instance.get('/kurs', {
            params: param
        })
    }

    // getKursById (id) : GET /kurs/:id
    getKursById (id) {
        return this.instance.get('/kurs/' + id);
    }
}

export {
    ApiSibape
}
