<template>
  <div>
    <Dialog header="Confirmation" v-model:visible="deletePopupVisibility" :style="{width: '35vw'}" :modal="true" @hide="dontDelete">
      <div>
        <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete {{ deletePopupData }}?</span>
      </div>
      <template #footer> 
        <Button label="No" icon="pi pi-times" @click="dontDelete" class="p-button-text"/>
        <Button label="Yes" icon="pi pi-check" @click="deletePackage(deletePopupData)" class="p-button-text"/>
      </template>
    </Dialog>
    <Card
      style="
        width: 95%;
        margin-left: 2.5%;
        margin-right: 2.5%;
        margin-bottom: 2rem;
      "
      class="p-col"
    >
      <template #header>
        <Toolbar>
          <template #left>
            <AddPackageForm
              :package-objects="packageDataModel.packages"
              @new-package-created="newPackageCreated"
            />
          </template>
          <template #right>
            <Button class="pi pi-info-circle p-button-rounded p-button-primary" aria:haspopup="true" aria-controls="info-overlay" @click="toggleInfoOverlay"/>
            <OverlayPanel id="info-overlay" style="width: 25%" :dismissable="true" ref="op">
              <p>If there is no data shown in the table when you believe there should be, please press the refresh button. Also, note that some carriers are not 
                supported by the tracking service so the tracking data will not be updated in the table. We are working to find a fix for this soon.
              </p>
            </OverlayPanel>
          </template>
        </Toolbar>
      </template>
      <template #content>
        <DataTable
          class="responsive-table"
          :value="packageDataModel.packages.arrayOfPackages"
          :paginator="true"
          :rows="10"
          :rowHover="true"
          :reactive="true"
          :filters="filters"
          :loading="loadingStatus"
          :lazy="false"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[10, 25, 50]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          v-model:expandedRows="expandedRows"
        >
          <template #header>
            <div class="table-header">
              <span class="p-input-icon-right p-float-label">
                <i class="pi pi-search" />
                <InputText id="globalSearchField" v-model="filters['global']" />
                <label for="globalSearchField">Global Search</label>
              </span>
              <Button
                @click="refreshData"
                style="margin-left: 1rem"
                class="p-button-rounded p-button-info"
                icon="pi pi-refresh"
              />
            </div>
          </template>
          <template #empty> No packages found. </template>
          <template #loading> Loading tracking data. Please wait. </template>
          <template #expansion="slotProps">
            <Panel header="Description" style="margin-bottom: 1%"> {{ slotProps.data.description }} </Panel>
            <Panel header="Last Known Location"> {{ slotProps.data.location }} </Panel>
          </template>
          <Column :expander="true" headerStyle="width: 3em"></Column>
          <Column
            field="trackingNumber"
            header="Tracking Number"
            :sortable="false"
            filterField="trackingNumber"
            filterMatchMode="contains"
          >
            <template #body="slotProps">
              <span class="p-column-title"></span>
              {{ slotProps.data.trackingNumber }}
            </template>
          </Column>
          <Column
            field="dateAdded"
            header="Date Added"
            :sortable="true"
            filterField="dateAdded"
            filterMatchMode="startsWith"
          >
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>{{ formatDate(slotProps.data.dateAdded) }}</span>
            </template>
          </Column>
          <Column
            field="cost"
            header="Cost"
            :sortable="true"
            filterField="cost"
            filterMatchMode="startsWith"
          >
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>${{ slotProps.data.cost.toFixed(2) }}</span>
            </template>
          </Column>
          <Column
            field="status"
            header="Delivery Status"
            :sortable="true"
            filterField="status"
            filterMatchMode="startsWith"
          >
            <template #body="slotProps">
              <span class="p-column-title"></span>
              <span>{{ slotProps.data.status }}</span>
            </template>
          </Column>
          <Column
            headerStyle="width: 10rem; text-align: center"
            bodyStyle=" overflow: visible; margin-left: 5rem;"
          >
            <template #body="slotProps">
              <div class="buttonDiv">
                <EditPackageForm
                  :package-objects="packageDataModel.packages"
                  :current-package="slotProps.data.trackingNumber"
                  @click="openEditPopup(slotProps.data.trackingNumber)"
                  @package-updated="packageUpdated"
                />
                <Button
                  style="margin-left: 1rem"
                  type="button"
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger"
                  @click="deletePopup(slotProps.data.trackingNumber)"
                ></Button>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script>
import { toRef, ref, toRaw, reactive } from "vue";
const databaseMethods = require("../methods/databaseMethods");
import AddPackageForm from "./AddPackageForm";
import EditPackageForm from "./EditPackageForm";

export default {
  name: "MainTableView",

  props: {
    packageObjects: { type: Object },
    loadingBool: { type: Boolean },
  },

  components: {
    AddPackageForm,
    EditPackageForm,
  },


  setup(props) {
    const packagesAsObject = toRaw(props.packageObjects);
    const packageDataModel = reactive({
      packages: packagesAsObject,
    });
    const selectedPackages = ref(null);
    const expandedRows = ref([]);
    const filters = ref({});
    const loadingStatus = toRef(props.loadingBool);
    const searchNumber = ref("");
    const editPopup = ref(false);
    const deletePopupData = ref('');
    const deletePopupVisibility = ref(false);
    const currentEditTrackingNumber = ref("");
    const op = ref(null);

    function toggleInfoOverlay(event) {
      op.value.toggle(event);
    }

    function dontDelete() {

      deletePopupData.value = '';
      deletePopupVisibility.value = false;

    }

    function deletePopup(trackingNumber) {
      
      deletePopupData.value = trackingNumber;
      deletePopupVisibility.value = true;

    }

    function deletePackage(trackingNumber) {

      console.log("Deleting " + trackingNumber);
      databaseMethods
        .removePackageFromDatabase(trackingNumber)
        .catch((error) => console.log(error));

      for (const currentPackage in packagesAsObject.arrayOfPackages) {
        let count = 0;
        if (currentPackage.trackingNumber === trackingNumber) {
          delete packagesAsObject.arrayOfPackages[count];
          break;
        }
        count++;
      }

      deletePopupVisibility.value = false;

    }

    function formatDate(date) {
      var isoDate = new Date(date);

      let day = isoDate.getDate();
      let month = isoDate.getMonth() + 1;
      let year = isoDate.getFullYear();

      return day + "-" + month + "-" + year;
    }

    function showDescription(description) {
      if (!/\S/.test(description)) {
        return "No description provided :(";
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

    }

    async function packageUpdated(response) {
      console.log("Package updated");
      console.log(response);
    }

    async function refreshData() {
      await databaseMethods
        .getAllTrackingNumbersFromDatabase()
        .then(
          (response) => (packageDataModel.packages.arrayOfPackages = response)
        )
        .catch((err) => console.error(err));
    }

    return {
      packagesAsObject,
      selectedPackages,
      expandedRows,
      filters,
      loadingStatus,
      formatDate,
      searchNumber,
      deletePackage,
      showDescription,
      newPackageCreated,
      packageDataModel,
      refreshData,
      openEditPopup,
      packageUpdated,
      deletePopupData,
      deletePopupVisibility,
      deletePopup,
      dontDelete,
      toggleInfoOverlay,
      op,
    };
  },
};
</script>

<style>
.buttonDiv {
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
}
</style>