import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, token } = useAuth();

  // No token at all — bail immediately, no need to wait
  if (!token) return <Navigate to="/login" replace />;

  // Have a token but still verifying it against the backend
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-night">
        <span className="text-sm text-paper/60">Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}