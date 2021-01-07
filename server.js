const express = require('express')
const axios = require('axios')
const app = express()
const mongoose = require('mongoose')
const { PORT, mongoUri, easyAPI, serverURL } = require('./config')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const packageObjectItemRoutes = require ('./routes/api/PackageObjects')
const EasyPost = require('@easypost/api')
const easyTracking = new EasyPost(easyAPI)
const databaseMethods = require('./keeptrack/src/methods/databaseMethods')

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

//Establish connection with MongoDB Atlas database.
mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
        })
        .then (() => console.log('MongoDB database connected'))
        .catch((err) => console.log('err'))


app.use('/api/packageObjectItems', packageObjectItemRoutes)

app.get('/', (req, res) => res.send('Online'))

app.post('/api/addTracker', (req, res) => {
        res.status(200).send('Received request for tracking number ' + req.body.trackingNumber)
        const tracker = new easyTracking.Tracker({
                tracking_code: req.body.trackingNumber,
              })
        tracker.save().then((response) => {console.log(response.status); databaseMethods.updatePackageData(tracker)}).catch(err => console.error(err))
        
})


app.post('/api/trackerResponse', (req, res) => {
        let trackerObject = {};
        res.status(200).send();
        trackerObject = {
                trackingNumber: req.body.result.tracking_code,
                status: req.body.result.status,
                location: req.body.result.tracking_details[0].tracking_location.city + ' ' + req.body.result.tracking_details[0].tracking_location.country, 
        };
        console.log(JSON.stringify(trackerObject));
        databaseMethods.updatePackageData(trackerObject).catch(err => console.error(err));
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
