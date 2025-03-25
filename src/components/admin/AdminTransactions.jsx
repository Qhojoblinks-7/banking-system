// src/components/admin/AdminTransactions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/transactions", { withCredentials: true })
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  const handleReverse = (transactionId) => {
    // Example: POST /api/admin/transactions/:id/reverse
    axios
      .post(`/api/admin/transactions/${transactionId}/reverse`, {}, { withCredentials: true })
      .then(() => {
        // Remove or update the transaction in local state
        setTransactions((prev) =>
          prev.filter((tx) => tx.transaction_id !== transactionId)
        );
      })
      .catch((err) => setError(err.response?.data?.error || err.message));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Transactions</h2>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="border-b">
              <td className="p-2">{tx.transaction_id}</td>
              <td className="p-2">{tx.transaction_type}</td>
              <td className="p-2">GHC {tx.amount}</td>
              <td className="p-2">{tx.description}</td>
              <td className="p-2 text-right">
                <button
                  onClick={() => handleReverse(tx.transaction_id)}
                  className="bg-yellow-600 text-white px-2 py-1 rounded"
                >
                  Reverse
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTransactions;
