const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { aiSkillMatch } = require("../controllers/aiMatchController");

const router = express.Router();

// 🔐 Protected route - only logged-in users
router.get("/ai-matches", protect, aiSkillMatch);

module.exports = router;
