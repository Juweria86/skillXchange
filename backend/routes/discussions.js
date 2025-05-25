const express = require("express")
const router = express.Router()
const Discussion = require("../models/Discussion")
const User = require("../models/User")
const { protect} = require("../middleware/authMiddleware")

// Get all discussions
router.get("/", async (req, res) => {
  try {
    const { category, sort = "recent", isAnnouncement = false } = req.query

    const query = { isAnnouncement }

    if (category && category !== "all") {
      query.category = category
    }

    let sortOption = {}
    if (sort === "recent") {
      sortOption = { createdAt: -1 }
    } else if (sort === "popular") {
      sortOption = { likes: -1 }
    }

    const discussions = await Discussion.find(query).sort(sortOption).populate("author", "name avatar").lean()

    // Format the discussions for the frontend
    const formattedDiscussions = discussions.map((discussion) => ({
      id: discussion._id,
      title: discussion.title,
      author: {
        name: discussion.author.name,
        avatar: discussion.author.avatar,
      },
      time: formatTimeAgo(discussion.createdAt),
      content: discussion.content,
      tags: discussion.tags,
      likes: discussion.likes.length,
      replies: discussion.replies.length,
      category: discussion.category,
    }))

    res.json(formattedDiscussions)
  } catch (error) {
    console.error("Get discussions error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get announcements
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Discussion.find({ isAnnouncement: true })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .lean()

    // Format the announcements for the frontend
    const formattedAnnouncements = announcements.map((announcement) => ({
      id: announcement._id,
      title: announcement.title,
      author: {
        name: announcement.author.name,
        avatar: announcement.author.avatar,
      },
      time: formatTimeAgo(announcement.createdAt),
      content: announcement.content,
      tags: announcement.tags,
    }))

    res.json(formattedAnnouncements)
  } catch (error) {
    console.error("Get announcements error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single discussion
router.get("/:id", async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate("author", "name avatar")
      .populate("replies.author", "name avatar")
      .lean()

    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    // Format the discussion for the frontend
    const formattedDiscussion = {
      id: discussion._id,
      title: discussion.title,
      author: {
        name: discussion.author.name,
        avatar: discussion.author.avatar,
      },
      time: formatTimeAgo(discussion.createdAt),
      content: discussion.content,
      tags: discussion.tags,
      likes: discussion.likes.length,
      replies: discussion.replies.map((reply) => ({
        id: reply._id,
        content: reply.content,
        author: {
          name: reply.author.name,
          avatar: reply.author.avatar,
        },
        time: formatTimeAgo(reply.createdAt),
      })),
      category: discussion.category,
    }

    res.json(formattedDiscussion)
  } catch (error) {
    console.error("Get discussion error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new discussion
router.post("/", protect, async (req, res) => {
  try {
    const { title, content, tags, category, isAnnouncement = false } = req.body

    // Only admins can create announcements
    if (isAnnouncement && !req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can create announcements" })
    }

    const newDiscussion = new Discussion({
      title,
      content,
      author: req.user.id,
      tags,
      category,
      isAnnouncement,
    })

    await newDiscussion.save()

    // Populate author details
    await newDiscussion.populate("author", "name avatar")

    // Format the discussion for the frontend
    const formattedDiscussion = {
      id: newDiscussion._id,
      title: newDiscussion.title,
      author: {
        name: newDiscussion.author.name,
        avatar: newDiscussion.author.avatar,
      },
      time: "Just now",
      content: newDiscussion.content,
      tags: newDiscussion.tags,
      likes: 0,
      replies: 0,
      category: newDiscussion.category,
    }

    res.status(201).json(formattedDiscussion)
  } catch (error) {
    console.error("Create discussion error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Add a reply to a discussion
router.post("/:id/replies", protect, async (req, res) => {
  try {
    const { content } = req.body

    const discussion = await Discussion.findById(req.params.id)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    const reply = {
      content,
      author: req.user.id,
      createdAt: new Date(),
    }

    discussion.replies.push(reply)
    await discussion.save()

    // Get author details
    const author = await User.findById(req.user.id).select("name avatar")

    // Format the reply for the frontend
    const formattedReply = {
      id: discussion.replies[discussion.replies.length - 1]._id,
      content,
      author: {
        name: author.name,
        avatar: author.avatar,
      },
      time: "Just now",
    }

    res.status(201).json(formattedReply)
  } catch (error) {
    console.error("Add reply error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Like a discussion
router.post("/:id/like", protect, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" })
    }

    // Check if user already liked the discussion
    if (discussion.likes.includes(req.user.id)) {
      // Unlike
      discussion.likes = discussion.likes.filter((like) => like.toString() !== req.user.id)
    } else {
      // Like
      discussion.likes.push(req.user.id)
    }

    await discussion.save()

    res.json({ likes: discussion.likes.length })
  } catch (error) {
    console.error("Like discussion error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
}

module.exports = router
