import { useEffect, useState } from "react";
import  useData  from "../context/DataContext"; // Use global DataContext

const Analytics = () => {
  const { token, analytics, fetchAnalytics } = useData();
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      setLocalLoading(true);
      try {
        await fetchAnalytics();
      } catch (err) {
        setError(err.response?.data?.message || "An unexpected error occurred");
      } finally {
        setLocalLoading(false);
      }
    };

    fetchData();
  }, [token, fetchAnalytics]);

  if (localLoading) {
    return (
      <div className="text-center text-gray-500">
        Loading analytics data, please wait...

      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}. Please try again later.

      </div>
    );
  }

  // Ensure analyticsData is always an array for rendering
  const analyticsData = Array.isArray(analytics)
    ? analytics
    : analytics
    ? [analytics]
    : [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-500">Analytics</h1>
      {analyticsData.length > 0 ? (
        <div className="mt-4">
          {analyticsData.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg mb-2 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">
                {item.title || "No Title"}
              </h2>
              <p className="text-gray-600">
                {item.description || "No description available."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          No analytics data available.
        </p>
      )}
    </div>
  );
};

export default Analytics;
