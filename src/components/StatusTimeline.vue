<template>
  <div>
    <b-row>
      <b-col md="6" offset-md="3">
        <ul class="timeline">
          <li v-for="(s) in data" :key="s.id" class="rounded shadow mx-2 mb-4 p-3">
            <!-- title -->
            <b-badge :variant="badgeVariant(s.status)" style="font-size:1.2rem" class="shadow">{{ s.status }}</b-badge>
            <!-- time -->
            <small class="float-right text-dark bg-light px-1 rounded">{{ s.created_at }}</small>
            <!-- user data -->
            <div v-if="s.user">
              <small class="username">
              <font-awesome-icon icon="user-alt"/>
              {{ s.user.data.name }} (<em>{{ s.user.data.nip }}</em>)
              </small>
            </div>
            <!-- desc -->
            <template v-if="s.detail">
              <p>{{ s.detail.data.keterangan }}</p>
              <!-- detail button (if exists) -->
            
            </template>
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>  
</template>

<script>
import niceties from '../mixins/niceties'

export default {
  mixins: [
    niceties
  ],

  props: {
    data: {
      type: Array,
      required: true
    }
  },
}
</script>

<style>
ul.timeline {
  list-style-type: none;
  position: relative;
}

ul.timeline:before {
  content: ' ';
  background: #9aadc7;
  display: inline-block;
  position: absolute;
  left: 29px;
  width: 2px;
  height: 100%;
  z-index: 400;
}

ul.timeline > li {
/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#f2eef6+0,eae1f4+100 */
background: rgb(242,238,246); /* Old browsers */
background: -moz-linear-gradient(top,  rgba(242,238,246,1) 0%, rgba(234,225,244,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top,  rgba(242,238,246,1) 0%,rgba(234,225,244,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  rgba(242,238,246,1) 0%,rgba(234,225,244,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2eef6', endColorstr='#eae1f4',GradientType=0 ); /* IE6-9 */

}

ul.timeline > li:before {
  content: ' ';
  background: white;
  display: inline-block;
  position: absolute;
  border-radius: 50%;
  border: 3px solid #1a478b;
  left: 20px;
  width: 20px;
  height: 20px;
  z-index: 400;
}

.username {
  font-weight: 650;
}
</style>