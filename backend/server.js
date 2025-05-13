const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const aiMatchRoutes = require("./routes/aiMatchRoutes");
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoutes = require("./routes/messageRoutes");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => res.send("SkillXchange API is running ✅"));
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/match", aiMatchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use("/api/messages", messageRoutes);





const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173", "http://127.0.0.1:5173"], methods: ["GET", "POST"], credentials: true }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", {
      ...data,
      timestamp: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});




const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server + Socket.IO running on port ${PORT}`));
  })
  .catch((err) => console.error(err));

