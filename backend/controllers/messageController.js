const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user.id;
  const { text } = req.body;

  try {
    const newMessage = await Message.create({
      sender: userId,
      receiver: receiverId,
      text,
    });

    // Optional: populate user fields
    await newMessage.populate("sender receiver", "name email");

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
};





