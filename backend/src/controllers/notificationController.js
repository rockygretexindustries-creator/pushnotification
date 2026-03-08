const tokenStore = require("../data/tokenStore");
const ExpoPushService = require("../services/expoPushService");

const notificationController = {
  /**
   * Register a push notification token
   * POST /register-token
   */
  registerToken: async (req, res) => {
    try {
      const { userId, token, deviceType } = req.body;

      // Validate request body
      if (!userId || !token) {
        return res.status(400).json({
          success: false,
          error: "userId and token are required",
        });
      }

      // Validate token format
      if (!ExpoPushService.isValidExpoPushToken(token)) {
        return res.status(400).json({
          success: false,
          error: "Invalid Expo push token format",
        });
      }

      // Store token
      const result = tokenStore.addToken(
        userId,
        token,
        deviceType || "unknown"
      );

      console.log(
        `Token ${result.isNew ? "registered" : "updated"} for user: ${userId}`
      );

      res.status(200).json({
        success: true,
        message: result.isNew
          ? "Token registered successfully"
          : "Token updated successfully",
        data: {
          userId: result.token.userId,
          deviceType: result.token.deviceType,
          isNew: result.isNew,
        },
      });
    } catch (error) {
      console.error("Error registering token:", error);
      res.status(500).json({
        success: false,
        error: "Failed to register token",
        details: error.message,
      });
    }
  },

  /**
   * Send push notification to a specific user
   * POST /send-notification
   */
  sendNotification: async (req, res) => {
    try {
      const { userId, title, message, data } = req.body;

      // Validate request body
      if (!userId || !title || !message) {
        return res.status(400).json({
          success: false,
          error: "userId, title, and message are required",
        });
      }

      // Get user tokens
      const userTokens = tokenStore.getTokensByUserId(userId);

      if (userTokens.length === 0) {
        return res.status(404).json({
          success: false,
          error: `No tokens found for user: ${userId}`,
        });
      }

      console.log(
        `Sending notification to ${userTokens.length} device(s) for user: ${userId}`
      );

      // Extract token strings
      const tokens = userTokens.map((t) => t.token);

      // Send notifications
      const result = await ExpoPushService.sendPushNotifications(
        tokens,
        title,
        message,
        data || {}
      );

      // Check for errors
      if (ExpoPushService.hasErrors(result)) {
        const errorTokens = ExpoPushService.getErrorTokens(result);
        console.warn("Some notifications failed:", errorTokens);

        // Remove invalid tokens
        errorTokens.forEach((error) => {
          if (
            error.error === "DeviceNotRegistered" ||
            error.error === "InvalidCredentials"
          ) {
            tokenStore.removeToken(error.token);
            console.log(`Removed invalid token: ${error.token}`);
          }
        });
      }

      res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        data: {
          userId,
          devicesNotified: userTokens.length,
          result: result.data,
        },
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send notification",
        details: error.message,
      });
    }
  },

  /**
   * Send broadcast notification to all registered users
   * POST /send-broadcast
   */
  sendBroadcast: async (req, res) => {
    try {
      const { title, message, data } = req.body;

      // Validate request body
      if (!title || !message) {
        return res.status(400).json({
          success: false,
          error: "title and message are required",
        });
      }

      // Get all tokens
      const allTokens = tokenStore.getAllTokens();

      if (allTokens.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No tokens registered",
        });
      }

      console.log(`Broadcasting notification to ${allTokens.length} device(s)`);

      // Extract token strings
      const tokens = allTokens.map((t) => t.token);

      // Send notifications
      const result = await ExpoPushService.sendPushNotifications(
        tokens,
        title,
        message,
        data || {}
      );

      res.status(200).json({
        success: true,
        message: "Broadcast sent successfully",
        data: {
          devicesNotified: allTokens.length,
          result: result.data,
        },
      });
    } catch (error) {
      console.error("Error sending broadcast:", error);
      res.status(500).json({
        success: false,
        error: "Failed to send broadcast",
        details: error.message,
      });
    }
  },

  /**
   * Get all registered tokens (for debugging)
   * GET /tokens
   */
  getTokens: async (req, res) => {
    try {
      const tokens = tokenStore.getAllTokens();
      res.status(200).json({
        success: true,
        count: tokens.length,
        data: tokens,
      });
    } catch (error) {
      console.error("Error getting tokens:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get tokens",
        details: error.message,
      });
    }
  },

  /**
   * Remove a token
   * DELETE /token
   */
  removeToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: "token is required",
        });
      }

      const removed = tokenStore.removeToken(token);

      if (removed) {
        res.status(200).json({
          success: true,
          message: "Token removed successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          error: "Token not found",
        });
      }
    } catch (error) {
      console.error("Error removing token:", error);
      res.status(500).json({
        success: false,
        error: "Failed to remove token",
        details: error.message,
      });
    }
  },
};

module.exports = notificationController;
