<template>
  
  <Card style="width: 95%; margin-left: 2.5%; margin-right: 2.5%; margin-bottom: 2rem;" class="p-col">
    <template #header>
        <Toolbar >
          <template #left>
            <AddPackageForm :package-objects="packageDataModel.packages" @new-package-created="newPackageCreated"/>
            <template v-if="editPopup">
              <EditPackageForm :package-objects="packageDataModel.packages" :current-package="currentEditTrackingNumber" @package-updated="packageUpdated">
            </template>

          </template>
          <template #right>
            <span class="p-float-label p-input-icon-right">
              <InputText id="searchField" v-model="searchNumber" type="text"/>
              <i class="pi pi-search" />
              <label for="searchField">Tracking Number</label>
            </span>
          </template>
        </Toolbar>
    </template>
    <template #content>
        <DataTable :value="packageDataModel.packages.arrayOfPackages" :paginator="true" :rows="10" :rowHover="true" :reactive="true"
        :filters="filters" :loading="loadingStatus" :lazy="false"   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[10,25,50]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" v-model:expandedRows="expandedRows">
          <template #header>
            <div class="table-header">
              <span class="p-input-icon-right p-float-label">
                  <i class="pi pi-search" />
                  <InputText id="globalSearchField" v-model="filters['global']"/>
                  <label for="globalSearchField">Global Search</label>
              </span>
              <Button @click="refreshData" style="margin-left: 1rem;" class="p-button-rounded p-button-info" icon="pi pi-refresh"/>
          </div>
          </template>
          <template #empty>
              No packages found.
          </template>
          <template #loading>
              Loading tracking data. Please wait.
          </template>
          <template #expansion="slotProps">
            <Card style="width: 90%; margin-left: 5%; margin-right: 5%; margin-bottom: 2rem;" class="p-col">
              <template #header>
                <h3 style="margin-left: 5%">Description</h3>
              </template>
              <template #content>
                <p>{{showDescription(slotProps.data.description)}}</p>
              </template>  
            </Card>
          </template>
          <Column :expander="true" headerStyle="width: 3em" ></Column>
            <Column field="trackingNumber" header="Tracking Number" :sortable="false" filterField="trackingNumber" filterMatchMode="contains">
              <template #body="slotProps">
              <span class="p-column-title"></span>
              {{slotProps.data.trackingNumber}}
             </template>
            </Column>
          <Column field="dateAdded" header="Date added" :sortable="true" filterField="dateAdded" filterMatchMode="startsWith">
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>{{formatDate(slotProps.data.dateAdded)}}</span>
            </template>
          </Column>
          <Column field="cost" header="Cost" :sortable="true" filterField="cost" filterMatchMode="startsWith">
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>${{slotProps.data.cost}}</span>
            </template>
          </Column>
          <Column field="status" header="Delivery status" :sortable="true" filterField="status" filterMatchMode="startsWith">
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>{{slotProps.data.status}}</span>
            </template>
          </Column>
          <Column headerStyle="width: 10rem; text-align: center" bodyStyle="text-align: center; overflow: visible; margin-left: 5rem;">
            <template #body="slotProps">
              <Button style="margin-right: 1rem;" type="button" icon="pi pi-pencil" class="p-button-rounded p-button-info" @click="openEditPopup(slotProps.data.trackingNumber)"></Button>
              <Button type="button" icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="deletePackage(slotProps.data.trackingNumber)"></Button>
            </template>
          </Column>
        </DataTable>
    </template>

</Card>

</template>

<script>
import { toRef, ref, toRaw, reactive } from 'vue';
const databaseMethods = require('../methods/databaseMethods');
import AddPackageForm from './AddPackageForm';
import EditPackageForm from './EditPackageForm';

export default {
   

    name: 'MainTableView',

    props: {
        packageObjects: { type: Object },
        loadingBool: { type: Boolean }
    },
    
    components: {
      AddPackageForm,
      EditPackageForm,
    },

    setup(props) {
        

        const packagesAsObject = toRaw(props.packageObjects);
        const packageDataModel = reactive({
          packages: packagesAsObject,
        })
        const selectedPackages = ref(null);
        const expandedRows= ref([]);
        const filters = ref({});
        const loadingStatus = toRef(props.loadingBool);
        const searchNumber = ref('');
        const editPopup = ref(false);
        const currentEditTrackingNumber = ref('');

        function formatDate(date) {
            var isoDate = new Date(date);

            let day = isoDate.getDate();
            let month = isoDate.getMonth()+1;
            let year = isoDate.getFullYear();

            return day + '-' + month + '-' + year;
        }

         function testMethod() {
            console.log(packagesAsObject.arrayOfPackages);
            console.log(props.loadingBool);
        }

        function deletePackage(trackingNumber) {
          console.log('Deleting ' + trackingNumber);
          databaseMethods.removePackageFromDatabase(trackingNumber)
          .catch(error => console.log(error));

          for (const currentPackage in packagesAsObject.arrayOfPackages) {
            let count = 0;
            if (currentPackage.trackingNumber === trackingNumber) {
              delete packagesAsObject.arrayOfPackages[count];
              break;
            }
            count++;
           
          }
          
        }

        function showDescription(description) {

          if (!(/\S/.test(description))) {
            return 'No description provided :(';
          } else {
            return description;
          }
          
        }

        function openEditPopup(trackingNumber) {
          editPopup.value = true;
          currentEditTrackingNumber.value = trackingNumber;
        }

        async function newPackageCreated(response) {
          console.log(response); 
          packageDataModel.packages.arrayOfPackages = response;
        }

        async function packageUpdated(response) {
          console.log("Package updated");
          console.log(response);
        }

        async function refreshData() {
          await databaseMethods.getAllTrackingNumbersFromDatabase().then(response => packageDataModel.packages.arrayOfPackages = response).catch(err => console.error(err));
        }

        return {
            packagesAsObject,
            selectedPackages,
            expandedRows,
            filters,
            loadingStatus,
            formatDate,
            searchNumber,
            testMethod,
            deletePackage,
            showDescription,
            newPackageCreated,
            packageDataModel,
            refreshData,
            openEditPopup,
            packageUpdated,
        }


    }

}
</script>

<style>

</style>