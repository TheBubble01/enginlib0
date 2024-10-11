// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Define storage options for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store files in 'uploads/materials'
    cb(null, path.join(__dirname, '../uploads/materials'));
  },
  filename: function (req, file, cb) {
    // Use the original filename and add a timestamp to avoid name collisions
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Set file size limit (50 MB for video, lower for other file types if needed)
const fileFilter = (req, file, cb) => {
  const fileTypes = /pdf|jpeg|jpg|png|mp4/; // Only allow PDFs, images, and MP4 videos
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDFs, images, and MP4 videos are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
  fileFilter: fileFilter
});

module.exports = upload;

