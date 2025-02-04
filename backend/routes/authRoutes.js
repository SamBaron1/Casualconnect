const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.post('/signup', authController.signup);

// Login route
router.post('/login', authController.login);

// Send password reset link route
router.post('/send-reset-link', authController.sendResetLink);

// Reset password route
router.post('/reset-password', authController.resetPassword);


module.exports = router;
