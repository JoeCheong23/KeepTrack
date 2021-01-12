<template>
<div class="p-grid p-flex-column">
  <MainHeader class="p-col"/>
    <h1 class="greeting p-col">Hello, User!</h1>
    <MainTableView :package-objects="packages" :loadingBool="loading" />

</div>




</template>



<script>
import { getAllTrackingNumbersFromDatabase, makeNewTracker, addNewPackageToDatabase } from './methods/databaseMethods.js'
import { ref, onMounted, reactive, toRaw } from 'vue'
import MainHeader from './components/MainHeader'
import MainTableView from './components/MainTableView'
require('babel-polyfill')




export default {

  name: 'App',

  components: {
    MainHeader,
    MainTableView
  },

  setup() {
    const packages = reactive({
      arrayOfPackages: [],
    });
    const inputVal = ref('');
    const searchNumber = ref('');
    const makeTracker = makeNewTracker;
    const selectedPackages = ref(null);
    const filters = ref({});
    const loading = ref(true);
    const newObject= {
      id: "12313218",
      dateAdded: Date.now,
      trackingNumber: "EZ3000000003",
      cost: 69.69,
      description: "Response test"
    }




    function testMethod(){
      console.log('Add new package clicked');
    }

    async function testMethod2() {
      console.log(packages);
      packages.arrayOfPackages.push(newObject);
      makeNewTracker(newObject.trackingNumber).then(addNewPackageToDatabase(newObject));

    }


    onMounted( () => {
      getAllTrackingNumbersFromDatabase().then(result => {console.log(result); packages.arrayOfPackages = result; console.log(toRaw(packages.arrayOfPackages)); loading.value = false;});
    });
     
    return {
      makeTracker,
      inputVal,
      packages,
      searchNumber,
      testMethod,
      selectedPackages,
      filters,
      loading,
      testMethod2
    };
   
  }

} 
   
  
</script>

<style scoped>

#app {
  margin: auto;
  margin-top: 1rem;
}

.tracking{
  font-size: 30px;
  font-weight: 500;
}

.greeting{
  font-size: 30px;
  font-weight: 500;
  margin-top: 3rem;
  margin-bottom: 3rem;
  margin-left: 3rem;
}

</style>
