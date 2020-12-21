import axios from 'axios'
require ('babel-polyfill')

async function getAllTrackingNumbersFromDatabase() {
    const response = await axios.get('http://localhost:3000/api/packageObjectItems/')
    let packages = []
    packages = response.data
    console.log('testing out the database')
    return packages
}

async function makeNewTracker(number) {
    await axios.post('http://localhost:3000/api/addTracker/', {
        "trackingNumber": number
    }).then(response => console.log(response)).catch(err => console.error(err))
}

export {
    getAllTrackingNumbersFromDatabase,
    makeNewTracker
}