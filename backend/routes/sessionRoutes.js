const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const { protect } = require("../middleware/authMiddleware");

// Get all sessions for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new session
router.post('/', protect, async (req, res) => {
  try {
    const { title, date, startTime, endTime, skill, type } = req.body;
    
    const newSession = new Session({
      title,
      date,
      startTime,
      endTime,
      skill,
      type,
      userId: req.user.id
    });

    const savedSession = await newSession.save();
    res.json(savedSession);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a session
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, date, startTime, endTime, skill, type } = req.body;
    
    const updatedSession = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, date, startTime, endTime, skill, type },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(updatedSession);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a session
router.delete('/:id', protect, async (req, res) => {
  try {
    const deletedSession = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedSession) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;