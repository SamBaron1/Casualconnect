const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Ensure the casing matches the actual file name


let resetTokens = {}; // Store reset tokens temporarily (In production, store in the database)



// Signup logic
exports.signup = async (req, res) => {
  const { name, email, password, role, companyName, whatsappNumber, desiredJob, location } = req.body;

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
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, and 1 number.'
      });
    }
  
    // Conditional validation for WhatsApp number
    if (role === 'employer' && (!whatsappNumber || whatsappNumber.trim() === "")) {
      return res.status(400).json({ message: 'WhatsApp Number is required for employers.' });
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
      whatsappNumber: role === 'employer' ? whatsappNumber : null,
      desiredJob: role === 'jobseeker' ? desiredJob : null,
      location
    });

    res.status(201).json({ message: 'User created successfully!', userId: newUser.id });
  } catch (err) {
    console.error('Server error:', err.message); // Log server error with detailed message
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log email being checked
    console.log("Finding user with email:", email);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    console.log("Verifying password for user:", email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error("Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    console.log("Generating JWT token for user:", email);
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response
    console.log("Login successful for user:", email);
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role, // For frontend redirection
    });
  } catch (err) {
    // Handle errors
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 100000, // Set connection timeout to 100 seconds
});




exports.sendResetLink = async (req, res) => {
  const { email } = req.body; // Extract email from request body
  console.log("Email received in backend:", email); // Debug log

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findByEmail(email);
    console.log("Finding user with email:", email); // Debug log for database query

    if (!user) {
      return res.status(400).json({ message: "No user found with this email address." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    resetTokens[resetToken] = email;

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("Generated reset link:", resetLink);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `To reset your password, click the following link: ${resetLink}`,
    });

    res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Error sending reset link:", err.message);
    res.status(500).json({ message: "Error sending reset link", error: err.message });
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
