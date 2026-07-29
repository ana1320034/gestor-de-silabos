import React from 'react';
import { Sparkles, Plus } from 'lucide-react';

const BASE_METHODOLOGIES = [
  'Aprendizaje Basado en Proyectos (ABPr)',
  'Estudio de Casos',
  'Clase Invertida (Flipped Classroom)',
  'Aprendizaje Basado en Problemas (ABP)',
  'Aprendizaje Colaborativo',
  'Gamificación Educativa'
];

export default function MethodologyTab({
  courseData, setCourseData, aiSuggestions
}) {
  const [customMethodologies, setCustomMethodologies] = React.useState([]);
  const [newMethodology, setNewMethodology] = React.useState('');

  const handleAddCustom = () => {
    if (newMethodology.trim()) {
      setCustomMethodologies(prev => [...prev, newMethodology.trim()]);
      setNewMethodology('');
    }
  };

  const allMethodologies = [...BASE_METHODOLOGIES, ...customMethodologies];

  return (
    <div className="fade-in">
      <h3 className="mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Enfoque Metodológico
      </h3>

      {/* Selector de Metodologías */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex justify-between items-center mb-3">
          <label className="label" style={{ margin: 0 }}>Metodologías Activas</label>
          {aiSuggestions && (
            <span className="badge badge-gold"><Sparkles size={12} style={{ marginRight: '4px' }} /> IA resaltó las recomendadas</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {allMethodologies.map((method, idx) => {
            const isAiSuggested = aiSuggestions?.metodologiasSugeridas?.includes(method);
            return (
              <label
                key={idx}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem',
                  background: isAiSuggested ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-surface-hover)',
                  borderRadius: '0.375rem',
                  border: isAiSuggested ? '1px solid var(--gold-primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  defaultChecked={isAiSuggested || idx === 0}
                  style={{ accentColor: 'var(--gold-primary)' }}
                />
                <span style={{ fontSize: '0.875rem' }}>{method}</span>
                {isAiSuggested && <Sparkles size={12} style={{ color: 'var(--gold-primary)', marginLeft: 'auto' }} />}
              </label>
            );
          })}
        </div>

        {/* Añadir metodología personalizada */}
        <div className="flex gap-2 items-end">
          <div style={{ flex: 1 }}>
            <label className="label" style={{ fontSize: '0.75rem' }}>Añadir otra metodología</label>
            <input
              type="text"
              className="input"
              placeholder="Ej: Aprendizaje Basado en Competencias"
              value={newMethodology}
              onChange={(e) => setNewMethodology(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
            />
          </div>
          <button className="btn btn-outline" onClick={handleAddCustom} style={{ padding: '0.5rem 1rem' }}>
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Descripción de la Estrategia Didáctica */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="label" style={{ margin: 0 }}>Descripción de la Estrategia Didáctica</label>
          {aiSuggestions?.descripcionEstrategia && (
            <span className="badge badge-gold"><Sparkles size={12} style={{ marginRight: '4px' }} /> Sugerido por IA</span>
          )}
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Explique cómo se aplicarán las metodologías seleccionadas durante el desarrollo del curso.
        </p>
        <textarea
          className="input"
          rows="5"
          value={aiSuggestions?.descripcionEstrategia || courseData.strategyDesc || ''}
          onChange={(e) => setCourseData({ ...courseData, strategyDesc: e.target.value })}
          placeholder="Durante el semestre, los estudiantes desarrollarán un proyecto integrador que atraviesa todas las unidades..."
        />
      </div>
    </div>
  );
}
