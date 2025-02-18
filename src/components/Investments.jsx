import { useState, useEffect } from 'react';

const InvestmentOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch('/api/investments');
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Failed to load investment opportunities');
          setLoading(false);
          return;
        }
        setOpportunities(data.investments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading investment opportunities...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Investment Opportunities</h1>
      {opportunities.length === 0 ? (
        <p>No investment opportunities available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {opportunities.map((opp) => (
            <li key={opp.investment_id} className="border p-4 rounded shadow-sm">
              <h2 className="text-xl font-semibold">{opp.title}</h2>
              <p className="mt-2">{opp.description}</p>
              <div className="mt-2">
                <span className="font-medium">Return Rate:</span> {opp.return_rate}%
              </div>
              <div>
                <span className="font-medium">Risk Level:</span> {opp.risk_level}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvestmentOpportunities;
