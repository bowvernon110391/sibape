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

    //===================GENERIC SECTION========================================
    // setToken (token) : ngeset semua access token tiap request    
    setToken (token) {
        this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    //==================RESOURCE : KURS========================================
    // getKurs (param) : GET /kurs. param = data, e.g. { q:'CNY', tanggal:'2019-01-01' }
    getKurs (param) {
        return this.instance.get('/kurs', {
            params: param
        })
    }

    // getKursById (id) : GET /kurs/:id
    getKursById (id) {
        return this.instance.get('/kurs/' + id)
    }

    //=================RESOURCE : PENUMPANG====================================
    // getPenumpang (param) : GET /penumpang. param = search data
    getPenumpang (param) {
        return this.instance.get('/penumpang', {
            params: param
        })
    }

    // getPenumpangById (id) : GET /penumpang/:id
    getPenumpangById (id) {
        return this.instance.get('/penumpang/' + id)
    }

    // createPenumpang (data) : POST /penumpang. data = json of penumpang data
    createPenumpang (data) {
        return this.instance.post('/penumpang', data)
    }

    // updatePenumpang (id, data) : PUT /penumpang/:id. data = json of penumpang data
    updatePenumpang (id, data) {
        return this.instance.put('/penumpang/' + id, data)
    }

    // deletePenumpang (id) : DELETE /penumpang/:id
    deletePenumpang (id) {
        return this.instance.delete('/penumpang/' + id)
    }

    //===================RESOURCE : COMMON======================================================
    // getNegara () : GET /negara
    getNegara () {
        return this.instance.get('/negara')
    }

    // createNegara (data) : POST /negara
    createNegara (data) {
        return this.instance.post('/negara', data)
    }

    // getKategori () : GET /kategori
    getKategori () {
        return this.instance.get('/kategori')
    }

    // createKategori (data) : POST /kategori
    createKategori (data) {
        return this.instance.post('/kategori', data)
    }
}

export {
    ApiSibape
}
