// controllers/transactionController.js
import Transaction from '../models/Transaction.model.js';
import paystackService from '../services/paystackService.js';
import mongoose from 'mongoose';
import axios from "axios"

// Initialize payment
export const initializePayment = async (req, res) => {
  try {
    const { amount, email, productOrService, metadata } = req.body;
    const clientId = req.user.id; // Assuming you have auth middleware

    // Create transaction record
    const transaction = new Transaction({
      clientId,
      email,
      reference: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      productOrService,
      metadata,
      status: 'pending'
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      data: {
        reference: transaction.reference,
        amount: transaction.amount
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment'
    });
  }
};

// Verify payment and update transaction
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const verification = await paystackService.verifyTransaction(reference);

    if (!verification.status) {
      return res.status(400).json({
        success: false,
        message: 'Transaction verification failed'
      });
    }

    // Update transaction in database
    const transaction = await Transaction.findOneAndUpdate(
      { reference },
      {
        status: verification.data.status,
        channel: verification.data.channel,
        paidAt: verification.data.paid_at,
        paystackResponse: verification.data
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

export const verifyTransaction = async (req, res) => {
  console.log("🟢 Verify route hit with reference:", req.params.reference);

  const { reference } = req.params;

  try {
    // Verify with Paystack API
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = response.data.data;

    // Save transaction to DB if not already saved
    const existing = await Transaction.findOne({ reference });
    if (!existing) {
      await Transaction.create({
        reference: data.reference,
        email: data.customer.email,
        amount: data.amount / 100,
        status: data.status,
        paid_at: data.paid_at,
      });
    }

    res.json({ success: true, message: "Verified and saved", data });
  } catch (error) {
    console.error("Paystack verification failed:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Get client's transaction history from database
export const getClientTransactions = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { page = 1, limit = 20, status, startDate, endDate } = req.query;

    const query = { clientId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalTransactions: count
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history'
    });
  }
};

// Sync transactions from Paystack (admin or periodic sync)
export const syncTransactionsFromPaystack = async (req, res) => {
  try {
    const { email } = req.body;
    const clientId = req.user.id;

    // Fetch transactions from Paystack
    const paystackData = await paystackService.getCustomerTransactions(email);

    if (!paystackData.status || !paystackData.data) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch transactions from Paystack'
      });
    }

    const syncedTransactions = [];

    for (const txn of paystackData.data) {
      // Check if transaction already exists
      const existingTxn = await Transaction.findOne({ reference: txn.reference });

      if (!existingTxn) {
        const newTransaction = new Transaction({
          clientId,
          email: txn.customer.email,
          reference: txn.reference,
          amount: txn.amount / 100, // Paystack returns amount in kobo
          currency: txn.currency,
          status: txn.status,
          channel: txn.channel,
          paidAt: txn.paid_at,
          productOrService: txn.metadata?.productOrService || 'N/A',
          description: txn.metadata?.description,
          metadata: txn.metadata,
          paystackResponse: txn
        });

        await newTransaction.save();
        syncedTransactions.push(newTransaction);
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${syncedTransactions.length} new transactions`,
      data: syncedTransactions
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync transactions'
    });
  }
};

// Get transaction statistics
export const getTransactionStats = async (req, res) => {
  try {
    const clientId = req.user.id;

    const stats = await Transaction.aggregate([
      { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalTransactions = await Transaction.countDocuments({ clientId });
    const successfulTransactions = await Transaction.countDocuments({ 
      clientId, 
      status: 'success' 
    });

    res.status(200).json({
      success: true,
      data: {
        stats,
        totalTransactions,
        successfulTransactions
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction statistics'
    });
  }
};