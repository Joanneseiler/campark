const { Schema, model } = require("mongoose");

require("./Place.model")
require("./Review.model")

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  email: String,
  country: {
    type: String,
  },
  googleID: String,
  profilePic: {
    type: String,
    default: 'images/default-avatar.png'
  },
  placesAdded: [{ type: Schema.Types.ObjectId, ref: 'place' }],
  placesVisited: [{ type: Schema.Types.ObjectId, ref: 'place' }]
}, 
{
  timestamps: {
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  }
});

const User = model("user", userSchema);

module.exports = User;
