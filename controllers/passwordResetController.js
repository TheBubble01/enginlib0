// controllers/passwordResetController.js

const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Request a password reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send email with reset link (implement your email sending logic)
    const transporter = nodemailer.createTransport({
      service: 'gmail', //To be deleted upon webmail integration

      /*
      *host: process.env.EMAIL_HOST,
      *port: process.env.EMAIL_PORT,
      *secure: process.env.EMAIL_PORT == 465,  // true for 465, false for 587
      */


      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your email password or app password
      }
    });

const resetLink = `${process.env.BASE_URL || 'http://localhost:5000'}/api/users/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `Click on the link to reset your password: ${resetLink}`
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Error requesting password reset', error });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

