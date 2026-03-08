# Push Notifications Setup - Fixes Applied

## Issues Found and Resolved

### 1. Firebase Configuration Mismatch
**Problem:** Two different `google-services.json` files existed:
- Old file: Project "expopushnotifications2" (project_number: 865486165032)
- New file: Project "practice-2ca55" (project_number: 809060378114)

**Fix:** Removed old file and renamed the correct one to `google-services.json`

### 2. Outdated Google Services Plugin
**Problem:** Using old version 4.3.3
**Fix:** Updated to version 4.4.0 in `android/build.gradle`

### 3. Missing Android 13+ Notification Permission
**Problem:** POST_NOTIFICATIONS permission not declared
**Fix:** Added to both:
- `android/app/src/main/AndroidManifest.xml`
- `app.json` permissions array

### 4. Poor Error Handling
**Problem:** Token fetch errors weren't being logged properly
**Fix:** Added comprehensive error handling and logging in `usePushNotifications.ts`

### 5. Basic UI
**Problem:** Minimal UI made debugging difficult
**Fix:** Enhanced App.tsx with better styling and selectable token text

## Configuration Summary

### Firebase Project Details
- Project ID: practice-2ca55
- Project Number: 809060378114 (Sender ID)
- Package Name: com.wa2goose.PushNotifications2

### EAS Project
- Project ID: 0651f95c-5a56-4946-9deb-e000dda044cd
- Owner: rogerr6969

## Testing Instructions

1. Build completed - app should be installing on device
2. Check Metro bundler logs for "Expo Push Token:" message
3. Token should start with "ExponentPushToken[...]"
4. Copy token for testing push notifications

## Send Test Notification

Use this curl command (replace YOUR_TOKEN):

```bash
curl -H "Content-Type: application/json" -X POST https://exp.host/--/api/v2/push/send -d '{
  "to": "YOUR_TOKEN",
  "title": "Test Notification",
  "body": "This is a test push notification!",
  "data": { "extraData": "Some data" }
}'
```

## Potential Issues to Monitor

1. **Network connectivity** - Device needs internet to fetch token
2. **Google Play Services** - Must be installed and updated on device
3. **Firebase API enabled** - Cloud Messaging API (V1) must be enabled in Firebase Console
4. **Physical device required** - Push notifications don't work on emulators without Google Play Services

## Next Steps

1. Wait for build to complete
2. Check logs for successful token generation
3. Test sending a notification using the token
4. Verify notification appears on device
