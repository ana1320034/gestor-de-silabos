import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, FileDown, CheckCircle } from 'lucide-react';

// ── Generador de documento Word (HTML → .doc) ─────────────────────────────────
// Funciona sin dependencias externas. Word y LibreOffice aceptan HTML envuelto
// en el encabezado de MIME de Word.
function generateWordDocument(syllabus) {
  const units = syllabus.units || [];

  const unitsHtml = units.length > 0
    ? units.map((u, i) => `
      <h3 style="background:#f0f0f0;padding:6px 8px;border:1px solid #ccc;">
        ${u.name || `Unidad ${i + 1}`}
        ${u.duration ? `<span style="float:right;font-size:12px;font-weight:normal;">⏱ ${u.duration}</span>` : ''}
      </h3>
      <table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <tr><td width="30%" style="background:#fafafa;font-weight:bold;">Resultado de Aprendizaje</td>
          <td>${u.learningOutcome || '—'}</td></tr>
        <tr><td style="background:#fafafa;font-weight:bold;">Contenidos</td>
          <td>${(u.contents || '—').replace(/;/g, '<br>•&nbsp;')}</td></tr>
        <tr><td style="background:#fafafa;font-weight:bold;">Actividades con Docente</td>
          <td>${u.teacherActivities || '—'}</td></tr>
        <tr><td style="background:#fafafa;font-weight:bold;">Trabajo Independiente</td>
          <td>${u.independentActivities || '—'}</td></tr>
        <tr><td style="background:#fafafa;font-weight:bold;">Evidencia</td>
          <td>${u.evidence || '—'}</td></tr>
        <tr><td style="background:#fafafa;font-weight:bold;">Instrumento</td>
          <td>${u.evaluationType || 'Rúbrica'}</td></tr>
      </table>
      ${u.evaluationType === 'Rúbrica' && u.rubric?.length > 0 ? `
        <p style="font-size:12px;font-weight:bold;margin:4px 0;">Rúbrica de Evaluación:</p>
        <table border="1" cellpadding="4" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:12px;margin-bottom:20px;">
          <thead><tr style="background:#f0f0f0;">
            <th>Criterio</th><th>Excelente (9-10)</th><th>Bueno (7-8)</th><th>Aceptable (5-6)</th><th>Insuficiente (1-4)</th>
          </tr></thead>
          <tbody>
            ${(u.rubric || []).map(r => `
              <tr>
                <td><strong>${r.criterion || ''}</strong></td>
                <td>${r.excellent || ''}</td>
                <td>${r.good || ''}</td>
                <td>${r.acceptable || ''}</td>
                <td>${r.insufficient || ''}</td>
              </tr>`).join('')}
          </tbody>
        </table>` : ''}
    `).join('')
    : '<p>No se registraron unidades temáticas.</p>';

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Sílabo - ${syllabus.name || 'Asignatura'}</title>
      <!--[if gte mso 9]>
        <xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml>
      <![endif]-->
      <style>
        body { font-family: Arial, sans-serif; font-size: 14px; color: #111; margin: 40px; }
        h1 { font-size: 20px; border-bottom: 3px solid #000; padding-bottom: 8px; }
        h2 { font-size: 15px; background: #e8e8e8; padding: 6px 8px; border: 1px solid #bbb; }
        h3 { font-size: 13px; margin-top: 16px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        td, th { border: 1px solid #aaa; padding: 6px 8px; vertical-align: top; }
        .signature { margin-top: 60px; display: flex; justify-content: space-around; }
        .sig-line { text-align: center; }
        .sig-underline { border-bottom: 1px solid #000; width: 200px; height: 40px; display: inline-block; }
      </style>
    </head>
    <body>
      <h1>SÍLABO INSTITUCIONAL</h1>
      <p style="color:#666;font-size:12px;">Generado: ${new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <h2>1. INFORMACIÓN GENERAL</h2>
      <table>
        <tr><td width="30%"><strong>Asignatura:</strong></td><td>${syllabus.name || '—'}</td></tr>
        <tr><td><strong>Código:</strong></td><td>${syllabus.code || '—'}</td></tr>
        <tr><td><strong>Programa Académico:</strong></td><td>${syllabus.program || '—'}</td></tr>
        <tr><td><strong>Docente Autor:</strong></td><td>${syllabus.author || '—'}</td></tr>
        <tr><td><strong>Créditos:</strong></td><td>${syllabus.credits || '—'}</td></tr>
        <tr><td><strong>Modalidad:</strong></td><td>${syllabus.modality || '—'}</td></tr>
        <tr><td><strong>Estado:</strong></td><td>${syllabus.status || '—'}</td></tr>
      </table>

      <h2>2. PROPÓSITO FORMATIVO</h2>
      <p>${syllabus.purpose || 'No definido.'}</p>

      <h2>3. ARTICULACIÓN CURRICULAR</h2>
      <p><strong>Resultados de Aprendizaje (RAA):</strong></p>
      <p>${syllabus.raa || 'No definidos.'}</p>

      <h2>4. ENFOQUE METODOLÓGICO</h2>
      <p>${syllabus.strategyDesc || 'No definido.'}</p>

      <h2>5. UNIDADES TEMÁTICAS</h2>
      ${unitsHtml}

      <div class="signature">
        <div class="sig-line">
          <div class="sig-underline"></div>
          <p>Firma Docente<br><small>${syllabus.author || ''}</small></p>
        </div>
        <div class="sig-line">
          <div class="sig-underline"></div>
          <p>Firma Coordinación Académica</p>
        </div>
        <div class="sig-line">
          <div class="sig-underline"></div>
          <p>Firma Decano / Director</p>
        </div>
      </div>
    </body>
    </html>`;

  return html;
}

function downloadAsWord(syllabus) {
  const html = generateWordDocument(syllabus);
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = (syllabus.name || 'silabo').replace(/[^a-zA-Z0-9_\-]/g, '_');
  link.download = `Silabo_${safeName}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function SyllabusExport() {
  const location = useLocation();
  const navigate = useNavigate();
  const syllabus = location.state?.syllabus;
  const [downloaded, setDownloaded] = useState(false);

  if (!syllabus) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
        <h2>No se ha seleccionado ningún sílabo para exportar.</h2>
        <button className="btn btn-primary" onClick={() => navigate('/review')}>
          Volver a Revisión
        </button>
      </div>
    );
  }

  const handleDownloadWord = () => {
    downloadAsWord(syllabus);
    setDownloaded(true);
  };

  const units = syllabus.units || [];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Barra de acciones */}
      <div className="flex justify-between items-center mb-6 no-print">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => window.print()}
            title="Imprimir o guardar como PDF con el navegador"
          >
            <Printer size={18} /> Imprimir / PDF
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownloadWord}
            style={{ background: 'var(--gold-primary)', color: '#000' }}
            title="Descargar documento Word editable (.doc)"
          >
            {downloaded
              ? <><CheckCircle size={18} /> Descargado</>
              : <><FileDown size={18} /> Descargar Word (.doc)</>}
          </button>
        </div>
      </div>

      {/* Vista previa del documento */}
      <div className="preview-document" style={{
        backgroundColor: '#fff', color: '#000', padding: '3rem 4rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)', fontFamily: 'Arial, sans-serif',
        minHeight: '1056px', fontSize: '14px'
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
        <SectionTitle>1. INFORMACIÓN GENERAL</SectionTitle>
        <InfoTable rows={[
          ['Asignatura', syllabus.name],
          ['Código', syllabus.code],
          ['Programa Académico', syllabus.program],
          ['Docente Autor', syllabus.author],
          ['Créditos Académicos', syllabus.credits],
          ['Modalidad', syllabus.modality],
          ['Estado', syllabus.status],
        ]} />

        {/* Sección 2 */}
        <SectionTitle>2. PROPÓSITO FORMATIVO</SectionTitle>
        <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem' }}>{syllabus.purpose || 'No definido.'}</p>

        {/* Sección 3 */}
        <SectionTitle>3. ARTICULACIÓN CURRICULAR</SectionTitle>
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Resultados de Aprendizaje de la Asignatura (RAA):</p>
        <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem', whiteSpace: 'pre-line' }}>{syllabus.raa || 'No definidos.'}</p>

        {/* Sección 4 */}
        <SectionTitle>4. ENFOQUE METODOLÓGICO</SectionTitle>
        <p style={{ lineHeight: 1.6, margin: '0 0 1.5rem' }}>{syllabus.strategyDesc || 'No definido.'}</p>

        {/* Sección 5 — Unidades */}
        <SectionTitle>5. UNIDADES TEMÁTICAS</SectionTitle>
        {units.length === 0 && <p style={{ color: '#888' }}>No se registraron unidades temáticas.</p>}
        {units.map((u, i) => (
          <div key={u.id || i} style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '14px', background: '#f0f0f0', padding: '6px 10px', border: '1px solid #ccc', margin: '0 0 0.5rem', display: 'flex', justifyContent: 'space-between', color: '#000' }}>
              <span>{u.name || `Unidad ${i + 1}`}</span>
              {u.duration && <span style={{ fontWeight: 400, fontSize: '12px', color: '#555' }}>⏱ {u.duration}</span>}
            </h3>
            <InfoTable rows={[
              ['Resultado de Aprendizaje', u.learningOutcome],
              ['Contenidos', u.contents],
              ['Actividades con Docente', u.teacherActivities],
              ['Trabajo Independiente', u.independentActivities],
              ['Evidencia de Aprendizaje', u.evidence],
              ['Instrumento de Evaluación', u.evaluationType],
            ]} />
            {u.evaluationType === 'Rúbrica' && u.rubric?.length > 0 && (
              <RubricPreview rubric={u.rubric} />
            )}
          </div>
        ))}

        {/* Sección 6 — Evaluación */}
        <SectionTitle>6. SISTEMA DE EVALUACIÓN</SectionTitle>
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
            {(syllabus.evaluation || []).map((e, idx) => (
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
        <SectionTitle>7. CRONOGRAMA SEMANAL</SectionTitle>
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
              // 1. Usar cronograma guardado si existe
              if (syllabus.schedule && syllabus.schedule.length > 0) {
                return syllabus.schedule.map((item) => (
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

              // 2. Fallback: Generar al vuelo si no hay guardado (retrocompatibilidad)
              const schedule = [];
              const unitsCount = units.length;
              if (unitsCount === 0) return <tr><td colSpan="6" style={{ padding: '0.5rem', textAlign: 'center' }}>No hay unidades para generar cronograma.</td></tr>;
              const totalWeeks = syllabus.hours?.totalWeeks || 16;
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

        {/* Firmas */}
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-around' }}>
          {['Firma Docente', 'Firma Coordinación', 'Firma Decano'].map((label) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #000', width: '180px', height: '40px' }} />
              <p style={{ marginTop: '0.5rem', fontSize: '12px' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Sub-componentes de presentación ──────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: '15px', backgroundColor: '#f0f0f0', padding: '6px 10px',
      border: '1px solid #ccc', color: '#000', margin: '0 0 0.75rem'
    }}>
      {children}
    </h2>
  );
}

function InfoTable({ rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '1.25rem' }}>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td style={{ padding: '5px 8px', border: '1px solid #ddd', fontWeight: 'bold', width: '30%', background: '#fafafa' }}>{label}:</td>
            <td style={{ padding: '5px 8px', border: '1px solid #ddd' }}>{value || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RubricPreview({ rubric }) {
  return (
    <>
      <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0.5rem 0 0.25rem' }}>Rúbrica de Evaluación:</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            {['Criterio', 'Excelente (9-10)', 'Bueno (7-8)', 'Aceptable (5-6)', 'Insuficiente (1-4)'].map(h => (
              <th key={h} style={{ padding: '4px 6px', border: '1px solid #ccc', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rubric.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd', fontWeight: 'bold' }}>{r.criterion}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{r.excellent}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{r.good}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{r.acceptable}</td>
              <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{r.insufficient}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
