const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Skill = require("../models/Skill");
const { validationResult } = require("express-validator");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiSkillMatch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const currentUser = await User.findById(req.user.id)
      .populate("skillsIWantToLearn", "name");

    const otherUsers = await User.find({ _id: { $ne: req.user.id } })
      .populate("skillsICanTeach", "name");

    if (!currentUser || otherUsers.length === 0) {
      return res.status(404).json({ message: "No users or skills found" });
    }

    // Build the prompt for Gemini
    const prompt = `
You are an AI that helps match students for skill sharing.

The current user wants to learn: ${currentUser.skillsIWantToLearn.map(skill => skill.name).join(", ")}

Here are other users and what they can teach:
${otherUsers.map(user => `${user.name}: ${user.skillsICanTeach.map(skill => skill.name).join(", ")}`).join("\n")}

Suggest the best matches. Focus on relevance of skills, and rank users if possible. 
Return a simple list: Name - Skill they teach that matches.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ matches: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating AI matches", error: err.message });
  }
};
