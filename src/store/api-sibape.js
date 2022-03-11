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

    // generateUrl (endpoint) : menggenerate absolute url utk endpoint tertentu
    //  eg: generateUrl('cd/2') => https://apishinta.test/cd/2
    generateUrl (endpoint) {
        return this.instance.defaults.baseURL + endpoint.replace(/^\/+|\/+$/g, '')
    }

    // call GET on /endpoint
    getEndpoint (endpoint) {
        return this.instance.get(endpoint)
    }

    // call post on /endpoint
    postEndpoint (endpoint, data) {
        return this.instance.post(endpoint, data)
    }

    // call PUT on /endpoint
    putEndpoint (endpoint, data) {
        return this.instance.put(endpoint, data)
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

    // deleteKurs (id) : DELETE /kurs/:id
    deleteKurs (id) {
        return this.instance.delete('/kurs/' + id)
    }

    // grabKurs () : POST /kurs/bkf
    grabKurs () {
        return this.instance.post('/kurs/bkf')
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
    // getAirline () : GET /airline
    getAirline () {
        return this.instance.get('/airline')
    }

    // getAirlineByKode () : GET /airline/{kode}
    getAirlineByKode (kode) {
        return this.instance.get('/airline/' + kode)
    }

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

    // getHSById (id) : GET /hs/:id
    getHSById (id) {
        return this.instance.get('/hs/' + id)
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

    // getJenisDokkap () : GET /dokkap
    getJenisDokkap () {
        return this.instance.get('/dokkap')
    }

    // getJenisPungutan () : GET /jenis-pungutan
    getJenisPungutan () {
        return this.instance.get('/jenis-pungutan')
    }

    // getLokasi () : GET /lokasi
    getLokasi () {
        return this.instance.get('/lokasi')
    }

    // getTps () : GET /tps
    getTps () {
        return this.instance.get('/tps')
    }

    // getPjt () : GET /pjt
    getPjt () {
        return this.instance.get('/pjt')
    }

    // createPjt () : POST /pjt
    createPjt (data) {
        return this.instance.post('/pjt', data)
    }

    // getGudang () : GET /gudang?include=tps
    getGudang () {
        return this.instance.get('/gudang', {
            params: {
                include: 'tps'
            }
        })
    }

    // createGudang () : POST /tps/{id}/gudang
    createGudang (tps_id, kode) {
        return this.instance.post(`/tps/${tps_id}/gudang`, {
            kode: kode
        })
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

    // unlockCd (id) : DELETE /cd/{id}/lock
    unlockCd (id) {
        return this.instance.delete(`/cd/${id}/lock`)
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

    // getPerhitunganCd (id) : GET /cd/:id/simulasi
    getPerhitunganCd (id) {
        return this.instance.get(`/cd/${id}/simulasi`)
    }

    // createPenetapanCd (id) : POST /cd/:id/penetapan
    createPenetapanCd (id, data) {
        return this.instance.put(`/cd/${id}/penetapan`, data)
    }

    //==================RESOURCE : SPP===========================================================
    // getSpp () : GET /spp
    getSpp (param) {
        return this.instance.get('/spp', {
            params: param
        })
    }

    // getSppById (id) : GET /spp/{id}
    getSppById (id) {
        return this.instance.get('/spp/' + id, {
            params: {
                include: 'source,pibk'
            }
        })
    }

    // getSppByCdId (id) : GET /spp/{id}/spp
    getSppBySourceId (type, id) {
        return this.instance.get(`/${type}/` + id + '/spp', {
            params: {
                include: 'cd'
            }
        })
    }

    // createSpp (data) : POST /cd/{id}/spp
    createSpp (type, cdId, dataSpp) {
        return this.instance.put(`/${type}/` + cdId + '/spp', dataSpp)
    }

    /* // updateCd (dataCd) : PUT /cd/{id}
    updateCd (id, dataCd) {
        return this.instance.put('/cd/' + id, dataCd)
    } */

    // deleteSpp (id) : DELETE /spp/{id}
    deleteSpp (id) {
        return this.instance.delete('/spp/' + id)
    }

    // getMockupSpp (cdId) : GET /cd/{id}/spp_mockup
    getMockupSpp (type, id) {
       return this.instance.get(`/${type}/` + id + '/spp_mockup', {
           params: {
               include: 'source.details'
           }
       })
    }

    //==================RESOURCE : ST===========================================================
    // getSt () : GET /st
    getSt (param) {
        return this.instance.get('/st', {
            params: param
        })
    }

    // getStById (id) : GET /st/{id}
    getStById (id) {
        return this.instance.get('/st/' + id, {
            params: {
                include: 'cd,pibk'
            }
        })
    }

    // getStByCdId (id) : GET /st/{id}/spp
    getStByCdId (id) {
        return this.instance.get('/cd/' + id + '/st', {
            params: {
                include: 'cd'
            }
        })
    }

    // createSt (data) : POST /cd/{id}/st
    createSt (cdId, dataSt) {
        return this.instance.put('/cd/' + cdId + '/st', dataSt)
    }

    /* // updateCd (dataCd) : PUT /cd/{id}
    updateCd (id, dataCd) {
        return this.instance.put('/cd/' + id, dataCd)
    } */

    // deleteSt (id) : DELETE /st/{id}
    deleteSt (id) {
        return this.instance.delete('/st/' + id)
    }

    // getMockupSt (cdId) : GET /cd/{id}/st_mockup
    getMockupSt (cdId) {
       return this.instance.get('/cd/' + cdId + '/st_mockup', {
           params: {
               include: 'cd.details'
           }
       })
    }

    //==================RESOURCE : BPJ===========================================================
    // getBpj () : GET /bpj
    getBpj (param) {
        return this.instance.get('/bpj', {
            params: param
        })
    }

    // getBpjById () : GET /bpj/{id}
    getBpjById (id) {
        return this.instance.get('/bpj/' + id, {
            params: {
                include: 'guaranteeable,status'
            }
        })
    }

    // createBpj (dataBpj) : POST /bpj
    createBpj (dataBpj) {
        return this.instance.post('/bpj', dataBpj)
    }

    // updateBpj (dataBpj) : PUT /bpj/{id}
    updateBpj (id, dataBpj) {
        return this.instance.put('/bpj/' + id, dataBpj)
    }

    // deleteBpj (id) : DELETE /bpj/{id}
    deleteBpj (id) {
        return this.instance.delete('/bpj/' + id)
    }

    //===================RESOURCE : PDF======================================================
    getPdf (doctype, id, param) {
        return this.instance.get('/pdf', {
            headers: {
                'Content-Type' : 'text/html'
            },
            params: {
                doc: doctype,
                id: id,
                ...param
            }
        })
    }

    // this one generate accessible url (supposedly) to download pdf
    generatePdfUrl (doctype, id, param) {
        var url = this.instance.defaults.baseURL + 'pdf' + `?doc=${doctype}&id=${id}`
        // dynamically add more to param
        if (param) {
            for (var k in param) {
                url += `&${k}=${param[k]}`
            }
        }

        return url
    }

    // this one attach resource to a specific endpoints
    attachFile (doctype, id, data, progressFn) {
        var url = `/${doctype}/${id}/lampiran`

        return this.instance.post(url, data.blob, {
            onUploadProgress: progressFn,
            headers: {
                ...this.instance.defaults.headers,

                'Content-Type'      : data.type,
                // 'Content-Length'    : data.blobsize,
                'X-Content-Filesize': data.filesize,
                'X-Content-Filename': data.filename
            }
        })
    }

    // this one attach resource to a specific uri
    attachFileToUri (uri, data, progressFn) {
        return this.instance.post(uri, data.blob, {
            onUploadProgress: progressFn,
            headers: {
                ...this.instance.defaults.headers,

                'Content-Type'      : data.type,
                'X-Content-Filesize': data.filesize,
                'X-Content-Filename': data.filename
            }
        })
    }

    // this one attach ONE raw file to a specific uri
    attachRawFileToUri (uri, file, progressFn) {
        var fd = new FormData();
        fd.append('file', file)
        return this.instance.post(uri, fd, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressFn
        })
    }

    // this one delete attachment by id
    // deleteAttachment (id) : DELETE /lampiran/id
    deleteAttachment (id) {
        return this.instance.delete('/lampiran/' + id)
    }

    // this downloads uri
    downloadUri (uri, headers, timeout, params) {
        return this.instance.get(uri, {
            responseType: 'arraybuffer',
            headers: {
                ...this.instance.defaults.headers,
                ...headers
            },
            timeout : timeout || this.instance.timeout,
            params: params
        })
    }

    //===================RESOURCE : PEMBATALAN======================================================
    // getPembatalan () : GET /pembatalan
    getPembatalan (param) {
        return this.instance.get('/pembatalan', {
            params: param
        })
    }

    // getPembatalanById (id) : GET /pembatalan/{id}
    getPembatalanById (id) {
        return this.instance.get('/pembatalan/' + id, {
            params: {
                include: 'status,lampiran'
            }
        })
    }

    // createPembatalan (data) : POST /pembatalan
    createPembatalan (data) {
        return this.instance.post('/pembatalan', data)
    }

    // updatePembatalan (id, data) : PUT /pembatalan/{id}
    updatePembatalan (id, data) {
        return this.instance.put('/pembatalan/' + id, data)
    }

    // deletePembatalan (id) : DELETE /pembatalan/{id}
    deletePembatalan (id) {
        return this.instance.delete(`/pembatalan/${id}`)
    }

    // lockPembatalan (id) : PUT /pembatalan/{id}/lock
    lockPembatalan (id, data) {
        return this.instance.put(`/pembatalan/${id}/lock`, data)
    }

    // addPembatalanDetail (id, doctype, docid) : PUT /pembatalan/{id}/{doctype}/{docid}
    addPembatalanDetail (id, doctype, docid, data) {
        return this.instance.put(`/pembatalan/${id}/${doctype}/${docid}`, data)
    }

    // deletePembatalanDetail (detailId) : DELETE /pembatalan/detail/{detailId}
    deletePembatalanDetail (detailId) {
        return this.instance.delete(`/pembatalan/detail/${detailId}`)
    }

    // ===========================SSO USER QUERY===============================================
    getPemeriksa (params) {
        return this.instance.get('/pemeriksa', {
            params: params
        })
    }

    // ===========================INSTRUKSI PEMERIKSAAN===============================================
    putIp (uri, data) {
        return this.instance.put(uri, data)
    }

    getIp (params) {
        return this.instance.get('/ip', {
            params: params
        })
    }

    // ===========================LHP=====================================================================
    putLhp (uri, data, params) {
        return this.instance.put(uri, data, {
            params: params
        })
    }

    getLhpById (id, params) {
        return this.instance.get(`/lhp/${id}`, {
            params: params
        })
    }

    // ===========================DETAIL BARANG=====================================================================
    getPenetapanBarang(params) {
        return this.instance.get(`/penetapan`, {
            params: params
        })
    }

    updatePenetapanBarang(id, data) {
        return this.instance.put(`/penetapan/${id}`, data)
    }

    storePenetapanBarang(uri, data) {
        return this.instance.post(uri, data)
    }

    deletePenetapanBarang(id) {
        return this.instance.delete(`/penetapan/${id}`)
    }

    // ===========================PIBK=====================================================================
    getPibk (params) {
        return this.instance.get('/pibk', {
            params: params
        })
    }

    getPibkById (id, params) {
        return this.instance.get(`/pibk/${id}`, {
            params: {
                ...params,
                include: 'lampiran,instruksi_pemeriksaan,dokkap,details,source'
            }
        })
    }

    storePibk (data, params) {
        return this.instance.post('/pibk', data, {
            params: params
        })
    }

    updatePibk (id, data, params) {
        return this.instance.put(`/pibk/${id}`, data, {
            params: params
        })
    }

    deletePibk (id) {
        return this.instance.delete(`/pibk/${id}`)
    }

    //==================RESOURCE : BPPM===========================================================
    getBppm (params) {
        return this.instance.get('/bppm', {
            params: params
        })
    }
}

export {
    ApiSibape
}
