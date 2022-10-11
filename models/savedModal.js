const mongoose = require("mongoose");

const SavedVideoSchema = new mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    //today changes
    VideoLink: [
      {
        vlink:String,
        lat:Number,
        lng:Number,
      },
    ],
    productId: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Saved", SavedVideoSchema);
