const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { setupSocket } = require("./socket"); // Import from socket.js
const jwt = require("jsonwebtoken");

// Import routes
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const aiMatchRoutes = require("./routes/aiMatchRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const discussionRoutes = require("./routes/discussions")
const resourceRoutes = require("./routes/resources")
const challengeRoutes = require("./routes/challenges")
const adminRoutes = require("./routes/admin")

dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const { io, onlineUsers } = setupSocket(server);

// Make io and onlineUsers available to routes/controllers as a single object
app.set('socket', { io, onlineUsers });

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => res.send("SkillXchange API is running ✅"));
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/match", aiMatchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use('/api/connections', connectionRoutes);
app.use("/api/discussions", discussionRoutes)
app.use("/api/resources", resourceRoutes)
app.use("/api/challenges", challengeRoutes)
app.use("/api/admin", adminRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = { app, server, io, onlineUsers };