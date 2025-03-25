import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/usersSlice";
import axios from "axios";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [newUser, setNewUser] = useState({ fullName: "", email: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, action: "", userId: null });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Show notifications
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle actions with confirmation modals
  const handleAction = async () => {
    const { action, userId } = modal;
    try {
      if (action === "lock") {
        await axios.put(`/api/admin/users/${userId}/lock`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showNotification("User locked successfully!");
      } else if (action === "unlock") {
        await axios.put(`/api/admin/users/${userId}/unlock`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showNotification("User unlocked successfully!");
      } else if (action === "delete") {
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        showNotification("User deleted successfully!");
      }
      dispatch(fetchUsers());
      setModal({ isOpen: false, action: "", userId: null });
    } catch (error) {
      showNotification("Something went wrong!", "error");
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/admin/users",
        { full_name: newUser.fullName, email: newUser.email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(fetchUsers());
      setNewUser({ fullName: "", email: "" });
      showNotification("User added successfully!");
    } catch (error) {
      showNotification("Failed to add user", "error");
    }
  };

  // Open modal with action and user ID
  const openModal = (action, userId) => setModal({ isOpen: true, action, userId });

  // Pagination and search logic
  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (status === "loading") return <h2>Loading users...</h2>;
  if (status === "failed") return <h2>Error: {error}</h2>;

  return (
    <div className="space-y-4 p-4 relative">
      <h2 className="text-xl font-bold">Manage Users</h2>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 text-white rounded ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {notification.message}
        </div>
      )}

      {/* Add User Form */}
      <form onSubmit={handleAddUser} className="space-x-2 mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          Add User
        </button>
      </form>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border px-2 py-1 mb-4 w-full"
      />

      {/* Users Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">User ID</th>
            <th className="p-2 text-left">Full Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u.user_id} className="border-b">
              <td className="p-2">{u.user_id}</td>
              <td className="p-2">{u.full_name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.isLocked ? "Locked" : "Active"}</td>
              <td className="p-2 text-right space-x-2">
                <button
                  onClick={() => openModal(u.isLocked ? "unlock" : "lock", u.user_id)}
                  className={`px-2 py-1 rounded text-white ${u.isLocked ? "bg-green-600" : "bg-yellow-600"}`}
                >
                  {u.isLocked ? "Unlock" : "Lock"}
                </button>
                <button
                  onClick={() => openModal("delete", u.user_id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="bg-gray-300 px-2 py-1 rounded"
        >
          Previous
        </button>
        <span>{currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="bg-gray-300 px-2 py-1 rounded"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h3>Are you sure you want to {modal.action} this user?</h3>
            <div className="mt-4 space-x-2">
              <button onClick={handleAction} className="bg-blue-600 text-white px-4 py-1 rounded">Yes</button>
              <button onClick={() => setModal({ isOpen: false, action: "", userId: null })} className="bg-gray-600 text-white px-4 py-1 rounded">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
