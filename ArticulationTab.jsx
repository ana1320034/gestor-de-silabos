import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function ArticulationTab({ courseData, setCourseData, aiSuggestions }) {
  // Competencias: se leen del sílabo (persisten); si no hay, se sugiere usar la IA
  const competencias = courseData.competencias ?? [];

  return (
    <div className="fade-in">
      <h3 className="mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        Articulación Curricular
      </h3>

      {/* Competencias */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div className="flex justify-between items-center mb-2">
          <label className="label" style={{ margin: 0 }}>Competencias del Programa</label>
          {competencias.length > 0 && <span className="badge badge-gold"><Sparkles size={12} style={{ marginRight: '4px' }} /> Sugerido por IA</span>}
        </div>
        <div style={{ background: 'var(--bg-surface-hover)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          {competencias.length > 0
            ? competencias.map((comp, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <CheckCircle size={16} className="text-gold" style={{ marginTop: '4px', color: 'var(--gold-primary)', flexShrink: 0 }} />
                <p style={{ fontSize: '0.875rem', margin: 0 }}>{comp}</p>
              </div>
            ))
            : <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Usa el botón <strong>"Asistente IA"</strong> en la pestaña General para generar competencias alineadas al curso.
              </p>
          }
        </div>
      </div>

      {/* RAA */}
      <div>
        <label className="label">Resultados de Aprendizaje de la Asignatura (RAA)</label>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Redacte los resultados específicos que aportarán al cumplimiento del RAP superior. Use verbos de acción según la Taxonomía de Bloom.
        </p>
        <textarea
          className="input"
          rows="5"
          value={courseData.raa || ''}
          onChange={(e) => setCourseData({ ...courseData, raa: e.target.value })}
          placeholder={`Ej:\n• El estudiante diseña diagramas de componentes UML...\n• El estudiante implementa patrones de diseño...`}
        />
      </div>
    </div>
  );
}