const User = require('../models/User');

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
  const student = await User.findById(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

// POST create new student
exports.createStudent = async (req, res) => {
  const { fullName, email, phone, password, course, enrollmentYear } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const newStudent = new User({
    fullName,
    email,
    phone,
    password,
    role: 'student',
    course,
    enrollmentYear
  });

  await newStudent.save();
  res.status(201).json({ message: 'Student created', student: newStudent });
};

// PUT update student
exports.updateStudent = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Student updated', student: updated });
};

// DELETE student
exports.deleteStudent = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Student deleted' });
};

// PATCH change role
exports.toggleUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.role = user.role === 'student' ? 'admin' : 'student';
  await user.save();

  res.json({ message: `Role changed to ${user.role}` });
};

// @desc    Get logged-in student's profile
exports.getMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update logged-in student's profile including image upload
exports.updateMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update basic fields
    student.fullName = req.body.fullName || student.fullName;
    student.phone = req.body.phone || student.phone;

    // Update imageUrl if image uploaded
    if (req.file && req.file.path) {
      student.imageUrl = req.file.path; // Cloudinary URL from multer-storage-cloudinary
    }

    await student.save();

    res.status(200).json({ message: 'Profile updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
