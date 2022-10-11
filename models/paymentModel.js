const mongoose = require('mongoose');

const Payment = new mongoose.Schema({

    plan: {
        type: String,

    },
    orderId: {
        type: String,

    },
    orderEmail: {
        type: String,

    },
    paymentId: {
        type: String,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema'
    }
},
    {
        timestamps: true
    }
)

module.exports = Payment

