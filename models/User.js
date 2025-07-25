const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'student'],
    default: 'student'
  },
  profilePicture: { type: String, default: '' },
  course: { type: String }, // For students only
  enrollmentYear: { type: Number },
  status: {
    type: String,
    enum: ['Active', 'Graduated', 'Dropped'],
    default: 'Active'
  }
});

module.exports = mongoose.model('User', userSchema);
