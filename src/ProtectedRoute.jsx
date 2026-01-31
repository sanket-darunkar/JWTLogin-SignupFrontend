import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  const decoded = jwtDecode(token);
  if (decoded.role !== role) return <Navigate to="/" />;

  return children;
}
