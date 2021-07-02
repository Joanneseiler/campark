const { Schema, model } = require("mongoose");
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
  profilePic: String
}, 
{
  timestamps: {
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  }
});

const User = model("user", userSchema);

module.exports = User;
