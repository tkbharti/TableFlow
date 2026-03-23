// ./route/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // or use context/auth state
  const location = useLocation();

  if (!isAuthenticated) {
    // 🔁 redirect to login if not logged in
      return <Navigate to="/login" state={{ from: location }} replace />; 
  }

  // ✅ render the protected page if logged in
  return children;
}
