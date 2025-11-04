// models/Transaction.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  reference: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'abandoned', 'pending'],
    default: 'pending'
  },
  channel: {
    type: String
  },
  paidAt: {
    type: Date
  },
  productOrService: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  paystackResponse: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ clientId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, clientId: 1 });

export default mongoose.model('Transaction', transactionSchema);