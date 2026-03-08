require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Expo Push Notification Server`);
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🎛️  Admin Panel: http://localhost:${PORT}/admin`);
  console.log("=".repeat(50));
  console.log("\nAvailable endpoints:");
  console.log("  GET    /admin (Admin Panel)");
  console.log("  POST   /register-token");
  console.log("  POST   /send-notification");
  console.log("  POST   /send-broadcast");
  console.log("  GET    /tokens");
  console.log("  DELETE /token");
  console.log("\n" + "=".repeat(50) + "\n");
});
