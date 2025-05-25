require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("MongoDB connected")

    // Check if admin already exists
    const adminEmail = "jujumelmi143@gmail.com"
    const existingAdmin = await User.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log("Admin user already exists")
      process.exit(0)
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10)
    const admin = new User({
      name: "skillXchange Team",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isOnboarded: true
    })

    await admin.save()
    console.log("Admin user created successfully")

    // Disconnect from MongoDB
    await mongoose.disconnect()
    console.log("MongoDB disconnected")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin user:", error)
    process.exit(1)
  }
}

createAdmin()
