import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Database, FileText, GraduationCap, Plus, ArrowRight, LayoutDashboard, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAppContext } from '../hooks/useApp';
import { useRole } from '../hooks/useRole';
import { auth } from '../services/firebase';

// Colores e íconos por estado
const STATUS_STYLE = {
  'En Revisión': { color: 'var(--gold-primary)' },
  'Devuelto':    { color: 'var(--danger)' },
  'Aprobado':    { color: 'var(--success, #10B981)' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { faculties, programs, courses, syllabi } = useAppContext();
  const { isAdmin } = useRole();
  const uid = auth.currentUser?.uid;

  // Los admins ven todos los sílabos; los demás, solo los propios.
  const mySyllabi = isAdmin ? syllabi : syllabi.filter(s => s.authorId === uid);

  const myDrafts    = mySyllabi.filter(s => s.status === 'Borrador');
  const myInReview  = mySyllabi.filter(s => s.status === 'En Revisión' || s.status === 'Devuelto');
  const myApproved  = mySyllabi.filter(s => s.status === 'Aprobado');

  // Estadísticas institucionales (siguen siendo globales a propósito)
  const approvedCount = syllabi.filter(s => s.status === 'Aprobado').length;
  const reviewCount   = syllabi.filter(s => s.status === 'En Revisión').length;
  const draftCount    = syllabi.filter(s => s.status === 'Borrador').length || 0;
  const totalSyllabi  = syllabi.length;

  const stats = [
    { title: 'Facultades',        value: faculties.length, icon: <Database size={24} className="text-gold" /> },
    { title: 'Programas',         value: programs.length,  icon: <GraduationCap size={24} className="text-gold" /> },
    { title: 'Asignaturas',       value: courses.length,   icon: <BookOpen size={24} className="text-gold" /> },
    { title: 'Sílabos Aprobados', value: approvedCount,    icon: <CheckCircle size={24} className="text-gold" /> },
  ];

  const pieData = [
    { name: 'Aprobados', value: approvedCount, color: '#10B981' },
    { name: 'En Revisión', value: reviewCount, color: '#D4AF37' },
    { name: 'Borrador', value: draftCount, color: '#6B7280' }
  ];

  // Tarjeta reutilizable de sílabo
  const SyllabusCard = ({ s, badgeLabel, badgeColor, actionLabel }) => (
    <div className="card hover-trigger" style={{ cursor: 'pointer' }} onClick={() => navigate(`/builder/${s.id}`)}>
      <div className="flex justify-between items-start mb-4">
        <div style={{ background: 'var(--gold-glow)', padding: '0.5rem', borderRadius: '0.5rem' }}>
          <FileText className="text-gold" size={24} />
        </div>
        <span className="badge" style={{ border: `1px solid ${badgeColor}`, color: badgeColor, borderRadius: '999px', padding: '0.35rem 0.8rem', fontSize: '0.75rem' }}>
          {badgeLabel}
        </span>
      </div>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{s.name || 'Sin título'}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
        {s.program || 'Programa no definido'}
      </p>
      {isAdmin && s.author && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          Autor: {s.author}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Clock size={12} /> {s.updatedAt?.toDate ? s.updatedAt.toDate().toLocaleDateString() : 'Recién editado'}
        </span>
        <span className="text-gold" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {actionLabel} <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Mis Borradores ── */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock className="text-gold" /> {isAdmin ? 'Borradores Recientes' : 'Mis Borradores'}
          </h2>
          <button onClick={() => navigate('/builder')} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            <Plus size={18} /> Nuevo Sílabo
          </button>
        </div>

        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          {myDrafts.slice(0, 6).map(draft => (
            <SyllabusCard key={draft.id} s={draft} badgeLabel="Borrador" badgeColor="var(--gold-primary)" actionLabel="Editar" />
          ))}

          {myDrafts.length === 0 && (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '2px dashed var(--border-color)', background: 'transparent' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No tienes borradores pendientes.</p>
              <button onClick={() => navigate('/builder')} className="btn btn-outline" style={{ margin: '0 auto' }}>
                Crear mi primer sílabo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mis Sílabos en Revisión / Devueltos ── */}
      {myInReview.length > 0 && (
        <div className="mb-10">
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Eye className="text-gold" /> {isAdmin ? 'Sílabos en Revisión' : 'Mis Sílabos en Revisión'}
          </h2>
          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {myInReview.map(s => (
              <SyllabusCard
                key={s.id}
                s={s}
                badgeLabel={s.status}
                badgeColor={STATUS_STYLE[s.status]?.color ?? 'var(--gold-primary)'}
                actionLabel={s.status === 'Devuelto' ? 'Corregir' : 'Ver'}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Mis Sílabos Aprobados ── */}
      {myApproved.length > 0 && (
        <div className="mb-10">
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <CheckCircle className="text-gold" /> {isAdmin ? 'Sílabos Aprobados' : 'Mis Sílabos Aprobados'}
          </h2>
          <div className="grid grid-3" style={{ gap: '1.5rem' }}>
            {myApproved.map(s => (
              <SyllabusCard key={s.id} s={s} badgeLabel="Aprobado" badgeColor="#10B981" actionLabel="Ver" />
            ))}
          </div>
        </div>
      )}

      {/* ── Estadísticas institucionales ── */}
      <div className="flex justify-between items-center mb-6">
        <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard className="text-gold" /> Panorama Institucional
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="card flex items-center gap-4">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 className="mb-4">Estado de los Sílabos</h3>
          {totalSyllabi > 0 ? (
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              No hay sílabos creados todavía.
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4">Facultades Recientes</h3>
          <div className="flex-col gap-4">
            {faculties.length > 0 ? faculties.map(fac => (
              <div key={fac.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 500 }}>{fac.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gold-primary)', background: 'var(--bg-color)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  {programs.filter(p => p.facultyId === fac.id).length} Programas
                </div>
              </div>
            )) : (
              <div style={{ padding: '1rem', color: 'var(--text-secondary)' }}>No hay facultades registradas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}