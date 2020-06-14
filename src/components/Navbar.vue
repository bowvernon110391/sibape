<template>
  <b-navbar toggleable="lg" type="dark" variant="dark" id="navbar">
    <b-container fluid>
      <b-navbar-brand to="/">
        <img style="height: 25px;" src="../assets/banner_icon.png" />
        <div class="banner-text d-inline-block">
          <div>
            <strong>PATOPS</strong>
          </div>
          <!-- <div class="smol-text d-xs-block d-sm-none">
                            <em>Passenger Monitoring and Payment System</em>
          </div>-->
        </div>
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Dokumen">
            <b-dropdown-item to="/cd" v-if="hasRole()">💰Customs Declaration (CD)</b-dropdown-item>
            <!-- <b-dropdown-item to="/sbp">👮Bukti Penindakan (SBP)</b-dropdown-item> -->
            <b-dropdown-item to="/is" v-if="hasRole()">⏲️Impor Sementara (IS)</b-dropdown-item>
            <b-dropdown-item to="/spmb" v-if="hasRole()">🛫SPMB</b-dropdown-item>
            <b-dropdown-item to="/st" v-if="hasRole()">🛅Surat Titipan (ST)</b-dropdown-item>
            <b-dropdown-item to="/spp" v-if="hasRole()">✋Surat Penundaan Pengeluaran (SPP)</b-dropdown-item>
            <b-dropdown-item to="/bc32" v-if="hasRole()">💸Pembawaan Mata Uang (BC32)</b-dropdown-item>
            <b-dropdown-item to="/carnet" v-if="hasRole()">🚗CARNET</b-dropdown-item>
            <b-dropdown-item to="/pibk" v-if="hasRole()">📦PIBK - Barang Penumpang</b-dropdown-item>
            <!-- <b-dropdown-item to="/sspcp">💸SSPCP</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Referensi" v-if="hasRole()">
            <b-dropdown-item to="/penumpang" v-if="hasRole(['PDTT','KASI','CONSOLE'])">👨Penumpang</b-dropdown-item>
            <b-dropdown-item to="/kurs" v-if="hasRole()">💲Kurs</b-dropdown-item>
            <b-dropdown-item to="/bpj" v-if="hasRole(['PDTT','KASI','CONSOLE'])">📝Jaminan</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Lain-lain" v-if="hasRole(['KASI','CONSOLE'])">
            <b-dropdown-item to="/pembatalan">❌Rekam Pembatalan</b-dropdown-item>
            <b-dropdown-item to="/perbaikan">🚧Perbaikan Data</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>
          <!-- <b-nav-item href="#">Lost & Found</b-nav-item> -->
          <b-nav-item href="#">Laporan</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <span>
                <font-awesome-icon icon="user-circle"></font-awesome-icon>
                {{ userInfo.name }} @ {{ lokasi }}
              </span>
            </template>
            <b-dropdown-item :href="profileUrl" target="blank">
              <font-awesome-icon icon="user"></font-awesome-icon>
              Profile
            </b-dropdown-item>
            <!-- <b-dropdown-item to="/resetpassword"><font-awesome-icon icon="lock"></font-awesome-icon> Reset Password</b-dropdown-item> -->
            <b-dropdown-item v-b-modal.modal-select-location>
              <font-awesome-icon icon="map-marker-alt"></font-awesome-icon>
              Switch Location
            </b-dropdown-item>
            <b-dropdown-item @click="logout">
              <font-awesome-icon icon="power-off"></font-awesome-icon>
              Sign Out
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import appMethod from '../mixins/appMethod'

export default {
    mixins: [ appMethod ],

    methods: {
        hasRole () {
            return true
        }
    }
}
</script>