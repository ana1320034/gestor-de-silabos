import React, { memo } from 'react';
import { Sparkles, Trash2, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import RubricTable from './RubricTable';

const DEFAULT_RUBRIC_ROW = { criterion: '', excellent: '', good: '', acceptable: '', insufficient: '' };

const UnitCard = memo(({ unit, onUpdate, onDelete, onToggle, onGenerateAI, isGenerating }) => {
  const update = (field, value) => onUpdate(unit.id, field, value);


  return (
    <div className={`${unit.aiGenerated ? 'ai-generated-border' : ''}`} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-surface-hover)', cursor: 'pointer' }}>
        <div className="flex items-center gap-2" style={{ flex: 1 }} onClick={() => onToggle(unit.id)}>
          {unit.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <input
            type="text"
            className="unit-name-input"
            value={unit.name}
            onChange={(e) => update('name', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Nombre de la unidad..."
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input"
            value={unit.duration}
            onChange={(e) => update('duration', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Duración"
            style={{ width: '110px', fontSize: '0.75rem', padding: '0.25rem 0.5rem', textAlign: 'center' }}
          />
          <button className="btn-ai-unit" onClick={(e) => { e.stopPropagation(); onGenerateAI(unit.id); }} disabled={isGenerating || !unit.name.trim()}>
            {isGenerating ? <Loader size={12} className="spin" /> : <Sparkles size={12} />}
            IA
          </button>
          {unit.aiGenerated && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}><Sparkles size={10} /> IA</span>}
          <button onClick={(e) => { e.stopPropagation(); onDelete(unit.id); }} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      {unit.expanded && (
        <div className={`fade-in ${isGenerating ? 'ai-loading-overlay' : ''}`} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* 1. Resultado de Aprendizaje */}
          <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--gold-primary)' }}>
            <label className="label" style={{ color: 'var(--gold-primary)' }}>1. ¿Qué logrará el estudiante? (Resultado de Aprendizaje)</label>
            <textarea className="input" rows="2" value={unit.learningOutcome} onChange={(e) => update('learningOutcome', e.target.value)} placeholder="Ej: Identifica los componentes principales de un sistema..." />
          </div>

          {/* 2. Contenidos */}
          <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--text-secondary)' }}>
            <label className="label">2. ¿Qué temas se deben tratar? (Contenidos)</label>
            <textarea className="input" rows="2" value={unit.contents} onChange={(e) => update('contents', e.target.value)} placeholder="Ej: Conceptos de arquitectura, patrones de diseño..." />
          </div>

          {/* 3. Actividades */}
          <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--text-secondary)' }}>
            <label className="label">3. ¿Qué hará el estudiante? (Actividades)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label className="label" style={{ fontSize: '0.7rem', opacity: 0.7 }}>Trabajo con Docente</label>
                <textarea className="input" rows="2" value={unit.teacherActivities} onChange={(e) => update('teacherActivities', e.target.value)} placeholder="Clase magistral, talleres..." />
              </div>
              <div>
                <label className="label" style={{ fontSize: '0.7rem', opacity: 0.7 }}>Trabajo Independiente</label>
                <textarea className="input" rows="2" value={unit.independentActivities} onChange={(e) => update('independentActivities', e.target.value)} placeholder="Lecturas, ejercicios prácticos..." />
              </div>
            </div>
          </div>

          {/* 4. Evaluación */}
          <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--success)' }}>
            <label className="label" style={{ color: 'var(--success)' }}>4. ¿Cómo evidenciará su aprendizaje? (Evaluación)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <input type="text" className="input" value={unit.evidence} onChange={(e) => update('evidence', e.target.value)} placeholder="Evidencia (Ej: Taller práctico)" />
              <select className="input" value={unit.evaluationType} onChange={(e) => {
                update('evaluationType', e.target.value);
                if (e.target.value === 'Rúbrica' && (!unit.rubric || unit.rubric.length === 0)) {
                  update('rubric', [{ ...DEFAULT_RUBRIC_ROW }]);
                }
              }}>
                <option>Rúbrica</option>
                <option>Lista de Chequeo</option>
                <option>Quiz</option>
                <option>Prueba Escrita</option>
                <option>Exposición Oral</option>
              </select>
            </div>

            {/* Rubric Table (conditional) */}
            {unit.evaluationType === 'Rúbrica' && (
              <RubricTable
                rubric={unit.rubric || [{ ...DEFAULT_RUBRIC_ROW }]}
                onChange={(newRubric) => update('rubric', newRubric)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default UnitCard;
