const express = require('express');
const router = express.Router(); 
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

// Create subject
router.post('/', auth, async (req, res) => {
  let { name, goalHours } = req.body;

  if (typeof name !== 'string') name = String(name);
  name = name.trim();

  if (!name || name.length < 3) {
    return res.status(400).json({ msg: 'Subject name must be at least 3 characters' });
  }

  if (!goalHours || isNaN(goalHours) || goalHours < 1) {
    return res.status(400).json({ msg: 'Goal hours must be a number >= 1' });
  }

  try {
    const newSubject = new Subject({
      userId: req.user.id,
      name,
      goalHours
    });

    const saved = await newSubject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating subject:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all subjects for current user
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update subject
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: 'Subject not found or not authorized' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating subject:', err.message);
    res.status(500).json({ msg: 'Update failed' });
  }
});

// Delete subject
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ msg: 'Subject not found or not authorized' });
    }

    res.json({ msg: 'Subject deleted successfully' });
  } catch (err) {
    console.error('Error deleting subject:', err.message);
    res.status(500).json({ msg: 'Delete failed' });
  }
});

module.exports = router;
