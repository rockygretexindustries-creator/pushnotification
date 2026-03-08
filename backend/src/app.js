const express = require("express");
const notificationRoutes = require("./routes/notificationRoutes");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (admin panel)
app.use(express.static(path.join(__dirname, "../public")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expo Push Notification Server is running",
    endpoints: {
      admin: "GET /admin - Admin Panel",
      registerToken: "POST /register-token",
      sendNotification: "POST /send-notification",
      sendBroadcast: "POST /send-broadcast",
      getTokens: "GET /tokens",
      removeToken: "DELETE /token",
    },
  });
});

// Admin panel route
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

// API routes
app.use("/", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: err.message,
  });
});

module.exports = app;
