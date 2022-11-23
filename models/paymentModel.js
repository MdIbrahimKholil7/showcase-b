const mongoose = require('mongoose');

const Payment = new mongoose.Schema({

    plan: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    transactionId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required:true
    }
},
    {
        timestamps: true
    }
)

module.exports = Payment

