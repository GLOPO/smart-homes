// services/paystackService.js
import axios from 'axios';

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.baseURL = 'https://api.paystack.co';
  }

  // Fetch all transactions for a specific customer
  async getCustomerTransactions(email, page = 1, perPage = 50) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction`,
        {
          params: {
            customer: email,
            page,
            perPage
          },
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error.response?.data || error.message);
      throw new Error('Failed to fetch transaction history');
    }
  }

  // Verify a single transaction
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying transaction:', error.response?.data || error.message);
      throw new Error('Failed to verify transaction');
    }
  }

  // Get transaction details by ID
  async getTransactionById(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error.response?.data || error.message);
      throw new Error('Failed to fetch transaction details');
    }
  }

  // Export transaction history
  async exportTransactions(email, startDate, endDate) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/export`,
        {
          params: {
            customer: email,
            from: startDate,
            to: endDate
          },
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting transactions:', error.response?.data || error.message);
      throw new Error('Failed to export transactions');
    }
  }
}

export default new PaystackService();