const mongoose = require("mongoose")

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrl: String,
    externalLink: String,
    icon: {
      type: String,
      default: "file",
    },
    iconBg: {
      type: String,
      default: "bg-blue-100",
    },
    iconColor: {
      type: String,
      default: "text-blue-600",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    topic: {
      type: String,
      enum: ["programming", "design", "business", "language", "other"],
      default: "other",
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Resource", ResourceSchema)
