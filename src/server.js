const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Stripe Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Stripe API running 🚀" });
});

// 💳 Create Payment Intent (PA 10%)
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "chf",
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 💰 Payment për POSTIM KERRI (10 CHF)
app.post("/create-listing-payment", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // 10 CHF
      currency: "chf",
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
