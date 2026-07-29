import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', gap: '1.5rem',
      backgroundColor: 'var(--bg-color)', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)', border: '2px solid var(--danger)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ShieldOff size={36} color="var(--danger)" />
      </div>
      <div>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Acceso Denegado</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          No tienes permisos para acceder a esta sección.
          Contacta al administrador si crees que es un error.
        </p>
      </div>
      <button
        className="btn btn-outline"
        onClick={() => navigate('/dashboard')}
      >
        Volver al Panel
      </button>
    </div>
  );
}
