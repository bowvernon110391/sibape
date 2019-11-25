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

    // getHS (param) : GET /hs
    getHS (param) {
        return this.instance.get('/hs', {
            params: param
        })
    }

    // getPelabuhan (param) : GET /pelabuhan
    getPelabuhan (param) {
        return this.instance.get('/pelabuhan', {
            params: param
        })
    }

    // getPelabuhanByKode (kode) : GET /pelabuhan/:kode
    getPelabuhanByKode (kode) {
        return this.instance.get('/pelabuhan/' + kode)
    }

    // getKemasan (param) : GET /kemasan
    getKemasan (param) {
        return this.instance.get('/kemasan', {
            params: param
        })
    }

    // getKemasanByKode (kode) : GET /kemasan/:kode
    getKemasanByKode (kode) {
        return this.instance.get('/kemasan/' + kode)
    }

    // getSatuan (param) : GET /satuan
    getSatuan (param) {
        return this.instance.get('/satuan', {
            params: param
        })
    }

    // getSatuanByKode (kode) : GET /satuan/:kode
    getSatuanByKode (kode) {
        return this.instance.get('/satuan/' + kode)
    }

    // getJenisDetailSekunder () : GET /jenis-detail-sekunder
    getJenisDetailSekunder () {
        return this.instance.get('/jenis-detail-sekunder')
    }

    //==================RESOURCE : CD===========================================================
    // getCd () : GET /cd
    getCd (param) {
        return this.instance.get('/cd', {
            params: param
        })
    }

    // getCdById (id) : GET /cd/{id}
    getCdById (id) {
        return this.instance.get('/cd/' + id, {
            params: {
                include: 'pelabuhan_asal,pelabuhan_tujuan'
            }
        })
    }

    // createCd (data) : POST /cd
    createCd (dataCd) {
        return this.instance.post('/cd', dataCd)
    }

    // updateCd (dataCd) : PUT /cd/{id}
    updateCd (id, dataCd) {
        return this.instance.put('/cd/' + id, dataCd)
    }

    // deleteCd (id) : DELETE /cd/{id}
    deleteCd (id) {
        return this.instance.delete('/cd/' + id)
    }

    // getCdDetails (id, param) : GET /cd/:id/details?param
    getCdDetails (id, param) {
        return this.instance.get(`/cd/${id}/details`, {
            params: param
        })
    }

    // getCdDetailById (id, param) : GET /cd/details/:id?param
    getCdDetailById (id, param) {
        return this.instance.get('/cd/details/' + id, {
            params: param
        })
    }

    // createCdDetail (id, data) : POST /cd/:id/details
    createCdDetail (id, data) {
        return this.instance.post(`/cd/${id}/details`, data)
    }

    // updateCdDetail (id, data) : PUT /cd/details/:id
    updateCdDetail (id, data) {
        return this.instance.put('/cd/details/' + id, data)
    }

    // deleteCdDetail (id) : DELETE /cd/details/:id
    deleteCdDetail (id) {
        return this.instance.delete('/cd/details/' + id)
    }
}

export {
    ApiSibape
}
