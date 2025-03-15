const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, listSubscribers, sendNewsletter } = require('../controllers/newsletterController');

// Add a new subscriber
router.post('/subscribe', subscribe);

// Remove a subscriber by email
router.delete('/:email', unsubscribe);

// Get all subscribers
router.get('/', listSubscribers);

// Send a bulk newsletter
router.post('/send', sendNewsletter);

module.exports = router;
