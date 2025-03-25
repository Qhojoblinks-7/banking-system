// src/components/admin/AdminApprovals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/admin/approvals", { withCredentials: true })
      .then((res) => setApprovals(res.data.approvals))
      .catch((err) => setError(err.response?.data?.error || err.message));
  }, []);

  const handleApprove = (id) => {
    // Example: PUT /api/admin/approvals/:id/approve
  };

  const handleReject = (id) => {
    // Example: PUT /api/admin/approvals/:id/reject
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Approvals</h2>
      {error && <p className="text-red-500">{error}</p>}

      {approvals.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between">
          <div>
            <p className="font-semibold">{item.description}</p>
            <p className="text-sm text-gray-500">{item.created_at}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleApprove(item.id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(item.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminApprovals;
