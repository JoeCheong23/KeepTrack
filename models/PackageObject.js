const { Schema, model } = require('mongoose');

const PackageObjectSchema = new Schema({
    trackingNumber:{
        type: String,
        required:true,
    }, 
    dateAdded: {
        type: Date,
        default: Date.now,
    },
    id: {
        type: Int,
    },

})

const PackageObject = model('packageObject', PackageObjectSchema)

module.exports = PackageObject