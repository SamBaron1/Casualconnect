const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Import the database connection
const { subscribeToNewsletter } = require('../controllers/newsletterController'); // Import the controller

// POST route for subscribing to the newsletter
router.post('/subscribe', subscribeToNewsletter);

module.exports = router;
