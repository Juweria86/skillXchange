const Message = require("../models/Message");
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email _id") 
      .populate("receiver", "name email _id");

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

// controllers/conversationController.js


exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all messages where the current user is either sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    }).sort({ createdAt: -1 });
    
    // Extract unique conversation partners
    const conversationPartners = new Map();
    
    for (const message of messages) {
      // Determine the other participant in the conversation
      const partnerId = message.sender.toString() === userId 
        ? message.receiver.toString() 
        : message.sender.toString();
      
      // If we haven't processed this partner yet
      if (!conversationPartners.has(partnerId)) {
        // Get unread count
        const unreadCount = await Message.countDocuments({
          sender: partnerId,
          receiver: userId,
          status: { $ne: 'read' }
        });
        
        // Get partner details
        const participant = await User.findById(partnerId)
          .select('name email profileImage');
        
        // Add to map with the last message
        conversationPartners.set(partnerId, {
          _id: partnerId,
          participant,
          lastMessage: message,
          unreadCount
        });
      }
    }
    
    // Convert map to array
    const conversations = Array.from(conversationPartners.values());
    
    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Failed to fetch conversations', error: err.message });
  }
};





