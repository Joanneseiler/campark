const { Schema, model } = require("mongoose");
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
  googleID: String
}, 
{
  timestamps: {
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  }
});
const User = model("user", userSchema);
module.exports = User;