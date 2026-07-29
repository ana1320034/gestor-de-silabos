import React from 'react';
import { Check, X, MessageSquare, Eye, FileDown } from 'lucide-react';
import { useAppContext } from '../hooks/useApp';
import { useNavigate } from 'react-router-dom';

export default function SyllabusReview() {
  const { syllabi, updateSyllabusStatus } = useAppContext();
  const navigate = useNavigate();

  const handleApprove = (id) => {
    updateSyllabusStatus(id, 'Aprobado');
  };

  const handleReject = (id) => {
    updateSyllabusStatus(id, 'Devuelto');
  };

  const handleExport = (syllabus) => {
    // Para simplificar, pasamos el objeto a la ruta de exportación usando state
    navigate('/export', { state: { syllabus } });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Revisión y Aprobación</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Evalúa los sílabos enviados por los docentes.</p>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Pendientes de Revisión</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Asignatura</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Programa</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Docente Autor</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Estado</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {syllabi.filter(s => s.status === 'En Revisión').map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 500, color: 'var(--gold-primary)' }}>{item.name}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{item.program}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{item.author}</td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <span className="badge badge-gold">{item.status}</span>
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                  <div className="flex gap-2 justify-center">
                    <button className="btn btn-outline" onClick={() => navigate(`/review/${item.id}`)} style={{ padding: '0.25rem 0.5rem' }} title="Revisar Sílabo">
                      <Eye size={16} /> Revisar
                    </button>
                    <button className="btn btn-primary" onClick={() => handleReject(item.id)} style={{ padding: '0.25rem 0.5rem', background: 'var(--danger)', border: 'none', color: '#fff' }} title="Devolver">
                      <X size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {syllabi.filter(s => s.status === 'En Revisión').length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay sílabos pendientes de revisión.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 className="mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>Historial Reciente</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Asignatura</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Programa</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>Estado</th>
              <th style={{ padding: '1rem 0.5rem', fontWeight: 500, textAlign: 'center' }}>Exportar</th>
            </tr>
          </thead>
          <tbody>
            {syllabi.filter(s => s.status !== 'En Revisión').map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '1rem 0.5rem' }}>{item.program}</td>
                <td style={{ padding: '1rem 0.5rem' }}>
                  <span className={item.status === 'Aprobado' ? 'badge badge-success' : 'badge badge-gold'} style={{ borderColor: item.status === 'Devuelto' ? 'var(--danger)' : '', color: item.status === 'Devuelto' ? 'var(--danger)' : '' }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '1rem 0.5rem', textAlign: 'center' }}>
                  {item.status === 'Aprobado' && (
                    <button onClick={() => handleExport(item)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} title="Exportar a PDF">
                      <FileDown size={16} /> PDF
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {syllabi.filter(s => s.status !== 'En Revisión').length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay historial reciente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
