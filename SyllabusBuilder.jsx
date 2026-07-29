import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowRight, CheckCircle, Clock, AlertCircle, Loader, FileText } from 'lucide-react';
import { useAppContext } from '../hooks/useApp';
import { aiService } from '../services/aiService';

import GeneralTab from '../components/SyllabusTabs/GeneralTab';
import HoursTab from '../components/SyllabusTabs/HoursTab';
import ArticulationTab from '../components/SyllabusTabs/ArticulationTab';
import MethodologyTab from '../components/SyllabusTabs/MethodologyTab';
import EvaluationTab from '../components/SyllabusTabs/EvaluationTab';
import UnitsTab from '../components/SyllabusTabs/UnitsTab';
import ScheduleTab from '../components/SyllabusTabs/ScheduleTab';
import PreviewTab from '../components/SyllabusTabs/PreviewTab';

// ── Utilidades ──────────────────────────────────────────────────────────────
const createEmptyUnit = (index) => ({
  id: Date.now() + Math.random(),
  name: `Unidad ${index}`,
  duration: '',
  expanded: true,
  learningOutcome: '',
  contents: '',
  teacherActivities: '',
  independentActivities: '',
  evidence: '',
  evaluationType: 'Rúbrica',
  rubric: [{ criterion: '', excellent: '', good: '', acceptable: '', insufficient: '' }],
  aiGenerated: false
});

const TABS = [
  { id: 'general',      label: '1. Información General' },
  { id: 'horas',        label: '2. Horas por Modalidad' },
  { id: 'articulacion', label: '3. Articulación Curricular' },
  { id: 'unidades',     label: '4. Unidades Temáticas' },
  { id: 'metodologia',  label: '5. Enfoque Metodológico' },
  { id: 'evaluacion',   label: '6. Sistema de Evaluación' },
  { id: 'cronograma',   label: '7. Cronograma Semanal' },
  { id: 'vista-previa', label: '8. Vista Previa' },
];

// ── Componente Principal ─────────────────────────────────────────────────────
export default function SyllabusBuilder() {
  const navigate = useNavigate();
  const { syllabusId } = useParams();
  const { addSyllabus, saveSyllabusDraft, syllabi, loading } = useAppContext();

  // ── Estado central del sílabo ──────────────────────────────────────────────
  const [activeTab, setActiveTab]   = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiError, setAiError]       = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | error
  const [draftId, setDraftId]       = useState(syllabusId || null);

  const [courseData, setCourseData] = useState({
    name: '',
    code: '',
    program: '',
    author: '',
    credits: 3,
    semester: 1,
    modality: 'Presencial',
    purpose: '',
    raa: '',
    strategyDesc: '',
    methodologies: [],
    hours: {
      directTeaching: 0,
      independent: 0,
      totalWeeks: 16
    },
    evaluation: [
      { id: 1, moment: 'Primer Corte', evidence: '', instrument: 'Rúbrica de Evaluación', weight: 30, type: 'Sumativa' },
      { id: 2, moment: 'Segundo Corte', evidence: '', instrument: 'Rúbrica de Evaluación', weight: 30, type: 'Sumativa' },
      { id: 3, moment: 'Corte Final', evidence: '', instrument: 'Rúbrica de Evaluación', weight: 40, type: 'Sumativa' },
    ]
  });

  const [units, setUnits] = useState([createEmptyUnit(1)]);
  const [generatingUnitIds, setGeneratingUnitIds] = useState(new Set());
  const [isGeneratingAllUnits, setIsGeneratingAllUnits] = useState(false);

  // ── Carga de datos existentes ──────────────────────────────────────────────
  useEffect(() => {
    if (syllabusId && syllabi.length > 0) {
      const existing = syllabi.find(s => s.id === syllabusId);
      if (existing) {
        setCourseData({
          ...existing,
          hours: existing.hours || courseData.hours,
          evaluation: existing.evaluation || courseData.evaluation
        });
        if (existing.units) setUnits(existing.units);
      }
    }
  }, [syllabusId, syllabi]);

  // ── Auto-guardado con debounce ─────────────────────────────────────────────
  const debounceRef = useRef(null);

  const triggerAutoSave = useCallback((data, currentUnits, id) => {
    clearTimeout(debounceRef.current);
    setSaveStatus('saving');
    debounceRef.current = setTimeout(async () => {
      try {
        const payload = {
          ...data,
          units: currentUnits,
          status: data.status || 'Borrador',
        };
        const savedId = await saveSyllabusDraft(payload, id);
        if (!id) setDraftId(savedId);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (err) {
        console.error('Auto-guardado falló:', err);
        setSaveStatus('error');
      }
    }, 3000);
  }, [saveSyllabusDraft]);

const handleCourseDataChange = useCallback((newData) => {
    setCourseData(newData);
    // Solo se guarda cuando hay nombre Y programa elegido
    if (newData.name && newData.programId) triggerAutoSave(newData, units, draftId);
  }, [triggerAutoSave, units, draftId]);

  const handleUnitsChange = useCallback((newUnits) => {
    setUnits(newUnits);
    if (courseData.name && courseData.programId) triggerAutoSave(courseData, newUnits, draftId);
  }, [triggerAutoSave, courseData, draftId]);

  // ── Acción IA Global ───────────────────────────────────────────────────────
  const handleAutoFill = async () => {
    if (!courseData.name.trim()) {
      alert('Por favor, escribe primero el nombre de la asignatura.');
      return;
    }
    setIsGenerating(true);
    setAiError(null);
    try {
      const suggestions = await aiService.generateSyllabusSuggestions(courseData.name);
      setAiSuggestions(suggestions);
      handleCourseDataChange({
        ...courseData,
        purpose: suggestions.propositoFormativo || courseData.purpose,
        strategyDesc: suggestions.descripcionEstrategia || courseData.strategyDesc,
        raa: suggestions.resultadosAprendizaje?.join('\n\n') || courseData.raa,
        competencias: suggestions.competencias || courseData.competencias || [],
      });
    } catch (err) {
      setAiError(`Error IA: ${err.message}`);
    }
    setIsGenerating(false);
  };

  // ── Handlers de Unidades ──────────────────────────────────────────────────
  const addUnit = useCallback(
    () => handleUnitsChange([...units, createEmptyUnit(units.length + 1)]),
    [handleUnitsChange, units]
  );

  const toggleUnit = useCallback(
    (id) => handleUnitsChange(units.map(u => u.id === id ? { ...u, expanded: !u.expanded } : u)),
    [handleUnitsChange, units]
  );

  const deleteUnit = useCallback(
    (id) => handleUnitsChange(units.filter(u => u.id !== id)),
    [handleUnitsChange, units]
  );

  const updateUnit = useCallback(
    (id, field, value) => handleUnitsChange(units.map(u => u.id === id ? { ...u, [field]: value } : u)),
    [handleUnitsChange, units]
  );

  const handleGenerateUnitAI = useCallback(async (unitId) => {
    const unit = units.find(u => u.id === unitId);
    if (!unit?.name.trim()) return;
    setGeneratingUnitIds(prev => new Set(prev).add(unitId));
    try {
      const details = await aiService.generateUnitDetails(courseData.name, unit.name);
      handleUnitsChange(units.map(u => u.id === unitId ? { ...u, ...details, aiGenerated: true, expanded: true } : u));
    } catch (err) {
      setAiError(`Error generando unidad: ${err.message}`);
    }
    setGeneratingUnitIds(prev => { const s = new Set(prev); s.delete(unitId); return s; });
  }, [units, courseData.name, handleUnitsChange]);

  const handleGenerateAllUnits = useCallback(async () => {
    setIsGeneratingAllUnits(true);
    try {
      const result = await aiService.generateAllUnits(courseData.name);
      if (result?.units?.length) {
        const newUnits = result.units.map((u, i) => ({
          id: Date.now() + i,
          expanded: i === 0,
          aiGenerated: true,
          ...u,
          rubric: u.rubric || [{ criterion: '', excellent: '', good: '', acceptable: '', insufficient: '' }]
        }));
        handleUnitsChange(newUnits);
      }
    } catch (err) {
      setAiError(`Error generando unidades: ${err.message}`);
    }
    setIsGeneratingAllUnits(false);
  }, [courseData.name, handleUnitsChange]);

  // ── Enviar a Revisión ─────────────────────────────────────────────────────
  const validateSyllabus = () => {
    // 1. General
    if (!courseData.name?.trim()) return { valid: false, tab: 'general', msg: 'El nombre de la asignatura es obligatorio.' };
    if (!courseData.program?.trim()) return { valid: false, tab: 'general', msg: 'El programa académico es obligatorio.' };
    if (!courseData.author?.trim()) return { valid: false, tab: 'general', msg: 'El docente autor es obligatorio.' };
    if (!courseData.credits) return { valid: false, tab: 'general', msg: 'Los créditos son obligatorios.' };
    
    // 2. Articulation
    if (!courseData.purpose?.trim()) return { valid: false, tab: 'articulacion', msg: 'El propósito formativo es obligatorio.' };
    if (!courseData.raa?.trim()) return { valid: false, tab: 'articulacion', msg: 'Los Resultados de Aprendizaje (RAA) son obligatorios.' };

    // 3. Methodology
    if (!courseData.strategyDesc?.trim()) return { valid: false, tab: 'metodologia', msg: 'El enfoque metodológico es obligatorio.' };

    // 4. Units
    if (!units || units.length === 0) return { valid: false, tab: 'unidades', msg: 'Debe agregar al menos una unidad temática.' };
    for (let i = 0; i < units.length; i++) {
      if (!units[i].name?.trim()) return { valid: false, tab: 'unidades', msg: `La unidad ${i + 1} requiere un título.` };
      if (!units[i].contents?.trim()) return { valid: false, tab: 'unidades', msg: `La unidad ${i + 1} requiere contenidos.` };
    }

    // 5. Evaluation
    const evalData = courseData.evaluation || [];
    if (evalData.length === 0) return { valid: false, tab: 'evaluacion', msg: 'Debe configurar al menos un corte de evaluación.' };
    const totalWeight = evalData.reduce((sum, e) => sum + (parseInt(e.weight) || 0), 0);
    if (totalWeight !== 100) return { valid: false, tab: 'evaluacion', msg: `La suma de ponderaciones debe ser 100%. Actualmente es ${totalWeight}%.` };

    // 6. Schedule
    const scheduleData = courseData.schedule || [];
    if (scheduleData.length === 0) return { valid: false, tab: 'cronograma', msg: 'Debe generar el cronograma semanal.' };

    return { valid: true };
  };

  const handleSubmit = async () => {
    const validation = validateSyllabus();
    if (!validation.valid) {
      alert(`Falta información en la pestaña "${validation.tab}":\n\n${validation.msg}`);
      setActiveTab(validation.tab);
      return;
    }

    try {
      const payload = {
        ...courseData,
        units,
        status: 'En Revisión',
      };
      await saveSyllabusDraft(payload, draftId);
      alert('✅ Sílabo enviado a revisión correctamente.');
      navigate('/');
    } catch (err) {
      alert('Error al enviar a revisión. Intenta de nuevo.');
    }
  };

  const isReadOnly = ['En Revisión', 'Aprobado'].includes(courseData.status);

  if (loading && syllabusId) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader className="spin" /> Cargando sílabo...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div>
          <h1 style={{ fontSize: '1.875rem' }}>Constructor de Sílabos</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {courseData.name || 'Nueva Asignatura'} {courseData.program ? `— ${courseData.program}` : ''}
            </p>
            {saveStatus === 'saving' && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Loader size={12} className="spin" /> Guardando...</span>}
            {saveStatus === 'saved' && <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={12} /> Guardado</span>}
          </div>
        </div>
        <div className="flex gap-2">
          {!isReadOnly && (
            <button onClick={handleSubmit} className="btn btn-primary">
              Enviar a Revisión <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Alertas de Estado */}
      {isReadOnly && (
        <div className="card mb-4" style={{ background: 'rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)', border: '1px solid var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> Este sílabo está en estado <strong>{courseData.status}</strong> y es de sólo lectura.
        </div>
      )}

      {courseData.status === 'Devuelto' && courseData.feedback && Object.keys(courseData.feedback).length > 0 && (
        <div className="card mb-4" style={{ background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> <strong>Sílabo Devuelto:</strong> Revisa las pestañas marcadas para ver el feedback y realizar las correcciones.
        </div>
      )}

      {aiError && (
        <div className="card mb-4" style={{ borderColor: 'var(--danger)', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)' }}>
          {aiError}
        </div>
      )}

      <div className="flex gap-6">
        {/* Navegación lateral */}
        <div style={{ width: '240px', flexShrink: 0 }} className="no-print">
          <div className="card" style={{ padding: '0.5rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {TABS.map((tab) => {
                const hasFeedback = courseData.status === 'Devuelto' && courseData.feedback?.[tab.id]?.length > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`sidebar-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <span>{tab.label}</span>
                    {hasFeedback && <AlertCircle size={14} style={{ color: 'var(--danger)' }} title="Hay correcciones solicitadas" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Área de contenido */}
        <div style={{ flex: 1 }}>
          {/* Banner de Feedback Específico de Pestaña */}
          {courseData.status === 'Devuelto' && courseData.feedback?.[activeTab]?.length > 0 && (
            <div className="card mb-4" style={{ background: 'var(--bg-surface)', borderLeft: '4px solid var(--danger)' }}>
              <h4 style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Feedback del Revisor para esta sección:</h4>
              <ul style={{ fontSize: '0.875rem', paddingLeft: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
                {courseData.feedback[activeTab].map((fb, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{fb.comment}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card" style={{ 
            pointerEvents: (isReadOnly && activeTab !== 'vista-previa') ? 'none' : 'auto', 
            opacity: (isReadOnly && activeTab !== 'vista-previa') ? 0.7 : 1 
          }}>
            {activeTab === 'general' && (
              <GeneralTab
                courseData={courseData}
                setCourseData={handleCourseDataChange}
                aiSuggestions={aiSuggestions}
                isGenerating={isGenerating}
                onAutoFill={handleAutoFill}
              />
            )}
            {activeTab === 'horas' && (
              <HoursTab
                courseData={courseData}
                setCourseData={handleCourseDataChange}
              />
            )}
            {activeTab === 'articulacion' && (
              <ArticulationTab
                courseData={courseData}
                setCourseData={handleCourseDataChange}
                aiSuggestions={aiSuggestions}
              />
            )}
            {activeTab === 'metodologia' && (
              <MethodologyTab
                courseData={courseData}
                setCourseData={handleCourseDataChange}
                aiSuggestions={aiSuggestions}
              />
            )}
            {activeTab === 'evaluacion' && (
              <EvaluationTab
                evaluation={courseData.evaluation}
                onEvaluationChange={(newEval) => handleCourseDataChange({ ...courseData, evaluation: newEval })}
              />
            )}
            {activeTab === 'unidades' && (
              <UnitsTab
                units={units}
                onAddUnit={addUnit}
                onDeleteUnit={deleteUnit}
                onToggleUnit={toggleUnit}
                onUpdateUnit={updateUnit}
                onGenerateUnitAI={handleGenerateUnitAI}
                onGenerateAllUnits={handleGenerateAllUnits}
                generatingUnitIds={generatingUnitIds}
                isGeneratingAllUnits={isGeneratingAllUnits}
                courseName={courseData.name}
              />
            )}
            {activeTab === 'cronograma' && (
              <ScheduleTab
                courseData={courseData}
                setCourseData={setCourseData}
                units={units}
              />
            )}
            {activeTab === 'vista-previa' && (
              <PreviewTab
                courseData={courseData}
                units={units}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
