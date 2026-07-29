import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Barrera de errores: si un componente hijo falla inesperadamente,
 * muestra un mensaje amable en vez de una pantalla en blanco.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Registro para diagnóstico (visible en la consola del navegador)
    console.error('Error capturado por ErrorBoundary:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
          backgroundColor: 'var(--bg-color, #0f172a)', color: 'var(--text-primary, #f1f5f9)',
          padding: '2rem', textAlign: 'center',
        }}>
          <AlertTriangle size={48} style={{ color: 'var(--gold-primary, #d4af37)' }} />
          <h2 style={{ margin: 0 }}>Algo salió mal</h2>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', maxWidth: '420px', lineHeight: 1.6, margin: 0 }}>
            Ocurrió un error inesperado en la aplicación. Tu trabajo guardado está a salvo.
            Recarga la página para continuar.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--gold-primary, #d4af37)', color: '#000',
              border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem',
              fontWeight: 600, cursor: 'pointer', fontSize: '1rem', marginTop: '0.5rem',
            }}
          >
            <RefreshCw size={18} /> Recargar la página
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748b)', marginTop: '1rem' }}>
            Si el problema persiste, contacta al administrador.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}