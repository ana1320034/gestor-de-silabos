import React, { useState } from 'react';
import { Plus, Trash2, X, Building2, BookOpen, GraduationCap, Image, Upload } from 'lucide-react';
import { useAppContext } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';
import { db, storage } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ── Modal genérico ──────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 50,
    }}>
      <div className="card" style={{ width: '440px', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Tab Identidad institucional (logo) ──────────────────────────────────────
function IdentityTab() {
  const { institution } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    // Validaciones (en espejo con las reglas de Storage)
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen (PNG, JPG, SVG...).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 2 MB.`);
      return;
    }

    setUploading(true);
    try {
      // 1. Subir el logo nuevo a Storage
      const logoPath = `institutions/${institution.id}/branding/logo_${Date.now()}`;
      const fileRef = ref(storage, logoPath);
      await uploadBytes(fileRef, file, { contentType: file.type });
      const logoUrl = await getDownloadURL(fileRef);

      // 2. Borrar el logo anterior si existía
      if (institution.logoPath) {
        await deleteObject(ref(storage, institution.logoPath)).catch(() => {});
      }

      // 3. Guardar la referencia en el documento de la institución
      await updateDoc(doc(db, 'institutions', institution.id), { logoUrl, logoPath });

      alert('✅ Logo actualizado correctamente.');
      window.location.reload(); // refresca para que el menú lateral muestre el logo nuevo
    } catch (err) {
      setError('Error subiendo el logo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('¿Quitar el logo institucional? La aplicación volverá a mostrar el ícono por defecto.')) return;
    setUploading(true);
    try {
      if (institution.logoPath) {
        await deleteObject(ref(storage, institution.logoPath)).catch(() => {});
      }
      await updateDoc(doc(db, 'institutions', institution.id), { logoUrl: null, logoPath: null });
      alert('Logo eliminado.');
      window.location.reload();
    } catch (err) {
      setError('Error eliminando el logo: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px' }}>
      <h3 style={{ marginTop: 0 }}>Logo institucional</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        El logo aparecerá en el menú de la aplicación para todos los usuarios de tu institución.
        Formatos recomendados: PNG o SVG con fondo transparente, máximo 2 MB.
      </p>

      {/* Vista previa actual */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.5rem',
        border: '1px dashed var(--border-color)', borderRadius: '12px',
        padding: '1.5rem', margin: '1.25rem 0',
      }}>
        {institution?.logoUrl ? (
          <img
            src={institution.logoUrl}
            alt="Logo institucional"
            style={{ maxHeight: '72px', maxWidth: '200px', objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            width: '72px', height: '72px', borderRadius: '12px',
            background: 'var(--bg-surface-hover, rgba(255,255,255,0.05))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}>
            <Image size={28} />
          </div>
        )}
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{institution?.name}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {institution?.logoUrl ? 'Logo actual' : 'Sin logo — se muestra el ícono por defecto'}
          </p>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>
      )}

      <div className="flex gap-2">
        <label className="btn btn-primary" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <Upload size={16} /> {uploading ? 'Procesando...' : (institution?.logoUrl ? 'Cambiar logo' : 'Subir logo')}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
        {institution?.logoUrl && (
          <button className="btn btn-ghost" onClick={handleRemove} disabled={uploading} style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} /> Quitar logo
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab Facultades ──────────────────────────────────────────────────────────
function FacultiesTab() {
  const { faculties, addFaculty, deleteFaculty, programs } = useAppContext();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await addFaculty(name);
      setName(''); setOpen(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteFaculty(id); }
    catch (err) { alert(err.message); }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{faculties.length} facultad(es) registrada(s)</p>
        <button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={16} /> Nueva Facultad</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Nombre</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Programas</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map(fac => (
            <tr key={fac.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '0.9rem 0.5rem', fontWeight: 500 }}>{fac.name}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>
                {programs.filter(p => p.facultyId === fac.id).length}
              </td>
              <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                <button className="btn btn-ghost" onClick={() => handleDelete(fac.id)} style={{ padding: '0.25rem', color: 'var(--danger)' }} title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {faculties.length === 0 && (
            <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay facultades registradas.</td></tr>
          )}
        </tbody>
      </table>

      {open && (
        <Modal title="Nueva Facultad" onClose={() => { setOpen(false); setError(''); }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Nombre de la Facultad *</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)}
                placeholder="Ej. Facultad de Ingeniería" required autoFocus />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ── Tab Programas ───────────────────────────────────────────────────────────
const LEVELS_UNIV  = ['Pregrado', 'Especialización', 'Maestría', 'Doctorado'];
const LEVELS_SCH   = ['Básica Primaria', 'Básica Secundaria', 'Media'];

function ProgramsTab({ institutionType }) {
  const { programs, faculties, addProgram, deleteProgram, courses } = useAppContext();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', level: '', facultyId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const levels = institutionType === 'school' ? LEVELS_SCH : LEVELS_UNIV;

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await addProgram({ name: form.name, level: form.level || levels[0], facultyId: form.facultyId });
      setForm({ name: '', level: '', facultyId: '' }); setOpen(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteProgram(id); }
    catch (err) { alert(err.message); }
  };

  const getFacultyName = (id) => faculties.find(f => f.id === id)?.name ?? '—';

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{programs.length} programa(s) registrado(s)</p>
        <button className="btn btn-primary" onClick={() => setOpen(true)} disabled={faculties.length === 0}>
          <Plus size={16} /> Nuevo Programa
        </button>
      </div>
      {faculties.length === 0 && (
        <p style={{ color: 'var(--gold-primary)', fontSize: '0.875rem' }}>⚠ Crea al menos una facultad antes de añadir programas.</p>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Programa</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Nivel</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Facultad</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Asignaturas</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(prog => (
            <tr key={prog.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '0.9rem 0.5rem', fontWeight: 500 }}>{prog.name}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{prog.level}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{getFacultyName(prog.facultyId)}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>
                {courses.filter(c => c.programId === prog.id).length}
              </td>
              <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                <button className="btn btn-ghost" onClick={() => handleDelete(prog.id)} style={{ padding: '0.25rem', color: 'var(--danger)' }} title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {programs.length === 0 && (
            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay programas registrados.</td></tr>
          )}
        </tbody>
      </table>

      {open && (
        <Modal title="Nuevo Programa" onClose={() => { setOpen(false); setError(''); }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Nombre del Programa *</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Ingeniería de Sistemas" required autoFocus />
            </div>
            <div>
              <label className="label">Facultad *</label>
              <select className="input" value={form.facultyId} onChange={e => setForm({ ...form, facultyId: e.target.value })} required>
                <option value="">— Selecciona —</option>
                {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Nivel</label>
              <select className="input" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {levels.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ── Tab Asignaturas ─────────────────────────────────────────────────────────
function CoursesTab() {
  const { courses, programs, faculties, addCourse, deleteCourse } = useAppContext();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', credits: 3, semester: 1, programId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await addCourse(form);
      setForm({ name: '', code: '', credits: 3, semester: 1, programId: '' }); setOpen(false);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta asignatura?')) return;
    try { await deleteCourse(id); }
    catch (err) { alert(err.message); }
  };

  const getProgramName = (id) => programs.find(p => p.id === id)?.name ?? '—';

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{courses.length} asignatura(s) registrada(s)</p>
        <button className="btn btn-primary" onClick={() => setOpen(true)} disabled={programs.length === 0}>
          <Plus size={16} /> Nueva Asignatura
        </button>
      </div>
      {programs.length === 0 && (
        <p style={{ color: 'var(--gold-primary)', fontSize: '0.875rem' }}>⚠ Crea al menos un programa antes de añadir asignaturas.</p>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Asignatura</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Código</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Programa</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Créd.</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500 }}>Sem.</th>
            <th style={{ padding: '0.75rem 0.5rem', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '0.9rem 0.5rem', fontWeight: 500 }}>{c.name}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{c.code || '—'}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{getProgramName(c.programId)}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{c.credits}</td>
              <td style={{ padding: '0.9rem 0.5rem', color: 'var(--text-secondary)' }}>{c.semester}</td>
              <td style={{ padding: '0.9rem 0.5rem', textAlign: 'right' }}>
                <button className="btn btn-ghost" onClick={() => handleDelete(c.id)} style={{ padding: '0.25rem', color: 'var(--danger)' }} title="Eliminar">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {courses.length === 0 && (
            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay asignaturas registradas.</td></tr>
          )}
        </tbody>
      </table>

      {open && (
        <Modal title="Nueva Asignatura" onClose={() => { setOpen(false); setError(''); }}>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Nombre de la Asignatura *</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Ingeniería de Software II" required autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Código</label>
                <input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="Ej. SIS-402" />
              </div>
              <div>
                <label className="label">Programa *</label>
                <select className="input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })} required>
                  <option value="">— Selecciona —</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Créditos</label>
                <input type="number" className="input" min="1" max="10" value={form.credits}
                  onChange={e => setForm({ ...form, credits: e.target.value })} />
              </div>
              <div>
                <label className="label">Semestre</label>
                <input type="number" className="input" min="1" max="12" value={form.semester}
                  onChange={e => setForm({ ...form, semester: e.target.value })} />
              </div>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

// ── Página principal ────────────────────────────────────────────────────────
const TABS = [
  { id: 'faculties', label: 'Facultades',  icon: <Building2 size={16} /> },
  { id: 'programs',  label: 'Programas',   icon: <GraduationCap size={16} /> },
  { id: 'courses',   label: 'Asignaturas', icon: <BookOpen size={16} /> },
  { id: 'identity',  label: 'Identidad',   icon: <Image size={16} /> },
];

export default function InstitutionalManagement() {
  const [activeTab, setActiveTab] = useState('faculties');
  const { institution } = useAuth();
  const institutionType = institution?.type ?? 'university';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Gestión Institucional</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Administra la estructura académica de tu institución.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', border: 'none', background: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--gold-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400,
              transition: 'all 0.2s',
              marginBottom: '-1px',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {activeTab === 'faculties' && <FacultiesTab />}
        {activeTab === 'programs'  && <ProgramsTab institutionType={institutionType} />}
        {activeTab === 'courses'   && <CoursesTab />}
        {activeTab === 'identity'  && <IdentityTab />}
      </div>
    </div>
  );
}