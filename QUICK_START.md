# Quick Start Guide - Push Notifications

## ✅ What I Fixed

1. **Frontend Integration**: Updated `usePushNotifications.ts` to automatically send tokens to backend
2. **Admin Panel**: Created beautiful web interface at `http://localhost:3000/admin`
3. **Android Config**: Added `android:usesCleartextTraffic="true"` to allow HTTP connections
4. **Backend URL**: Set to your computer's IP: `192.168.1.10:3000`

## 🚀 Start Everything

### Step 1: Start Backend (Terminal 1)
```powershell
cd backend
npm start
```

You should see:
```
🚀 Expo Push Notification Server
📡 Server running on port 3000
🎛️  Admin Panel: http://localhost:3000/admin
```

### Step 2: Open Admin Panel
Open your browser and go to:
```
http://localhost:3000/admin
```

You'll see a beautiful dashboard with:
- 📊 Statistics (registered devices, users)
- 📤 Send notification form
- 📱 List of all registered tokens

### Step 3: Rebuild and Run React Native App (Terminal 2)
```powershell
# Clean build
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue

# Run app
npx expo run:android
```

### Step 4: Grant Permissions
When app opens, tap "Allow" for notifications

### Step 5: Watch the Magic! ✨

**Check Metro Console:**
```
LOG  Expo Push Token: ExponentPushToken[xxx...]
LOG  📤 Registering token with backend...
LOG  ✅ Token registered with backend: Token registered successfully
```

**Check Backend Console:**
```
POST /register-token
Token registered for user: user123
```

**Check Admin Panel:**
Refresh the page - you'll see your token appear!

### Step 6: Send Test Notification

**Option A: Use Admin Panel (Easiest)**
1. Go to `http://localhost:3000/admin`
2. Fill in:
   - Send To: "Specific User"
   - User ID: "user123"
   - Title: "Hello!"
   - Message: "Test from admin panel"
3. Click "Send Notification"
4. Check your phone! 🎉

**Option B: Use PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "title": "Hello!", "message": "Test notification"}'
```

## 🎯 Testing Checklist

- [ ] Backend running on port 3000
- [ ] Admin panel accessible at http://localhost:3000/admin
- [ ] React Native app running on device
- [ ] Token visible on app screen
- [ ] Token appears in admin panel
- [ ] Notification received on device

## 📱 Admin Panel Features

### Dashboard
- See total registered devices
- See unique users count
- Auto-refreshes every 10 seconds

### Send Notifications
- Send to specific user
- Broadcast to all users
- Real-time success/error messages

### Token Management
- View all registered tokens
- See user ID, device type, registration time
- Tokens displayed in easy-to-read format

## 🔧 Troubleshooting

### Token not appearing in admin panel?

**Check Metro console for errors:**
```
❌ Failed to register token with backend: [error message]
```

**Common fixes:**
1. Make sure backend is running
2. Check IP address in `usePushNotifications.ts` (line 8)
3. Verify phone and computer on same WiFi
4. Rebuild the app after changes

### Can't access admin panel?

Try:
```
http://localhost:3000/admin
http://192.168.1.10:3000/admin
```

### Notification not received?

1. Check token is registered in admin panel
2. Verify userId matches ("user123")
3. Make sure app is running
4. Check backend console for Expo API response

## 🎨 Admin Panel Screenshots

The admin panel includes:
- 📊 Real-time statistics
- 🎨 Beautiful gradient design
- 📱 Responsive layout
- ✅ Success/error alerts
- 🔄 Auto-refresh tokens
- 📤 Easy notification sending

## 🔗 Important URLs

- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:3000 (JSON response)

## 📝 Next Steps

1. **Replace "user123"** with real user IDs from your auth system
2. **Deploy backend** to production server
3. **Update BACKEND_URL** in `usePushNotifications.ts` to production URL
4. **Add authentication** to admin panel
5. **Use database** instead of in-memory storage

## 💡 Pro Tips

- Keep admin panel open while testing
- Use broadcast feature to test multiple devices
- Check backend console for detailed logs
- Admin panel auto-refreshes tokens every 10 seconds
- You can send notifications even when app is closed

## 🎉 Success!

If you can:
1. See your token in the admin panel
2. Send a notification from admin panel
3. Receive it on your device

**You're all set!** The push notification system is working perfectly.

---

## Quick Commands Reference

### Start Backend
```powershell
cd backend
npm start
```

### Rebuild App
```powershell
npx expo run:android
```

### Send Notification (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "title": "Test", "message": "Hello!"}'
```

### View Tokens (PowerShell)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tokens" -Method GET
```

### Open Admin Panel
```
http://localhost:3000/admin
```
