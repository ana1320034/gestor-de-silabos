import React from 'react';
import { Sparkles, Loader, BookOpen, User, Hash, GraduationCap, Calendar } from 'lucide-react';
import { useAppContext } from '../../hooks/useApp';

export default function GeneralTab({ courseData, setCourseData, aiSuggestions, isGenerating, onAutoFill }) {
  const { courses, programs } = useAppContext();

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    if (!courseId) return;

    const course = courses.find(c => c.id === courseId);
    if (course) {
      const program = programs.find(p => p.id === course.programId);
      setCourseData({
        ...courseData,
        name: course.name,
        code: course.code,
        credits: course.credits,
        program: program ? program.name : '',
        programId: course.programId ?? '',        // ← NUEVO: guarda el id del programa
        semester: course.semester || 1
      });
    }
  };

  // NUEVO: al elegir un programa del selector se guardan id y nombre juntos
  const handleProgramSelect = (e) => {
    const programId = e.target.value;
    const program = programs.find(p => p.id === programId);
    setCourseData({
      ...courseData,
      programId: programId,
      program: program ? program.name : '',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Información de la Asignatura</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Define los datos básicos y carga información del catálogo institucional.</p>
        </div>
        <button 
          onClick={onAutoFill}
          disabled={isGenerating || !courseData.name}
          className="btn btn-outline"
          style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}
        >
          {isGenerating ? <Loader size={18} className="spin" /> : <Sparkles size={18} />}
          Asistente IA
        </button>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label><BookOpen size={14} /> Seleccionar Asignatura del Catálogo (Opcional)</label>
          <select 
            onChange={handleCourseSelect}
            className="input"
            style={{ background: 'var(--gold-glow)', borderColor: 'var(--gold-primary)' }}
          >
            <option value="">— Seleccionar para precargar datos —</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label><BookOpen size={14} /> Nombre de la Asignatura</label>
          <input 
            type="text" 
            className="input"
            value={courseData.name}
            onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
            placeholder="Ej: Cálculo Integral"
          />
        </div>

        <div className="form-group">
          <label><Hash size={14} /> Código</label>
          <input 
            type="text" 
            className="input"
            value={courseData.code}
            onChange={(e) => setCourseData({ ...courseData, code: e.target.value })}
            placeholder="Ej: MAT-102"
          />
        </div>

        <div className="form-group">
          <label><GraduationCap size={14} /> Programa Académico</label>
          <select
            className="input"
            value={courseData.programId ?? ''}
            onChange={handleProgramSelect}
          >
            <option value="">— Selecciona un programa —</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {/* Si el sílabo es antiguo y solo tiene el nombre escrito, se muestra como referencia */}
          {!courseData.programId && courseData.program && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Este sílabo tenía escrito: "{courseData.program}". Selecciona el programa correcto de la lista.
            </p>
          )}
        </div>

        <div className="form-group">
          <label><User size={14} /> Autor / Docente</label>
          <input 
            type="text" 
            className="input"
            value={courseData.author}
            onChange={(e) => setCourseData({ ...courseData, author: e.target.value })}
            placeholder="Nombre del docente"
          />
        </div>

        <div className="form-group">
          <label><Hash size={14} /> Créditos Académicos</label>
          <input 
            type="number" 
            className="input"
            value={courseData.credits}
            onChange={(e) => setCourseData({ ...courseData, credits: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label><Calendar size={14} /> Semestre / Nivel</label>
          <input 
            type="number" 
            className="input"
            value={courseData.semester}
            onChange={(e) => setCourseData({ ...courseData, semester: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Propósito Formativo</span>
          {aiSuggestions?.propositoFormativo && (
            <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>✨ Sugerencia IA disponible</span>
          )}
        </label>
        <textarea 
          className="input"
          style={{ minHeight: '120px' }}
          value={courseData.purpose}
          onChange={(e) => setCourseData({ ...courseData, purpose: e.target.value })}
          placeholder="Describe el objetivo principal de la asignatura..."
        />
      </div>
    </div>
  );
}