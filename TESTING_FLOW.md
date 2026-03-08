# Complete Testing Flow - Push Notifications

## Prerequisites Checklist

- [ ] Node.js installed (v18 or v20)
- [ ] Android device connected via USB OR Android emulator running
- [ ] USB debugging enabled on Android device
- [ ] Computer and phone on same WiFi network (for testing)
- [ ] Firebase Cloud Messaging API (V1) enabled

## Step-by-Step Testing Guide

### STEP 1: Find Your Computer's IP Address

**On Windows (PowerShell):**
```bash
ipconfig
```
Look for "IPv4 Address" - it will look like `192.168.1.100`

**Example Output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Write down your IP:** `_________________`

---

### STEP 2: Start the Backend Server

Open a **NEW terminal** window:

```bash
cd backend
npm install
npm start
```

**Expected Output:**
```
==================================================
🚀 Expo Push Notification Server
📡 Server running on port 3000
🌍 Environment: development
📍 URL: http://localhost:3000
==================================================

Available endpoints:
  POST   /register-token
  POST   /send-notification
  POST   /send-broadcast
  GET    /tokens
  DELETE /token

==================================================
```

✅ **Checkpoint:** Server should be running without errors

**Keep this terminal open!**

---

### STEP 3: Test Backend is Working

Open **ANOTHER terminal** window and test:

```bash
curl http://localhost:3000
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Expo Push Notification Server is running",
  "endpoints": {
    "registerToken": "POST /register-token",
    "sendNotification": "POST /send-notification",
    ...
  }
}
```

✅ **Checkpoint:** You should see the JSON response

---

### STEP 4: Update React Native App with Backend URL

Update `usePushNotifications.ts` - add this at the top:

```typescript
// Replace with YOUR IP address from Step 1
const BACKEND_URL = "http://192.168.1.100:3000"; // <-- CHANGE THIS!

// Add this function after the interface
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
```

Then in the `useEffect`, add the backend registration:

```typescript
useEffect(() => {
  registerForPushNotificationsAsync()
    .then((token) => {
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);

      // ADD THIS BLOCK:
      if (token?.data) {
        const userId = "user123"; // You can change this
        registerTokenWithBackend(token.data, userId);
      }
    })
    .catch((error) => {
      console.error("Failed to register for push notifications:", error);
    });
  // ... rest of code
}, []);
```

---

### STEP 5: Configure Android for HTTP

Edit `android/app/src/main/AndroidManifest.xml`:

Find the `<application` tag and add `android:usesCleartextTraffic="true"`:

```xml
<application
  android:name=".MainApplication"
  android:label="@string/app_name"
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:allowBackup="false"
  android:theme="@style/AppTheme"
  android:usesCleartextTraffic="true">  <!-- ADD THIS LINE -->
```

---

### STEP 6: Rebuild and Run the App

Open **ANOTHER terminal** (3rd terminal):

```bash
# Clean build
rm -rf android/build
rm -rf android/app/build

# Rebuild and run
npx expo run:android
```

**This will take 2-5 minutes**

✅ **Checkpoint:** App should install and launch on your device

---

### STEP 7: Grant Notification Permission

When the app opens:
1. You'll see a permission dialog
2. Tap **"Allow"** to grant notification permissions

---

### STEP 8: Verify Token Registration

**Check Metro Bundler Console** (terminal 3):
Look for these logs:
```
LOG  Project ID: 0651f95c-5a56-4946-9deb-e000dda044cd
LOG  Token fetched successfully: [Object object]
LOG  Expo Push Token: [Object object]
LOG  Registering token with backend...
LOG  ✅ Token registered with backend: Token registered successfully
```

**Check Backend Console** (terminal 1):
Look for:
```
POST /register-token
Token registered for user: user123
```

**Check App Screen:**
You should see the token displayed:
```
Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

✅ **Checkpoint:** Token should be visible on screen and in both consoles

---

### STEP 9: Verify Token in Backend

In **terminal 2**, check registered tokens:

```bash
curl http://localhost:3000/tokens
```

**Expected Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "userId": "user123",
      "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
      "deviceType": "android",
      "createdAt": "2026-03-08T...",
      "updatedAt": "2026-03-08T..."
    }
  ]
}
```

✅ **Checkpoint:** You should see your token in the response

---

### STEP 10: Send Test Notification

In **terminal 2**, send a notification:

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"user123\", \"title\": \"Hello!\", \"message\": \"This is a test notification from backend\"}"
```

**Expected Backend Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "userId": "user123",
    "devicesNotified": 1,
    "result": [
      {
        "status": "ok",
        "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    ]
  }
}
```

**Check Backend Console:**
```
POST /send-notification
Sending notification to 1 device(s) for user: user123
Expo Push API Response: {
  "data": [
    {
      "status": "ok",
      "id": "..."
    }
  ]
}
```

**Check Your Phone:**
You should see a notification appear! 🎉

✅ **Checkpoint:** Notification appears on your device

---

### STEP 11: Test Broadcast Notification

Send to all users:

```bash
curl -X POST http://localhost:3000/send-broadcast \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Broadcast\", \"message\": \"This goes to everyone!\"}"
```

✅ **Checkpoint:** Another notification appears

---

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. App Starts                                               │
│    └─> usePushNotifications hook runs                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Request Permissions                                      │
│    └─> User taps "Allow"                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Get Expo Push Token                                      │
│    └─> Expo servers generate token                          │
│    └─> Token: ExponentPushToken[xxx...]                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Register Token with Backend                              │
│    └─> POST http://YOUR_IP:3000/register-token              │
│    └─> Backend stores in memory                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Send Notification from Backend                           │
│    └─> POST http://YOUR_IP:3000/send-notification           │
│    └─> Backend calls Expo Push API                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Expo Delivers Notification                               │
│    └─> Notification appears on device                       │
│    └─> User sees: "Hello! This is a test..."                │
└─────────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Problem: "Network request failed"

**Solution:**
1. Check backend is running (terminal 1)
2. Verify IP address is correct in `BACKEND_URL`
3. Ensure phone and computer on same WiFi
4. Check `android:usesCleartextTraffic="true"` is set
5. Try accessing `http://YOUR_IP:3000` in phone's browser

### Problem: "Token not registered with backend"

**Check:**
```bash
# Test backend from your computer
curl http://localhost:3000

# Test from phone's IP (if possible)
curl http://YOUR_IP:3000
```

**Solution:**
- Restart backend server
- Rebuild React Native app
- Check Metro console for errors

### Problem: "FIS_AUTH_ERROR"

**Solution:**
```bash
# Clean and rebuild
rm -rf android/build
rm -rf android/app/build
npx expo run:android
```

### Problem: Notification not received

**Check:**
1. Token is registered:
```bash
curl http://localhost:3000/tokens
```

2. userId matches:
```bash
# Make sure you're sending to "user123" if that's what you registered
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"user123\", \"title\": \"Test\", \"message\": \"Hello\"}"
```

3. Check backend console for Expo API response
4. Ensure app is running (Expo Go or standalone)

---

## Quick Test Commands

### Check if backend is running:
```bash
curl http://localhost:3000
```

### View all registered tokens:
```bash
curl http://localhost:3000/tokens
```

### Send test notification:
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"user123\", \"title\": \"Test\", \"message\": \"Hello from backend!\"}"
```

### Send broadcast:
```bash
curl -X POST http://localhost:3000/send-broadcast \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Broadcast\", \"message\": \"Message to all!\"}"
```

---

## Success Criteria

✅ Backend server running on port 3000
✅ React Native app running on device
✅ Token displayed on app screen
✅ Token visible in backend (`curl http://localhost:3000/tokens`)
✅ Notification received on device when sent from backend
✅ Backend console shows successful Expo API response

---

## What You Should See

### Terminal 1 (Backend):
```
🚀 Expo Push Notification Server
📡 Server running on port 3000
POST /register-token
Token registered for user: user123
POST /send-notification
Sending notification to 1 device(s) for user: user123
Expo Push API Response: { "data": [{ "status": "ok" }] }
```

### Terminal 3 (Metro/React Native):
```
LOG  Expo Push Token: ExponentPushToken[xxx...]
LOG  Registering token with backend...
LOG  ✅ Token registered with backend: Token registered successfully
LOG  📬 Notification received: [Object object]
```

### Your Phone Screen:
```
Token: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
Notification: {...}
```

### Notification Tray:
```
🔔 Hello!
   This is a test notification from backend
```

---

## Next Steps After Successful Test

1. Replace "user123" with real user IDs from your auth system
2. Deploy backend to production server (Heroku, AWS, etc.)
3. Update BACKEND_URL to production URL
4. Add authentication to backend endpoints
5. Use database instead of in-memory storage
6. Implement notification history feature
7. Add notification scheduling
8. Handle notification tap actions

---

## Need Help?

If you're stuck at any step:
1. Check which terminal shows the error
2. Read the error message carefully
3. Check the troubleshooting section above
4. Verify all checkpoints were passed
5. Try restarting from Step 2
