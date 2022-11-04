const { text } = require('express')
const mongoose = require('mongoose')

// schema 
const BusSchema = new mongoose.Schema({

    link: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true
    },
    /*  latitude: {
         type: Number,
         required: true
     },
     longitude: {
         type: Number,
         required: true
     }, */
    email: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        required: true
    },
    discount: {
        type: Number
    },
    // vaw2-uBFtqoinN0rDnbXYR9GkPe-_T-xgqr10HXW
    Description: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    videoOwner: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('ProUser', BusSchema)