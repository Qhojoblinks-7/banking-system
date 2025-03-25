// src/components/admin/AdminHeader.jsx
import React from "react";

const AdminHeader = () => {
  return (
    <header className="bg-white h-16 flex items-center justify-between px-6 shadow">
      <h2 className="text-gray-700 text-lg font-semibold">
        Admin Panel
      </h2>
      <div className="flex items-center space-x-4">
        <span className="text-gray-500">Hello, Admin</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default AdminHeader;
