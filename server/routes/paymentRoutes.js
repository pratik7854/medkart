const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

const router = express.Router();

/* =====================================================
   STEP 3: CREATE RAZORPAY ORDER
===================================================== */
router.post("/create-razorpay-order", async (req, res) => {
  try {
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log(
      "RAZORPAY_KEY_SECRET loaded:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Razorpay keys not loaded",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID.trim(),
      key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
    });

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paisa
      currency: "INR",
      receipt: `medkart_${Date.now()}`,
    });

    return res.json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("❌ Razorpay order error:", error);

    return res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
    });
  }
});

/* =====================================================
   STEP 4: VERIFY PAYMENT
===================================================== */
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
      .update(body)
      .digest("hex");

    console.log("Generated:", expectedSignature);
    console.log("Received :", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed (signature mismatch)",
      });
    }

    await Order.findByIdAndUpdate(orderId, {
      status: "PAID",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

module.exports = router;
