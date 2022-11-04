const { text } = require("express");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    loginBy: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    whats: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: 0

    },
    longitude: {

      type: Number,
      default: 0
    },
    profile: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      default: "",
    },
    loginBy: String || Null
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema,'users');



