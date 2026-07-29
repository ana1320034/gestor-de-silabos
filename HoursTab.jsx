import React from 'react';
import { Clock, Info } from 'lucide-react';

// Tipos de período académico y su nombre para totales
const PERIOD_OPTIONS = [
  { value: 'Semestral',     label: 'Semestral' },
  { value: 'Anual',         label: 'Anual' },
  { value: 'Trimestral',    label: 'Trimestral' },
  { value: 'Cuatrimestral', label: 'Cuatrimestral' },
  { value: 'Otro',          label: 'Otro' },
];

export default function HoursTab({ courseData, setCourseData }) {
  const { hours, credits, modality } = courseData;

  const handleHourChange = (field, value) => {
    setCourseData({
      ...courseData,
      hours: { ...hours, [field]: value === '' ? '' : parseInt(value) }
    });
  };

  const directTeaching = parseInt(hours.directTeaching) || 0;
  const independent    = parseInt(hours.independent) || 0;
  const totalWeeksNum  = parseInt(hours.totalWeeks) || 16;

  // NUEVO: período y equivalencia configurables
  const periodType     = hours.periodType || 'Semestral';
  // Horas por crédito: configurable; 48 por defecto (estándar Colombia).
  const hoursPerCredit = hours.hoursPerCredit === '' ? '' : (parseInt(hours.hoursPerCredit) ?? 48);
  const hpcNum         = parseInt(hoursPerCredit) || 0;

  const creditsNum   = parseInt(credits) || 0;
  const usesCredits  = creditsNum > 0;           // si no hay créditos, no se valida equivalencia
  const totalWeekly  = directTeaching + independent;
  const totalPeriod  = totalWeekly * totalWeeksNum;
  const expectedTotal = creditsNum * (hpcNum || 48);

  const matches = totalPeriod === expectedTotal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Horas por Modalidad</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Configura la distribución horaria semanal según la modalidad <strong>{modality}</strong>.
        </p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Modalidad de Estudio</label>
            <select
              className="input"
              value={modality}
              onChange={(e) => setCourseData({ ...courseData, modality: e.target.value })}
            >
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de Periodo Académico</label>
            <select
              className="input"
              value={periodType}
              onChange={(e) => setCourseData({ ...courseData, hours: { ...hours, periodType: e.target.value } })}
            >
              {PERIOD_OPTIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label><Clock size={14} /> Horas de Acompañamiento Docente (Semanal)</label>
            <input
              type="number"
              className="input"
              value={hours.directTeaching}
              onChange={(e) => handleHourChange('directTeaching', e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Clases magistrales, tutorías, laboratorios.
            </p>
          </div>

          <div className="form-group">
            <label><Clock size={14} /> Horas de Trabajo Independiente (Semanal)</label>
            <input
              type="number"
              className="input"
              value={hours.independent}
              onChange={(e) => handleHourChange('independent', e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Estudio personal, lecturas, tareas, investigación.
            </p>
          </div>

          <div className="form-group">
            <label>Semanas Totales del Periodo</label>
            <input
              type="number"
              className="input"
              value={hours.totalWeeks}
              onChange={(e) => handleHourChange('totalWeeks', e.target.value)}
            />
          </div>

          {/* Solo aplica cuando la asignatura maneja créditos */}
          {usesCredits && (
            <div className="form-group">
              <label>Horas Totales por Crédito</label>
              <input
                type="number"
                className="input"
                value={hoursPerCredit === '' ? '' : (hoursPerCredit || 48)}
                onChange={(e) => setCourseData({
                  ...courseData,
                  hours: { ...hours, hoursPerCredit: e.target.value === '' ? '' : parseInt(e.target.value) }
                })}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                En Colombia, 1 crédito = 48 horas por periodo. Ajusta este valor según la
                normativa de tu país o institución.
              </p>
            </div>
          )}
        </div>

        <div className="card" style={{ background: 'var(--gold-glow)', border: '1px solid var(--gold-primary)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={16} /> Resumen de Carga Horaria
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(197, 168, 97, 0.2)' }}>
              <span>Total Horas Semanales:</span>
              <span style={{ fontWeight: 'bold' }}>{totalWeekly} h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(197, 168, 97, 0.2)' }}>
              <span>Total Horas del Periodo ({periodType}):</span>
              <span style={{ fontWeight: 'bold' }}>{totalPeriod} h</span>
            </div>

            {usesCredits && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(197, 168, 97, 0.2)' }}>
                <span>Horas por Créditos ({creditsNum} cr. × {hpcNum || 48} h):</span>
                <span style={{ fontWeight: 'bold' }}>{expectedTotal} h</span>
              </div>
            )}

            {usesCredits ? (
              <div style={{
                marginTop: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem',
                background: matches ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.12)',
                color: matches ? 'var(--success)' : '#f59e0b',
                fontSize: '0.8rem'
              }}>
                {matches
                  ? '✓ La distribución horaria coincide con la equivalencia de créditos configurada.'
                  : `ℹ La carga del periodo (${totalPeriod} h) difiere de la equivalencia por créditos (${expectedTotal} h). Verifica la distribución o ajusta las "Horas Totales por Crédito" según tu normativa. Esto no impide continuar.`
                }
              </div>
            ) : (
              <div style={{
                marginTop: '0.5rem', padding: '0.75rem', borderRadius: '0.375rem',
                background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', fontSize: '0.8rem'
              }}>
                ℹ Esta asignatura no maneja créditos. El tiempo total del periodo ({totalPeriod} h)
                será la base para el cronograma y las actividades.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}