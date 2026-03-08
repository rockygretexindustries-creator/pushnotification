const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

// Register a push token
router.post("/register-token", notificationController.registerToken);

// Send notification to a specific user
router.post("/send-notification", notificationController.sendNotification);

// Send broadcast to all users
router.post("/send-broadcast", notificationController.sendBroadcast);

// Get all tokens (debugging)
router.get("/tokens", notificationController.getTokens);

// Remove a token
router.delete("/token", notificationController.removeToken);

module.exports = router;
