const mongoose = require("mongoose")

const DiscussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        name: String,
        variant: {
          type: String,
          enum: ["blue", "green", "purple", "yellow", "red"],
          default: "blue",
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    category: {
      type: String,
      enum: ["general", "tech", "design", "language", "soft-skills", "announcement"],
      default: "general",
    },
    isAnnouncement: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    buttonText: {
      type: String,
      default: "Learn More",
    },
    buttonLink: {
      type: String,
    },
    secondaryButtonText: {
      type: String,
    },
    secondaryButtonLink: {
      type: String,
    },
  },
  { timestamps: true },
)

// Virtual for like count
DiscussionSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for reply count
DiscussionSchema.virtual("replyCount").get(function () {
  return this.replies.length
})

module.exports = mongoose.model("Discussion", DiscussionSchema)
