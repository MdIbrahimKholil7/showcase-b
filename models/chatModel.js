const { text } = require("express");
const mongoose = require("mongoose");

const chatSchemaName = new mongoose.Schema(
    {
        message: {
            type: String
        },
        users: { type: Array },

        sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: true
        },
        // content: {
        //     type: String,
        //     required: true
        // }

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Chat", chatSchemaName);

