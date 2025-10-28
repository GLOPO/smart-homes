import express from "express";
import axios from "axios";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Fetch transactions specific to one user (by email)
router.get("/transactions", verifyToken, async (req, res) => {
  const { email } = req.params;

  try {
    // Fetch all transactions from Paystack
    const response = await axios.get("https://api.paystack.co/transaction", {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    // Filter by the logged-in user's email
    const userTransactions = response.data.data.filter(
      (tx) => tx.customer?.email === email
    );

    res.json(userTransactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Failed to fetch user transactions" });
  }
});

export default router;
