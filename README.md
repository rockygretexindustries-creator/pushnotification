# 🔔 Expo Push Notifications - Complete System

A full-stack push notification system for React Native Expo apps with a beautiful admin panel.

## 📋 Features

### Frontend (React Native)
- ✅ Expo SDK 50
- ✅ Push notification permissions handling
- ✅ Automatic token registration with backend
- ✅ Sound & vibration enabled
- ✅ High priority notifications
- ✅ Foreground & background notification handling
- ✅ Firebase Cloud Messaging integration

### Backend (Node.js/Express)
- ✅ RESTful API for push notifications
- ✅ In-memory token storage
- ✅ Send to specific users or broadcast to all
- ✅ Automatic invalid token cleanup
- ✅ Multiple devices per user support
- ✅ Beautiful web-based admin panel

### Admin Panel
- ✅ Real-time statistics dashboard
- ✅ Send notifications via web interface
- ✅ View all registered tokens
- ✅ Auto-refresh every 10 seconds
- ✅ Responsive design
- ✅ Success/error alerts

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or 20
- Android Studio (for Android development)
- Physical Android device (push notifications don't work on emulators)
- Firebase project with Cloud Messaging API (V1) enabled

### 1. Clone Repository
```bash
git clone https://github.com/rockygretexindustries-creator/pushnotification.git
cd pushnotification
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Configure Backend URL

Edit `usePushNotifications.ts` line 8:
```typescript
const BACKEND_URL = "http://YOUR_COMPUTER_IP:3000"; // Change this!
```

Find your IP:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` (look for inet address)

### 4. Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Expo Push Notification Server
📡 Server running on port 3000
🎛️  Admin Panel: http://localhost:3000/admin
```

### 5. Open Admin Panel

Open browser: `http://localhost:3000/admin`

### 6. Run React Native App

```bash
npx expo run:android
```

### 7. Grant Permissions

When app opens, tap "Allow" for notifications.

### 8. Send Test Notification

From admin panel:
1. Fill in User ID: `user123`
2. Title: `Hello!`
3. Message: `Test notification`
4. Click "Send Notification"

Check your phone! 🎉

## 📁 Project Structure

```
pushnotification/
├── App.tsx                          # Main React Native app
├── usePushNotifications.ts          # Push notification hook
├── app.json                         # Expo configuration
├── package.json                     # Frontend dependencies
│
├── backend/                         # Backend server
│   ├── src/
│   │   ├── controllers/
│   │   │   └── notificationController.js
│   │   ├── routes/
│   │   │   └── notificationRoutes.js
│   │   ├── services/
│   │   │   └── expoPushService.js
│   │   ├── data/
│   │   │   └── tokenStore.js
│   │   └── app.js
│   ├── public/
│   │   └── admin.html               # Admin panel
│   ├── server.js
│   └── package.json
│
├── android/                         # Android native code
│   └── app/
│       ├── google-services.json     # Firebase config
│       └── src/main/AndroidManifest.xml
│
└── Documentation/
    ├── README.md                    # This file
    ├── QUICK_START.md              # Quick start guide
    ├── BACKEND_INTEGRATION.md      # Backend integration
    ├── TESTING_FLOW.md             # Testing guide
    ├── NOTIFICATION_SETTINGS.md    # Sound & priority settings
    ├── POWERSHELL_COMMANDS.md      # Windows commands
    └── PUSH_NOTIFICATION_SETUP.md  # Complete setup
```

## 🔧 API Endpoints

### POST /register-token
Register a push notification token.

```bash
curl -X POST http://localhost:3000/register-token \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "token": "ExponentPushToken[xxx...]",
    "deviceType": "android"
  }'
```

### POST /send-notification
Send notification to specific user.

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "Hello!",
    "message": "Test notification"
  }'
```

### POST /send-broadcast
Send notification to all users.

```bash
curl -X POST http://localhost:3000/send-broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Announcement",
    "message": "Message to everyone!"
  }'
```

### GET /tokens
Get all registered tokens.

```bash
curl http://localhost:3000/tokens
```

### DELETE /token
Remove a token.

```bash
curl -X DELETE http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{"token": "ExponentPushToken[xxx...]"}'
```

## 🎨 Admin Panel Features

Access at: `http://localhost:3000/admin`

- **Dashboard:** View total devices and unique users
- **Send Notifications:** Easy form to send notifications
- **Token Management:** View all registered tokens with details
- **Auto-refresh:** Updates every 10 seconds
- **Responsive:** Works on desktop and mobile browsers

## 🔊 Notification Settings

### Sound
- ✅ Enabled by default
- ✅ Uses system default sound
- ✅ Works in foreground and background

### Priority
- ✅ High priority for immediate delivery
- ✅ Bypasses battery optimization
- ✅ Shows as heads-up notification

### Vibration
- ✅ Custom pattern: [0, 250, 250, 250]
- ✅ Enabled by default

## 📱 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Go to Project Settings → Cloud Messaging
4. Enable "Cloud Messaging API (V1)"
5. Download `google-services.json`
6. Place in `android/app/google-services.json`

## 🧪 Testing

### Test Flow
1. Start backend server
2. Open admin panel
3. Run React Native app
4. Grant permissions
5. Check token appears in admin panel
6. Send test notification
7. Verify notification received

### PowerShell Commands (Windows)

**Send Notification:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "title": "Test", "message": "Hello!"}'
```

**View Tokens:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tokens" -Method GET
```

## 🐛 Troubleshooting

### Token not registering?
- Check backend is running
- Verify IP address in `usePushNotifications.ts`
- Ensure phone and computer on same WiFi
- Check `android:usesCleartextTraffic="true"` in AndroidManifest.xml

### No sound?
- Check device volume
- Disable Do Not Disturb
- Rebuild app after changes
- Check notification settings in device settings

### Notification not received?
- Verify token is registered (check admin panel)
- Ensure userId matches
- Check backend console for errors
- Make sure app is running

## 📚 Documentation

- [QUICK_START.md](QUICK_START.md) - Get started quickly
- [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) - Connect frontend to backend
- [TESTING_FLOW.md](TESTING_FLOW.md) - Complete testing guide
- [NOTIFICATION_SETTINGS.md](NOTIFICATION_SETTINGS.md) - Sound & priority settings
- [POWERSHELL_COMMANDS.md](POWERSHELL_COMMANDS.md) - Windows commands
- [PUSH_NOTIFICATION_SETUP.md](PUSH_NOTIFICATION_SETUP.md) - Detailed setup

## 🚀 Production Deployment

For production use:

1. **Deploy Backend:**
   - Use Heroku, AWS, DigitalOcean, etc.
   - Enable HTTPS
   - Add authentication
   - Use database (MongoDB, PostgreSQL)

2. **Update Frontend:**
   - Change `BACKEND_URL` to production URL
   - Use environment variables
   - Replace "user123" with real user IDs

3. **Security:**
   - Add API authentication
   - Rate limiting
   - Input validation
   - CORS configuration

4. **Monitoring:**
   - Add logging service
   - Error tracking
   - Analytics

## 🛠️ Tech Stack

### Frontend
- React Native
- Expo SDK 50
- TypeScript
- expo-notifications
- expo-device
- expo-constants

### Backend
- Node.js
- Express.js
- node-fetch
- dotenv

### Services
- Expo Push Notification Service
- Firebase Cloud Messaging

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Expo team for excellent push notification APIs
- Firebase for Cloud Messaging service
- React Native community

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation files
- Review troubleshooting section

## 🎯 Features Roadmap

- [ ] iOS support
- [ ] Notification scheduling
- [ ] Rich notifications (images, actions)
- [ ] Notification history
- [ ] User preferences
- [ ] Analytics dashboard
- [ ] Database integration
- [ ] Authentication system

---

**Made with ❤️ for the React Native community**

🌟 Star this repo if you find it helpful!
