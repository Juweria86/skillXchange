// controllers/profileController.js
const User = require("../models/User");
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res) => {
  try {
    const { data } = req.body;
    const updateData = JSON.parse(data);
    
    // Handle file upload if exists
    if (req.file) {
      // Delete old profile image if exists
      const user = await User.findById(req.user.id);
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      updateData.profileImage = req.file.path;
    }

    // Process skills arrays
    if (updateData.skillsICanTeach) {
      updateData.skillsICanTeach = updateData.skillsICanTeach
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);
    }

    if (updateData.skillsToLearn) {
      updateData.skillsIWantToLearn = updateData.skillsToLearn
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);
      delete updateData.skillsToLearn;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-password -verifyToken -resetToken');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: "Error updating profile", 
      error: error.message 
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -verifyToken -resetToken')
      .populate('skillsICanTeach', 'name category level')
      .populate('skillsIWantToLearn', 'name category level')
      .populate('friends', 'name profileImage');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching profile", 
      error: error.message 
    });
  }
};