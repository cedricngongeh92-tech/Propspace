import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function ProtectedRoute() {
  const { loading, token, user } = useAuth();

  if (loading) {
    return <p className="page">Loading...</p>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
