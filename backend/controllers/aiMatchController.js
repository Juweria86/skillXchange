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
      .populate("skillsIWantToLearn", "name")
      .select("skillsIWantToLearn");

    const otherUsers = await User.find({ _id: { $ne: req.user.id } })
      .populate("skillsICanTeach", "name")
      .select("name skillsICanTeach location lastActive");

    if (!currentUser || otherUsers.length === 0) {
      return res.status(404).json({ message: "No users or skills found" });
    }

    // Build structured matches based on skill overlap
    const structuredMatches = otherUsers.map(user => {
      const matchingSkills = user.skillsICanTeach.filter(teachSkill => 
        currentUser.skillsIWantToLearn.some(learnSkill => 
          learnSkill.name === teachSkill.name
        )
      );

      if (matchingSkills.length === 0) return null;

      // Calculate match percentage (simplified for example)
      const matchPercentage = Math.min(
        95,
        70 + (matchingSkills.length * 5) + 
        (user.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 10 : 0)
      );

      return {
        id: user._id,
        name: user.name,
        avatar: user.avatar || "/placeholder.svg",
        location: user.location || "Unknown",
        teaches: matchingSkills.map(skill => skill.name),
        learns: [], // We don't know what they want to learn from this
        match: matchPercentage,
        active: user.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      };
    }).filter(match => match !== null);

    // Sort by match percentage
    structuredMatches.sort((a, b) => b.match - a.match);

    // Also get AI suggestions if you want both
    const prompt = `
      The current user wants to learn: ${currentUser.skillsIWantToLearn.map(skill => skill.name).join(", ")}
      
      Here are the best matches we found:
      ${structuredMatches.slice(0, 5).map(user => 
        `${user.name} - ${user.teaches.join(", ")} (${user.match}% match)`
      ).join("\n")}
      
      Please provide some personalized advice for the user about these matches.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const aiAdvice = await result.response.text();

    res.json({ 
      matches: structuredMatches,
      aiAdvice 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating matches", error: err.message });
  }
};
