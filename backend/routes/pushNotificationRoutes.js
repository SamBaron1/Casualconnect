const express = require("express");
const router = express.Router();
const webPush = require("web-push");
const PushSubscription = require("../models/pushSubscription"); // Import the model

// Push notification test route
router.post("/sendPushNotification", async (req, res) => {
  const { userId, title, message } = req.body;

  try {
    const subscription = await PushSubscription.findOne({ where: { userId } });
    if (!subscription) {
      return res.status(404).json({ error: "Push subscription not found for the given userId" });
    }

    const payload = JSON.stringify({ title, message });

    await webPush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.publicKey,
          auth: subscription.authKey,
        },
      },
      payload
    );

    res.status(200).json({ message: "Push notification sent successfully" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ error: "Failed to send push notification" });
  }
});

module.exports = router;