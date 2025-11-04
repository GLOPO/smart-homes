// routes/transactionRoutes.route.js
import express from 'express';
import {
  initializePayment,
  verifyTransaction,
  getClientTransactions,
  syncTransactionsFromPaystack,
  getTransactionStats
} from '../controllers/transactionController.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Initialize a new payment
router.post('/initialize', initializePayment);

// Verify payment after Paystack redirect
router.get('/verify/:reference', verifyTransaction);

// Get current client's transaction history
router.get('/history', getClientTransactions);

// Sync transactions from Paystack
router.post('/sync', syncTransactionsFromPaystack);

// Get transaction statistics
router.get('/stats', getTransactionStats);

export default router;