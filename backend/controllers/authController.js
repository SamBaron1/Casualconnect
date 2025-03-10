const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Ensure the casing matches the actual file name

let resetTokens = {}; // Store reset tokens temporarily (In production, store in the database)

// Signup logic
exports.signup = async (req, res) => {
  const { name, email, password, role, companyName, position, companySize, desiredJob, location } = req.body;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  try {
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.' });
    }

    // Check if email already exists
    const user = await User.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: role === 'employer' ? companyName : null,
      position: role === 'employer' ? position : null,
      companySize: role === 'employer' ? companySize : null,
      desiredJob: role === 'jobseeker' ? desiredJob : null,
      location
    });

    res.status(201).json({ message: 'User created successfully!', userId: newUser.id });
  } catch (err) {
    console.error('Server error:', err.message); // Log server error with detailed message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role, // Pass role for frontend redirection
    });
  } catch (err) {
    console.error('Database error:', err.message); // Log database error with detailed message
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};

// Configure email transporter once, outside the function
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use 587 if TLS is preferred
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD, // Use App Password here
  },
  tls: {
    rejectUnauthorized: false, // Bypass TLS issues
  },
  connectionTimeout: 100000, // Extend timeout in milliseconds
  pool: true, // Reduce connection issues by reusing connections
  maxConnections: 1, // Limit concurrent connections
  maxMessages: 10, // Control email sending rate
});


// Send reset link
exports.sendResetLink = async (req, res) => {
  const { email } = req.body;
  console.log('Email received:', email);

  try {
    const user = await User.findByEmail(email);
    console.log('Finding user with email:', email); // Debugging log

    if (!user) {
      return res.status(400).json({ message: 'No user found with this email address.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens[resetToken] = email;

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `To reset your password, please click the following link: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('Error sending reset link:', err.message);
    res.status(500).json({ message: 'Error sending reset link', error: err.message });
  }
};


// Reset password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const email = resetTokens[token];
    if (!email) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'No user found with this email address.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    delete resetTokens[token];

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
};
