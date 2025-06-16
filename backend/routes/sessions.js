const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// Add a session
router.post('/', auth, async (req, res) => {
  const { subjectId, duration, notes } = req.body;

  if (!subjectId || !duration) {
    return res.status(400).json({ msg: 'subjectId and duration are required' });
  }

  try {
    const newSession = new Session({
      userId: req.user.id,  // ✅ Correct user
      subjectId,
      duration,
      notes
    });

    const saved = await newSession.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating session:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all sessions for current user
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id }).populate({
      path: 'subjectId',
      select: 'name goalHours'
    });

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete a session
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    res.json({ msg: 'Session deleted successfully' });
  } catch (err) {
    console.error('Error deleting session:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
