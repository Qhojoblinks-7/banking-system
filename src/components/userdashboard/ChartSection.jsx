import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { fetchExchangeRates } from "../store/exchangeRatesSlice"; // Adjust path as needed

const ChartSection = () => {
  const dispatch = useDispatch();
  const lineChartRef = useRef(null);

  // If you need a token from auth slice:
  const token = useSelector((state) => state.auth?.token);

  // Retrieve exchange rates data, loading status, and error from Redux exchangeRates slice
  const { trends: exchangeRates, status, error } = useSelector(
    (state) => state.exchangeRates
  );

  // Dispatch the fetchExchangeRates thunk when token is available and status is idle
  useEffect(() => {
    if (token && status === "idle") {
      dispatch(fetchExchangeRates());
    }
  }, [token, dispatch, status]);

  // Once exchangeRates load, build chart
  useEffect(() => {
    if (!lineChartRef.current) return;
    if (exchangeRates.length === 0) return;

    const ctx = lineChartRef.current.getContext("2d");

    // Destroy old chart instance if it exists (avoid duplicates)
    if (lineChartRef.current.chartInstance) {
      lineChartRef.current.chartInstance.destroy();
    }

    // For demonstration: second dataset is a dashed line, 80% of the main
    const comparisonRates = exchangeRates.map((data) => data.rate * 0.8);

    lineChartRef.current.chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: exchangeRates.map((data) => data.date),
        datasets: [
          {
            label: "Dollar Rate",
            data: exchangeRates.map((data) => data.rate),
            fill: true,
            backgroundColor: "rgba(255, 99, 132, 0.1)", // Light red fill
            borderColor: "rgba(255, 99, 132, 1)",       // Red line
            tension: 0.4,
          },
          {
            label: "Comparison",
            data: comparisonRates,
            fill: false,
            borderColor: "rgba(201, 203, 207, 0.7)",    // Grey line
            borderDash: [5, 5],                         // Dashed line
            tension: 0.4,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Let parent container control height
        plugins: {
          legend: { display: false }, // Hide dataset labels
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: "rgba(200,200,200,0.2)" },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });
  }, [exchangeRates]);

  // Handle loading/error states
  if (status === "loading") {
    return (
      <div className="text-center text-gray-500">
        Loading dollar rate trends...
      </div>
    );
  }

  if (status === "failed") {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <section className="bg-white w-full p-6 rounded-lg shadow-md">
      {/* Top Container: Title, Amount, Percentage */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-700">Dollar Rate</h2>
          <p className="text-3xl font-bold text-gray-900">$1.20</p>
        </div>
        <div className="flex items-center text-red-500">
          <span className="text-sm font-bold mr-2">↓ 0.05%</span>
          <FontAwesomeIcon icon={faArrowDown} />
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative" style={{ height: "300px" }}>
        <canvas
          ref={lineChartRef}
          className="bg-white p-2 shadow-inner rounded-lg"
        ></canvas>
      </div>
    </section>
  );
};

export default ChartSection;
