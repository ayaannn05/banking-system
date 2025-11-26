import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    // Not logged in -> redirect to login
    if (!token) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }
    // If a specific role is required but user doesn't have it -> redirect
    if (requiredRole && role !== requiredRole) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [navigate, location, requiredRole]);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!token) return null;
  if (requiredRole && role !== requiredRole) return null;

  return children;
}
