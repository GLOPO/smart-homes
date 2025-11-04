/* eslint-disable react-hooks/exhaustive-deps */
// components/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { getTransactionHistory, getTransactionStats, syncTransactions } from '../services/transactionService';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalTransactions: 0
  });

  useEffect(() => {
    const syncAndFetch = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.email) await syncTransactions(user.email);
        await fetchTransactions();
        await fetchStats();
      } catch (error) {
        console.error('Auto-sync failed: ', error)
      }
    }

    syncAndFetch();
  }, [filters.page, filters.status, filters.startDate, filters.endDate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactionHistory(filters);
      setTransactions(response.data);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        totalTransactions: response.totalTransactions
      });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getTransactionStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const formatAmount = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      success: 'badge-success',
      failed: 'badge-failed',
      pending: 'badge-pending',
      abandoned: 'badge-abandoned'
    };
    return statusClasses[status] || 'badge-default';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  if (loading && transactions.length === 0) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="transaction-history">
      <div className="header">
        <h1>Transaction History</h1>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Transactions</h3>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
          <div className="stat-card">
            <h3>Successful</h3>
            <p className="stat-value success">{stats.successfulTransactions}</p>
          </div>
          {stats.stats && stats.stats.map(stat => (
            <div key={stat._id} className="stat-card">
              <h3>{stat._id}</h3>
              <p className="stat-value">{formatAmount(stat.totalAmount)}</p>
              <p className="stat-count">{stat.count} transactions</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Status:</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <button className="btn-clear" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Transactions Table */}
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Product/Service</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Channel</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr key={txn._id}>
                  <td className="reference">{txn.reference}</td>
                  <td>{txn.productOrService}</td>
                  <td className="amount">{formatAmount(txn.amount, txn.currency)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td>{txn.channel || 'N/A'}</td>
                  <td>{formatDate(txn.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="btn-page"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;