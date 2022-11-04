const { text } = require('express')
const mongoose = require('mongoose')

// schema 
const kidsSchema = new mongoose.Schema({

    link: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true
    },
  /*   latitude: {
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
    discount:{
        type:Number
    },
    Description: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    videoOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required:true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Kid', kidsSchema)