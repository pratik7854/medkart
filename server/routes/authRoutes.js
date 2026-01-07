const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

/* ======================
   REGISTER
====================== */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Registration failed" });
  }
});

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* ======================
   FORGOT PASSWORD (EMAIL)
====================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Always return success (prevents email enumeration)
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a reset link has been sent",
      });
    }

    // Create reset token (15 min)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // Email transporter (Gmail App Password)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ HTML EMAIL TEMPLATE
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; background:#f3f4f6; padding:20px;">
        <div style="max-width:500px;margin:auto;background:#fff;padding:25px;border-radius:8px;">
          <h2 style="text-align:center;color:#facc15;">MedKart</h2>
          <p>You requested a password reset.</p>
          <a href="${resetLink}"
             style="display:block;text-align:center;background:#facc15;
             padding:12px;border-radius:6px;color:#000;text-decoration:none;
             font-weight:bold;margin:20px 0;">
            Reset Password
          </a>
          <p>This link expires in 15 minutes.</p>
          <p>If you didn’t request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"MedKart Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your MedKart Password",
      html: emailHTML,
    });

    return res.json({
      success: true,
      message: "If this email exists, a reset link has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      message: "Failed to send reset email",
    });
  }
});

/* ======================
   RESET PASSWORD
====================== */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(400).json({
      message: "Invalid or expired reset link",
    });
  }
});

module.exports = router;
