const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const uploadProfileImage = require('../middleware/uploadMiddleware');


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
  completeOnboarding,
  checkOnboardingStatus,
  getUserProfile,
  updateUserProfile,
  getUserById,
  
} = require("../controllers/userController");

const router = express.Router();


router.get('/profile', protect, getUserProfile);
router.put("/", protect, uploadProfileImage, updateUserProfile);
router.get("/:id", protect, getUserById);


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
router.get('/check-onboarding', protect, checkOnboardingStatus);
router.post('/onboarding', protect, uploadProfileImage, completeOnboarding);


module.exports = router;
