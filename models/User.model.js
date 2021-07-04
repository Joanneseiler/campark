const { Schema, model } = require("mongoose");

require("./Place.model")
require("./Review.model")

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    //required: true
  },
  password: {
    type: String,
    //required: true
  },
  email: String,
  country: {
    type: String,
    //required: true
  },
  googleID: String,
  profilePic: {
    type: String,
    default: 'images/default-avatar.png'
  },
  reviewsAdded: [{ type: Schema.Types.ObjectId, ref: 'review' }],
  placesAdded: [{ type: Schema.Types.ObjectId, ref: 'place' }]
}, 
{
  timestamps: {
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  }
});

const User = model("user", userSchema);

module.exports = User;
