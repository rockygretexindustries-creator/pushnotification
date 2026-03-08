# Backend Integration Guide

## How to Connect Your React Native App to the Backend

### Step 1: Update `usePushNotifications.ts`

Add this function to register tokens with your backend:

```typescript
import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

// CHANGE THIS TO YOUR SERVER IP
const BACKEND_URL = "http://192.168.1.100:3000"; // Replace with your server IP

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

// Function to register token with backend
async function registerTokenWithBackend(
  token: string,
  userId: string
): Promise<void> {
  try {
    console.log("Registering token with backend...");
    const response = await fetch(`${BACKEND_URL}/register-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        token: token,
        deviceType: Platform.OS,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ Token registered with backend:", result.message);
    } else {
      console.error("❌ Backend registration failed:", result.error);
    }
  } catch (error) {
    console.error("❌ Failed to register token with backend:", error);
  }
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permission not granted for push notifications");
        alert("Failed to get push token for push notification!");
        return;
      }

      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        console.log("Project ID:", projectId);

        token = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        console.log("Token fetched successfully:", token);
      } catch (error: any) {
        console.error("Error fetching push token:", error);
        console.error("Error details:", error.message);

        try {
          console.log("Trying fallback method...");
          token = await Notifications.getExpoPushTokenAsync();
          console.log("Token fetched with fallback:", token);
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          alert(`Error fetching token: ${error.message}`);
        }
      }
    } else {
      console.log("Not a physical device");
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        setExpoPushToken(token);
        console.log("Expo Push Token:", token);

        // Register token with backend
        if (token?.data) {
          // TODO: Replace "user123" with actual user ID from your auth system
          const userId = "user123";
          registerTokenWithBackend(token.data, userId);
        }
      })
      .catch((error) => {
        console.error("Failed to register for push notifications:", error);
      });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📬 Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Notification tapped:", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};
```

### Step 2: Find Your Server IP Address

#### On Windows:
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually starts with 192.168.x.x)

#### On Mac/Linux:
```bash
ifconfig
```
Look for "inet" address (usually starts with 192.168.x.x)

### Step 3: Update BACKEND_URL

Replace this line in the code above:
```typescript
const BACKEND_URL = "http://192.168.1.100:3000";
```

With your actual IP:
```typescript
const BACKEND_URL = "http://YOUR_IP_HERE:3000";
```

### Step 4: Configure Android for HTTP (if needed)

If using HTTP (not HTTPS), add to `android/app/src/main/AndroidManifest.xml`:

```xml
<application
  android:usesCleartextTraffic="true"
  android:name=".MainApplication"
  ...>
```

### Step 5: Start Backend Server

```bash
cd backend
npm install
npm start
```

You should see:
```
🚀 Expo Push Notification Server
📡 Server running on port 3000
```

### Step 6: Test the Integration

1. **Rebuild your React Native app:**
```bash
npx expo run:android
```

2. **Grant notification permissions** when prompted

3. **Check backend console** - you should see:
```
Token registered for user: user123
```

4. **Send a test notification:**
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Test Notification",
    "message": "Hello from your backend!"
  }'
```

5. **Check your device** - notification should appear!

## Complete Testing Flow

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start React Native App
```bash
npx expo start
# Then press 'a' for Android
```

### 3. Check Token Registration
```bash
curl http://localhost:3000/tokens
```

You should see your registered token.

### 4. Send Test Notification
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Hello!",
    "message": "This is a test from backend"
  }'
```

### 5. Send Broadcast to All Users
```bash
curl -X POST http://localhost:3000/send-broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broadcast",
    "message": "Message to all users!"
  }'
```

## Troubleshooting

### "Network request failed"
- Make sure backend server is running
- Verify the IP address is correct
- Check that your phone and computer are on the same WiFi network
- For Android, ensure `android:usesCleartextTraffic="true"` is set

### Token not showing in backend
- Check Metro bundler console for errors
- Verify BACKEND_URL is correct
- Check backend console for incoming requests
- Try accessing `http://YOUR_IP:3000` in your phone's browser

### Notification not received
- Verify token is registered: `curl http://localhost:3000/tokens`
- Check userId matches what you're sending to
- Ensure Expo Go app is running (for development)
- Check backend console for Expo API response

## Production Deployment

For production, you'll need to:

1. **Deploy backend to a server** (Heroku, AWS, DigitalOcean, etc.)
2. **Use HTTPS** (required for production)
3. **Update BACKEND_URL** to your production URL
4. **Add authentication** to protect your endpoints
5. **Use a database** instead of in-memory storage
6. **Handle user authentication** - replace "user123" with real user IDs

## Next Steps

1. Replace hardcoded "user123" with actual user ID from your auth system
2. Add error handling UI in your React Native app
3. Store backend URL in environment variables
4. Add retry logic for failed registrations
5. Implement token refresh on app startup
6. Add notification history/inbox feature
