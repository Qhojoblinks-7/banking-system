import { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [data, setData] = useState([]);  // Ensures state starts as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from API
        const response = await axios.get('/api/analytics'); 
        
        console.log("API Response:", response.data); // Debugging step
        
        // Ensure response data is an array or extract correct field
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else if (response.data && Array.isArray(response.data.analytics)) {
          setData(response.data.analytics);
        } else {
          setData([]); // Default to empty array if response is not as expected
        }

      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-500">Analytics</h1>

      {data.length > 0 ? (
        <div className="mt-4">
          {data.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg mb-2 shadow-sm bg-white">
              <h2 className="font-semibold text-lg">{item.title || "No Title"}</h2>
              <p className="text-gray-600">{item.description || "No description available."}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No analytics data available.</p>
      )}
    </div>
  );
};

export default Analytics;
