import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import Layout from './components/Layout';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ExecutiveSummaryView from './pages/ExecutiveSummaryView';
import Dashboard from './pages/Dashboard';
import InstitutionalManagement from './pages/InstitutionalManagement';
import DocumentRepository from './pages/DocumentRepository';
import SyllabusBuilder from './pages/SyllabusBuilder';
import SyllabusReview from './pages/SyllabusReview';
import SyllabusReviewPanel from './pages/SyllabusReviewPanel';
import SyllabusExport from './pages/SyllabusExport';
import UserManagement from './pages/UserManagement';
import Unauthorized from './pages/Unauthorized';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/resumen-ejecutivo" element={<ExecutiveSummaryView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Rutas Protegidas de la Aplicación en Layout */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Solo admin */}
                <Route path="/institutional" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <InstitutionalManagement />
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />

                {/* Admin + coordinator */}
                <Route path="/review" element={
                  <ProtectedRoute allowedRoles={['admin', 'coordinator']}>
                    <SyllabusReview />
                  </ProtectedRoute>
                } />
                <Route path="/review/:syllabusId" element={
                  <ProtectedRoute allowedRoles={['admin', 'coordinator']}>
                    <SyllabusReviewPanel />
                  </ProtectedRoute>
                } />

                {/* Todos los autenticados */}
                <Route path="/repository" element={<DocumentRepository />} />
                <Route path="/builder"    element={<SyllabusBuilder />} />
                <Route path="/builder/:syllabusId" element={<SyllabusBuilder />} />
                <Route path="/export"     element={<SyllabusExport />} />
              </Route>

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);