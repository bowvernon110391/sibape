<template>
    <div>
        <!-- first format when it's commercial? -->
        <b-table
            :items="dataBarang">
            <!-- row render -->
        </b-table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data_penetapan: {
            "komersil":true,
            "pph_tarif":"7.5000",
            "ppnbm_tarif":0,
            "total_bm":273818000,
            "total_cukai":0,
            "total_ppn":252467000,
            "total_pph":189352000,
            "total_ppnbm":0,
            "total_bm_pajak":715637000,
            "data_perhitungan":[
                {
                    "hs_code":"15079090",
                    "bm_tarif":5,
                    "bm_tarif_hs":5,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":12,
                    "jenis_satuan":"KGM",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":432789778.88978285,
                    "fob":56917.0584,
                    "insurance":52.8125,
                    "freight":86.2394,
                    "cif":57056.1103,
                    "bm":21640000,
                    "cukai":0,
                    "ppn":45443000,
                    "pph":34083000,
                    "ppnbm":0,
                    "valuta":"USD",
                    "ndpbm":7585.3362,
                    "long_description":"Illum vero perspiciatis labore. -- 7 BX, 12 KGM -- brutto 3650905.9930 KG, netto 2501016.5645 KG\n- IMEI : Modi nulla nam iusto ratione laborum hic numquam beatae quae dolorem cupiditate.; - MAC ADDRESS : Aut rem facilis aut nisi quo corrupti ut rerum odit.; - IMEI : Deleniti ex rerum qui veniam."
                },
                {
                    "hs_code":"37029710",
                    "bm_tarif":5,
                    "bm_tarif_hs":5,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":90,
                    "jenis_satuan":"EA",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":26735.0162,
                    "fob":26530.0617,
                    "insurance":26.4404,
                    "freight":178.5141,
                    "cif":26735.0162,
                    "bm":2000,
                    "cukai":0,
                    "ppn":3000,
                    "pph":3000,
                    "ppnbm":0,
                    "valuta":"IDR",
                    "ndpbm":1,
                    "long_description":"Dolorem molestias dolorum eum reiciendis possimus sunt iste a. -- 17 BX, 90 EA -- brutto 22.2613 KG, netto 11.7585 KG"
                },
                {
                    "hs_code":"02071491",
                    "bm_tarif":5,
                    "bm_tarif_hs":5,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":26,
                    "jenis_satuan":"PCE",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":278544312.72827643,
                    "fob":31019.1892,
                    "insurance":90.8928,
                    "freight":81.234,
                    "cif":31191.316000000003,
                    "bm":13928000,
                    "cukai":0,
                    "ppn":29248000,
                    "pph":21936000,
                    "ppnbm":0,
                    "valuta":"USD",
                    "ndpbm":8930.1879,
                    "long_description":"Distinctio facilis. -- 11 BX, 26 PCE -- brutto 24.1683 KG, netto 5.5077 KG"
                },
                {
                    "hs_code":"17011300",
                    "bm_tarif":550,
                    "bm_tarif_hs":550,
                    "jenis_tarif_bm":"SPESIFIK",
                    "satuan_spesifik":"\/kg",
                    "jumlah_satuan":56,
                    "jenis_satuan":"KGM",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":74312295.74509974,
                    "fob":80764.1239,
                    "insurance":94.4882,
                    "freight":28.9177,
                    "cif":80887.52980000002,
                    "bm":31000,
                    "cukai":0,
                    "ppn":7435000,
                    "pph":5576000,
                    "ppnbm":0,
                    "valuta":"KRW",
                    "ndpbm":918.7114,
                    "long_description":"Et optio occaecati. -- 11 BX, 56 KGM -- brutto 9342793.7602 KG, netto 6114082.1922 KG"
                },
                {
                    "hs_code":"85043130",
                    "bm_tarif":0,
                    "bm_tarif_hs":0,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":83,
                    "jenis_satuan":"KGM",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":512280039.51214415,
                    "fob":88599.7421,
                    "insurance":11.3471,
                    "freight":35.0044,
                    "cif":88646.09360000001,
                    "bm":0,
                    "cukai":0,
                    "ppn":51229000,
                    "pph":38422000,
                    "ppnbm":0,
                    "valuta":"THB",
                    "ndpbm":5778.9353,
                    "long_description":"Quaerat ut et. -- 9 BX, 83 KGM -- brutto 983289.9061 KG, netto 23579.5598 KG"
                },
                {
                    "hs_code":"61043300",
                    "bm_tarif":25,
                    "bm_tarif_hs":25,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":30,
                    "jenis_satuan":"PCE",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":952861668.7829953,
                    "fob":69138.9318,
                    "insurance":67.5949,
                    "freight":115.4632,
                    "cif":69321.9899,
                    "bm":238216000,
                    "cukai":0,
                    "ppn":119108000,
                    "pph":89331000,
                    "ppnbm":0,
                    "valuta":"THB",
                    "ndpbm":13745.446,
                    "long_description":"Non et accusamus occaecati beatae. -- 10 PK, 30 PCE -- brutto 43599.1949 KG, netto 6211.9235 KG\n- IMSI : Eligendi nulla quisquam facilis ipsam."
                },
                {
                    "hs_code":"39021030",
                    "bm_tarif":10,
                    "bm_tarif_hs":10,
                    "jenis_tarif_bm":"ADVALORUM",
                    "satuan_spesifik":null,
                    "jumlah_satuan":50,
                    "jenis_satuan":"KGM",
                    "ppn_tarif":10,
                    "pph_tarif":7.5,
                    "ppnbm_tarif":0,
                    "nilai_pabean":1852.7744,
                    "fob":1727.6742,
                    "insurance":37.7098,
                    "freight":87.3904,
                    "cif":1852.7744,
                    "bm":1000,
                    "cukai":0,
                    "ppn":1000,
                    "pph":1000,
                    "ppnbm":0,
                    "valuta":"IDR",
                    "ndpbm":1,
                    "long_description":"Animi id sunt. -- 7 RO, 50 KGM -- brutto 4088715.5413 KG, netto 1299673.3441 KG\n- SERIAL NUMBER : Fugiat harum ut corporis est quam doloremque error."
                }
            ],
            "data_pembebasan":null
            }
        }
    },

    computed: {
        dataBarang: function() {
            return this.data_penetapan.data_perhitungan.map(this.prettyExtract)
        }
    },

    methods: {
        prettyExtract(d) {
            // const d = this.data_penetapan.data_pembebasan[0]

            var description         = d.long_description
            var hs_code_and_tariffs = `${d.hs_code}\nBM: ${d.bm_tarif}%\nPPN: ${d.ppn_tarif}%\nPPh: ${d.pph_tarif}%`
            var jumlah_satuan       = `${d.jumlah_satuan} ${d.jenis_satuan}`
            
            const nilai_cif_frm     = this.$options.filters.formatCurrency(d.cif)
            const nilai_pabean_frm  = this.$options.filters.displayRupiah(this.$options.filters.formatCurrency(d.nilai_pabean))

            var nilai_cif_pabean    = `${nilai_cif_frm} ${d.valuta}\n${d.nilai_pabean_frm}`

            const bm_frm            = this.$options.filters.formatCurrency(d.bm)
            const ppn_frm           = this.$options.filters.formatCurrency(d.ppn)
            const pph_frm           = this.$options.filters.formatCurrency(d.pph)
            const total_frm         = this.$options.filters.formatCurrency(d.bm + d.ppn + d.pph + d.ppnbm)

            var bm_pajak            = `BM: ${bm_frm}\nPPN: ${ppn_frm}\nPPh: ${pph_frm}\nTotal: ${total_frm}`

            return {
                description:    description,
                hs_code_and_tariffs: hs_code_and_tariffs,
                jumlah_satuan: jumlah_satuan,
                nilai_cif_pabean: nilai_cif_pabean,
                bm_pajak: bm_pajak
            }
        }
    }
}
</script>