import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Loader, MessageSquare, Send } from 'lucide-react';
import { useAppContext } from '../hooks/useApp';

import GeneralTab from '../components/SyllabusTabs/GeneralTab';
import HoursTab from '../components/SyllabusTabs/HoursTab';
import ArticulationTab from '../components/SyllabusTabs/ArticulationTab';
import MethodologyTab from '../components/SyllabusTabs/MethodologyTab';
import EvaluationTab from '../components/SyllabusTabs/EvaluationTab';
import UnitsTab from '../components/SyllabusTabs/UnitsTab';
import ScheduleTab from '../components/SyllabusTabs/ScheduleTab';
import PreviewTab from '../components/SyllabusTabs/PreviewTab';

import SignatureModal from '../components/SignatureModal';

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

export default function SyllabusReviewPanel() {
  const navigate = useNavigate();
  const { syllabusId } = useParams();
  const { syllabi, loading, updateSyllabusStatus, addFeedback } = useAppContext();

  const [activeTab, setActiveTab] = useState('general');
  const [courseData, setCourseData] = useState(null);
  const [newComment, setNewComment] = useState('');
  
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (syllabusId && syllabi.length > 0) {
      const existing = syllabi.find(s => s.id === syllabusId);
      if (existing) {
        setCourseData(existing);
      } else {
        navigate('/review'); // No encontrado
      }
    }
  }, [syllabusId, syllabi, navigate]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await updateSyllabusStatus(syllabusId, 'Aprobado', courseData.status, 'Sílabo aprobado institucionalmente.');
      setIsSignatureOpen(false);
      navigate('/review');
    } catch (err) {
      console.error(err);
      alert('Error al aprobar el sílabo.');
    }
    setIsProcessing(false);
  };

  const handleReturn = async () => {
    if (!window.confirm('¿Estás seguro de devolver este sílabo para correcciones? El docente será notificado.')) return;
    setIsProcessing(true);
    try {
      await updateSyllabusStatus(syllabusId, 'Devuelto', courseData.status, 'Sílabo devuelto con observaciones.');
      navigate('/review');
    } catch (err) {
      console.error(err);
      alert('Error al devolver el sílabo.');
    }
    setIsProcessing(false);
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addFeedback(syllabusId, activeTab, newComment.trim());
      setNewComment('');
      // Optimistic update
      setCourseData(prev => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          [activeTab]: [...(prev.feedback?.[activeTab] || []), { comment: newComment.trim() }]
        }
      }));
    } catch (err) {
      console.error(err);
      alert('Error al enviar el comentario.');
    }
  };

  if (loading || !courseData) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><Loader className="spin" /> Cargando sílabo para revisión...</div>;
  }

  const currentFeedback = courseData.feedback?.[activeTab] || [];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/review')} className="btn btn-ghost mb-2" style={{ padding: 0, color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} /> Volver a Pendientes
          </button>
          <h1 style={{ fontSize: '1.875rem' }}>Revisión Institucional</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {courseData.name} {courseData.program ? `— ${courseData.program}` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReturn} className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} disabled={isProcessing}>
            <XCircle size={18} /> Devolver al Docente
          </button>
          <button onClick={() => setIsSignatureOpen(true)} className="btn btn-primary" disabled={isProcessing}>
            <CheckCircle size={18} /> Aprobar Sílabo
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Navegación lateral */}
        <div style={{ width: '240px', flexShrink: 0 }}>
          <div className="card" style={{ padding: '0.5rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {TABS.map((tab) => {
                const hasFeedback = courseData.feedback?.[tab.id]?.length > 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`sidebar-nav-link ${activeTab === tab.id ? 'active' : ''}`}
                    style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <span>{tab.label}</span>
                    {hasFeedback && <MessageSquare size={14} style={{ color: 'var(--gold-primary)' }} title="Contiene comentarios" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Área de contenido del Sílabo (Solo Lectura) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="card" style={{ 
            pointerEvents: activeTab !== 'vista-previa' ? 'none' : 'auto', 
            opacity: activeTab !== 'vista-previa' ? 0.8 : 1,
            maxHeight: '70vh',
            overflowY: 'auto'
          }}>
            {activeTab === 'general' && <GeneralTab courseData={courseData} setCourseData={() => {}} />}
            {activeTab === 'horas' && <HoursTab courseData={courseData} setCourseData={() => {}} />}
            {activeTab === 'articulacion' && <ArticulationTab courseData={courseData} setCourseData={() => {}} />}
            {activeTab === 'metodologia' && <MethodologyTab courseData={courseData} setCourseData={() => {}} />}
            {activeTab === 'evaluacion' && <EvaluationTab evaluation={courseData.evaluation || []} onEvaluationChange={() => {}} />}
            {activeTab === 'unidades' && <UnitsTab units={courseData.units || []} onAddUnit={() => {}} onDeleteUnit={() => {}} onToggleUnit={() => {}} onUpdateUnit={() => {}} onGenerateUnitAI={() => {}} onGenerateAllUnits={() => {}} generatingUnitIds={new Set()} isGeneratingAllUnits={false} courseName={courseData.name} />}
            {activeTab === 'cronograma' && <ScheduleTab courseData={courseData} units={courseData.units || []} />}
            {activeTab === 'vista-previa' && <PreviewTab courseData={courseData} units={courseData.units || []} />}
          </div>
        </div>

        {/* Panel lateral derecho: Feedback */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <div className="card" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} />
              Notas de Revisión
            </h3>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Dejando comentarios para la sección: <br/><strong style={{ color: 'var(--text-primary)' }}>{TABS.find(t => t.id === activeTab)?.label}</strong>
            </p>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentFeedback.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2rem' }}>
                  No hay comentarios en esta sección.
                </div>
              ) : (
                currentFeedback.map((fb, idx) => (
                  <div key={idx} style={{ background: 'var(--bg-surface-hover)', padding: '0.75rem', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-primary)' }}>{fb.comment}</p>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <label className="label" style={{ fontSize: '0.75rem' }}>Agregar comentario:</label>
              <textarea
                className="input"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Indique correcciones a realizar..."
                style={{ resize: 'none', marginBottom: '0.5rem' }}
              />
              <button onClick={submitComment} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} disabled={!newComment.trim()}>
                <Send size={16} /> Enviar Nota
              </button>
            </div>
          </div>
        </div>
      </div>

      <SignatureModal 
        isOpen={isSignatureOpen} 
        onClose={() => setIsSignatureOpen(false)} 
        onConfirm={handleApprove} 
        syllabusName={courseData.name}
      />
    </div>
  );
}
