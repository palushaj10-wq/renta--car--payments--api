const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Stripe Secret Key nga .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Test route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Stripe API running 🚀" });
});

// 💳 Create Payment Intent (ME 10% KOMISION)
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, connectedAccountId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!connectedAccountId) {
      return res.status(400).json({ error: "Missing connected account" });
    }

    // 💰 10% komision
    const fee = Math.round(amount * 0.10);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // p.sh 10000 = 100 CHF
      currency: "chf",
      automatic_payment_methods: { enabled: true },

      // 💸 Komisioni yt
      application_fee_amount: fee,

      // 🚗 Paratë shkojnë te pronari
      transfer_data: {
        destination: connectedAccountId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
