// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const passwordResetController = require('../controllers/passwordResetController');

// Tech admin registration (only one allowed)
router.post('/register/tech-admin', userController.registerTechAdmin);

// Tech admin login
router.post('/login/tech-admin', userController.loginTechAdmin);

// Admin self-registration (admin registers but remains in pending status)
router.post('/register/admin', userController.registerAdmin);

// Tech admin route for approving or denying admin registration
router.put('/approve-admin/:id', authMiddleware('tech-admin'), userController.approveOrDenyAdmin);

// Tech admin-specific route for getting all users
router.get('/all', authMiddleware('tech-admin'), userController.getAllUsers);

// User registration (for student users)
router.post('/register/student', userController.registerStudent);

// User login routes for admins and students
router.post('/login/admin', userController.loginAdmin);
router.post('/login/student', userController.loginStudent);

// Get user profile (protected route for all roles)
router.get('/profile', authMiddleware, userController.getProfile);

// Request password reset
router.post('/reset-password/request', passwordResetController.requestPasswordReset);

// Reset password
router.post('/reset-password/:token', passwordResetController.resetPassword);

// General routes for updating and deleting users (admin-specific routes)
router.put('/update/student/:id', authMiddleware('admin'), userController.updateStudent);
router.delete('/delete/student/:id', authMiddleware('admin'), userController.deleteStudent);

module.exports = router;

