<template>
  <div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Let's try something new!"/>
  <div id="app">
    <div class="notification" v-for="eachPackage in packages" :key="eachPackage.id">
      <p> {{ getStatus(eachPackage.trackingNumber) }} </p>
    </div>
  </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
require('babel-polyfill')
const EasyPost = require('@easypost/api')
import { easyAPI } from '../../config.js'
const easyTracking = new EasyPost(easyAPI)


export default {

  name: 'App',

  components: {
    HelloWorld,
  },

  
  data() {
    return {
      packages: [],
      locations: []

    };
  },
  async mounted() {
    const response = await axios.get('api/packageObjectItems/')
    this.packages = response.data;



  },

  methods: {

    createTracker(trackingNum) {
      console.log(trackingNum)
      const tracker = new easyTracking.Tracker({
        tracking_code: trackingNum,
      })
      tracker.save().then(console.log)
    },
    
    getStatus(trackingNum) {

      this.createTracker(trackingNum);
        
    },
    




  }


    


  

}
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

#app {
  margin: auto;
  margin-top: 3rem;
  max-width: 700px;
}
</style>
