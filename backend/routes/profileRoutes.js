const express = require('express');
const { getUserProfile } = require('../controllers/profileController');
const router = express.Router();

// Define the route to get user profile by email
router.get('/:id', getUserProfile);  // Change to :id if using user ID


module.exports = router;
