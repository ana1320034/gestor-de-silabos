import React from 'react';
import { Plus, Trash2, Percent, Target, FileText, AlertCircle } from 'lucide-react';

export default function EvaluationTab({ evaluation, onEvaluationChange }) {
  const addEvaluation = () => {
    const nextId = evaluation.length > 0 ? Math.max(...evaluation.map(e => e.id)) + 1 : 1;
    onEvaluationChange([
      ...evaluation,
      { id: nextId, moment: '', evidence: '', instrument: '', weight: 0, type: 'Sumativa' }
    ]);
  };

  const updateEvaluation = (id, field, value) => {
    onEvaluationChange(
      evaluation.map(e => e.id === id ? { ...e, [field]: value } : e)
    );
  };

  const removeEvaluation = (id) => {
    if (evaluation.length <= 1) return;
    onEvaluationChange(evaluation.filter(e => e.id !== id));
  };

  const totalWeight = evaluation.reduce((acc, curr) => acc + (parseInt(curr.weight) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Sistema de Evaluación</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Define los cortes evaluativos, evidencias e instrumentos.</p>
        </div>
        <button onClick={addEvaluation} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
          <Plus size={14} /> Añadir Corte
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.5rem', fontWeight: 500 }}>Corte / Momento</th>
            <th style={{ padding: '0.5rem', fontWeight: 500 }}>Evidencia Solicitada</th>
            <th style={{ padding: '0.5rem', fontWeight: 500 }}>Instrumento</th>
            <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'center' }}>%</th>
            <th style={{ padding: '0.5rem', fontWeight: 500, textAlign: 'center' }}>—</th>
          </tr>
        </thead>
        <tbody>
          {evaluation.map((evalItem) => (
            <tr key={evalItem.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={evalItem.moment}
                  onChange={(e) => updateEvaluation(evalItem.id, 'moment', e.target.value)}
                />
              </td>
              <td style={{ padding: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  value={evalItem.evidence}
                  onChange={(e) => updateEvaluation(evalItem.id, 'evidence', e.target.value)}
                />
              </td>
              <td style={{ padding: '0.5rem' }}>
                <select className="input" value={evalItem.instrument} onChange={(e) => updateEvaluation(evalItem.id, 'instrument', e.target.value)}>
                  <option>Rúbrica de Evaluación</option>
                  <option>Lista de Chequeo</option>
                  <option>Prueba Escrita</option>
                  <option>Exposición Oral</option>
                  <option>Portafolio</option>
                </select>
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                <div className="flex items-center gap-1" style={{ justifyContent: 'center' }}>
                  <input
                    type="number"
                    className="input"
                    value={evalItem.weight}
                    onChange={(e) => updateEvaluation(evalItem.id, 'weight', e.target.value)}
                    style={{ width: '70px', textAlign: 'center' }}
                    min="0" max="100"
                  />
                  <span>%</span>
                </div>
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => removeEvaluation(evalItem.id)}
                  style={{ padding: '0.25rem', color: 'var(--danger)' }}
                  title="Eliminar corte"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 600 }}>Total:</td>
            <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontWeight: 700, color: totalWeight === 100 ? 'var(--success)' : 'var(--danger)' }}>
              {totalWeight}%
            </td>
            <td />
          </tr>
        </tfoot>
      </table>

      {totalWeight !== 100 && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid var(--danger)', borderRadius: '0.5rem', fontSize: '0.875rem', color: 'var(--danger)' }}>
          ⚠ La suma de ponderaciones debe ser exactamente 100%. Actualmente es {totalWeight}%.
        </div>
      )}
    </div>
  );
}
