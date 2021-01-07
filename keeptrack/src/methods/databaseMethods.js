const axios = require('axios')
const { serverURL } = require('../../../config')
require ('babel-polyfill')

const route = 'api/packageObjectItems/';

async function getAllTrackingNumbersFromDatabase() {
    const response = await axios.get(serverURL + route);
    let packages = [];
    packages = response.data;
    return packages;
}

async function makeNewTracker(number) {
    await axios.post(serverURL + 'api/addTracker/', {
        "trackingNumber": number
    }).catch(err => console.error(err));
    
}

async function updatePackageDataByUser(trackerObject){
    await axios.put(serverURL + route + 'userEditing/' + trackerObject.trackingNumber, trackerObject).catch(err => console.error(err));
}

async function updatePackageData(trackerObject) {
    await axios.put(serverURL + route + trackerObject.tracking_code, trackerObject).catch(err => console.error(err));
}

async function addNewPackageToDatabase(packageObject) {
    await axios.post(serverURL + route , packageObject).catch(err => console.error(err));
}

async function removePackageFromDatabase(trackingNumber) {
    await axios.delete(serverURL + route + trackingNumber).catch(err => console.error(err));
}

module.exports = {
    getAllTrackingNumbersFromDatabase,
    makeNewTracker,
    updatePackageData,
    addNewPackageToDatabase,
    removePackageFromDatabase,
    updatePackageDataByUser,
}