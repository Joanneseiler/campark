const { Schema, model } = require("mongoose");

require("./User.model")
require("./Place.model")

const reviewSchema = new Schema({
    rating:{
      type: Number,
      required: true,
  },
    date: {
      type: Date,
      default: Date.now
    },
    comment: {
        type: String,
        required: true,
  },
  userId : {
    ref: "user",
    type: Schema.Types.ObjectId
  }
  });

const Review = model("review", reviewSchema);

module.exports = Review;
