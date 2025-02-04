const express = require('express');
const { Notification } = require('../models');
const router = express.Router();

// Fetch notifications for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications', message: error.message });
  }
});

// Create a notification and send in real-time
router.post('/:userId/notifications', async (req, res) => {
  const { userId } = req.params;
  const { title, message, jobId } = req.body;

  try {
    console.log(`Creating notification for user_${userId}...`);

    const notification = await Notification.create({
      userId,
      title,
      message,
      jobId,
    });

    console.log('Notification saved to DB:', notification);

    // Emit notification immediately
    const io = req.app.get('io');
    if (io) {
      console.log(` Sending real-time notification to user_${userId}`);
      io.to(`user_${userId}`).emit('notification', notification);
    } else {
      console.error(' Socket.IO instance not found!');
    }

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification', message: error.message });
  }
});

// DELETE a notification by ID (for both employers and job seekers)
router.delete("/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.destroy(); // Permanently delete the notification
    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});
// DELETE all notifications for a user
router.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await Notification.destroy({ where: { userId } });
    res.json({ message: "All notifications deleted" });
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    res.status(500).json({ error: "Failed to delete notifications" });
  }
});
module.exports = router;
