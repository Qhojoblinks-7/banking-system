import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "../store/analyticsSlice"; // Adjust path as needed

const Analytics = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const { analytics, status, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (token && status === "idle") {
      dispatch(fetchAnalytics());
    }
  }, [token, dispatch, status]);

  if (status === "loading") {
    return (
      <div className="text-center text-gray-500">
        Loading analytics data, please wait...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-500 text-center">
        Error: {error}. Please try again later.
      </div>
    );
  }

  // Ensure analytics data is always an array for rendering
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
