const User = require("../models/User");
const Skill = require("../models/Skill");
const { body, validationResult } = require("express-validator");


// PATCH /api/users/update-skills
exports.updateUserSkills = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { skillsICanTeach, skillsIWantToLearn } = req.body;

    if (skillsICanTeach) user.skillsICanTeach = skillsICanTeach;
    if (skillsIWantToLearn) user.skillsIWantToLearn = skillsIWantToLearn;

    await user.save();

    res.json({
      message: "Skills updated successfully",
      user: {
        id: user._id,
        name: user.name,
        skillsICanTeach: user.skillsICanTeach,
        skillsIWantToLearn: user.skillsIWantToLearn,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating skills", error: err.message });
  }
};

// POST /api/users/add-skill
exports.addSkillToUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { skillId, type } = req.body;

    if (!["teach", "learn"].includes(type)) {
      return res.status(400).json({ message: "Type must be either 'teach' or 'learn'" });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "teach") {
      if (!user.skillsICanTeach.includes(skill._id)) {
        user.skillsICanTeach.push(skill._id);
      }
    } else if (type === "learn") {
      if (!user.skillsIWantToLearn.includes(skill._id)) {
        user.skillsIWantToLearn.push(skill._id);
      }
    }

    await user.save();

    res.json({
      message: `Skill added to your ${type === "teach" ? "teaching" : "learning"} skills`,
      user: {
        id: user._id,
        name: user.name,
        skillsICanTeach: user.skillsICanTeach,
        skillsIWantToLearn: user.skillsIWantToLearn,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding skill", error: err.message });
  }
};

// GET /api/users/my-skills
exports.getMySkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("skillsICanTeach", "name level experience description")
      .populate("skillsIWantToLearn", "name level experience description");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      skillsICanTeach: user.skillsICanTeach,
      skillsIWantToLearn: user.skillsIWantToLearn,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching skills", error: err.message });
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

