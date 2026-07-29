import React from 'react';
import { Calendar, Clock, BookOpen, User, Sparkles } from 'lucide-react';

export default function ScheduleTab({ courseData, setCourseData, units }) {
  const { hours } = courseData;
  const totalWeeks = hours?.totalWeeks || 16;
  const scheduleData = courseData.schedule || [];

  const handleGenerateSchedule = () => {
    const schedule = [];
    const unitsCount = units.length;
    if (unitsCount === 0) {
      alert("Debes crear al menos una unidad temática primero.");
      return;
    }

    const weeksPerUnit = Math.floor(totalWeeks / unitsCount);
    let currentWeek = 1;

    units.forEach((unit, index) => {
      const isLast = index === unitsCount - 1;
      const weeksForThisUnit = isLast ? (totalWeeks - currentWeek + 1) : weeksPerUnit;

      for (let i = 0; i < weeksForThisUnit; i++) {
        schedule.push({
          week: currentWeek,
          unitName: unit.name,
          contents: unit.contents?.split('\n')[0] || 'Contenidos de la unidad',
          teacherActivity: unit.teacherActivities?.split('\n')[0] || 'Actividad dirigida',
          independentActivity: unit.independentActivities?.split('\n')[0] || 'Trabajo autónomo',
          evidence: i === weeksForThisUnit - 1 ? unit.evidence : ''
        });
        currentWeek++;
      }
    });

    setCourseData({ ...courseData, schedule });
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedule = [...scheduleData];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setCourseData({ ...courseData, schedule: newSchedule });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Cronograma Semanal</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Distribución de contenidos y actividades a lo largo de las {totalWeeks} semanas.
          </p>
        </div>
        <button onClick={handleGenerateSchedule} className="btn btn-outline" style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>
          <Sparkles size={16} /> Generar Automáticamente
        </button>
      </div>

      {scheduleData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '0.5rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No hay cronograma generado.</p>
          <button onClick={handleGenerateSchedule} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Generar Ahora
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="schedule-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--gold-glow)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Sem.</th>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Unidad</th>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Temas / Contenidos</th>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Actividad Docente</th>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Trabajo Autónomo</th>
                <th style={{ padding: '1rem', border: '1px solid var(--border-color)' }}>Evidencia</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((item, index) => (
                <tr key={item.week} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)', fontWeight: 'bold', textAlign: 'center' }}>{item.week}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <input type="text" className="input" value={item.unitName} onChange={(e) => updateScheduleItem(index, 'unitName', e.target.value)} style={{ minWidth: '120px' }} />
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <textarea className="input" value={item.contents} onChange={(e) => updateScheduleItem(index, 'contents', e.target.value)} style={{ minWidth: '150px', resize: 'vertical', minHeight: '40px' }} />
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <textarea className="input" value={item.teacherActivity} onChange={(e) => updateScheduleItem(index, 'teacherActivity', e.target.value)} style={{ minWidth: '150px', resize: 'vertical', minHeight: '40px' }} />
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <textarea className="input" value={item.independentActivity} onChange={(e) => updateScheduleItem(index, 'independentActivity', e.target.value)} style={{ minWidth: '150px', resize: 'vertical', minHeight: '40px' }} />
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <input type="text" className="input" value={item.evidence} onChange={(e) => updateScheduleItem(index, 'evidence', e.target.value)} style={{ minWidth: '100px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
