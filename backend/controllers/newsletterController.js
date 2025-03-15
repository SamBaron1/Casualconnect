const Newsletter = require("../models/newsletterSubscriber");

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  console.log("Incoming payload:", req.body); // Debugging log

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const subscriber = await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscription successful!', subscriber });
  } catch (err) {
    console.error("Error subscribing:", err.message);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'You are already subscribed.' });
    }
    res.status(500).json({ message: 'Failed to subscribe. Try again later.' });
  }
};

// Remove a subscriber by email
exports.unsubscribe = async (req, res) => {
  const { email } = req.params;

  try {
    const subscriber = await Newsletter.findOne({ where: { email } });
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found.' });
    }

    await subscriber.destroy();
    res.status(200).json({ message: 'Unsubscribed successfully.' });
  } catch (err) {
    console.error('Error unsubscribing:', err.message);
    res.status(500).json({ message: 'Failed to unsubscribe.' });
  }
};

// List all subscribers
exports.listSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.findAll({
      attributes: ["email", "subscribed_at"], // Only return necessary fields
    });
    res.status(200).json(subscribers);
  } catch (err) {
    console.error('Error fetching subscribers:', err.message);
    res.status(500).json({ message: 'Failed to fetch subscribers.' });
  }
};

// Send a bulk newsletter
exports.sendNewsletter = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    const subscribers = await Newsletter.findAll({ attributes: ["email"] });
    const emails = subscribers.map((subscriber) => subscriber.email);

    // Simulate sending emails (real implementation with Nodemailer, SendGrid, etc.)
    console.log('Sending newsletter to:', emails);
    console.log('Message:', message);

    res.status(200).json({ message: 'Newsletter sent successfully!' });
  } catch (err) {
    console.error('Error sending newsletter:', err.message);
    res.status(500).json({ message: 'Failed to send newsletter.' });
  }
};
