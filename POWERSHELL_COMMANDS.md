# PowerShell Commands for Testing

## Windows PowerShell uses different syntax than bash/curl

### 1. Check if Backend is Running

```powershell
Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
```

### 2. Register a Test Token

```powershell
$body = @{
    userId = "user123"
    token = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
    deviceType = "android"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/register-token" -Method POST -ContentType "application/json" -Body $body
```

### 3. View All Registered Tokens

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tokens" -Method GET
```

### 4. Send Test Notification

```powershell
$body = @{
    userId = "user123"
    title = "Hello!"
    message = "Test notification from PowerShell"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body $body
```

### 5. Send Broadcast to All Users

```powershell
$body = @{
    title = "Broadcast"
    message = "This goes to everyone!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/send-broadcast" -Method POST -ContentType "application/json" -Body $body
```

### 6. Remove a Token

```powershell
$body = @{
    token = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/token" -Method DELETE -ContentType "application/json" -Body $body
```

## Complete Testing Flow (PowerShell)

### Step 1: Start Backend (in one terminal)
```powershell
cd backend
npm start
```

### Step 2: Test Backend (in another terminal)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
```

### Step 3: Register a Test Token (use your real token from the app)
```powershell
$body = @{
    userId = "user123"
    token = "ExponentPushToken[YOUR_ACTUAL_TOKEN_HERE]"
    deviceType = "android"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/register-token" -Method POST -ContentType "application/json" -Body $body
```

### Step 4: Verify Token is Registered
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tokens" -Method GET
```

### Step 5: Send Notification
```powershell
$body = @{
    userId = "user123"
    title = "Hello from Backend!"
    message = "This is a test notification"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body $body
```

## Quick Copy-Paste Commands

### Register Token (replace with your actual token)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/register-token" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "token": "ExponentPushToken[YOUR_TOKEN]", "deviceType": "android"}'
```

### Send Notification
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/send-notification" -Method POST -ContentType "application/json" -Body '{"userId": "user123", "title": "Hello!", "message": "Test notification"}'
```

### View Tokens
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tokens" -Method GET
```

## Alternative: Use Git Bash or WSL

If you have Git Bash or WSL installed, you can use the regular curl commands:

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "title": "Hello!", "message": "Test notification"}'
```

## Finding Your Computer's IP (PowerShell)

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"} | Select-Object IPAddress
```

Or simpler:
```powershell
ipconfig | Select-String "IPv4"
```
