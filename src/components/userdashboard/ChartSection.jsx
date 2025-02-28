import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { fetchExchangeRates } from "../store/exchangeRatesSlice"; // Adjust path as needed

const ChartSection = () => {
  const dispatch = useDispatch();
  const lineChartRef = useRef(null);

  // Retrieve token from Redux auth slice
  const token = useSelector((state) => state.auth.token);
  // Retrieve exchange rates data, loading status, and error from Redux exchangeRates slice
  const { trends: exchangeRates, status, error } = useSelector(
    (state) => state.exchangeRates
  );

  // Dispatch the fetchExchangeRates thunk when a token is available and status is idle
  useEffect(() => {
    if (token && status === "idle") {
      dispatch(fetchExchangeRates());
    }
  }, [token, dispatch, status]);

  // Draw chart when exchangeRates change
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

  if (status === "loading") {
    return (
      <div className="text-center text-gray-500">
        Loading exchange rate trends...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-500 text-center">Error: {error}</div>
    );
  }

  return (
    <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">
        Dollar Rate Trend
      </h2>
      <div className="relative" style={{ height: "300px" }}>
        <canvas
          ref={lineChartRef}
          className="bg-white p-4 shadow-md rounded-lg"
        ></canvas>
      </div>
    </section>
  );
};

export default ChartSection;
