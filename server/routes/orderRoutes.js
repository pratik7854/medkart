const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    console.log("Order request body:", req.body); 
    const { userEmail, items, amount } = req.body;

    const order = await Order.create({
      userEmail,
      items,
      amount,
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order creation failed" });
  }
});

module.exports = router;
