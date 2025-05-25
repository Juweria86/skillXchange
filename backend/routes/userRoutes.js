const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/uploadMiddleware');


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
  uploadProfileImage,
  getUserStats
  
} = require("../controllers/userController");

const router = express.Router();


router.get('/profile', protect, getUserProfile);
router.put("/", protect, upload.single('profileImage'), updateUserProfile);
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);
router.get('/stats', protect, getUserStats);


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
router.post('/onboarding', protect, upload.single('profileImage'), completeOnboarding);


module.exports = router;
