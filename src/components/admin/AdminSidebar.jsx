// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-red-600 text-white flex flex-col">
      {/* Brand / Logo */}
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <span className="text-red-600 font-bold">S</span>
        </div>
        <h1 className="text-xl font-bold">Sahara</h1>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 mt-4 space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-red-500 transition ${
              isActive ? "bg-red-500" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/loans"
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-red-500 transition ${
              isActive ? "bg-red-500" : ""
            }`
          }
        >
          Loans
        </NavLink>
        <NavLink
          to="/admin/transactions"
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-red-500 transition ${
              isActive ? "bg-red-500" : ""
            }`
          }
        >
          Transactions
        </NavLink>
        <NavLink
          to="/admin/approvals"
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-red-500 transition ${
              isActive ? "bg-red-500" : ""
            }`
          }
        >
          Approvals
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block py-2 px-3 rounded hover:bg-red-500 transition ${
              isActive ? "bg-red-500" : ""
            }`
          }
        >
          Users
        </NavLink>
      </nav>

      {/* Footer or Logout */}
      <div className="p-4">
        <button className="bg-white text-red-600 px-4 py-2 w-full rounded font-semibold hover:bg-gray-50 transition">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
