import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

export default function Header() {
  const { userProfile } = useAuth();
  const { roleLabel } = useRole();
  const displayName = userProfile?.displayName ?? 'Usuario';

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '300px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Buscar sílabos, asignaturas..."
            className="input"
            style={{ paddingLeft: '2.5rem', borderRadius: '999px', backgroundColor: 'var(--bg-color)' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--danger)', borderRadius: '50%' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{displayName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gold-primary)' }}>{roleLabel}</div>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)', fontWeight: 700 }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
