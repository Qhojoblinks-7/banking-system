import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransferFunds = () => {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!amount || !recipient) {
      setTransactionStatus('Please fill out all fields');
      return;
    }

    setLoading(true);
    setTransactionStatus('Processing...');

    try {
      // Placeholder for API call
      const response = await fetch('/api/transfer', {
        method: 'POST',
        body: JSON.stringify({ recipient, amount }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        setTransactionStatus('Transfer successful');
        navigate('/transaction-history');  // Redirect to transaction history after success
      } else {
        setTransactionStatus('Transfer failed. Please try again.');
      }
    } catch (error) {
      setTransactionStatus('Error processing transaction');
      console.error('Error during transfer:', error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-sky-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Transfer Funds</h2>
        
        <form onSubmit={handleTransfer} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-600">Recipient Account Number</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 border rounded-md"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Transfer'}
            </button>
            {transactionStatus && (
              <span className="text-sm text-gray-600">{transactionStatus}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferFunds;
