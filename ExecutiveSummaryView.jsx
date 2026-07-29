import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldCheck, Sparkles, Building2, Layers, CheckCircle2, FileText } from 'lucide-react';

export default function ExecutiveSummaryView() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#0f1115', color: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      {/* Botones de navegación (ocultos al imprimir) */}
      <div className="no-print" style={{ maxWidth: '900px', margin: '0 auto 1.5rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-ghost" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}
        >
          <ArrowLeft size={18} /> Volver a la Landing Page
        </button>
        <button 
          onClick={handlePrint} 
          className="btn btn-primary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #d4af37, #b08d28)', color: '#000', fontWeight: 600, padding: '0.6rem 1.2rem', borderRadius: '0.5rem' }}
        >
          <Printer size={18} /> Descargar / Imprimir en PDF
        </button>
      </div>

      {/* Hoja del Documento */}
      <div 
        className="preview-document" 
        style={{ 
          maxWidth: '900px', 
          margin: '0 auto', 
          backgroundColor: '#ffffff', 
          color: '#0f172a', 
          padding: '3.5rem 4rem', 
          borderRadius: '0.75rem', 
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }}
      >
        {/* Insignia y Encabezado */}
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#856404', border: '1px solid #d4af37', padding: '0.2rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Informe Ejecutivo SaaS
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '3px solid #d4af37', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Gestor de Sílabos SaaS
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
              Transformación Curricular e Inteligencia Artificial en la Nube
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>
            <div><strong>Destinatario:</strong> Ana María Ordóñez</div>
            <div><strong>Fecha:</strong> 29 de Julio, 2026</div>
            <div><strong>Estado:</strong> Propuesta Ejecutivo SaaS</div>
          </div>
        </div>

        {/* Sección 1 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#d4af37" /> 1. Visión del Producto SaaS
          </h2>
          <p style={{ fontSize: '0.925rem', color: '#334155', lineHeight: 1.6, textAlign: 'justify' }}>
            El <strong>Gestor de Sílabos SaaS</strong> es una plataforma en la nube diseñada para modernizar, estandarizar y automatizar la gestión curricular en instituciones de educación superior y colegios. Transforma la elaboración de sílabos de ser un trámite burocrático y desestructurado a ser un proceso colaborativo, ágil y guiado por <strong>Inteligencia Artificial (Google Gemini)</strong>, garantizando la coherencia con el Proyecto Educativo del Programa (PEP) y los resultados de aprendizaje (Taxonomía de Bloom).
          </p>
        </section>

        {/* Sección 2 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#d4af37" /> 2. Pilares Fundamentales
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #d4af37', padding: '1rem', borderRadius: '0.375rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#d4af37" /> Copiloto Curricular con IA
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Generación asistida de propósitos formativos, competencias, resultados de aprendizaje (Bloom) y rúbricas de evaluación por niveles en segundos.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #d4af37', padding: '1rem', borderRadius: '0.375rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={16} color="#d4af37" /> Arquitectura Multi-Tenant
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Aislamiento estricto de datos por institución, garantizando privacidad total y cumplimiento de normativas de tratamiento de datos personales.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #d4af37', padding: '1rem', borderRadius: '0.375rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#d4af37" /> Flujo de Gobierno y Revisión
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Sistema de roles (Admin, Coordinador, Docente) con paneles de aprobación, corrección y trazabilidad institucional.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #d4af37', padding: '1rem', borderRadius: '0.375rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} color="#d4af37" /> Repositorio y Exportación
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>
                Consolidación centralizada de sílabos con exportación oficial e inmediata a formato PDF normativo listo para acreditaciones.
              </p>
            </div>
          </div>
        </section>

        {/* Sección 3 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem', marginBottom: '0.75rem' }}>
            3. Arquitectura Técnica y Seguridad
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Componente</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Tecnología</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left' }}>Beneficio / Seguridad</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Frontend</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>React + Vite (SPA)</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Interfaz ultra rápida y fluida para docentes.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>Backend & DB</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Firebase (Auth, Firestore, Storage)</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Aislamiento por institutionId mediante reglas de seguridad.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600 }}>IA Proxy Blindado</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Cloudflare Worker Proxy</td>
                <td style={{ padding: '0.6rem 0.8rem' }}>Protección de claves de Google Gemini y control de tasa.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Cuadro destacado */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '2rem' }}>
          <h3 style={{ color: '#d4af37', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Propuesta de Valor Institucional
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.825rem' }}>
            <div>
              <strong style={{ color: '#fcd34d', display: 'block', marginBottom: '0.25rem' }}>Para Decanos / Directores</strong>
              Estandarización al 100% de la oferta académica y agilidad en procesos de auditoría de acreditación.
            </div>
            <div>
              <strong style={{ color: '#fcd34d', display: 'block', marginBottom: '0.25rem' }}>Para Coordinadores</strong>
              Visibilidad global del estado de entrega y panel eficiente de revisión y aprobación.
            </div>
            <div>
              <strong style={{ color: '#fcd34d', display: 'block', marginBottom: '0.25rem' }}>Para Docentes</strong>
              Reducción del tiempo de elaboración de horas a minutos gracias al asistente guiado por IA.
            </div>
          </div>
        </div>

        {/* Firma de pie de página */}
        <div style={{ marginTop: '3rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
          <div><strong>Elaborado por:</strong> Equipo del Gestor de Sílabos</div>
          <div>Documento Confidencial preparado para <strong>Ana María Ordóñez</strong></div>
        </div>
      </div>
    </div>
  );
}
