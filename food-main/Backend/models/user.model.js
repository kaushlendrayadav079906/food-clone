const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {  // Ensure 'email' is lowercase and correctly typed
    type: String,
    required: true,
    unique: true,  // Prevent duplicate email entries
    lowercase: true, // Ensure email is stored in lowercase
    trim: true // Trim any spaces
  },
  password: {  // Fixed the typo 'password'
    type: String,
    required: true,
  }
},{timestamps : true,versionKey:false})

module.exports = mongoose.model("User", userSchema)