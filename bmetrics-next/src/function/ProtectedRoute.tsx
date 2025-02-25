"use client"
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './VerificationCheck';

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
