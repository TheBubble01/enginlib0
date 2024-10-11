// controllers/userController.js

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Tech-admin registration (only one allowed)
exports.registerTechAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if tech-admin already exists
    const existingTechAdmin = await User.findOne({ where: { role: 'tech-admin' } });
    if (existingTechAdmin) {
      return res.status(400).json({ message: 'Tech-admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create tech-admin user
    const newTechAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'tech-admin',
      department: 'N/A', // No department for tech-admin
      username: 'techadmin'
    });

    res.status(201).json({
      message: 'Tech-admin registered successfully',
      user: {
        id: newTechAdmin.id,
        name: newTechAdmin.name,
        email: newTechAdmin.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering tech-admin', error });
  }
};

// Tech-admin login
exports.loginTechAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, role: 'tech-admin' } });

    if (!user) {
      return res.status(404).json({ message: 'Tech-admin not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Tech-admin login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
	role: user.role,
	username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in tech-admin', error });
  }
};

// Admin registration (pending approval by tech-admin)
exports.registerAdmin = async (req, res) => {
  const { name, email, password, department, username } = req.body;

  try {
    // Check if username is unique
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      department,
      username, // Include username in user creation
      approved: false // Awaiting tech-admin approval
    });

    res.status(201).json({
      message: 'Admin registered successfully, pending tech-admin approval',
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        department: newAdmin.department,
        username: newAdmin.username // Include username in the response
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error });
  }
};

// Tech-admin approves or denies admin registration
exports.approveOrDenyAdmin = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // status will be "approved" or "denied"

  try {
    // Fetch the admin user by ID
    const admin = await User.findByPk(id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the provided status is valid (either "approved" or "denied")
    if (status !== 'approved' && status !== 'denied') {
      return res.status(400).json({ message: 'Invalid status. Use either "approved" or "denied".' });
    }

    if (status === 'approved') {
      // Approve the admin
      admin.approved = true;
      await admin.save();
      return res.status(200).json({ message: 'Admin approved successfully', admin });
    } else if (status === 'denied') {
      // Deny the admin and remove their record
      await admin.destroy();
      return res.status(200).json({ message: 'Admin registration denied and user removed' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing admin approval/denial', error });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, role: 'admin', approved: true } });

    if (!user) {
      return res.status(404).json({ message: 'Admin not found or not approved' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        username: user.username
      }
    });
  } catch (error) {
    // Enhanced logging
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error logging in admin', error: error.message });
  }
};

// Admin updates student details
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, department, username } = req.body;

  try {
    const student = await User.findByPk(id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (department) student.department = department;
    if (username) student.username = username;

    await student.save();

    res.json({
      message: 'Student details updated successfully',
      student
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student details', error });
  }
};

// Admin deletes a student user
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await User.findByPk(id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error });
  }
};

// Fetch all users (Tech-admin-specific function)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'department', 'username'] // Select only relevant fields
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json({
      message: 'Users fetched successfully',
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Student registration
exports.registerStudent = async (req, res) => {
  const { name, email, password, department, username } = req.body;

  try {
    // Check if username is unique
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      department,
      username // Include username in user creation
    });

    res.status(201).json({
      message: 'Student registered successfully',
      user: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        department: newStudent.department,
        username: newStudent.username // Include username in the response
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error });
  }
};

// Student login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email, role: 'student' } });

    if (!user) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Student login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        username: user.username // Include username in the response
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in student', error });
  }
};

// Fetch user profile (common for all roles)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      username: user.username // Include username in the response
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

