const mongoose = require("mongoose")

const ChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    requiredSessions: {
      type: Number,
      default: 3,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sessionsCompleted: {
          type: Number,
          default: 0,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    prizes: [
      {
        name: String,
        description: String,
      },
    ],
    badges: [
      {
        name: String,
        image: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

// Virtual for participant count
ChallengeSchema.virtual("participantCount").get(function () {
  return this.participants.length
})

// Virtual for days remaining
ChallengeSchema.virtual("daysRemaining").get(function () {
  const now = new Date()
  const end = new Date(this.endDate)
  const diffTime = Math.abs(end - now)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

module.exports = mongoose.model("Challenge", ChallengeSchema)
