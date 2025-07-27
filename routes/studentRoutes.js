const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleUserRole,
  getMyProfile,
  updateMyProfile
} = require('../controllers/studentController');

const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');


// Admin only routes

router.get('/', protect, isAdmin, getAllStudents);
router.get('/:id', protect, isAdmin, getStudent);
router.post('/', protect, isAdmin, createStudent);
router.put('/:id', protect, isAdmin, updateStudent);
router.delete('/:id', protect, isAdmin, deleteStudent);
router.patch('/role/:id', protect, isAdmin, toggleUserRole);


// Student self-service routes

router.get('/me', protect, getMyProfile);
router.put('/me', protect, upload.single('image'), updateMyProfile);

module.exports = router;
