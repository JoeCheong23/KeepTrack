<template>
    <div>
        <Button label="Add New Package" icon="pi pi-plus" class="p-mr-2 p-button-info p-button-raised" @click="makeFormVisible"/>
        <Dialog header="Add New Package" v-model:visible="displayForm" :style="{width: '50vw'}">
            
            <p> </p>
            <div class="p-grid p-flex-column">
                
                <div class="p-col">
                    <template v-if="trackingNumberBool">
                        <span class="p-input-icon-right p-float-label">
                            <InputText id="trackingNumberField" type="text" v-model="trackingNumber"/>
                            <label for="trackingNumberField">Tracking Number</label>
                        </span>
                    </template>
                    <template v-else>
                        <span class="p-input-icon-right p-float-label">
                            <InputText id="tracking-number-field" type="text" v-model="trackingNumber" class="p-invalid" aria-describedby="tracking-number-field-help"/>
                            <label for="tracking-number-field">Tracking Number</label>
                            <br><small id="tracking-number-field-help" class="p-invalid" > A non-duplicate tracking number is required</small>
                        </span>
                        
                    </template>
                </div>

                <div class="p-col">
                    <template v-if="costBool">
                        <span class="p-input-icon-right p-float-label">
                            <InputNumber id="cost-field" mode="decimal" v-model="cost" :minFractionDigits="2" :maxFractionDigits="2"/>
                            <label for="cost-field">Cost ($)</label>
                        </span>
                    </template>
                    <template v-else>
                        <span class="p-input-icon-right p-float-label">
                            <InputNumber id="cost-field" mode="decimal" v-model="cost" :minFractionDigits="2" :maxFractionDigits="2" class="p-invalid" aria-describedby="cost-field-help"/>
                            <label for="cost-field">Cost ($)</label>
                            <small id="cost-field-help">A cost is required. You can type "0.00" if you do not want to enter a value.</small>
                        </span>
                    </template>
                </div>

                <div class="p-col">
                    <span class="p-input-icon-right p-float-label">
                        <Textarea id="descriptionField" v-model="description" rows="5" cols="50"/>
                        <label for="descriptionField">Description</label>
                    </span>
                </div>
        
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="closeForm" class="p-button-text p-button-danger"/>
                <Button label="Add Package" icon="pi pi-check" @click="check" class="p-button-text"/>
            </template>

            


        </Dialog>
      

    </div>

</template>

<script>

 import { ref, toRaw } from 'vue';
 import { makeNewTracker, addNewPackageToDatabase } from '../methods/databaseMethods.js';


export default {
   
    name: "AddPackageForm",

    props: {
        packageObjects: { type: Object },
    },


    setup(props, { emit }) {

        const packagesAsObject = toRaw(props.packageObjects);
        const displayForm = ref(false);
        const trackingNumberBool = ref(true);
        const trackingNumber = ref('');
        const costBool = ref(true);
        const cost = ref(0.00);
        const description = ref('');

        async function check() {

            let checkStatus = true;
            trackingNumber.value = trackingNumber.value.trim();
            

            if (!(/\S/.test(trackingNumber.value)) || checkDuplicateTrackingNumber()) {
                trackingNumberBool.value = false;
                checkStatus = false;
            }

            if (!(/\S/.test(cost.value))) {
                costBool.value = false;
                checkStatus = false;
            }

            if (checkStatus) {

                trackingNumberBool.value = true;
                costBool.value = true;

                const newObject = {
                    trackingNumber: trackingNumber.value,
                    cost: cost.value,
                    description: description.value,
                    dateAdded: Date.now,
                    status: "",
                    location: ""
                }

                await makeNewTracker(newObject.trackingNumber)
                .then(addNewPackageToDatabase(newObject))
                .then(response => emit('new-package-created', response));
                clearFields();
                displayForm.value = false;


            }
            
        }

        function checkDuplicateTrackingNumber() {

            for (const currentPackage in packagesAsObject.arrayOfPackages) {
                if (trackingNumber.value === currentPackage.trackingNumber) {
                    return true;
                }
            }

             return false;

        }

        function clearFields() {
            trackingNumber.value = '';
            cost.value = '';
            description.value = '';
        }

        function makeFormVisible() {
            displayForm.value = true;
        }

        function closeForm() {
            displayForm.value = false;
        }

        return {
            displayForm,
            trackingNumberBool,
            trackingNumber,
            costBool,
            cost,
            description,
            makeFormVisible,
            closeForm,
            check,
        }

    }


}
</script>

<style>

</style>