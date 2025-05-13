const User = require("../models/User");
const Skill = require("../models/Skill");
const { body, validationResult } = require("express-validator");





exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // exclude password
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name profileImage _id email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/userController.js
exports.updateUserProfile = async (req, res) => {
  try {
    const { bio, location } = req.body;

    // Handle possible JSON strings from FormData
    const availability = JSON.parse(req.body.availability || "[]");
    const socialLinks = JSON.parse(req.body.socialLinks || "[]");
    const achievements = JSON.parse(req.body.achievements || "[]");

    // Optional profile image
    let profileImage = null;
    if (req.file) {
      // Assuming you're storing the uploaded image URL or path
      profileImage = `/uploads/${req.file.filename}`; // or req.file.path if storing locally
    }

    const updateData = {
      bio,
      location,
      availability,
      socialLinks,
      achievements,
    };

    if (profileImage) {
      updateData.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};



exports.sendFriendRequestValidators = [
  body("userId").notEmpty().withMessage("User ID is required"),
];


exports.sendFriendRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const senderId = req.user.id; // from protect middleware
    const { userId: receiverId } = req.body;

    console.log(`Sender: ${senderId}, Receiver: ${receiverId}`);

    // 1. Prevent sending request to self
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Normalize IDs as strings for comparison
    const alreadyRequested = (receiver.friendRequests || []).some(
      (id) => id.toString() === senderId
    );

    const alreadyFriends = (receiver.friends || []).some(
      (id) => id.toString() === senderId
    );

    if (alreadyRequested || alreadyFriends) {
      return res.status(400).json({ message: "Already requested or friends" });
    }

    // 3. Add request
    receiver.friendRequests.push(sender._id);
    await receiver.save();

    res.json({ message: "Friend request sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending friend request", error: err.message });
  }
};



exports.acceptFriendRequestValidators = [
  body("userId").notEmpty().withMessage("Sender ID is required"),
];

exports.acceptFriendRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const senderId = req.body.userId;

    const user = await User.findById(req.user.id);
    const sender = await User.findById(senderId);

    if (!user || !sender) return res.status(404).json({ message: "User not found" });

    if (!user.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "No request from this user" });
    }

    user.friends.push(senderId);
    sender.friends.push(user._id);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== senderId);

    await user.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting request", error: err.message });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friendRequests", "name email");
    res.json({ friendRequests: user.friendRequests });
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
};

exports.getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "name email");
    res.json({ friends: user.friends });
  } catch (err) {
    res.status(500).json({ message: "Error fetching friends", error: err.message });
  }
};


exports.completeOnboarding = async (req, res) => {
  try {
    const { bio, skillsToTeach, skillsToLearn, interests, location } = req.body;
    const profileImagePath = req.file ? `/uploads/profile-images/${req.file.filename}` : null;

    // Find or create skills and get their IDs
    const canTeachIds = await Promise.all(
      skillsToTeach.split(',').map(async skill => {
        const s = await Skill.findOneAndUpdate(
          { name: skill.trim() },
          { name: skill.trim() },
          { upsert: true, new: true }
        );
        return s._id;
      })
    );

    const wantToLearnIds = await Promise.all(
      skillsToLearn.split(',').map(async skill => {
        const s = await Skill.findOneAndUpdate(
          { name: skill.trim() },
          { name: skill.trim() },
          { upsert: true, new: true }
        );
        return s._id;
      })
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        bio,
        skills: skillsToTeach.split(',').map(s => s.trim()),
        skillsICanTeach: canTeachIds, // Array of Skill ObjectIds
        skillsIWantToLearn: wantToLearnIds, // Array of Skill ObjectIds
        interests: interests.split(',').map(i => i.trim()),
        location,
        profileImage: profileImagePath,
        isOnboarded: true
      },
      { new: true }
    );

    res.status(200).json({ message: "Onboarding complete", user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
  }
};


exports.checkOnboardingStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ isOnboarded: user.isOnboarded });
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    res.status(500).json({ message: "Error checking onboarding status" });
  }
};


