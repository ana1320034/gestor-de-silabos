import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, FolderOpen, PenTool, CheckCircle, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard',    label: 'Panel General',        icon: <LayoutDashboard size={20} /> },
    { path: '/institutional', label: 'Gestión Institucional', icon: <Building2 size={20} /> },
    { path: '/repository',   label: 'Repositorio',           icon: <FolderOpen size={20} /> },
    { path: '/builder',      label: 'Constructor Sílabos',   icon: <PenTool size={20} /> },
    { path: '/review',       label: 'Revisión y Aprobación', icon: <CheckCircle size={20} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--gold-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', flexShrink: 0 }}>
          GS
        </div>
        <h2 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--gold-primary)' }}>Gestor de Sílabos</h2>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Pie */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <NavLink to="/login" className="sidebar-nav-link" style={{ color: 'var(--danger)' }}>
          <span className="sidebar-nav-icon"><LogOut size={20} /></span>
          Cerrar Sesión
        </NavLink>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.5, textAlign: 'center', margin: 0 }}>
          v1.0 · Beta
        </p>
      </div>
    </aside>
  );
}
