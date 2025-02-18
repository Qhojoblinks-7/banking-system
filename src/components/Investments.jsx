import  { useState } from 'react';

const InvestmentOpportunities = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [alert, setAlert] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Clear any existing alert when switching tabs
    setAlert(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    // Gather form data using FormData API and convert to a plain object
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/apply-investment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setAlert(`Error: ${data.error || 'Investment application failed'}`);
      } else {
        setAlert('Investment application submitted successfully!');
        e.target.reset();
      }
    } catch (error) {
      setAlert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investment Opportunities</h1>
      {alert && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {alert}
        </div>
      )}
      <div className="flex border-b border-gray-300 mb-4">
        <button
          onClick={() => handleTabChange('apply')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'apply'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
        >
          Apply for Investment
        </button>
        <button
          onClick={() => handleTabChange('track')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'track'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-600'
          }`}
        >
          Track Returns
        </button>
      </div>

      {activeTab === 'apply' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Apply for Investment</h2>
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">
                Investment Amount:
              </label>
              <input
                type="number"
                name="amount"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter amount"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">
                Investment Term (months):
              </label>
              <input
                type="number"
                name="term"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter term"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Notes:</label>
              <textarea
                name="notes"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Any additional info"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Application
            </button>
          </form>
        </div>
      )}

      {activeTab === 'track' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Track Investment Returns</h2>
          {/* Replace the placeholder content below with actual data fetched from your API */}
          <p className="text-gray-700">
            Your current investment return is{' '}
            <span className="font-bold">5.2%</span>.
          </p>
          <p className="text-gray-700">
            Detailed performance data and historical returns will be displayed here.
          </p>
          {/* Optionally, integrate a chart or a detailed table of returns */}
        </div>
      )}
    </div>
  );
};

export default InvestmentOpportunities;
