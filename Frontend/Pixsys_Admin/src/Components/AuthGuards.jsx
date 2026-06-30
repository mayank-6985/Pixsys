import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../services/authService";

export const ProtectedRoute = () => {
  const token = authService.getAccessToken();

  const isAuthenticated = token && token !== "undefined" && token !== "null";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const GuestRoute = () => {
  return <Outlet />;
};
