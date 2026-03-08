# Push Notification Setup - Complete Details

## Project Information
- **App Name**: PushNotifications2
- **Package Name**: com.wa2goose.PushNotifications2
- **Expo SDK**: 50.0.13
- **EAS Project ID**: 0651f95c-5a56-4946-9deb-e000dda044cd
- **Firebase Project**: expopushnotifications2

## What We Did

### 1. Installed Required Dependencies
```json
"expo-notifications": "~0.27.6",
"expo-device": "~5.9.3",
"expo-constants": "~15.4.5"
```

### 2. Created Custom Hook: `usePushNotifications.ts`
This hook handles all push notification logic:

**Features:**
- Requests notification permissions from the user
- Registers device for push notifications
- Fetches Expo Push Token
- Sets up notification listeners (foreground & background)
- Configures Android notification channel
- Logs token to console for testing

**Key Functions:**
- `registerForPushNotificationsAsync()` - Main registration function
- Permission handling for Android & iOS
- Error handling with detailed logging
- Fallback mechanism if primary method fails

### 3. Integrated into App.tsx
- Imported and used the `usePushNotifications` hook
- Displays the push token on screen
- Shows received notification data in real-time

### 4. Firebase Configuration
- **File**: `android/app/google-services.json`
- **Project Number**: 865486165032
- **API Key**: AIzaSyDKP-Z465NNSVsrXAEIcAZEOxHRdI4Mtuk
- **Firebase Cloud Messaging API (V1)**: Enabled ✓

### 5. Android Configuration
- Package name matches Firebase: `com.wa2goose.PushNotifications2`
- Google Services file properly placed
- Notification channel configured with:
  - Name: "default"
  - Importance: MAX
  - Vibration pattern: [0, 250, 250, 250]
  - Light color: #FF231F7C

## Current Issue & Solution

### Issue: FIS_AUTH_ERROR
**Error**: `java.io.IOException: FIS_AUTH_ERROR`

**Cause**: The native Android code needs to be rebuilt after adding Firebase configuration.

**Solution**: Rebuild the app with:
```bash
npx expo run:android
```

This compiles the native code with Firebase SDK properly initialized.

## How It Works

### Flow:
1. App launches → `usePushNotifications` hook runs
2. Checks if device is physical (not emulator)
3. Requests notification permissions
4. If granted → Fetches Expo Push Token from Expo servers
5. Token is logged to console and displayed on screen
6. Sets up listeners for incoming notifications

### Token Format:
```
ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
```

### Notification Listeners:
- **Foreground**: Updates state when notification received while app is open
- **Background**: Logs response when user taps notification

## Testing Push Notifications

### 1. Get Your Token
- Run the app on a physical device
- Check Metro bundler console for: `LOG Expo Push Token: ExponentPushToken[...]`
- Copy this token

### 2. Send Test Notification
Use Expo's Push Notification Tool:
- Go to: https://expo.dev/notifications
- Paste your token
- Enter title and message
- Click "Send a Notification"

### 3. Alternative: Use cURL
```bash
curl -H "Content-Type: application/json" -X POST https://exp.host/--/api/v2/push/send -d '{
  "to": "ExponentPushToken[YOUR_TOKEN_HERE]",
  "title":"Test Notification",
  "body": "This is a test message"
}'
```

## Files Modified/Created

### Created:
- `usePushNotifications.ts` - Custom hook for push notifications

### Modified:
- `App.tsx` - Integrated the hook and displays token/notifications
- `package.json` - Added notification dependencies

### Existing (Not Modified):
- `android/app/google-services.json` - Firebase configuration
- `app.json` - Contains EAS project ID

## Next Steps

1. **Rebuild the app**: `npx expo run:android`
2. **Test on physical device** (push notifications don't work on emulators)
3. **Copy the token** from console logs
4. **Send test notification** using Expo's tool
5. **Verify** notification appears on device

## Important Notes

- Push notifications require a **physical device** (not emulator)
- Token is unique per device installation
- Token can change if app is reinstalled
- Firebase Cloud Messaging API (V1) must be enabled
- For production, implement server-side token storage and notification sending
- Current setup works with Expo Go and standalone builds

## Troubleshooting

If token fetch fails:
1. Ensure Firebase Cloud Messaging API (V1) is enabled
2. Rebuild the app: `npx expo run:android`
3. Check permissions are granted
4. Verify google-services.json is up to date
5. Check console logs for detailed error messages
