<template>
  <div>
  <Button @click="consoleIt" label="Big button"></Button>
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
import { getAllTrackingNumbersFromDatabase, makeNewTracker } from './methods/databaseMethods.js'
import { ref, onMounted } from 'vue'
require('babel-polyfill')


export default {

  name: 'App',


  setup() {
    const packages = ref([]);
    const locations = ref([]);
    const inputVal = ref('');
    const makeTracker = makeNewTracker;

    function consoleIt() {
       console.log('Primevue button pressed')
    }

    onMounted( () => {
      getAllTrackingNumbersFromDatabase().then(result => packages.value = result);
    });
     
    return {
      makeTracker,
      inputVal,
      locations,
      packages,
      consoleIt
    };
   
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
