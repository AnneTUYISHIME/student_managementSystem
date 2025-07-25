const User = require('../models/User');

// GET all students
exports.getAllStudents = async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
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
