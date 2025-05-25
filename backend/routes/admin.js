const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Discussion = require("../models/Discussion")
const Resource = require("../models/Resource")
const Challenge = require("../models/Challenge")
const { protect } = require("../middleware/authMiddleware")
const { isAdmin } = require("../middleware/admin")
const mongoose = require("mongoose") // Added missing mongoose import

// Apply authentication and admin middleware to all routes
router.use(protect, isAdmin)

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments()
    const activeUserCount = await User.countDocuments({ status: "active" })

    const discussionCount = await Discussion.countDocuments()
    const pendingDiscussionCount = await Discussion.countDocuments({ status: "pending" })

    const resourceCount = await Resource.countDocuments()
    const pendingResourceCount = await Resource.countDocuments({ isApproved: false })

    const challengeCount = await Challenge.countDocuments()
    const activeParticipants = await Challenge.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ])

    const participantCount = activeParticipants.length > 0 ? activeParticipants[0].count : 0

    // Get recent activity
    const recentDiscussions = await Discussion.find().sort({ createdAt: -1 }).limit(5).populate("author", "name avatar")

    const recentResources = await Resource.find().sort({ createdAt: -1 }).limit(5).populate("author", "name avatar")

    // Combine and sort by date
    const recentActivity = [
      ...recentDiscussions.map((d) => ({
        type: "discussion",
        id: d._id,
        title: d.title,
        author: d.author,
        createdAt: d.createdAt,
      })),
      ...recentResources.map((r) => ({
        type: "resource",
        id: r._id,
        title: r.title,
        author: r.author,
        createdAt: r.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    res.json({
      users: {
        total: userCount,
        active: activeUserCount,
      },
      discussions: {
        total: discussionCount,
        pending: pendingDiscussionCount,
      },
      resources: {
        total: resourceCount,
        pending: pendingResourceCount,
      },
      challenges: {
        total: challengeCount,
        participants: participantCount,
      },
      recentActivity,
    })
  } catch (error) {
    console.error("Error getting admin stats:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// User Management Routes

// Get all users with pagination
router.get("/users", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.role) filter.role = req.query.role
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments(filter)

    res.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting users:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error getting user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, role, status, bio } = req.body

    // Find user
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (status) user.status = status
    if (bio !== undefined) user.bio = bio

    await user.save()

    res.json({ message: "User updated successfully", user: { ...user.toObject(), password: undefined } })
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await User.deleteOne({ _id: req.params.id })
    console.log('Received ID:', req.params.id);

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Discussion Management Routes

// Get all discussions with pagination
router.get("/discussions", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.category) filter.category = req.query.category
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const discussions = await Discussion.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Discussion.countDocuments(filter)

    res.json({
      discussions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting discussions:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update discussion status
router.patch("/discussions/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const discussion = await Discussion.findById(req.params.id)

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    discussion.status = status
    await discussion.save()

    res.json({ message: "Discussion status updated successfully", discussion })
  } catch (error) {
    console.error("Error updating discussion status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete discussion
router.delete("/discussions/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    await Discussion.deleteOne({ _id: req.params.id })

    res.json({ message: "Discussion deleted successfully" })
  } catch (error) {
    console.error("Error deleting discussion:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Resource Management Routes

// Get all resources with pagination
router.get("/resources", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.isApproved !== undefined) filter.isApproved = req.query.isApproved === "true"
    if (req.query.topic) filter.topic = req.query.topic
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const resources = await Resource.find(filter)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Resource.countDocuments(filter)

    res.json({
      resources,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting resources:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update resource approval status
router.patch("/resources/:id/approve", async (req, res) => {
  try {
    const { isApproved } = req.body

    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    resource.isApproved = isApproved
    await resource.save()

    res.json({ message: "Resource approval status updated successfully", resource })
  } catch (error) {
    console.error("Error updating resource approval:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete resource
router.delete("/resources/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    // If there's a file, you might want to delete it from storage
    // This depends on your file storage implementation

    await Resource.deleteOne({ _id: req.params.id })

    res.json({ message: "Resource deleted successfully" })
  } catch (error) {
    console.error("Error deleting resource:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Challenge Management Routes

// Get all challenges with pagination
router.get("/challenges", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true"
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const challenges = await Challenge.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Challenge.countDocuments(filter)

    res.json({
      challenges,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting challenges:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new challenge
router.post("/challenges", async (req, res) => {
  try {
    const { title, description, startDate, endDate, requirements, requiredSessions, prizes, badges, isActive } =
      req.body

    const newChallenge = new Challenge({
      title,
      description,
      startDate,
      endDate,
      requirements,
      requiredSessions,
      prizes,
      badges,
      isActive,
    })

    await newChallenge.save()

    res.status(201).json({ message: "Challenge created successfully", challenge: newChallenge })
  } catch (error) {
    console.error("Error creating challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update challenge
router.put("/challenges/:id", async (req, res) => {
  try {
    const { title, description, startDate, endDate, requirements, requiredSessions, prizes, badges, isActive } =
      req.body

    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    // Update fields
    if (title) challenge.title = title
    if (description) challenge.description = description
    if (startDate) challenge.startDate = startDate
    if (endDate) challenge.endDate = endDate
    if (requirements) challenge.requirements = requirements
    if (requiredSessions !== undefined) challenge.requiredSessions = requiredSessions
    if (prizes) challenge.prizes = prizes
    if (badges) challenge.badges = badges
    if (isActive !== undefined) challenge.isActive = isActive

    await challenge.save()

    res.json({ message: "Challenge updated successfully", challenge })
  } catch (error) {
    console.error("Error updating challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete challenge
router.delete("/challenges/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    await Challenge.deleteOne({ _id: req.params.id })

    res.json({ message: "Challenge deleted successfully" })
  } catch (error) {
    console.error("Error deleting challenge:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Announcement Management Routes

// Create announcement (special type of discussion)
router.post("/announcements", async (req, res) => {
  try {
    const { title, content, tags, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink } = req.body

    const newAnnouncement = new Discussion({
      title,
      content,
      author: req.user.id,
      tags,
      isAnnouncement: true,
      status: "approved",
      category: "announcement",
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink,
    })

    await newAnnouncement.save()

    // Populate author details
    await newAnnouncement.populate("author", "name avatar")

    res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement })
  } catch (error) {
    console.error("Error creating announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Discussion.find({ isAnnouncement: true })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })

    res.json(announcements)
  } catch (error) {
    console.error("Error getting announcements:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update announcement
router.put("/announcements/:id", async (req, res) => {
  try {
    const { title, content, tags, buttonText, buttonLink, secondaryButtonText, secondaryButtonLink } = req.body

    const announcement = await Discussion.findOne({ _id: req.params.id, isAnnouncement: true })

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    // Update fields
    if (title) announcement.title = title
    if (content) announcement.content = content
    if (tags) announcement.tags = tags
    if (buttonText) announcement.buttonText = buttonText
    if (buttonLink) announcement.buttonLink = buttonLink
    if (secondaryButtonText !== undefined) announcement.secondaryButtonText = secondaryButtonText
    if (secondaryButtonLink !== undefined) announcement.secondaryButtonLink = secondaryButtonLink

    await announcement.save()

    res.json({ message: "Announcement updated successfully", announcement })
  } catch (error) {
    console.error("Error updating announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete announcement
router.delete("/announcements/:id", async (req, res) => {
  try {
    const announcement = await Discussion.findOne({ _id: req.params.id, isAnnouncement: true })

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" })
    }

    await Discussion.deleteOne({ _id: req.params.id })

    res.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Report Management Routes

// Create a Report model
const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentType: {
    type: String,
    enum: ["discussion", "resource", "user"],
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    enum: ["spam", "inappropriate", "harassment", "misinformation", "copyright", "other"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Report = mongoose.model("Report", reportSchema)

// Get all reports with pagination
router.get("/reports", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.contentType) filter.contentType = req.query.contentType
    if (req.query.reason) filter.reason = req.query.reason
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ]
    }

    const reports = await Report.find(filter)
      .populate("reporter", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Report.countDocuments(filter)

    res.json({
      reports,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error getting reports:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update report status
router.patch("/reports/:id/status", async (req, res) => {
  try {
    const { status } = req.body

    if (!["pending", "resolved", "dismissed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    report.status = status
    await report.save()

    res.json({ message: "Report status updated successfully", report })
  } catch (error) {
    console.error("Error updating report status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Settings Management Routes

// Create a Settings model
const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Settings = mongoose.model("Settings", settingsSchema)

// Get all settings
router.get("/settings", async (req, res) => {
  try {
    const settings = await Settings.find().sort({ category: 1, key: 1 })

    // Transform to object by category
    const settingsByCategory = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = {}
      }
      acc[setting.category][setting.key] = setting.value
      return acc
    }, {})

    res.json(settingsByCategory)
  } catch (error) {
    console.error("Error getting settings:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update settings
router.put("/settings", async (req, res) => {
  try {
    const { settings } = req.body

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ message: "Invalid settings format" })
    }

    const updatePromises = []

    // Process each setting
    for (const category in settings) {
      for (const key in settings[category]) {
        const value = settings[category][key]

        updatePromises.push(
          Settings.findOneAndUpdate(
            { key, category },
            {
              key,
              value,
              category,
              updatedBy: req.user.id,
              updatedAt: new Date(),
            },
            { upsert: true, new: true },
          ),
        )
      }
    }

    await Promise.all(updatePromises)

    res.json({ message: "Settings updated successfully" })
  } catch (error) {
    console.error("Error updating settings:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
