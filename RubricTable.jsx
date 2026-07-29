import React, { memo } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const RubricTable = memo(function RubricTable({ rubric, onChange }) {
  const updateRow = (idx, field, value) => {
    const updated = rubric.map((r, i) => i === idx ? { ...r, [field]: value } : r);
    onChange(updated);
  };

  const addRow = () => {
    onChange([...rubric, { criterion: '', excellent: '', good: '', acceptable: '', insufficient: '' }]);
  };

  const removeRow = (idx) => {
    if (rubric.length <= 1) return;
    onChange(rubric.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ marginTop: '0.75rem' }}>
      <div className="flex justify-between items-center mb-2">
        <label className="label" style={{ margin: 0, color: 'var(--gold-primary)', fontSize: '0.8125rem' }}>
          📋 Rúbrica de Evaluación (Calificación 1-10)
        </label>
        <button className="btn-ai-unit" onClick={addRow} style={{ fontSize: '0.7rem' }}>
          <Plus size={12} /> Añadir Criterio
        </button>
      </div>
      <table className="rubric-table">
        <thead>
          <tr>
            <th>Criterio</th>
            <th className="level-excellent">Excelente (9-10)</th>
            <th className="level-good">Bueno (7-8)</th>
            <th className="level-acceptable">Aceptable (5-6)</th>
            <th className="level-insufficient">Insuficiente (1-4)</th>
            <th style={{ width: '40px', background: 'var(--bg-surface-hover)' }}></th>
          </tr>
        </thead>
        <tbody>
          {rubric.map((row, idx) => (
            <tr key={idx}>
              <td>
                <textarea className="rubric-input criterion-input" value={row.criterion} onChange={(e) => updateRow(idx, 'criterion', e.target.value)} placeholder="Criterio..." />
              </td>
              <td>
                <textarea className="rubric-input" value={row.excellent} onChange={(e) => updateRow(idx, 'excellent', e.target.value)} placeholder="Nivel excelente..." />
              </td>
              <td>
                <textarea className="rubric-input" value={row.good} onChange={(e) => updateRow(idx, 'good', e.target.value)} placeholder="Nivel bueno..." />
              </td>
              <td>
                <textarea className="rubric-input" value={row.acceptable} onChange={(e) => updateRow(idx, 'acceptable', e.target.value)} placeholder="Nivel aceptable..." />
              </td>
              <td>
                <textarea className="rubric-input" value={row.insufficient} onChange={(e) => updateRow(idx, 'insufficient', e.target.value)} placeholder="Nivel insuficiente..." />
              </td>
              <td>
                <div className="rubric-actions">
                  <button onClick={() => removeRow(idx)} className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--danger)' }} disabled={rubric.length <= 1}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default RubricTable;
