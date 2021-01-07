const { Schema, model } = require('mongoose');

const PackageObjectSchema = new Schema({
    trackingNumber: {
        type: String,
        required:true,
        unique: true,
    }, 
    dateAdded: {
        type: Date,
        default: Date.now
    },
    id: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    cost: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'Unknown'
    },
    location: {
        type: String,
        default: 'Unknown',
    }

})

const PackageObject = model('packageObject', PackageObjectSchema)

module.exports = PackageObject