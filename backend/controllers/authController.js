const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const admin = require("../config/firebaseAdmin"); // correct path

require('dotenv').config();



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    
  },
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email already exists" });

  // ✅ Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user with hashed password
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Generate verification token
  const token = crypto.randomBytes(32).toString("hex");
  user.verifyToken = token;
  user.verifyTokenExpires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

  await user.save();

  // Send verification email
  const verifyUrl = `http://localhost:5173/verify-email/${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `<p>Hi ${name},</p><p>Please <a href="${verifyUrl}">click here to verify your email</a>.</p>`,
  });

  res.status(201).json({ message: "User registered. Please check your email to verify." });
};


exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isOnboarded: user.isOnboarded // Critical for frontend redirection
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
      verifyTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};


exports.resendVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Email already verified" });

  const token = crypto.randomBytes(32).toString("hex");
  user.verifyToken = token;
  user.verifyTokenExpires = Date.now() + 1000 * 60 * 60 * 24;
  await user.save();

  const verifyUrl = `http://localhost:5173/verify-email/${token}`;
  await transporter.sendMail({
    to: email,
    subject: "Verify your email",
    html: `<p>Please <a href="${verifyUrl}">click here to verify your email</a>.</p>`,
  });

  res.json({ message: "Verification email resent. Check your inbox." });
};

// Send reset email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 1000 * 60 * 30; // 30 mins
  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  await transporter.sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 30 minutes.</p>`,
  });

  res.json({ message: "Reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token is invalid or expired" });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};

exports.googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decoded;
    const hashedDummyPassword = await bcrypt.hash(crypto.randomBytes(16).toString("hex"), 10);


    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: hashedDummyPassword, isVerified: true });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

