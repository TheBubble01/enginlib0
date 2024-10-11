// routes/materialRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const materialController = require('../controllers/materialController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route for admin to upload course materials
router.post('/upload/course-material', authMiddleware('admin'), upload.single('file'), materialController.uploadCourseMaterial);

// Route for students to upload contributions
router.post('/upload/contribution', authMiddleware('student'), upload.single('file'), materialController.uploadContribution);

// Route for admin to delete course materials
router.delete('/delete/course-material/:id', authMiddleware('admin'), materialController.deleteCourseMaterial);

// Route for students to delete their own contributions
router.delete('/delete/contribution/:id', authMiddleware('student'), materialController.deleteContribution);

// Route to download course material or contribution
router.get('/download/:type/:id', materialController.downloadMaterial);

module.exports = router;

