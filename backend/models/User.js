const mongoose = require("mongoose");


// models/User.js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: String,
    location: String,
    profileImage: String,
    skillsICanTeach: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Skill" 
    }],
    skillsIWantToLearn: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Skill" 
    }],
    interests: [String],
    availability: {
      weekdays: { type: String },
      weekends: { type: String }
    },
    socialLinks: {
      linkedIn: { type: String },
      github: { type: String },
      portfolio: { type: String }
    },
    achievements: [String],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpires: { type: Date },
    resetToken: String,
    resetTokenExpires: Date,
    isOnboarded: { type: Boolean, default: false }
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);