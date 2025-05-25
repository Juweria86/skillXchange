// // controllers/profileController.js
// const User = require("../models/User");
// const fs = require('fs');
// const path = require('path');



// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select('-password -verifyToken -resetToken')
//       .populate('skillsICanTeach', 'name category level')
//       .populate('skillsIWantToLearn', 'name category level')
//       .populate('friends', 'name profileImage');

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ 
//       message: "Error fetching profile", 
//       error: error.message 
//     });
//   }
// };