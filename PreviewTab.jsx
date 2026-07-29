import React from 'react';
import { FileText, Download, Printer, Eye } from 'lucide-react';

export default function PreviewTab({ courseData, units }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Vista Previa</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Visualiza cómo se verá el documento oficial final.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handlePrint} className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
            <Printer size={16} /> Descargar PDF Oficial
          </button>
          <button className="btn btn-outline" style={{ fontSize: '0.8rem', opacity: 0.5, cursor: 'not-allowed' }} title="Disponible post-MVP">
            <Download size={16} /> Word (Próximamente)
          </button>
        </div>
      </div>

      <div className="preview-document-container" style={{ 
        background: '#f3f4f6', 
        padding: '2rem', 
        borderRadius: '0.5rem',
        display: 'flex',
        justifyContent: 'center',
        maxHeight: '800px',
        overflowY: 'auto'
      }}>
        <div className="preview-document" style={{
          backgroundColor: '#fff', color: '#000', padding: '3rem 4rem',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)', fontFamily: 'Arial, sans-serif',
          minHeight: '1056px', fontSize: '14px', width: '100%', maxWidth: '800px'
        }}>
          {/* Encabezado */}
          <div style={{ borderBottom: '3px solid #000', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ color: '#000', fontSize: '22px', margin: 0 }}>SÍLABO INSTITUCIONAL</h1>
              <p style={{ margin: '0.25rem 0 0', fontSize: '12px', color: '#666' }}>
                Generado: {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ width: '64px', height: '64px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '11px', color: '#555' }}>
              LOGO INST.
            </div>
          </div>

          {/* Sección 1 */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>1. INFORMACIÓN GENERAL</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
            <tbody>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', width: '30%', fontWeight: 'bold' }}>Asignatura</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.name}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Código</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.code}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Programa Académico</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.program}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Docente Autor</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.author}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Créditos Académicos</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.credits}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Modalidad</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.modality}</td></tr>
              <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold' }}>Estado</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{courseData.status}</td></tr>
            </tbody>
          </table>

          {/* Sección 2 */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>2. PROPÓSITO FORMATIVO</h2>
          <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem' }}>{courseData.purpose || 'No definido.'}</p>

          {/* Sección 3 */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>3. ARTICULACIÓN CURRICULAR</h2>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Resultados de Aprendizaje de la Asignatura (RAA):</p>
          <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem', whiteSpace: 'pre-line' }}>{courseData.raa || 'No definidos.'}</p>

          {/* Sección 4 */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>4. ENFOQUE METODOLÓGICO</h2>
          <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem' }}>{courseData.strategyDesc || 'No definido.'}</p>

          {/* Sección 5 — Unidades */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>5. UNIDADES TEMÁTICAS</h2>
          {units.length === 0 && <p style={{ color: '#888' }}>No se registraron unidades temáticas.</p>}
          {units.map((u, i) => (
            <div key={u.id || i} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '14px', background: '#f0f0f0', padding: '6px 10px', border: '1px solid #ccc', margin: '0 0 0.5rem', display: 'flex', justifyContent: 'space-between', color: '#000' }}>
                <span>{u.name || `Unidad ${i + 1}`}</span>
                {u.duration && <span style={{ fontWeight: 400, fontSize: '12px', color: '#555' }}>⏱ {u.duration}</span>}
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
                <tbody>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', width: '30%', fontWeight: 'bold', background: '#fafafa' }}>Resultado de Aprendizaje</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{u.learningOutcome}</td></tr>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold', background: '#fafafa' }}>Contenidos</td><td style={{ border: '1px solid #aaa', padding: '6px 8px', whiteSpace: 'pre-line' }}>{u.contents}</td></tr>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold', background: '#fafafa' }}>Actividades con Docente</td><td style={{ border: '1px solid #aaa', padding: '6px 8px', whiteSpace: 'pre-line' }}>{u.teacherActivities}</td></tr>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold', background: '#fafafa' }}>Trabajo Independiente</td><td style={{ border: '1px solid #aaa', padding: '6px 8px', whiteSpace: 'pre-line' }}>{u.independentActivities}</td></tr>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold', background: '#fafafa' }}>Evidencia de Aprendizaje</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{u.evidence}</td></tr>
                  <tr><td style={{ border: '1px solid #aaa', padding: '6px 8px', fontWeight: 'bold', background: '#fafafa' }}>Instrumento de Evaluación</td><td style={{ border: '1px solid #aaa', padding: '6px 8px' }}>{u.evaluationType}</td></tr>
                </tbody>
              </table>
              {u.evaluationType === 'Rúbrica' && u.rubric?.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 0.5rem 0' }}>Rúbrica de Evaluación:</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #aaa', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ border: '1px solid #aaa', padding: '6px' }}>Criterio</th>
                        <th style={{ border: '1px solid #aaa', padding: '6px' }}>Excelente (9-10)</th>
                        <th style={{ border: '1px solid #aaa', padding: '6px' }}>Bueno (7-8)</th>
                        <th style={{ border: '1px solid #aaa', padding: '6px' }}>Aceptable (5-6)</th>
                        <th style={{ border: '1px solid #aaa', padding: '6px' }}>Insuficiente (1-4)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.rubric.map((r, idx) => (
                        <tr key={idx}>
                          <td style={{ border: '1px solid #aaa', padding: '6px', fontWeight: 'bold' }}>{r.criterion}</td>
                          <td style={{ border: '1px solid #aaa', padding: '6px' }}>{r.excellent}</td>
                          <td style={{ border: '1px solid #aaa', padding: '6px' }}>{r.good}</td>
                          <td style={{ border: '1px solid #aaa', padding: '6px' }}>{r.acceptable}</td>
                          <td style={{ border: '1px solid #aaa', padding: '6px' }}>{r.insufficient}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Sección 6 — Evaluación */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>6. SISTEMA DE EVALUACIÓN</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '13px', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0', color: '#000' }}>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Corte</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Evidencia</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Instrumento</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {(courseData.evaluation || []).map((e, idx) => (
                <tr key={e.id || idx}>
                  <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{e.moment}</td>
                  <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{e.evidence}</td>
                  <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{e.instrument}</td>
                  <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center' }}>{e.weight}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Sección 7 — Cronograma */}
          <h2 style={{ fontSize: '15px', background: '#e8e8e8', padding: '6px 8px', border: '1px solid #bbb', marginTop: '24px', marginBottom: '16px' }}>7. CRONOGRAMA SEMANAL</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '13px', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0', color: '#000' }}>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Semana</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Unidad</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Temas / Contenidos</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Actividad Docente</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Trabajo Autónomo</th>
                <th style={{ border: '1px solid #000', padding: '0.5rem' }}>Evidencia</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                if (courseData.schedule && courseData.schedule.length > 0) {
                  return courseData.schedule.map((item) => (
                    <tr key={item.week}>
                      <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{item.week}</td>
                      <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{item.unitName}</td>
                      <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{item.contents}</td>
                      <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{item.teacherActivity}</td>
                      <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{item.independentActivity}</td>
                      <td style={{ border: '1px solid #000', padding: '0.5rem', fontStyle: 'italic', color: '#444' }}>{item.evidence}</td>
                    </tr>
                  ));
                }

                const schedule = [];
                const unitsCount = units.length;
                if (unitsCount === 0) return <tr><td colSpan="6" style={{ padding: '0.5rem', textAlign: 'center' }}>No hay unidades para generar cronograma.</td></tr>;
                const totalWeeks = courseData.hours?.totalWeeks || 16;
                const weeksPerUnit = Math.floor(totalWeeks / unitsCount);
                let currentWeek = 1;
                units.forEach((unit, index) => {
                  const isLast = index === unitsCount - 1;
                  const weeksForThisUnit = isLast ? (totalWeeks - currentWeek + 1) : weeksPerUnit;
                  for (let i = 0; i < weeksForThisUnit; i++) {
                    const isLastWeekOfUnit = i === weeksForThisUnit - 1;
                    schedule.push(
                      <tr key={currentWeek}>
                        <td style={{ border: '1px solid #000', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>{currentWeek}</td>
                        <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{unit.name}</td>
                        <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{unit.contents?.split('\n')[0] || 'Contenidos de la unidad'}</td>
                        <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{unit.teacherActivities?.split('\n')[0] || 'Actividad dirigida'}</td>
                        <td style={{ border: '1px solid #000', padding: '0.5rem' }}>{unit.independentActivities?.split('\n')[0] || 'Trabajo autónomo'}</td>
                        <td style={{ border: '1px solid #000', padding: '0.5rem', fontStyle: 'italic', color: '#444' }}>{isLastWeekOfUnit ? unit.evidence : ''}</td>
                      </tr>
                    );
                    currentWeek++;
                  }
                });
                return schedule;
              })()}
            </tbody>
          </table>

          <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.8rem', color: '#666' }}>
            <p>Generado automáticamente por Gestor de Sílabos 2.0</p>
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
