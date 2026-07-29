import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, RefreshCw, Pencil, UserCheck, UserX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { useAppContext } from '../hooks/useApp';
import { listUsers, adminCreateUser, updateUserRole, updateUserPrograms, setUserActive } from '../services/userService';
import { auth } from '../services/firebase';

const ROLE_OPTIONS = [
  { value: 'admin',       label: 'Administrador / Director' },
  { value: 'coordinator', label: 'Coordinador Académico' },
  { value: 'teacher',     label: 'Docente' },
];

const EMPTY_FORM = { displayName: '', email: '', password: '', role: 'teacher', programIds: [] };

export default function UserManagement() {
  const { userProfile, institution } = useAuth();
  const { isAdmin } = useRole();
  const { programs, faculties } = useAppContext();
  const institutionId = userProfile?.institutionId;

  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState('');

  const [editingUser, setEditingUser]       = useState(null);
  const [editPrograms, setEditPrograms]     = useState([]);
  const [savingPrograms, setSavingPrograms] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!institutionId) return;
    setLoading(true);
    try {
      const list = await listUsers(institutionId);
      setUsers(list);
    } catch (err) {
      setError('Error cargando usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const facultyName = (facultyId) =>
    faculties.find(f => f.id === facultyId)?.name ?? 'Sin facultad';

  const toggleProgram = (programId) => {
    setForm(prev => ({
      ...prev,
      programIds: prev.programIds.includes(programId)
        ? prev.programIds.filter(id => id !== programId)
        : [...prev.programIds, programId],
    }));
  };

  const toggleEditProgram = (programId) => {
    setEditPrograms(prev =>
      prev.includes(programId)
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const openEditPrograms = (user) => {
    setEditingUser(user);
    setEditPrograms(user.programIds ?? []);
  };

  const handleSavePrograms = async () => {
    if (!editingUser) return;
    if (editPrograms.length === 0) {
      alert('Selecciona al menos un programa.');
      return;
    }
    setSavingPrograms(true);
    try {
      await updateUserPrograms(editingUser.id, editPrograms);
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, programIds: editPrograms } : u));
      setEditingUser(null);
    } catch (err) {
      alert('Error guardando programas: ' + err.message);
    } finally {
      setSavingPrograms(false);
    }
  };

  // Activar / desactivar un usuario
  const handleToggleActive = async (u) => {
    const isActive = u.active !== false;
    const verbo = isActive ? 'desactivar' : 'reactivar';
    const detalle = isActive
      ? 'No podrá ingresar a la plataforma, pero su historial y sus sílabos se conservan.'
      : 'Recuperará el acceso con su misma cuenta e historial.';
    if (!window.confirm(`¿Deseas ${verbo} a ${u.displayName}?\n\n${detalle}`)) return;

    try {
      await setUserActive(u.id, !isActive);
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, active: !isActive } : x));
    } catch (err) {
      alert('Error cambiando el estado: ' + err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setFormError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (form.role !== 'admin' && form.programIds.length === 0) {
      setFormError('Selecciona al menos un programa para este usuario.');
      return;
    }
    setSaving(true); setFormError('');
    try {
      await adminCreateUser(
        { ...form, institutionId },
        auth.currentUser?.uid
      );
      setForm(EMPTY_FORM);
      setShowModal(false);
      await loadUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers(prev => prev.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Error cambiando rol: ' + err.message);
    }
  };

  const roleLabel = (role) => ROLE_OPTIONS.find(r => r.value === role)?.label ?? role;

  const programNames = (u) => {
    if (u.role === 'admin') return 'Todos (admin)';
    if (!u.programIds?.length) return '—';
    return u.programIds
      .map(id => programs.find(p => p.id === id)?.name ?? '?')
      .join(', ');
  };

  const ProgramPicker = ({ selected, onToggle }) => (
    <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem' }}>
      {programs.length === 0 ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem' }}>
          No hay programas creados aún. Créalos primero en Gestión Institucional.
        </p>
      ) : programs.map(p => (
        <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.25rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          <input
            type="checkbox"
            checked={selected.includes(p.id)}
            onChange={() => onToggle(p.id)}
          />
          <span>{p.name}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            — {facultyName(p.facultyId)}
          </span>
        </label>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Gestión de Usuarios</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Usuarios de <strong>{institution?.name ?? 'tu institución'}</strong>. Solo el administrador puede crear y gestionar cuentas.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={loadUsers} title="Actualizar lista">
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <UserPlus size={16} /> Nuevo Usuario
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Nombre</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Correo</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Rol</th>
              <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Programas</th>
              {isAdmin && <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Estado</th>}
              {isAdmin && <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Cambiar Rol</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay usuarios registrados.</td></tr>
            ) : users.map(u => {
              const isActive = u.active !== false;
              return (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: isActive ? 1 : 0.45 }}>
                <td style={{ padding: '0.9rem 0.5rem', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>
                      {u.displayName?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    {u.displayName}
                    {u.id === auth.currentUser?.uid && (
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Tú</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '0.9rem 0.5rem' }}>
                  <span className="badge badge-gold">{roleLabel(u.role)}</span>
                </td>
                <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{programNames(u)}</span>
                    {isAdmin && u.role !== 'admin' && (
                      <button
                        className="btn btn-ghost"
                        style={{ padding: '0.15rem 0.3rem' }}
                        title="Editar programas asignados"
                        onClick={() => openEditPrograms(u)}
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                  </div>
                </td>
                {isAdmin && (
                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    {u.id !== auth.currentUser?.uid ? (
                      <button
                        onClick={() => handleToggleActive(u)}
                        title={isActive ? 'Desactivar usuario' : 'Reactivar usuario'}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          background: 'transparent', cursor: 'pointer',
                          border: `1px solid ${isActive ? 'var(--success, #10B981)' : 'var(--danger, #ef4444)'}`,
                          color: isActive ? 'var(--success, #10B981)' : 'var(--danger, #ef4444)',
                          borderRadius: '999px', padding: '0.25rem 0.7rem', fontSize: '0.75rem',
                        }}
                      >
                        {isActive ? <UserCheck size={13} /> : <UserX size={13} />}
                        {isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    ) : (
                      <span className="badge" style={{ fontSize: '0.75rem', color: 'var(--success, #10B981)' }}>Activo</span>
                    )}
                  </td>
                )}
                {isAdmin && (
                  <td style={{ padding: '0.9rem 0.5rem' }}>
                    {u.id !== auth.currentUser?.uid ? (
                      <select
                        className="input"
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      {/* Modal crear usuario */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '480px', backgroundColor: 'var(--bg-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Crear Nuevo Usuario</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Nombre Completo *</label>
                <input className="input" value={form.displayName}
                  onChange={e => setForm({ ...form, displayName: e.target.value })}
                  placeholder="Ej. María García" required autoFocus />
              </div>
              <div>
                <label className="label">Correo Electrónico *</label>
                <input type="email" className="input" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="usuario@institucion.edu.co" required />
              </div>
              <div>
                <label className="label">Contraseña Temporal *</label>
                <input type="password" className="input" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres" required />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Comparte esta contraseña con el usuario. Podrá cambiarla desde su perfil.
                </p>
              </div>
              <div>
                <label className="label">Rol</label>
                <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {form.role !== 'admin' && (
                <div>
                  <label className="label">Programas asignados *</label>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>
                    {form.role === 'coordinator'
                      ? 'Programas que esta persona coordina (pueden ser de varias facultades).'
                      : 'Programas en los que esta persona dicta o colabora.'}
                  </p>
                  <ProgramPicker selected={form.programIds} onToggle={toggleProgram} />
                </div>
              )}

              {formError && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{formError}</p>}
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-ghost" onClick={() => { setShowModal(false); setFormError(''); setForm(EMPTY_FORM); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creando...' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar programas */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div className="card" style={{ width: '480px', backgroundColor: 'var(--bg-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Programas de {editingUser.displayName}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Marca o desmarca los programas asignados y guarda los cambios.
            </p>
            <ProgramPicker selected={editPrograms} onToggle={toggleEditProgram} />
            <div className="flex gap-2 justify-end" style={{ marginTop: '1.25rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setEditingUser(null)}>Cancelar</button>
              <button type="button" className="btn btn-primary" disabled={savingPrograms} onClick={handleSavePrograms}>
                {savingPrograms ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}