const { text } = require("express");
const mongoose = require("mongoose");

const latestMessageSchema = new mongoose.Schema(
    {
        latestMessage: {
            type: String
        },
        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: true
        },
        receiver: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: true
        },

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("latestMessage", latestMessageSchema);

