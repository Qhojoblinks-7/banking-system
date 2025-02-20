import  { useState } from 'react';

const LoanApplication = () => {
  const [formData, setFormData] = useState({
    loan_amount: '',
    loan_term: '',
    purpose: '',
    collateral: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/loan-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setAlert({ type: 'error', message: data.error || 'Loan application failed.' });
      } else {
        setAlert({ type: 'success', message: 'Loan application submitted successfully!' });
        setFormData({
          loan_amount: '',
          loan_term: '',
          purpose: '',
          collateral: '',
        });
      }
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Loan Application</h1>
      {alert && (
        <div className={`mb-4 p-3 rounded text-center ${alert.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Loan Amount:</label>
          <input 
            type="number" 
            name="loan_amount" 
            value={formData.loan_amount}
            onChange={handleChange}
            placeholder="Enter loan amount"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Loan Term (months):</label>
          <input 
            type="number"
            name="loan_term"
            value={formData.loan_term}
            onChange={handleChange}
            placeholder="Enter loan term in months"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Purpose:</label>
          <textarea 
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            placeholder="Describe the purpose of the loan"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Collateral (optional):</label>
          <input 
            type="text"
            name="collateral"
            value={formData.collateral}
            onChange={handleChange}
            placeholder="Enter collateral details if any"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-emerald-600 text-white font-semibold rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default LoanApplication;
