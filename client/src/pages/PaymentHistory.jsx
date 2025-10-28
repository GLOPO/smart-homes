import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentHistory = ({ userEmail }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchUserTransactions = async () => {
      try {
        const response = await axios.get(
          `/api/paystack/transactions/${userEmail}`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching user transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTransactions();
  }, [userEmail]);

  if (loading) return <p>Loading transactions...</p>;

  if (transactions.length === 0)
    return <p>No payment history found for {userEmail}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment History for {userEmail}</h2>
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Amount (₦)</th>
            <th>Status</th>
            <th>Paid At</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.reference}</td>
              <td>{(tx.amount / 100).toFixed(2)}</td>
              <td>{tx.status}</td>
              <td>{new Date(tx.paid_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
