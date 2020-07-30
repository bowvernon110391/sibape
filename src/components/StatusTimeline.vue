<template>
  <div>
    <b-row>
      <b-col md="6" offset-md="3">
        <ul class="timeline">
          <li v-for="(s, id) in status" :key="id" class="rounded shadow mx-2 mb-4 p-3">
            <b-badge :variant="badgeVariant(s.title)" style="font-size:1.2rem" class="shadow">{{ s.title }}</b-badge>
            <span class="float-right text-secondary">{{ s.date }}</span>
            <div>
              <font-awesome-icon icon="user-alt"/>
              <small>Anonymouse</small>
            </div>
            <p>{{ s.desc }}</p>
            <div v-if="id == 2">
              <b-button size="sm" :variant="badgeVariant('btn'+s.title)" class="shadow">
                View Detail...
              </b-button>
            </div>
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

  data () {
    return {
      status: [
        {
          title: 'The Martyrs',
          date: '1998-03-13 10:23:04',
          desc: "Several college students were shot in this damned day. That's what you get when you have a CIA backed puppet president"
        },
        {
          title: "Lil bro's burial",
          date: '1991-03-20 18:10:31',
          desc: "He was buried somewhere near the public (now private) football field. Lil grave in there along with some famous locals"
        },
        {
          title: 'Brother Died',
          date: '1991-03-18 03:03:11',
          desc: 'My younger twin brother died. Better dead than live a crippled existence though'
        },
        {
          title: 'Born',
          date: '1991-03-11 20:03:34',
          desc: 'I was born triplet. Two boys, one girl. Sadly only two of us survived into adulthood. Well maybe I should have cheered for him instead'
        },
      ]
    }
  }
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
/* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#eeeeee+0,eeeeee+100;Grey+Flat */
background: rgb(238,238,238); /* Old browsers */
background: -moz-linear-gradient(top,  rgba(238,238,238,1) 0%, rgba(238,238,238,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top,  rgba(238,238,238,1) 0%,rgba(238,238,238,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom,  rgba(238,238,238,1) 0%,rgba(238,238,238,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eeeeee', endColorstr='#eeeeee',GradientType=0 ); /* IE6-9 */

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
</style>