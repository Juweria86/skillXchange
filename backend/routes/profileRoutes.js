// // routes/profileRoutes.js
// const express = require('express');
// const router = express.Router();
// const profileController = require('../controllers/profileController');
// const { protect } = require("../middleware/authMiddleware");
// const uploadProfileImage = require('../middleware/uploadMiddleware');

// const {
//     getProfile,
//     updateProfile,
// } = require("../controllers/profileController");
// // Get current user profile
// router.get('/me', protect,getProfile);

// // Update profile
// router.post('/', protect, uploadProfileImage, updateProfile);


// module.exports = router;