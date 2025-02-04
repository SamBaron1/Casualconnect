const { addSubscriber } = require('../models/subscriberModel');

// Subscribe to newsletter
exports.subscribe = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  addSubscriber(email, (err) => {
    if (err) {
      console.error('Error details:', err); // Log detailed error
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'You are already subscribed.' });
      }
      return res.status(500).json({ message: 'Failed to subscribe. Try again later.' });
    }
    res.status(201).json({ message: 'Subscription successful!' });
  });
};

