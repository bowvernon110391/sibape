<template>
    <div>
        <b-row>
            <!-- Nomor + tgl dokumen -->
            <b-col md="6">
                <b-form-group
                    label="Nomor &amp; Tanggal"
                >
                    <b-input-group>
                        <b-form-input class="flex-grow-1 text-center" v-model="data.nomor_lengkap" disabled/>
                        <template #append>
                            <datepicker v-model="data.tgl_dok" :disabled="disabled" style="max-width: 150px"/>
                        </template>
                    </b-input-group>
                </b-form-group>
            </b-col>

            <!-- NPWP -->
            <b-col md="6">
                <b-form-group label="NPWP Importir" description="kosongkan kalau tidak ada">
                    <b-form-input v-model="data.npwp" :disabled="disabled"/>
                </b-form-group>
            </b-col>
            
        </b-row>

        <!-- 2nd row -->
        <b-row>
            <!-- Importir + PEMBERITAHU (PJT)-->
            <b-col md="6">
                <b-form-group label="Importir" description="jenis importir dan idnya">
                    <!-- {{ data.importir_type }} -->
                    <b-form-radio-group v-model="data.importir_type" class="mb-1" :disabled="disabled">
                        <!-- options -->
                        <b-form-radio value="App\Penumpang">Penumpang</b-form-radio>
                        <b-form-radio value="App\Perusahaan" disabled>Perusahaan</b-form-radio>
                    </b-form-radio-group>
                    <!-- Real selector -->
                    <template v-if="data.importir_type == 'App\\Penumpang'">
                        <select-penumpang-2
                        v-model="data.importir_id"
                        :disabled="disabled"
                        :initial-options="!isNew ? data.importir.data : null"
                        :search-on-empty="isNew"
                        />
                    </template>
                    <template v-else>
                        <small>Pilih Jenis Importir (saat ini cuma support penumpang)</small>
                    </template>
                </b-form-group>

                <!-- PJT -->
                <b-form-group label="Pemberitahu (PJT)" description="kosongkan kalau tidak ada (misal barang penumpang)">
                    <select-pjt
                    v-model="data.pemberitahu_id"
                    :disabled="disabled"
                    />
                </b-form-group>
            </b-col>

            <!-- Alamat -->
            <b-col md="6">
                <b-form-group label="Alamat">
                    <b-form-textarea v-model="data.alamat" :disabled="disabled" rows="6"/>
                </b-form-group>
            </b-col>
        </b-row>

        <!-- 3rd row, flight data? -->
        <b-row>
            <!-- flight data only -->
            <b-col md="6">
                <b-row>
                    <b-col>
                        <b-form-group label="Nomor &amp; Tgl. Flight">
                            <b-input-group>
                                <b-form-input
                                v-model="data.no_flight"
                                type="text"
                                id="no_flight"
                                class="md-3"
                                :disabled="disabled"
                                ></b-form-input>
                                <template v-slot:append>
                                <!-- <b-form-select style="min-width: 250px" class="d-none d-sm-block"></b-form-select> -->
                                <select-airline
                                    :tabindex="9999"
                                    style="min-width: 250px; margin: 0 2px;"
                                    :disabled="disabled"
                                    v-model="data.kd_airline"
                                    class="d-none d-sm-block"
                                ></select-airline>

                                <datepicker
                                    v-model="data.tgl_kedatangan"
                                    id="tgl_kedatangan"
                                    :disabled="disabled"
                                    style="max-width: 150px"
                                ></datepicker>
                                </template>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- Data BC11 -->
                <b-row>
                    <b-col>
                        <b-form-group label="Nomor &amp; Tgl BC11 (opsional)" description="kosongkan data BC11 kalau tidak ada (misal: barang penumpang)">
                            <div>
                                <b-input-group>
                                    <b-form-input 
                                        v-model="data.no_bc11"
                                        :disabled="disabled"
                                        class="text-center"
                                    />
                                    <template #append>
                                        <datepicker v-model="data.tgl_bc11" :disabled="disabled" style="max-width:150px"/>
                                    </template>
                                </b-input-group>
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>

                <b-row>
                    <!-- Posnya -->
                    <b-col>
                        <!-- posnya -->
                        <b-row>
                            <b-col md="9">
                                <b-row no-gutters>
                                    <b-col md="4">
                                        <b-form-group label="Pos">
                                        <b-form-input
                                            v-model="data.pos_bc11"
                                            :disabled="disabled"
                                            class="text-center"
                                        />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="4">
                                        <b-form-group label="SubPos">
                                        <b-form-input
                                            v-model="data.subpos_bc11"
                                            :disabled="disabled"
                                            class="text-center"
                                        />
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="4">
                                        <b-form-group label="SubSubPos">
                                        <b-form-input
                                            v-model="data.subsubpos_bc11"
                                            :disabled="disabled"
                                            class="text-center"
                                        />
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-col>

                            <!-- Tarif PPh -->
                            <b-col md="3">
                                <b-form-group label="Tarif PPh (%)">
                                    <b-form-input
                                        v-model="data.pph_tarif"
                                        :disabled="disabled"
                                    />
                                </b-form-group>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>

            <!-- Terminals -->
            <b-col md="6">
                <b-row>
                    <b-col>
                        <b-form-group label="Airport asal">
                        <!-- <b-input-group prepend="Dari" class="mb-2"> -->
                        <!-- <b-form-input v-model="data.kd_pelabuhan_asal" id="kd_pelabuhan_asal" type="text" :disabled="disabled"></b-form-input> -->
                        <select-pelabuhan
                            v-model="data.kd_pelabuhan_asal"
                            :disabled="disabled"
                            :initial-options="data.pelabuhan_asal.data"
                            :search-on-empty="isNew"
                        ></select-pelabuhan>
                        <!-- <b-input-group-prepend is-text>
                                                Ke
                        </b-input-group-prepend>-->
                        <!-- <b-form-input v-model="data.kd_pelabuhan_tujuan" id="kd_pelabuhan_tujuan" type="text" :disabled="disabled"></b-form-input> -->
                        <!-- </b-input-group> -->
                        </b-form-group>
                    </b-col>
                    </b-row>
                    <b-row>
                    <b-col>
                        <b-form-group label="Airport Tujuan" >
                        <select-pelabuhan
                            id="kd_pelabuhan_tujuan"
                            v-model="data.kd_pelabuhan_tujuan"
                            :disabled="disabled"
                            :initial-options="data.pelabuhan_tujuan.data"
                            :search-on-empty="isNew"
                        ></select-pelabuhan>
                        </b-form-group>
                    </b-col>
                </b-row>

                <!-- Lokasi Penimbunan Barang -->
                <b-row>
                    <b-col>
                        <b-form-group label="Lokasi Barang" description="bisa di lokasi kerja atau gudang tertentu">
                            <!-- Radio selector -->
                            <b-form-radio-group v-model="data.lokasi_type" :disabled="disabled" class="mb-1" @change="data.lokasi_id = 0">
                                <b-form-radio value="App\Lokasi">Lokasi Kerja</b-form-radio>
                                <b-form-radio value="App\Gudang">Gudang</b-form-radio>
                            </b-form-radio-group>

                            <!-- real selectors -->
                            <template v-if="data.lokasi_type == 'App\\Lokasi'">
                                <select-lokasi
                                    v-model="data.lokasi_id"
                                    :disabled="disabled"
                                    :reduce="e => e.id"
                                />
                            </template>
                            <template v-else-if="data.lokasi_type == 'App\\Gudang'">
                                <select-gudang
                                    v-model="data.lokasi_id"
                                    :disabled="disabled"
                                    :reduce="e => e.id"
                                />
                            </template>
                            <template v-else>
                                <small>Pilih jenis lokasi dulu</small>
                            </template>
                            
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>

    </div>
</template>

<script>
import Datepicker from '@/components/Datepicker'
import SelectPenumpang2 from '@/components/SelectPenumpang2'
import SelectAirline from '@/components/SelectAirline'
import SelectPelabuhan from '@/components/SelectPelabuhan'
import SelectGudang from '@/components/SelectGudang'
import SelectLokasi from '@/components/SelectLokasi'
import SelectPjt from '@/components/SelectPjt'

export default {
    
    // COMPONENTS
    components: {
        Datepicker,
        SelectPenumpang2,
        SelectAirline,
        SelectPelabuhan,
        SelectGudang,
        SelectLokasi,
        SelectPjt
    },
    // PROPERTIES
    props: {
        disabled: Boolean,
        data: {
            type: Object,
            required: true
        },
        isNew: {
            type: Boolean
        }
    },

    computed: {
        // the 2 digit of airline
        airlineCode () {
            if (this.data.no_flight && this.data.no_flight.length >= 2) {
                return this.data.no_flight.substring(0, 2).toUpperCase()
            }

            return null
        }
    },

    // WATCHERS!
    watch: {
        'data.no_flight': {
            immediate: true,
            deep: true,
            handler(newVal) {
                this.data.kd_airline = this.airlineCode
            }
        }
    }
}
</script>