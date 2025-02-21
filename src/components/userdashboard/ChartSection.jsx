import { useEffect, useRef, useState } from "react";
import { useData } from "../context/DataContext"; // Use global DataContext
import Chart from "chart.js/auto";
import axios from "axios";

const ChartSection = () => {
  const { token } = useData(); // Get authentication token from DataContext
  const lineChartRef = useRef(null);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (!token) return; // Ensure token is available

      try {
        setLoading(true);
        // Fetch real-time exchange rate data
        const response = await axios.get("/api/exchange-rates", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.trends) {
          setExchangeRates(response.data.trends);
        } else {
          setExchangeRates([]);
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);
        setError(err.response?.data?.message || "Failed to load exchange rates.");
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [token]);

  useEffect(() => {
    if (exchangeRates.length === 0 || !lineChartRef.current) return;

    const ctx = lineChartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists (prevents duplicate charts)
    if (lineChartRef.current.chartInstance) {
      lineChartRef.current.chartInstance.destroy();
    }

    // Create new chart instance
    lineChartRef.current.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: exchangeRates.map((data) => data.date), // X-axis (Dates)
        datasets: [
          {
            label: "Dollar Rate",
            data: exchangeRates.map((data) => data.rate), // Y-axis (Rates)
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
    });
  }, [exchangeRates]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading exchange rate trends...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">Dollar Rate Trend</h2>
      <div className="relative" style={{ height: "300px" }}>
        <canvas ref={lineChartRef} className="bg-white p-4 shadow-md rounded-lg"></canvas>
      </div>
    </section>
  );
};

export default ChartSection;
