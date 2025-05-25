const mongoose = require("mongoose");


// models/User.js
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },

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
availability: [
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true }, // format: "09:00"
    endTime: { type: String, required: true },   // format: "17:00"
    timezone: { type: String, default: 'UTC' }   // e.g., "GMT+3"
  }
],

    socialLinks: {
      linkedIn: { type: String },
      github: { type: String },
      portfolio: { type: String }
    },
    achievements: [
  {
    title: { type: String, required: true },
    description: { type: String },
  },
],

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