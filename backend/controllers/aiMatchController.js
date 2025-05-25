const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/User");
const Skill = require("../models/Skill");
const { validationResult } = require("express-validator");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.aiSkillMatch = async (req, res, internalCall = false) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return internalCall 
      ? { matches: [], aiAdvice: "" }
      : res.status(400).json({ errors: errors.array() });
  }

  try {
    const currentUser = await User.findById(req.user.id)
      .populate("skillsIWantToLearn", "name")
      .select("skillsIWantToLearn");

    const otherUsers = await User.find({ _id: { $ne: req.user.id } })
      .populate("skillsICanTeach", "name")
      .select("name skillsICanTeach location lastActive avatar");

    if (!currentUser || otherUsers.length === 0) {
      return internalCall
        ? { matches: [], aiAdvice: "No matches found" }
        : res.status(404).json({ message: "No users or skills found" });
    }

    // Build structured matches
    const structuredMatches = otherUsers
      .map(user => {
        const matchingSkills = user.skillsICanTeach.filter(teachSkill => 
          currentUser.skillsIWantToLearn.some(learnSkill => 
            learnSkill.name === teachSkill.name
          )
        );

        if (matchingSkills.length === 0) return null;

        const matchPercentage = Math.min(
          95,
          70 + (matchingSkills.length * 5) + 
          (user.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 10 : 0
        ));

        return {
          id: user._id,
          name: user.name,
          avatar: user.avatar || "/placeholder.svg",
          location: user.location || "Unknown",
          teaches: matchingSkills.map(skill => skill.name),
          learns: [],
          match: matchPercentage,
          active: user.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        };
      })
      .filter(match => match !== null)
      .sort((a, b) => b.match - a.match);

    // Generate AI advice
    let aiAdvice = "";
    try {
      const prompt = `The current user wants to learn: ${currentUser.skillsIWantToLearn.map(skill => skill.name).join(", ")}`;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      aiAdvice = await result.response.text();
    } catch (aiError) {
      console.error("AI advice error:", aiError);
      aiAdvice = "Could not generate AI advice";
    }

    return internalCall
      ? { matches: structuredMatches, aiAdvice }
      : res.json({ matches: structuredMatches, aiAdvice });

  } catch (err) {
    console.error("Match generation error:", err);
    return internalCall
      ? { matches: [], aiAdvice: "Error generating matches" }
      : res.status(500).json({ message: "Error generating matches", error: err.message });
  }
};
