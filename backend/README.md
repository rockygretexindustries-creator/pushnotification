# Expo Push Notification Backend

A simple Node.js/Express backend service for handling Expo push notifications.

## Features

- Register push notification tokens from mobile apps
- Send notifications to specific users
- Broadcast notifications to all users
- In-memory token storage (no database required)
- Automatic invalid token cleanup
- Support for multiple devices per user

## Tech Stack

- Node.js
- Express.js
- node-fetch (for Expo Push API)
- dotenv (environment variables)

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── notificationController.js
│   ├── routes/
│   │   └── notificationRoutes.js
│   ├── services/
│   │   └── expoPushService.js
│   ├── data/
│   │   └── tokenStore.js
│   └── app.js
├── server.js
├── package.json
├── .env
└── README.md
```

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (or copy from `.env.example`):
```bash
PORT=3000
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### 1. Register Token
Register a push notification token from the mobile app.

**Endpoint:** `POST /register-token`

**Request Body:**
```json
{
  "userId": "user123",
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "deviceType": "android"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token registered successfully",
  "data": {
    "userId": "user123",
    "deviceType": "android",
    "isNew": true
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/register-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "deviceType": "android"
  }'
```

### 2. Send Notification
Send a push notification to a specific user.

**Endpoint:** `POST /send-notification`

**Request Body:**
```json
{
  "userId": "user123",
  "title": "Hello!",
  "message": "This is a test notification",
  "data": {
    "screen": "home",
    "customData": "value"
  }
}
```

**Response:**
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

**cURL Example:**
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Hello!",
    "message": "This is a test notification"
  }'
```

### 3. Send Broadcast
Send a notification to all registered users.

**Endpoint:** `POST /send-broadcast`

**Request Body:**
```json
{
  "title": "Announcement",
  "message": "This is a broadcast message",
  "data": {
    "type": "broadcast"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/send-broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Announcement",
    "message": "This is a broadcast message"
  }'
```

### 4. Get All Tokens (Debug)
Get all registered tokens.

**Endpoint:** `GET /tokens`

**cURL Example:**
```bash
curl http://localhost:3000/tokens
```

### 5. Remove Token
Remove a specific token.

**Endpoint:** `DELETE /token`

**Request Body:**
```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
  }'
```

## React Native Integration

### Update `usePushNotifications.ts`

Add this function to register the token with your backend:

```typescript
async function registerTokenWithBackend(token: string, userId: string) {
  try {
    const response = await fetch('http://YOUR_SERVER_IP:3000/register-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        token: token,
        deviceType: Platform.OS,
      }),
    });

    const result = await response.json();
    console.log('Token registered with backend:', result);
  } catch (error) {
    console.error('Failed to register token with backend:', error);
  }
}
```

### Call it after getting the token:

```typescript
useEffect(() => {
  registerForPushNotificationsAsync()
    .then((token) => {
      setExpoPushToken(token);
      console.log("Expo Push Token:", token);
      
      // Register with backend
      if (token?.data) {
        registerTokenWithBackend(token.data, "user123"); // Replace with actual user ID
      }
    })
    .catch((error) => {
      console.error("Failed to register for push notifications:", error);
    });
  // ... rest of the code
}, []);
```

### Important Notes for React Native:

1. **Replace `YOUR_SERVER_IP`** with your actual server IP address
   - For local testing on physical device: Use your computer's local IP (e.g., `192.168.1.100`)
   - For emulator: Use `10.0.2.2` (Android) or `localhost` (iOS)
   - For production: Use your deployed server URL

2. **User ID**: Replace `"user123"` with the actual logged-in user's ID from your authentication system

3. **Network Security (Android)**: If using HTTP (not HTTPS), add to `android/app/src/main/AndroidManifest.xml`:
```xml
<application
  android:usesCleartextTraffic="true"
  ...>
```

## Testing Flow

1. **Start the backend server:**
```bash
cd backend
npm start
```

2. **Run your React Native app:**
```bash
npx expo start
```

3. **Grant notification permissions** on your device

4. **Check backend logs** - you should see the token registration

5. **Send a test notification:**
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Test",
    "message": "Hello from backend!"
  }'
```

6. **Check your device** - notification should appear!

## Error Handling

The backend automatically handles:
- Invalid token formats
- Missing required fields
- Expo API errors
- Invalid/expired tokens (automatically removed)

## Limitations

- **In-memory storage**: Tokens are lost when server restarts
- **No authentication**: Add authentication for production use
- **No persistence**: Use a database (MongoDB, PostgreSQL) for production
- **Single server**: Not suitable for horizontal scaling

## Production Considerations

For production deployment, consider:
1. Add authentication/authorization
2. Use a database (MongoDB, PostgreSQL, Redis)
3. Add rate limiting
4. Use HTTPS
5. Add logging service (Winston, Morgan)
6. Add monitoring (PM2, New Relic)
7. Handle Expo push receipts
8. Implement retry logic
9. Add input validation library (Joi, express-validator)

## Troubleshooting

### Token not registering
- Check if backend server is running
- Verify the server URL in React Native app
- Check network connectivity
- Look at backend console logs

### Notification not received
- Verify token is registered: `curl http://localhost:3000/tokens`
- Check if userId matches
- Ensure device has internet connection
- Check Expo Go app is running (for development)
- Look at backend console for Expo API errors

### "DeviceNotRegistered" error
- Token has expired or app was uninstalled
- Backend automatically removes these tokens
- User needs to re-register the token

## License

MIT
