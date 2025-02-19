import React, { useState, useEffect } from 'react';

const Deposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        // Replace with the actual authenticated user's ID or obtain from context
        const userId = '11111111-1111-1111-1111-111111111111';
        const response = await fetch(`/api/transactions/${userId}`);

        // Check if the response content type is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, but received: ${text.slice(0, 100)}...`);
        }

        // Check for non-OK responses
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load transactions');
        }

        const data = await response.json();

        // Ensure the response data has a transactions array
        if (!data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Invalid data format received');
        }

        // Filter transactions to include only deposits
        const depositData = data.transactions.filter(
          (tx) => tx.transaction_type === 'deposit'
        );

        setDeposits(depositData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading deposits...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Deposits</h1>
      {deposits.length === 0 ? (
        <p>No deposit transactions found.</p>
      ) : (
        <ul className="space-y-3">
          {deposits.map((deposit) => (
            <li key={deposit.transaction_id} className="border p-3 rounded shadow-sm">
              <div className="text-gray-700">
                <span className="font-medium">Date:</span> {deposit.date || 'N/A'}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Amount:</span> ₵{deposit.amount || '0.00'}
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Description:</span> {deposit.description || 'No description'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Deposits;
