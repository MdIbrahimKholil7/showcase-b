const { text } = require('express')
const mongoose = require('mongoose')

// schema 
const BusSchema = new mongoose.Schema({
    
    link: {
        type: String,
        // required: true,
        trim: true
    },
    imgLink:{
        type: String,
        required: [true, ' Please upload product image'],
        trim: true
    },
    companyName: {
        type: String,
        // required: true
    },
     latitude:{
        type: Number,
        // required: true
     },
     longitude:{
        type: Number,
        // required: true
        },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    brand:{
        type: String,
        // required: true
    },
    type:{
        type: String,
        // required: true
    },
    category: {
        type: String,
        default:""
    },
    price: {
        type: String,
        // required: true
    },
    
    Description: {
        type: String,
        // required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('ProUser', BusSchema)