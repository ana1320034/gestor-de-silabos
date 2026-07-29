import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Protege una ruta por autenticación y opcionalmente por rol.
 * @param {string[]} [allowedRoles] — si se omite, solo requiere estar autenticado.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si hay allowedRoles pero role aún no cargó (null), espera brevemente
  if (allowedRoles && !role) {
    return null;
  }

  return children;
}
