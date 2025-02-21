import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext"; // Import global user context
import axios from "axios";

const Analytics = () => {
  const { token } = useUser(); // Get token from global state
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return; // Ensure token is available

      try {
        setLoading(true);

        // Fetch analytics data with authorization
        const response = await axios.get("/api/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debugging step

        if (Array.isArray(response.data)) {
          setAnalyticsData(response.data);
        } else if (response.data && Array.isArray(response.data.analytics)) {
          setAnalyticsData(response.data.analytics);
        } else {
          setAnalyticsData([]); // Default to empty array if response is unexpected
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]); // Runs when the token is available

  if (loading) {
    return <div className="text-center text-gray-500">Loading analytics data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-500">Analytics</h1>

      {analyticsData.length > 0 ? (
        <div className="mt-4">
          {analyticsData.map((item, index) => (
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
