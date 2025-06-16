const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  goalHours: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Subject', SubjectSchema);
