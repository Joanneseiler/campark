const { Schema, model } = require("mongoose");

require("./User.model")
require("./Place.model")

const reviewSchema = new Schema({
    rate: {
      type: Number,
      required: true,
  },
    date: {
      type: String
    },
    comment: {
        type: String,
        required: true,
  },
  userId: {
    ref: "user",
    type: Schema.Types.ObjectId
  }, 
  placeId : {
    ref: "place",
    type: Schema.Types.ObjectId
  }
  });

const Review = model("review", reviewSchema);

module.exports = Review;
