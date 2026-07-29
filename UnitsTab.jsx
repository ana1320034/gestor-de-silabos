import React from 'react';
import { Sparkles, Plus, BookOpen, Loader } from 'lucide-react';
import UnitCard from '../UnitCard';

export default function UnitsTab({
  units, onAddUnit, onDeleteUnit, onToggleUnit, onUpdateUnit,
  onGenerateUnitAI, onGenerateAllUnits,
  generatingUnitIds, isGeneratingAllUnits, courseName
}) {
  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0 }}>Unidades Temáticas (Alineación Pedagógica)</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Cada contenido debe tener una actividad y una evidencia de evaluación asociada.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={onGenerateAllUnits}
            disabled={isGeneratingAllUnits}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            {isGeneratingAllUnits ? <Loader size={16} className="spin" /> : <Sparkles size={16} />}
            Generar Todo con IA
          </button>
          <button
            className="btn btn-primary"
            onClick={onAddUnit}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <Plus size={16} /> Nueva Unidad
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onUpdate={onUpdateUnit}
            onDelete={onDeleteUnit}
            onToggle={onToggleUnit}
            onGenerateAI={onGenerateUnitAI}
            isGenerating={generatingUnitIds.has(unit.id)}
          />
        ))}
      </div>

      {units.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No hay unidades temáticas. Añade una manualmente o presiona <strong>"Generar Todo con IA"</strong>.</p>
        </div>
      )}
    </div>
  );
}
