const express = require("express");
const router = express.Router();
const { getMessages, sendMessage, getConversations} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:receiverId", protect, getMessages);
router.post("/:receiverId", protect, sendMessage);
router.get('/', protect, getConversations);

module.exports = router;
