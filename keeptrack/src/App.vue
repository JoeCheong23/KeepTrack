<template>
  <div>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Let's try something new!"/>
  <div id="app">
    <div class="notification" v-for="eachPackage in packages" :key="eachPackage.id">
      <p> {{ eachPackage.trackingNumber }} </p>
    </div>
    <input id="trackingNumberInput" v-model="inputVal" placeholder="Type in a tracking number"/>
    <button @click="makeTracker(inputVal)">Confirm</button>
  </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
require('babel-polyfill')


export default {

  name: 'App',

  components: {
    HelloWorld,
  },

  
  data() {
    return {
      packages: [],
      locations: [],
      inputVal: '',

    };
  },
  async mounted() {
    const response = await axios.get('http://localhost:3000/api/packageObjectItems/')
    this.packages = response.data;



  },

  methods: {

    async makeTracker(trackingNumber) {
      console.log(trackingNumber)
      await axios.post('http://localhost:3000/api/addTracker/', {
        "trackingNumber": trackingNumber,
      }).then(response => console.log(response))
    }
    




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
