const Session = require("../models/Session");
const { validationResult } = require("express-validator");


exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ learner: req.user.id }, { teacher: req.user.id }],
    })
      .populate("skill", "name")
      .populate("teacher", "name email")
      .populate("learner", "name email");

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sessions", error: err.message });
  }
};

exports.createSession = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  const { teacher, skill, scheduledAt, notes } = req.body;

  try {
    const newSession = await Session.create({
      learner: req.user.id,
      teacher,
      skill,
      scheduledAt,
      notes,
    });

    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ message: "Error creating session", error: err.message });
  }
};

exports.updateSessionStatus = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  const { status } = req.body;

  try {
    const session = await Session.findById(req.params.id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // Only the teacher can confirm/complete/cancel
    if (session.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    session.status = status;
    await session.save();

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Error updating session", error: err.message });
  }
};
