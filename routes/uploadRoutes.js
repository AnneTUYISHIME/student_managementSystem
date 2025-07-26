const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
