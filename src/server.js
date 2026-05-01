const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (_, res) => {
  res.json({ ok: true, service: "renta-car-payments-api" });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "chf", connectedAccountId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

   const fee = Math.round(amount * 0.10);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      application_fee_amount: connectedAccountId ? fee : undefined,
      transfer_data: connectedAccountId ? { destination: connectedAccountId } : undefined
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
