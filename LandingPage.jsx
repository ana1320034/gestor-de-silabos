import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Bot, 
  Award, 
  Users, 
  Zap, 
  Download,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('docentes');

  return (
    <div className="landing-page" style={{ backgroundColor: '#0f1115', color: '#f8fafc', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ── HEADER / NAVIGATION BAR ── */}
      <header style={{ borderBottom: '1px solid #2d3139', backgroundColor: 'rgba(26, 29, 36, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #d4af37, #b08d28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(212, 175, 55, 0.3)' }}>
              <GraduationCap color="#000" size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #d4af37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Gestor de Sílabos
              </span>
              <span style={{ fontSize: '0.65rem', display: 'block', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Plataforma SaaS con IA
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="#caracteristicas" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Características</a>
            <a href="#ia-gemini" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Copiloto IA</a>
            <a href="#beneficios" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Beneficios</a>
            <a href="#planes" style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }}>Planes SaaS</a>
          </nav>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/resumen-ejecutivo')} 
              className="btn btn-outline" 
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #d4af37', color: '#d4af37' }}
            >
              <FileText size={16} /> Resumen Ejecutivo PDF
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary" 
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Iniciar Sesión <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem 6rem 1.5rem', background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.15) 0%, rgba(15, 17, 21, 1) 70%)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', backgroundColor: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#fcd34d', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <Sparkles size={16} /> Potenciado por Google Gemini AI & Firestore Multi-tenant
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: '3.25rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            El futuro de la <span style={{ background: 'linear-gradient(135deg, #d4af37 0%, #fcd34d 50%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gestión Curricular</span> para Instituciones Educativas
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '750px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
            Diseñe, revise y apruebe sílabos académicos alineados con la Taxonomía de Bloom y los PEP institucionales en minutos. Una solución SaaS integral creada para universidades y colegios modernos.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary" 
              style={{ fontSize: '1.05rem', padding: '0.85rem 2rem', borderRadius: '0.5rem', fontWeight: 700, gap: '0.6rem' }}
            >
              Probar Plataforma <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate('/resumen-ejecutivo')} 
              className="btn btn-outline" 
              style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem', borderRadius: '0.5rem', fontWeight: 600, gap: '0.6rem' }}
            >
              <Download size={20} /> Ver Informe para Ana María Ordóñez
            </button>
          </div>

          {/* Metrics / Trust Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '4rem', padding: '1.5rem', backgroundColor: 'rgba(26, 29, 36, 0.6)', border: '1px solid #2d3139', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4af37' }}>80%</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reducción en tiempo de creación</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4af37' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Alineación con Taxonomía Bloom</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4af37' }}>Multi-tenant</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Aislamiento total de datos</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#d4af37' }}>1-Click</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Exportación a PDF Oficial</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SHOWCASE / COPILOTO CON IA ── */}
      <section id="ia-gemini" style={{ padding: '5rem 1.5rem', backgroundColor: '#161920', borderTop: '1px solid #2d3139', borderBottom: '1px solid #2d3139' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#d4af37', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
              <Bot size={18} /> Asistente de Inteligencia Artificial
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Un copiloto pedagógico que redacta y estructura por ti
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Nuestra IA especializada analiza el nombre del curso y genera en segundos propuestas de propósitos formativos, competencias clave, resultados de aprendizaje con verbos de acción y rúbricas graduadas.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 color="#d4af37" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Taxonomía de Bloom integrada:</strong> Verbos precisos para medir el aprendizaje esperado.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 color="#d4af37" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Rúbricas automáticas:</strong> Criterios de evaluación con descriptores desde Insuficiente hasta Excelente.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 color="#d4af37" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Ingesta de Documentos PEP:</strong> Extracción de pilares institucionales directamente desde los microcurrículos.</span>
              </li>
            </ul>

            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Probar Copiloto IA <ChevronRight size={18} />
            </button>
          </div>

          {/* Visual Interactive UI Card */}
          <div className="card glass-panel" style={{ padding: '2rem', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d3139', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="#d4af37" size={20} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Generador Asistido de Sílabo</span>
              </div>
              <span className="badge badge-gold">IA Gemini Activa</span>
            </div>

            <div style={{ backgroundColor: '#0f1115', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #2d3139' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Asignatura ingresada:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>Inteligencia Artificial Aplicada a la Educación</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.08)', padding: '0.85rem', borderRadius: '0.5rem', borderLeft: '3px solid #d4af37' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fcd34d' }}>Resultado de Aprendizaje (Bloom)</div>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.25rem' }}>
                  "Diseñar e implementar modelos de evaluación adaptativa integrando algoritmos de procesamiento de lenguaje natural."
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '0.5rem', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>Rúbrica Generada Automáticamente</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                  Criterio: Arquitectura de la Solución (Excelente: 9-10 pts | Insuficiente: 1-4 pts)
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── CARACTERÍSTICAS PRINCIPALES ── */}
      <section id="caracteristicas" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Todo lo que tu institución necesita en una sola plataforma
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              Diseñada específicamente para atender los retos de vicerrectores, directores académicos, coordinadores y docentes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            <div className="card" style={{ transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', marginBottom: '1.25rem' }}>
                <Building2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>SaaS Multi-Institucional</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Aislamiento estricto de datos por `institutionId`. Administra facultades, departamentos y programas independientes con total privacidad.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Flujo de Gobierno Académico</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Workflow formal con roles diferenciados: Administrador, Coordinador y Docente. Sistema de observaciones, correcciones y aprobaciones.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', marginBottom: '1.25rem' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Repositorio de Documentos PEP</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Almacena los Proyectos Educativos del Programa (PEP) y permite a la IA extraer información estratégica para los sílabos.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', marginBottom: '1.25rem' }}>
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Exportación a PDF Normativo</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Descarga de sílabos con formato institucional estandarizado listos para visitas de acreditación y auditorías de calidad.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: '1.25rem' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Proxy de IA Blindado</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Infraestructura en Cloudflare Workers que protege las llaves de la API de Google Gemini y controla la cuota de uso por usuario autenticado.
              </p>
            </div>

            <div className="card">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', marginBottom: '1.25rem' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Control de Versiones y Vigencia</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Trazabilidad completa por semestre académico, permitiendo auditar versiones previas y actualizaciones curriculares.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── BENEFICIOS POR ROL ── */}
      <section id="beneficios" style={{ padding: '5rem 1.5rem', backgroundColor: '#161920', borderTop: '1px solid #2d3139' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Impacto directo para cada miembro de la comunidad
            </h2>
          </div>

          {/* Selector de Rol */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <button 
              onClick={() => setActiveTab('docentes')} 
              className={`btn ${activeTab === 'docentes' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
            >
              Para Docentes
            </button>
            <button 
              onClick={() => setActiveTab('coordinadores')} 
              className={`btn ${activeTab === 'coordinadores' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
            >
              Para Coordinadores
            </button>
            <button 
              onClick={() => setActiveTab('decanos')} 
              className={`btn ${activeTab === 'decanos' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '0.6rem 1.5rem', fontSize: '0.95rem' }}
            >
              Para Decanos y Vicerrectores
            </button>
          </div>

          {/* Contenido por Rol */}
          <div className="card glass-panel" style={{ padding: '2.5rem' }}>
            {activeTab === 'docentes' && (
              <div>
                <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '1rem' }}>Soporte ágil en la labor pedagógica</h3>
                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Elimina el estrés de redactar sílabos desde cero cada semestre. El asistente sugiere estructuras acordes a los requerimientos institucionales, permitiendo personalizar temas, semanas y métodos de evaluación.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Reducción del tiempo de elaboración a minutos.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Sugerencias de rúbricas listas para aplicar.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'coordinadores' && (
              <div>
                <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '1rem' }}>Supervisión y control de calidad curricular</h3>
                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Visualiza el avance de entrega de sílabos por departamento y programa. Aprueba o solicita correcciones directamente sobre el documento sin necesidad de intercambiar correos ni archivos adjuntos.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Panel centralizado de revisión de sílabos.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Garantía de consistencia pedagógica.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'decanos' && (
              <div>
                <h3 style={{ color: '#d4af37', fontSize: '1.4rem', marginBottom: '1rem' }}>Alineación estratégica y acreditación</h3>
                <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Asegura que el 100% de la oferta académica de la institución cumpla con las normas del Ministerio de Educación y los requerimientos de los pares evaluadores en visitas de acreditación.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Reportes institucionales unificados.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.9rem' }}>
                    <CheckCircle2 color="#d4af37" size={18} /> Resguardo del patrimonio intelectual educativo.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── PLANES SAAS ── */}
      <section id="planes" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Planes Flexibles para cada Institución
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Comienza con una prueba piloto o despliega en toda tu universidad.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Plan Piloto */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Prueba Piloto</div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Gratuito / Piloto</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Ideal para validar en 1 programa o departamento durante 1 mes.</p>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Hasta 10 Docentes</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Copiloto IA Gemini básico</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Exportación a PDF</li>
                </ul>
              </div>
              <button onClick={() => navigate('/login')} className="btn btn-outline w-full">Solicitar Piloto</button>
            </div>

            {/* Plan Institucional (Destacado) */}
            <div className="card" style={{ border: '2px solid #d4af37', background: 'rgba(26, 29, 36, 0.9)', boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: '#d4af37', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.75rem', borderRadius: '10px', textTransform: 'uppercase' }}>
                Más Recomendado
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Institucional</div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Suscripción Anual</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Para facultades o colegios completos con soporte y capacitaciones.</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Docentes ilimitados</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Copiloto IA avanzado con rúbricas</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Multi-tenant aislado completo</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Ingesta de documentos PEP</li>
                </ul>
              </div>
              <button onClick={() => navigate('/login')} className="btn btn-primary w-full">Comenzar Ahora</button>
            </div>

            {/* Plan Enterprise */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Enterprise</div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Personalizado</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Para redes universitarias con integración a LMS y dominio propio.</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Dominio personalizado (ej. tuuniversidad.com)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Integración con Moodle / Canvas</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 color="#d4af37" size={16} /> Acuerdo de Nivel de Servicio (SLA)</li>
                </ul>
              </div>
              <button onClick={() => navigate('/login')} className="btn btn-ghost w-full" style={{ border: '1px solid #2d3139' }}>Contactar Ventas</button>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #2d3139', backgroundColor: '#0a0c0e', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Gestor de Sílabos SaaS</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Plataforma inteligente de planificación curricular © 2026</div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="/resumen-ejecutivo" onClick={(e) => { e.preventDefault(); navigate('/resumen-ejecutivo'); }} style={{ color: '#d4af37' }}>Resumen para Ana María Ordóñez</a>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: '#94a3b8' }}>Acceso a Usuarios</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
