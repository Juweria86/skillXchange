const Skill = require("../models/Skill");
const User = require("../models/User");
const { validationResult } = require("express-validator");

// GET all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching skills", error: err.message });
  }
};

// GET single skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Error fetching skill", error: err.message });
  }
};

// CREATE a new skill (admin or system use)
exports.createSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, level, experience } = req.body;

    const skill = new Skill({
      name,
      description,
      level,
      experience
    });

    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (err) {
    res.status(500).json({ message: "Error creating skill", error: err.message });
  }
};

// UPDATE skill details
exports.updateSkill = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSkill);
  } catch (err) {
    res.status(500).json({ message: "Error updating skill", error: err.message });
  }
};

// DELETE skill and remove references from all users
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    // Remove skill from all user arrays
    await User.updateMany({ skillsICanTeach: skill._id }, { $pull: { skillsICanTeach: skill._id } });
    await User.updateMany({ skillsIWantToLearn: skill._id }, { $pull: { skillsIWantToLearn: skill._id } });

    await skill.deleteOne();
    res.json({ message: "Skill deleted and removed from users" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting skill", error: err.message });
  }
};
