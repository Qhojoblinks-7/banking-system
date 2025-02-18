const ChartSection = ({ lineChartRef }) => {
  return (
    <section className="mt-8 bg-sky-100 w-full p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900">Dollar Rate Trend</h2>
      <div className="relative" style={{ height: '300px' }}>
        <canvas ref={lineChartRef} className="bg-white p-4 shadow-md rounded-lg"></canvas>
      </div>
    </section>
  );
};

export default ChartSection;
// Compare this snippet from src/components/CustomSection.jsx: