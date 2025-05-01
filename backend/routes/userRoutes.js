const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");

const {
  updateUserSkills,
  addSkillToUser,
  getMySkills,
  sendFriendRequest,
  sendFriendRequestValidators,
  acceptFriendRequest,
  acceptFriendRequestValidators,
  getPendingRequests,
  getMyFriends,
} = require("../controllers/userController");

const router = express.Router();

// PATCH /api/users/update-skills
router.patch(
  "/update-skills",
  protect,
  [
    body("skillsICanTeach").optional().isArray().withMessage("skillsICanTeach must be an array of skill IDs"),
    body("skillsIWantToLearn").optional().isArray().withMessage("skillsIWantToLearn must be an array of skill IDs"),
  ],
  updateUserSkills
);

// POST /api/users/add-skill
router.post(
  "/add-skill",
  protect,
  [
    body("skillId").notEmpty().withMessage("skillId is required"),
    body("type").isIn(["teach", "learn"]).withMessage("Type must be either 'teach' or 'learn'"),
  ],
  addSkillToUser
);

// GET /api/users/my-skills
router.get("/my-skills", protect, getMySkills);


router.post(
  "/request-friend",
  protect,
  sendFriendRequestValidators,
  sendFriendRequest
);

router.post(
  "/accept-friend",
  protect,
  acceptFriendRequestValidators,
  acceptFriendRequest
);

router.get("/friend-requests", protect, getPendingRequests);
router.get("/friends", protect, getMyFriends);

module.exports = router;
