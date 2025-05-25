const mongoose = require('mongoose');
const User = require("../models/User");
const Skill = require("../models/Skill");
const { body, validationResult } = require("express-validator");
// controllers/userController.js
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const Session = require("../models/Session");
const { aiSkillMatch } = require("./aiMatchController")
const Discussion = require('../models/Discussion');






exports.getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('skillsICanTeach')
      .populate('skillsIWantToLearn');

    if (!user) {
      console.error("❌ User not found in DB");
      return res.status(404).json({ message: 'User not found' });
    }


    // Ensure profileImage is returned as full path if DB has only filename
    let profileImageUrl = user.profileImage;
    if (!profileImageUrl.startsWith("http")) {
      profileImageUrl = `/uploads/${profileImageUrl}`;
}


    res.json({
      name: user.name,
      location: user.location,
      bio: user.bio,
      profileImage: profileImageUrl,
      skillsICanTeach: user.skillsICanTeach,
      skillsIWantToLearn: user.skillsIWantToLearn,
      achievements: user.achievements,
      availability: user.availability,
      socialLinks: user.socialLinks,
    });

  } catch (err) {
    console.error("❌ getUserProfile Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.updateUserProfile = async (req, res) => {
  try {
    console.log("🟡 Incoming updateUserProfile Request");

    const { bio, location } = req.body;

    let availability = [];
    let socialLinks = [];
    let achievements = [];

    try {
      availability = JSON.parse(req.body.availability || "[]");
      socialLinks = JSON.parse(req.body.socialLinks || "[]");
      achievements = JSON.parse(req.body.achievements || "[]");
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      return res.status(400).json({ message: "Invalid JSON in request body", error: parseError.message });
    }

    console.log("✅ req.user:", req.user);
    console.log("✅ req.file:", req.file);

    if (!req.user || !req.user.id) {
      console.error("❌ No user ID found in request");
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    let profileImageUrl = null;

    if (req.file) {
      console.log("🟢 Uploading to Cloudinary (via buffer)...");

      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      profileImageUrl = uploadResult.secure_url;
      console.log("✅ Cloudinary Upload Successful:", profileImageUrl);
    } else {
      console.log("ℹ️ No new profile image uploaded");
    }

    const updateData = {
      bio,
      location,
      availability,
      socialLinks,
      achievements,
    };

    if (profileImageUrl) {
      updateData.profileImage = profileImageUrl; // Cloudinary full URL
    }

    console.log("🟢 Final updateData to DB:", updateData);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

    if (!updatedUser) {
      console.error("❌ User not found during update");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User Updated Successfully:", updatedUser);

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("❌ Update User Profile Error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
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



exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary (buffer to base64 string)
    const uploadedResponse = await cloudinary.uploader.upload_stream(
      {
        folder: 'profileImages',
        resource_type: 'image',
        transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
      },
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Cloudinary upload failed' });
        }

        // Update user's profileImage field
        const user = await User.findByIdAndUpdate(
          req.user.id,
          { profileImage: result.secure_url },
          { new: true }
        ).select('-password');

        res.json({ message: 'Profile image updated', profileImage: user.profileImage });
      }
    );

    // Pipe file buffer to Cloudinary upload_stream
    require('streamifier').createReadStream(req.file.buffer).pipe(uploadedResponse);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
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



exports.getUserStats = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID format' });
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const user = await User.findById(userId)
      .select('name email profileImage skillsICanTeach skillsIWantToLearn')
      .populate('skillsICanTeach', 'name')
      .populate('skillsIWantToLearn', 'name')
      .lean();

      console.log('User Document:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create a mock request object for aiSkillMatch
    const mockReq = {
      user: { id: userId.toString() },
      query: {},
      body: {},
      params: {}
    };

    // Create a mock response collector
    let matches = [];
    const mockRes = {
      json: (data) => { matches = data.matches || []; }
    };

    // Get all data in parallel
    const [sessions, announcements, matchData] = await Promise.all([
      Session.find({ $or: [{ learner: userId }, { teacher: userId }] })
        .populate('skill', 'name')
        .lean(),
        
      
      Discussion.countDocuments({ 
        isAnnouncement: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      
      aiSkillMatch(mockReq, mockRes, true) // internalCall = true
    ]);
    console.log('Session Count:', sessions.length);

    // Calculate session stats
    const now = new Date();
    const sessionStats = sessions.reduce((acc, session) => {
      const isTeacher = session.teacher.toString() === userId.toString();
      const isUpcoming = new Date(session.startTime) > now;
      const isCompleted = new Date(session.endTime) <= now;

      if (isTeacher) acc.teachingSessions++;
      else acc.learningSessions++;

      if (isUpcoming) acc.upcomingSessions++;
      if (isCompleted) acc.completedSessions++;

      return acc;
    }, { teachingSessions: 0, learningSessions: 0, upcomingSessions: 0, completedSessions: 0 });

    // Prepare response
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.profileImage
        },
        general: {
          ...sessionStats,
          totalSessions: sessions.length,
          announcementsCount: announcements,
          matchCount: matches.length
        },
        skills: {
          teaching: user.skillsICanTeach.map(s => s.name),
          learning: user.skillsIWantToLearn.map(s => s.name),
        },
        recentActivity: {
          lastSession: sessions.length > 0 
            ? sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0]
            : null,
          topMatches: matches.slice(0, 3)
        }
      }
    });

    // In getUserStats controller
console.log('User ID:', userId);
console.log('User found:', user);
console.log('Sessions found:', sessions.length);
console.log('Matches found:', matches.length);

  } catch (error) {
    console.error('Error in getUserStats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};




