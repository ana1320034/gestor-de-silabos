import React, { useState } from 'react';
import { X, CheckCircle, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SignatureModal({ isOpen, onClose, onConfirm, syllabusName }) {
  const { userProfile } = useAuth();
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const expectedSignature = userProfile?.displayName || userProfile?.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signature.trim().toLowerCase() !== expectedSignature?.trim().toLowerCase()) {
      setError('La firma no coincide con tu nombre registrado.');
      return;
    }
    setError('');
    onConfirm();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <Shield size={20} style={{ color: 'var(--gold-primary)' }} />
            Firma Digital Requerida
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Estás a punto de aprobar institucionalmente el sílabo <strong>"{syllabusName}"</strong>. 
          Esta acción bloqueará futuras modificaciones.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="label">Escribe tu nombre completo para firmar:</label>
            <input 
              type="text" 
              className="input" 
              placeholder={expectedSignature}
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              autoFocus
            />
            <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
              Firma esperada: {expectedSignature}
            </small>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!signature.trim()}>
              <CheckCircle size={16} /> Firmar y Aprobar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
