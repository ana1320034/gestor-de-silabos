import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate  = useNavigate();
  const { login, resetPassword } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Modo de la pantalla: 'login' o 'reset' (recuperar contraseña)
  const [mode, setMode]           = useState('login');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError('Error al autenticar: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        setError('El correo no tiene un formato válido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos e intenta de nuevo.');
      } else {
        // Si el correo no existe, Firebase no avisa (por seguridad).
        // El usuario ve el mensaje de éxito igualmente.
        setResetSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    setMode('login');
    setResetSent(false);
    setError('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '4rem', borderRight: '1px solid var(--border-color)',
        backgroundImage: 'radial-gradient(circle at top right, rgba(212, 175, 55, 0.1), transparent 50%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            width: '48px', height: '48px', background: 'var(--gold-primary)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000',
          }}>
            <BookOpen size={28} />
          </div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--gold-primary)', margin: 0 }}>Gestor de Sílabos</h1>
        </div>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '500px', lineHeight: 1.6 }}>
          Plataforma institucional para organizar, construir y articular currículos de forma inteligente.
        </p>
      </div>

      {/* Formulario */}
      <div style={{
        width: '450px', display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--bg-surface)',
      }}>
        <div className="glass-panel" style={{ width: '100%', padding: '2.5rem' }}>

          {/* ─────────── MODO LOGIN ─────────── */}
          {mode === 'login' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Iniciar Sesión</h2>
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Accede con las credenciales proporcionadas por tu administrador.
              </p>

              {error && (
                <div style={{
                  backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff6b6b',
                  padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem',
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="label">Correo Institucional</label>
                  <input
                    type="email" className="input"
                    placeholder="usuario@institucion.edu.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Contraseña</label>
                  <input
                    type="password" className="input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => { setMode('reset'); setError(''); }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--gold-primary)', fontSize: '0.8rem', padding: 0,
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
                <button
                  disabled={loading} type="submit" className="btn btn-primary"
                  style={{ marginTop: '0.5rem', padding: '0.75rem', fontSize: '1rem' }}
                >
                  {loading ? 'Verificando...' : 'Ingresar al Sistema'}
                </button>
              </form>

              <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                ¿No tienes acceso? Contacta al administrador de tu institución.
              </p>
              <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Al usar la plataforma aceptas los{' '}
                <a href="/terminos.html" target="_blank" rel="noopener" style={{ color: 'var(--gold-primary)' }}>
                  Términos y Condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacidad.html" target="_blank" rel="noopener" style={{ color: 'var(--gold-primary)' }}>
                  Política de Datos Personales
                </a>.
              </p>
            </>
          )}

          {/* ─────────── MODO RECUPERAR CONTRASEÑA ─────────── */}
          {mode === 'reset' && (
            <>
              <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Recuperar Contraseña</h2>

              {!resetSent ? (
                <>
                  <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Escribe tu correo y te enviaremos un enlace para crear una contraseña nueva.
                  </p>

                  {error && (
                    <div style={{
                      backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff6b6b',
                      padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem',
                    }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label className="label">Correo Institucional</label>
                      <input
                        type="email" className="input"
                        placeholder="usuario@institucion.edu.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <button
                      disabled={loading} type="submit" className="btn btn-primary"
                      style={{ padding: '0.75rem', fontSize: '1rem' }}
                    >
                      {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981',
                    padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', lineHeight: 1.6,
                  }}>
                    Si existe una cuenta con el correo <strong>{email}</strong>, recibirás un
                    enlace para restablecer tu contraseña en los próximos minutos.
                    <br /><br />
                    Revisa también la carpeta de <strong>spam o correo no deseado</strong>.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={backToLogin}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  margin: '1.5rem auto 0',
                }}
              >
                <ArrowLeft size={14} /> Volver a iniciar sesión
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}