const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { PORT, mongoUri } = require('./config')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const packageObjectItemRoutes = require ('./routes/api/PackageObjects')

app.use(cors())
app.use(morgan('tiny'))
app.use(bodyParser.json())

mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
        })
        .then (() => console.log('MongoDB database connected'))
        .catch((err) => console.log('err'))


app.use('/api/packageObjectItems', packageObjectItemRoutes)
app.get('/', (req, res) => res.send('Hello World'))

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`))
