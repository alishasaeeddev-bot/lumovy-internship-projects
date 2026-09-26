const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { 
      type: String, 
      minlength: 6, 
      default: null 
    },

    googleId: { 
      type: String, 
      default: null 
    },

    profileImage: {
      type: String,
      default: null
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;