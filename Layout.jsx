import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, Settings, LayoutDashboard, LogOut, UserCog, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

export default function Layout() {
  const { currentUser, userProfile, institution, logout } = useAuth();
  const { roleLabel, isAdmin, isCoordinator } = useRole();
  const navigate = useNavigate();

  // Estado del menú en móvil: abierto o cerrado
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const displayName = userProfile?.displayName || currentUser?.email || 'Usuario';
  const initials    = displayName.charAt(0).toUpperCase();

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-color)' }}>

      {/* Estilos responsivos: en pantallas angostas el menú se oculta
          y aparece la barra superior con el botón hamburguesa */}
      <style>{`
        /* ── Escritorio (por defecto): menú fijo, sin barra superior ── */
        .mobile-topbar { display: none; }
        .sidebar-overlay { display: none; }

        /* ── Móvil y tablets angostas ── */
        @media (max-width: 900px) {
          .mobile-topbar {
            display: flex;
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            align-items: center;
            gap: 0.75rem;
            padding: 0 1rem;
            background-color: var(--bg-surface);
            border-bottom: 1px solid var(--border-color);
            z-index: 40;
          }

          .sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            z-index: 60;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 4px 0 24px rgba(0,0,0,0.4);
          }
          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
            z-index: 50;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }
          .sidebar-overlay.visible {
            opacity: 1;
            pointer-events: auto;
          }

          .main-content {
            padding-top: 56px; /* deja espacio para la barra superior */
          }
          .main-content > div {
            padding: 1rem !important; /* menos margen en pantallas chicas */
          }
        }
      `}</style>

      {/* Barra superior — solo visible en móvil */}
      <header className="mobile-topbar no-print">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
        >
          <Menu size={26} />
        </button>
        {institution?.logoUrl ? (
          <img src={institution.logoUrl} alt="Logo" style={{ maxHeight: '32px', maxWidth: '120px', objectFit: 'contain' }} />
        ) : (
          <BookOpen color="var(--gold-primary)" size={20} />
        )}
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Sílabos Hub</span>
      </header>

      {/* Fondo oscurecido al abrir el menú en móvil (tocar = cerrar) */}
      <div
        className={`sidebar-overlay no-print ${menuOpen ? 'visible' : ''}`}
        onClick={closeMenu}
      />

      {/* Sidebar */}
      <aside className={`sidebar no-print ${menuOpen ? 'open' : ''}`} style={{ width: '260px', backgroundColor: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {institution?.logoUrl ? (
            <img src={institution.logoUrl} alt="Logo institucional" style={{ maxHeight: '40px', maxWidth: '150px', objectFit: 'contain' }} />
          ) : (
            <BookOpen color="var(--gold-primary)" size={24} />
          )}
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', flex: 1 }}>Sílabos Hub</h2>
          {/* Botón cerrar — solo tiene sentido en móvil, pero no estorba ocultarlo con la misma media query de la topbar */}
          {menuOpen && (
            <button
              onClick={closeMenu}
              aria-label="Cerrar menú"
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem', display: 'flex' }}
            >
              <X size={22} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/dashboard" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>

          {/* Solo admin */}
          {isAdmin && (
            <NavLink to="/institutional" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Users size={20} /> Gestión Institucional
            </NavLink>
          )}

          <NavLink to="/repository" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <FileText size={20} /> Repositorio Documental
          </NavLink>

          <NavLink to="/builder" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <BookOpen size={20} /> Constructor de Sílabos
          </NavLink>

          {/* Admin + coordinator */}
          {(isAdmin || isCoordinator) && (
            <NavLink to="/review" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <Settings size={20} /> Revisión Curricular
            </NavLink>
          )}

          {/* Solo admin */}
          {isAdmin && (
            <NavLink to="/users" onClick={closeMenu} className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
              <UserCog size={20} /> Gestión de Usuarios
            </NavLink>
          )}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {displayName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>
                {roleLabel}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.borderColor = '#ff6b6b'; }}
            onMouseOut={(e)  => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-color)', position: 'relative' }}>
        <div style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}