# Notification Settings - Sound & Priority

## ✅ Changes Applied

### Frontend (`usePushNotifications.ts`)

1. **Notification Handler - Sound Enabled:**
```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,  // ✅ Sound enabled
    shouldSetBadge: true,   // ✅ Badge enabled
  }),
});
```

2. **Android Notification Channel - High Priority:**
```typescript
await Notifications.setNotificationChannelAsync("default", {
  name: "default",
  importance: Notifications.AndroidImportance.MAX, // ✅ Maximum importance
  vibrationPattern: [0, 250, 250, 250],
  lightColor: "#FF231F7C",
  sound: "default",        // ✅ Sound enabled
  enableVibrate: true,     // ✅ Vibration enabled
  showBadge: true,         // ✅ Badge enabled
});
```

### Backend (`expoPushService.js`)

**Notification Payload - High Priority:**
```javascript
const notification = {
  to: token,
  sound: "default",        // ✅ Sound enabled
  title: title,
  body: message,
  data: data,
  priority: "high",        // ✅ High priority
  channelId: "default",    // ✅ Uses default channel
};
```

## 🔊 What This Means

### Sound
- ✅ Notifications will play the default system sound
- ✅ Works even when app is in background
- ✅ Works when app is closed (if using FCM)

### Priority
- ✅ `priority: "high"` ensures immediate delivery
- ✅ Wakes up device from doze mode
- ✅ Shows notification even in battery saver mode
- ✅ Appears as heads-up notification on Android

### Vibration
- ✅ Device vibrates with pattern: [0, 250, 250, 250]
- ✅ Pattern: wait 0ms, vibrate 250ms, wait 250ms, vibrate 250ms

### Badge
- ✅ Shows notification count on app icon
- ✅ Updates automatically

## 📱 Android Importance Levels

We're using `AndroidImportance.MAX` which means:
- Shows as heads-up notification
- Makes sound
- Vibrates
- Appears on lock screen
- Highest priority in notification shade

## 🧪 Testing

### Test 1: App in Foreground
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "title": "Foreground Test", "message": "App is open"}'
```
**Expected:** Sound plays, notification appears at top

### Test 2: App in Background
1. Press home button (app in background)
2. Send notification from admin panel
**Expected:** Sound plays, heads-up notification appears

### Test 3: App Closed
1. Swipe away app from recent apps
2. Send notification
**Expected:** Sound plays, notification in notification shade

### Test 4: Device Locked
1. Lock your device
2. Send notification
**Expected:** Sound plays, notification on lock screen

## 🎵 Custom Sound (Optional)

To use a custom sound:

1. Add sound file to `android/app/src/main/res/raw/notification_sound.mp3`

2. Update notification channel:
```typescript
await Notifications.setNotificationChannelAsync("default", {
  name: "default",
  importance: Notifications.AndroidImportance.MAX,
  sound: "notification_sound.mp3", // Custom sound
  // ... other settings
});
```

3. Update backend payload:
```javascript
const notification = {
  to: token,
  sound: "notification_sound.mp3", // Custom sound
  // ... other settings
};
```

## 🔧 Troubleshooting

### No sound playing?

**Check 1: Device Settings**
- Go to Settings → Apps → Your App → Notifications
- Ensure notifications are enabled
- Check "Sound" is enabled for the notification channel

**Check 2: Do Not Disturb**
- Disable Do Not Disturb mode
- Or add your app to priority apps

**Check 3: Volume**
- Increase notification volume
- Check device is not in silent mode

**Check 4: Rebuild App**
```powershell
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue
npx expo run:android
```

### Notification not appearing as heads-up?

**Solution:** We're already using:
- `priority: "high"` in backend
- `AndroidImportance.MAX` in frontend
- This should show heads-up notifications

If still not working:
1. Check device settings allow heads-up notifications
2. Some manufacturers (Samsung, Xiaomi) have additional restrictions
3. Test on different device

## 📊 Priority Comparison

| Priority | Delivery | Sound | Vibrate | Heads-up | Doze Mode |
|----------|----------|-------|---------|----------|-----------|
| default  | Normal   | ❌    | ❌      | ❌       | ❌        |
| normal   | Normal   | ✅    | ✅      | ❌       | ❌        |
| high     | Fast     | ✅    | ✅      | ✅       | ✅        |

We're using **high priority** for best results.

## 🎯 Current Configuration Summary

✅ Sound: Enabled (default system sound)
✅ Priority: High (immediate delivery)
✅ Vibration: Enabled (custom pattern)
✅ Badge: Enabled (shows count)
✅ Heads-up: Enabled (appears at top)
✅ Lock screen: Enabled (shows when locked)
✅ Doze mode: Bypassed (wakes device)

## 🚀 Next Steps

1. **Rebuild your app** to apply frontend changes:
```powershell
npx expo run:android
```

2. **Backend is already updated** (running with new settings)

3. **Test notifications** - they should now play sound!

4. **Optional:** Add custom sound file for branded experience

## 📝 Notes

- Backend changes are already live (server restarted)
- Frontend changes require app rebuild
- Sound works best on physical devices (not emulators)
- Some Android manufacturers have aggressive battery optimization
- iOS has different notification settings (not covered here)

---

**All changes applied! Rebuild your app and test.** 🔊🎉
