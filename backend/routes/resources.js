const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Resource = require("../models/Resource")
const { protect} = require("../middleware/authMiddleware")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/resources"
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/zip",
      "application/x-zip-compressed",
    ]

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only documents, images, and zip files are allowed."))
    }
  },
})

// Get all resources
router.get("/", async (req, res) => {
  try {
    const { topic, sort = "recent" } = req.query

    const query = { isApproved: true }

    if (topic && topic !== "all") {
      query.topic = topic
    }

    let sortOption = {}
    if (sort === "recent") {
      sortOption = { createdAt: -1 }
    } else if (sort === "popular") {
      sortOption = { downloads: -1 }
    }

    const resources = await Resource.find(query).sort(sortOption).populate("author", "name avatar").lean()

    // Format the resources for the frontend
    const formattedResources = resources.map((resource) => ({
      id: resource._id,
      title: resource.title,
      type: resource.type,
      description: resource.description,
      icon: getIconComponent(resource.icon),
      iconBg: resource.iconBg,
      iconColor: resource.iconColor,
      author: {
        name: resource.author.name,
        avatar: resource.author.avatar,
      },
      buttonText: resource.fileUrl ? "Download" : "Visit Link",
      fileUrl: resource.fileUrl,
      externalLink: resource.externalLink,
      downloads: resource.downloads,
      topic: resource.topic,
    }))

    res.json(formattedResources)
  } catch (error) {
    console.error("Get resources error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a single resource
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate("author", "name avatar").lean()

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    // Format the resource for the frontend
    const formattedResource = {
      id: resource._id,
      title: resource.title,
      type: resource.type,
      description: resource.description,
      icon: getIconComponent(resource.icon),
      iconBg: resource.iconBg,
      iconColor: resource.iconColor,
      author: {
        name: resource.author.name,
        avatar: resource.author.avatar,
      },
      buttonText: resource.fileUrl ? "Download" : "Visit Link",
      fileUrl: resource.fileUrl,
      externalLink: resource.externalLink,
      downloads: resource.downloads,
      topic: resource.topic,
    }

    res.json(formattedResource)
  } catch (error) {
    console.error("Get resource error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create a new resource
router.post("/", protect, upload.single("file"), async (req, res) => {
  try {
    const { title, type, description, externalLink, topic, icon, iconBg, iconColor } = req.body

    const newResource = new Resource({
      title,
      type,
      description,
      author: req.user.id,
      topic,
      icon: icon || getDefaultIcon(type),
      iconBg: iconBg || getDefaultIconBg(type),
      iconColor: iconColor || getDefaultIconColor(type),
    })

    // Handle file upload or external link
    if (req.file) {
      newResource.fileUrl = `/uploads/resources/${req.file.filename}`
    } else if (externalLink) {
      newResource.externalLink = externalLink
    } else {
      return res.status(400).json({ message: "Either a file or external link is required" })
    }

    await newResource.save()

    // Populate author details
    await newResource.populate("author", "name avatar")

    // Format the resource for the frontend
    const formattedResource = {
      id: newResource._id,
      title: newResource.title,
      type: newResource.type,
      description: newResource.description,
      icon: getIconComponent(newResource.icon),
      iconBg: newResource.iconBg,
      iconColor: newResource.iconColor,
      author: {
        name: newResource.author.name,
        avatar: newResource.author.avatar,
      },
      buttonText: newResource.fileUrl ? "Download" : "Visit Link",
      fileUrl: newResource.fileUrl,
      externalLink: newResource.externalLink,
      downloads: 0,
      topic: newResource.topic,
    }

    res.status(201).json(formattedResource)
  } catch (error) {
    console.error("Create resource error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Download a resource
router.get("/:id/download", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" })
    }

    if (!resource.fileUrl) {
      return res.status(400).json({ message: "This resource does not have a downloadable file" })
    }

    // Increment download count
    resource.downloads += 1
    await resource.save()

    // Get the file path
    const filePath = path.join(__dirname, "..", resource.fileUrl)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }

    // Send the file
    res.download(filePath)
  } catch (error) {
    console.error("Download resource error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to get default icon based on resource type
function getDefaultIcon(type) {
  if (type.includes("PDF")) return "file"
  if (type.includes("Slides")) return "presentation"
  if (type.includes("Link")) return "link"
  return "file"
}

// Helper function to get default icon background based on resource type
function getDefaultIconBg(type) {
  if (type.includes("PDF")) return "bg-blue-100"
  if (type.includes("Slides")) return "bg-purple-100"
  if (type.includes("Link")) return "bg-green-100"
  return "bg-blue-100"
}

// Helper function to get default icon color based on resource type
function getDefaultIconColor(type) {
  if (type.includes("PDF")) return "text-blue-600"
  if (type.includes("Slides")) return "text-purple-600"
  if (type.includes("Link")) return "text-green-600"
  return "text-blue-600"
}

// Helper function to get icon component based on icon type
function getIconComponent(iconType) {
  // This would return the appropriate SVG markup based on the icon type
  // For simplicity, we're just returning a placeholder
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
}

module.exports = router
