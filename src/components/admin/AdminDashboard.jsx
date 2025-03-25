// src/components/admin/AdminDashboard.jsx

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Example Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Loans</p>
          <p className="text-2xl font-bold text-gray-700">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Pending Approvals</p>
          <p className="text-2xl font-bold text-gray-700">3</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Transactions Today</p>
          <p className="text-2xl font-bold text-gray-700">45</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Users</p>
          <p className="text-2xl font-bold text-gray-700">105</p>
        </div>
      </div>

      {/* Possibly a chart or table */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
        <p className="text-sm text-gray-600">
          This could be a chart or a list of recent admin actions...
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
