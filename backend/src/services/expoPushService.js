const fetch = require("node-fetch");

const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";

class ExpoPushService {
  /**
   * Validate if a token is a valid Expo push token
   */
  static isValidExpoPushToken(token) {
    return (
      typeof token === "string" &&
      (token.startsWith("ExponentPushToken[") ||
        token.startsWith("ExpoPushToken["))
    );
  }

  /**
   * Send push notification to a single token
   */
  static async sendPushNotification(token, title, message, data = {}) {
    if (!this.isValidExpoPushToken(token)) {
      throw new Error(`Invalid Expo push token: ${token}`);
    }

    const notification = {
      to: token,
      sound: "default",
      title: title,
      body: message,
      data: data,
      priority: "high",
      channelId: "default",
    };

    try {
      const response = await fetch(EXPO_PUSH_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      const result = await response.json();
      console.log("Expo Push API Response:", JSON.stringify(result, null, 2));

      return result;
    } catch (error) {
      console.error("Error sending push notification:", error);
      throw error;
    }
  }

  /**
   * Send push notifications to multiple tokens
   */
  static async sendPushNotifications(tokens, title, message, data = {}) {
    // Validate all tokens
    const validTokens = tokens.filter((token) =>
      this.isValidExpoPushToken(token)
    );

    if (validTokens.length === 0) {
      throw new Error("No valid Expo push tokens provided");
    }

    const notifications = validTokens.map((token) => ({
      to: token,
      sound: "default",
      title: title,
      body: message,
      data: data,
      priority: "high",
      channelId: "default",
    }));

    try {
      const response = await fetch(EXPO_PUSH_API_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notifications),
      });

      const result = await response.json();
      console.log(
        "Expo Push API Response (Batch):",
        JSON.stringify(result, null, 2)
      );

      return result;
    } catch (error) {
      console.error("Error sending push notifications:", error);
      throw error;
    }
  }

  /**
   * Check if Expo API response contains errors
   */
  static hasErrors(response) {
    if (!response.data) return false;
    return response.data.some(
      (item) => item.status === "error" && item.details?.error
    );
  }

  /**
   * Extract error tokens from response
   */
  static getErrorTokens(response) {
    if (!response.data) return [];
    return response.data
      .filter((item) => item.status === "error")
      .map((item) => ({
        token: item.details?.expoPushToken,
        error: item.details?.error,
      }));
  }
}

module.exports = ExpoPushService;
