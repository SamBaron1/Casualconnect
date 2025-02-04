// routes/newsletter.js
const express = require('express');
const router = express.Router();

// Dummy subscriber data for example purposes
const subscribers = [];

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  // Save subscriber to database (mocked here)
  subscribers.push({ email });
  res.status(201).json({ message: 'Subscribed to newsletter successfully' });
});

module.exports = router;
