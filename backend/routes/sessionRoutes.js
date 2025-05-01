const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getAllSessions,
  createSession,
  updateSessionStatus,
} = require("../controllers/sessionController");
const { body } = require("express-validator");

const router = express.Router();

// ✅ GET all sessions for the logged-in user
router.get("/", protect, getAllSessions);

// ✅ POST create a new session
router.post(
  "/",
  protect,
  [
    body("teacher").notEmpty().withMessage("Teacher ID is required"),
    body("skill").notEmpty().withMessage("Skill ID is required"),
    body("scheduledAt")
      .notEmpty()
      .withMessage("Scheduled date is required")
      .isISO8601()
      .withMessage("Scheduled date must be a valid date"),
    body("notes").optional().isString(),
  ],
  createSession
);

// ✅ PUT update session status
router.put(
  "/:id/status",
  protect,
  [
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "confirmed", "completed", "cancelled"])
      .withMessage("Status must be one of: pending, confirmed, completed, cancelled"),
  ],
  updateSessionStatus
);

module.exports = router;
