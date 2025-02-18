import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransferFunds = () => {
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setTransactionStatus('');

    if (!recipient.match(/^\d+$/)) {
      setError('Recipient account must contain only numbers.');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    setLoading(true);
    setTransactionStatus('Processing...');

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        body: JSON.stringify({ recipient, amount }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to process transaction');
      }

      const data = await response.json();
      if (data.success) {
        setTransactionStatus('Transfer successful');
        setTimeout(() => navigate('/transaction-history'), 2000);
      } else {
        setError('Transfer failed. Please try again.');
      }
    } catch (error) {
      setError('Error processing transaction. Try again later.');
      console.error('Transfer error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-sky-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Transfer Funds</h2>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {transactionStatus && <p className="text-green-500 text-sm text-center">{transactionStatus}</p>}

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
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferFunds;
