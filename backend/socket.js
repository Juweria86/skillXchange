// socket.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');

const onlineUsers = new Map();

function setupSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "http://127.0.0.1:5173", // Update with your frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);
    io.emit("userStatus", { userId: socket.userId, online: true });

    // Message handling
    socket.on("sendMessage", async ({ receiverId, text }) => {
      try {
        const newMessage = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          text
        });

        await newMessage.populate("sender receiver", "name email _id profileImage");

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        socket.emit("messageSent", newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Read receipt handling
    socket.on("markAsRead", async ({ conversationId }) => {
      try {
        await Message.updateMany(
          {
            sender: conversationId,
            receiver: socket.userId,
            status: { $ne: "read" }
          },
          { status: "read" }
        );

        const senderSocketId = onlineUsers.get(conversationId);
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesRead", {
            conversationId: socket.userId
          });
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });

    // Disconnection handling
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit("userStatus", { userId: socket.userId, online: false });
    });
  });

  return { io, onlineUsers };
}

module.exports = { setupSocket, onlineUsers };