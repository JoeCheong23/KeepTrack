const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { PORT, mongoUri, easyAPI } = require('./config')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const packageObjectItemRoutes = require ('./routes/api/PackageObjects')
const EasyPost = require('@easypost/api')
const easyTracking = new EasyPost(easyAPI)

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
        res.status(200).send('Received request for tracking number' + req.body.trackingNumber)
        const tracker = new easyTracking.Tracker({
                tracking_code: req.body.trackingNumber,
              })
        tracker.save().then((response) => console.log(response.status)).catch(err => console.error(err))
        
})


app.post('/api/trackerResponse', (req, res) => {
        res.status(200).send()
        console.log('print this out')
        console.log(JSON.stringify(req.body.result))
})

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
