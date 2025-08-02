// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Se não está logado, redireciona ao login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se está logado, exibe o conteúdo protegido
  return <>{children}</>;
}
