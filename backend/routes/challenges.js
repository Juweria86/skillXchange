const express = require("express")
const router = express.Router()
const Challenge = require("../models/Challenge")
const { protect} = require("../middleware/authMiddleware")
const { isAdmin } = require("../middleware/admin")

// Get all active challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ endDate: 1 }).lean()

    // Format the challenges for the frontend
    const formattedChallenges = challenges.map((challenge) => ({
      id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      requirements: challenge.requirements,
      requiredSessions: challenge.requiredSessions,
      participants: challenge.participants.length,
      daysRemaining: getDaysRemaining(challenge.endDate),
      prizes: challenge.prizes,
      badges: challenge.badges,
    }))

    res.json(formattedChallenges)
  } catch (error) {
    console.error("Get challenges error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single challenge
router.get("/:id", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).lean()

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    // Format the challenge for the frontend
    const formattedChallenge = {
      id: challenge._id,
      title: challenge.title,
      description: challenge.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      requirements: challenge.requirements,
      requiredSessions: challenge.requiredSessions,
      participants: challenge.participants.length,
      daysRemaining: getDaysRemaining(challenge.endDate),
      prizes: challenge.prizes,
      badges: challenge.badges,
      isActive: challenge.isActive,
    }

    res.json(formattedChallenge)
  } catch (error) {
    console.error("Get challenge error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Join a challenge
router.post("/:id/join", protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    if (!challenge.isActive) {
      return res.status(400).json({ message: "This challenge is no longer active" })
    }

    // Check if user already joined
    const alreadyJoined = challenge.participants.some((participant) => participant.user.toString() === req.user.id)

    if (alreadyJoined) {
      return res.status(400).json({ message: "You have already joined this challenge" })
    }

    // Add user to participants
    challenge.participants.push({
      user: req.user.id,
      sessionsCompleted: 0,
      joinedAt: new Date(),
    })

    await challenge.save()

    res.json({ message: "Successfully joined the challenge" })
  } catch (error) {
    console.error("Join challenge error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's progress in a challenge
router.get("/:id/progress", protect, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    // Find user's participation
    const participation = challenge.participants.find((participant) => participant.user.toString() === req.user.id)

    if (!participation) {
      return res.json({
        joined: false,
        sessionsCompleted: 0,
        requiredSessions: challenge.requiredSessions,
        progress: 0,
      })
    }

    // Calculate progress percentage
    const progress = Math.min(100, Math.round((participation.sessionsCompleted / challenge.requiredSessions) * 100))

    res.json({
      joined: true,
      sessionsCompleted: participation.sessionsCompleted,
      requiredSessions: challenge.requiredSessions,
      progress,
      completed: participation.sessionsCompleted >= challenge.requiredSessions,
    })
  } catch (error) {
    console.error("Get challenge progress error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get challenge leaderboard
router.get("/:id/leaderboard", async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate("participants.user", "name avatar").lean()

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" })
    }

    // Sort participants by sessions completed
    const leaderboard = challenge.participants
      .sort((a, b) => b.sessionsCompleted - a.sessionsCompleted)
      .slice(0, 10) // Get top 10
      .map((participant, index) => ({
        rank: index + 1,
        user: {
          id: participant.user._id,
          name: participant.user.name,
          avatar: participant.user.avatar,
        },
        sessionsCompleted: participant.sessionsCompleted,
        completed: participant.sessionsCompleted >= challenge.requiredSessions,
      }))

    res.json(leaderboard)
  } catch (error) {
    console.error("Get challenge leaderboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new challenge (admin only)
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { title, description, startDate, endDate, requirements, requiredSessions, prizes, badges } = req.body

    const newChallenge = new Challenge({
      title,
      description,
      startDate,
      endDate,
      requirements,
      requiredSessions,
      prizes,
      badges,
    })

    await newChallenge.save()

    // Format the challenge for the frontend
    const formattedChallenge = {
      id: newChallenge._id,
      title: newChallenge.title,
      description: newChallenge.description,
      startDate: newChallenge.startDate,
      endDate: newChallenge.endDate,
      requirements: newChallenge.requirements,
      requiredSessions: newChallenge.requiredSessions,
      participants: 0,
      daysRemaining: getDaysRemaining(newChallenge.endDate),
      prizes: newChallenge.prizes,
      badges: newChallenge.badges,
      isActive: newChallenge.isActive,
    }

    res.status(201).json(formattedChallenge)
  } catch (error) {
    console.error("Create challenge error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to calculate days remaining
function getDaysRemaining(endDate) {
  const now = new Date()
  const end = new Date(endDate)
  const diffTime = Math.max(0, end - now)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

module.exports = router
