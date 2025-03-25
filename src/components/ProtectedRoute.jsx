import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const authUser = useSelector((state) => state.auth.user);

  if (!authUser) {
    return <Navigate to="/user/login" replace />;
  }

  if (isAdmin && authUser.role !== "admin") {
    return <Navigate to="/admin/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;