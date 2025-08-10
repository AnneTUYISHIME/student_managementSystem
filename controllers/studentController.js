const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all students
exports.getAllStudents = async (req, res) => {
  try {
    const query = { role: 'student' };

    if (req.query.course) {
      query.course = req.query.course;
    }

    if (req.query.enrollmentYear) {
      query.enrollmentYear = req.query.enrollmentYear;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const students = await User.find(query).select('-password');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single student
exports.getStudent = async (req, res) => {
  const student = await User.findById(req.params.id).select('-password');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

// POST create new student (with password hashing)
exports.createStudent = async (req, res) => {
  try {
    const { fullName, email, phone, password, course, enrollmentYear } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'student',
      course,
      enrollmentYear
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student created', student: newStudent });
  } catch (err) {
    console.error("❌ Error creating student:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT update student (with password hashing if password is changed)
exports.updateStudent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');

    if (!updated) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student updated', student: updated });
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PATCH change role
exports.toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = user.role === 'student' ? 'admin' : 'student';
    await user.save();

    res.json({ message: `Role changed to ${user.role}` });
  } catch (err) {
    console.error("❌ Error changing role:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in student's profile
exports.getMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error("❌ Error fetching profile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update logged-in student's profile including image upload
exports.updateMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update basic fields
    student.fullName = req.body.fullName || student.fullName;
    student.phone = req.body.phone || student.phone;

    // If password is provided, hash it
    if (req.body.password) {
      student.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update imageUrl if image uploaded
    if (req.file && req.file.path) {
      student.imageUrl = req.file.path; // Cloudinary URL
    }

    await student.save();

    res.status(200).json({ message: 'Profile updated successfully', student });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
