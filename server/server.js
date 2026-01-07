const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// ======================
// LOAD ENV
// ======================
dotenv.config();

// ======================
// INIT APP
// ======================
const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());

// ======================
// ROUTES IMPORT
// ======================
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("MedKart API is running...");
});

// ======================
// DATABASE CONNECTION
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ======================
// API ROUTES
// ======================
app.use("/api/auth", authRoutes);       // 🔐 LOGIN / REGISTER / FORGOT / RESET
app.use("/api/orders", orderRoutes);    // 📦 ORDERS
app.use("/api/payment", paymentRoutes); // 💳 RAZORPAY

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
