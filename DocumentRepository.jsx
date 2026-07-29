import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, CheckCircle, AlertCircle, 
  Trash2, Download, Search, Filter, Loader2,
  MoreVertical, FileCheck, FileWarning
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppContext } from '../hooks/useApp';
import { documentService, DOC_TYPE_CATALOG } from '../services/documentService';
import { aiService } from '../services/aiService';
import { extractTextFromPDF } from '../utils/pdfHelper';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

const DOC_TYPES = DOC_TYPE_CATALOG;

const DocumentRepository = () => {
  const { programs = [], faculties = [] } = useAppContext() || {};
  const { userProfile, institution } = useAuth() || {};
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedType, setSelectedType] = useState('PEP');
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingExtracted, setViewingExtracted] = useState(null);

  useEffect(() => {
    if (institution?.id) {
      loadDocuments();
    }
  }, [institution?.id]);

  const loadDocuments = async () => {
    try {
      const docs = await documentService.getDocumentsByInstitution(institution.id);
      setDocuments(docs || []);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAI = async (documentObj) => {
    if (!window.confirm("¿Deseas analizar este documento con IA? Esto extraerá competencias y resultados de aprendizaje.")) return;
    
    setProcessingId(documentObj.id);
    try {
      const text = await extractTextFromPDF(documentObj.fileUrl);
      const extracted = await aiService.extractCurricularData(text, documentObj.type);
      
      const docRef = doc(db, 'documents', documentObj.id);
      await updateDoc(docRef, {
        extractedData: extracted,
        processedAt: serverTimestamp()
      });

      setDocuments(prev => prev.map(d => 
        d.id === documentObj.id ? { ...d, extractedData: extracted } : d
      ));
      
      alert("¡Análisis curricular completado con éxito!");
    } catch (err) {
      console.error("Error IA:", err);
      alert("Error al procesar con IA: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (documentObj) => {
    if (!window.confirm(`¿Eliminar "${documentObj.fileName}"? Esta acción no se puede deshacer.`)) return;
    try {
      await documentService.deleteDocument(documentObj.id);
      setDocuments(prev => prev.filter(d => d.id !== documentObj.id));
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const getCompletionForProgram = (programId) => {
    const required = DOC_TYPES.filter(t => t.required);
    const uploaded = required.filter(t => hasDoc(programId, t.id));
    return Math.round((uploaded.length / required.length) * 100);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedProgram || !institution?.id) return;

    setUploading(true);
    try {
      console.log("Iniciando subida para institución:", institution.id);
      await documentService.uploadDocument({
        file: selectedFile,
        programId: selectedProgram,
        institutionId: institution.id,
        type: selectedType,
        userId: userProfile?.uid
      });
      console.log("Subida completada");
      await loadDocuments();
      setIsModalOpen(false);
      setSelectedFile(null);
      alert("¡Documento subido con éxito!");
    } catch (err) {
      console.error("Error detallado de subida:", err);
      // Si el error es de permisos, avisar al usuario
      if (err.code === 'storage/unauthorized') {
        alert("Error de permisos: Por favor, revisa las reglas de Storage en Firebase Console.");
      } else {
        alert("Error al subir documento: " + (err.message || "Error desconocido"));
      }
    } finally {
      setUploading(false);
    }
  };

  const hasDoc = (programId, type) => {
    return (documents || []).find(d => d.programId === programId && d.type === type);
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const filteredPrograms = (programs || []).filter(p => 
    normalizeText(p?.name || "").includes(normalizeText(searchTerm))
  );

  return (
    <div className="doc-repo-container">
      <style>{`
        .doc-repo-container { padding: 2rem; color: #f1f5f9; }
        .repo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .header-title h1 { font-size: 1.8rem; font-weight: 700; margin: 0; color: #fff; }
        .header-title p { color: #94a3b8; margin-top: 0.25rem; }
        
        .btn-primary {
          background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem;
          border: none; display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
          font-weight: 600; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }
        .btn-primary:hover { background: #4338ca; transform: translateY(-1px); }

        .btn-ai-process {
          background: #fbbf24; color: #78350f; padding: 0.3rem 0.6rem; border-radius: 0.5rem;
          font-size: 10px; font-weight: 700; border: none; cursor: pointer; margin-top: 5px;
          display: flex; align-items: center; gap: 4px; transition: all 0.2s;
        }
        .btn-ai-process:hover { background: #f59e0b; }
        
        .btn-ai-view {
          background: #10b981; color: white; padding: 0.3rem 0.6rem; border-radius: 0.5rem;
          font-size: 10px; font-weight: 700; border: none; cursor: pointer; margin-top: 5px;
        }

        .matrix-card { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 1rem; overflow: hidden; backdrop-filter: blur(8px); }
        .table-controls { padding: 1rem 1.5rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.3); }
        
        .search-input-wrapper { position: relative; width: 100%; max-width: 400px; }
        .search-input { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; padding: 0.6rem 1rem 0.6rem 2.5rem; color: #f1f5f9; outline: none; }
        
        .repo-table { width: 100%; border-collapse: collapse; text-align: left; }
        .repo-table th { background: rgba(15, 23, 42, 0.5); padding: 1rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; }
        .repo-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #334155; }
        
        .program-name { font-weight: 600; color: #f1f5f9; }
        .faculty-name { font-size: 0.75rem; color: #64748b; }
        .status-cell { text-align: center; }
        
        .doc-link { display: flex; flex-direction: column; align-items: center; gap: 4px; text-decoration: none; color: #10b981; }
        .missing-icon { color: #ef4444; opacity: 0.3; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: #1e293b; width: 100%; max-width: 600px; border-radius: 1.5rem; border: 1px solid #475569; overflow: hidden; }
        .modal-header { padding: 1.5rem; border-bottom: 1px solid #334155; background: rgba(0,0,0,0.2); }
        .modal-body { padding: 1.5rem; max-height: 80vh; overflow-y: auto; }
        
        .ai-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
        .ai-card { background: #0f172a; padding: 1rem; border-radius: 0.75rem; border: 1px solid #334155; }
        .ai-card h4 { color: #fbbf24; margin: 0 0 0.5rem 0; font-size: 0.7rem; text-transform: uppercase; }
        .ai-card ul { padding-left: 1.2rem; margin: 0; color: #cbd5e1; font-size: 0.85rem; }
        
        .dropzone { border: 2px dashed #334155; border-radius: 1rem; padding: 2rem; text-align: center; cursor: pointer; }
        .type-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
        .type-btn { padding: 0.6rem; background: #0f172a; border: 1px solid #334155; border-radius: 0.5rem; color: #94a3b8; cursor: pointer; font-size: 0.75rem; }
        .type-btn.active { border-color: #4f46e5; color: #fff; background: rgba(79, 70, 229, 0.2); }
      `}</style>

      <header className="repo-header">
        <div className="header-title">
          <h1>Repositorio Documental</h1>
          <p>Gestión inteligente de documentos curriculares.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Upload size={18} /> Cargar Documento
        </button>
      </header>

      <div className="matrix-card">
        <div className="table-controls">
          <div className="search-input-wrapper">
            <Search style={{position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#64748b'}} size={18}/>
            <input 
              className="search-input"
              placeholder="Filtrar programas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="repo-table">
          <thead>
            <tr>
              <th>Programa Académico</th>
              {DOC_TYPES.map(t => (
                <th key={t.id} style={{textAlign:'center'}}>
                  {t.label}
                  {t.required && <span style={{color:'#ef4444', marginLeft:3, fontSize:10}}>*</span>}
                </th>
              ))}
              <th style={{textAlign:'center', width: 90}}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrograms.map(prog => {
              const pct = getCompletionForProgram(prog.id);
              const barColor = pct === 100 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
              return (
              <tr key={prog.id}>
                <td>
                  <div className="program-name">{prog.name}</div>
                  <div className="faculty-name">ID: {prog.id.slice(0,8)}</div>
                </td>
                {DOC_TYPES.map(type => {
                  const docObj = hasDoc(prog.id, type.id);
                  const isProcessing = processingId === docObj?.id;
                  
                  return (
                    <td key={type.id} className="status-cell">
                      {docObj ? (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:3}}>
                          <button 
                            onClick={() => {
                              const win = window.open();
                              win.document.write(`<iframe src="${docObj.fileUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`);
                            }} 
                            className="doc-link"
                            style={{background: 'none', border: 'none', cursor: 'pointer'}}
                            title={docObj.fileName}
                          >
                            <FileCheck size={22} />
                          </button>
                          <div style={{display:'flex', gap:3}}>
                            {docObj.extractedData ? (
                              <button className="btn-ai-view" onClick={() => setViewingExtracted(docObj.extractedData)}>
                                Ver IA 🧠
                              </button>
                            ) : (
                              <button className="btn-ai-process" disabled={isProcessing} onClick={() => handleProcessAI(docObj)}>
                                {isProcessing ? <Loader2 className="animate-spin" size={12}/> : 'Analizar 🧠'}
                              </button>
                            )}
                            <button 
                              onClick={() => handleDelete(docObj)}
                              style={{background:'none', border:'none', cursor:'pointer', color:'#ef4444', opacity:0.5, padding:2}}
                              title="Eliminar documento"
                            >
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <FileWarning size={22} className="missing-icon" />
                      )}
                    </td>
                  );
                })}
                <td style={{textAlign:'center'}}>
                  <div style={{fontSize:11, fontWeight:700, color: barColor, marginBottom:3}}>{pct}%</div>
                  <div style={{background:'#1e293b', borderRadius:4, height:6, width:60, margin:'0 auto'}}>
                    <div style={{background: barColor, height:'100%', borderRadius:4, width:`${pct}%`, transition:'width 0.3s'}}/>
                  </div>
                </td>
              </tr>
            );})}
          </tbody>
        </table>

      </div>

      {/* Modal Carga */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header"><h3>Cargar Documento Oficial</h3></div>
            <div className="modal-body">
              <label style={{display:'block', marginBottom:5, fontSize:12}}>Programa</label>
              <select className="search-input" style={{paddingLeft:10, marginBottom:15}} value={selectedProgram} onChange={e=>setSelectedProgram(e.target.value)}>
                <option value="">Seleccionar...</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <label style={{display:'block', marginBottom:5, fontSize:12}}>Tipo de Documento</label>
              <div className="type-grid">
                {DOC_TYPES.map(t => (
                  <button key={t.id} className={`type-btn ${selectedType === t.id ? 'active' : ''}`} onClick={()=>setSelectedType(t.id)}>{t.label}</button>
                ))}
              </div>

              <div className="dropzone" onClick={()=>document.getElementById('f').click()}>
                <input id="f" type="file" hidden accept=".pdf" onChange={e=>setSelectedFile(e.target.files[0])}/>
                {selectedFile ? <div style={{color:'#10b981'}}>{selectedFile.name}</div> : "Seleccionar PDF"}
              </div>

              <div style={{display:'flex', gap:10, marginTop:20}}>
                <button className="btn-primary" style={{flex:1, background:'#475569'}} onClick={()=>setIsModalOpen(false)}>Cancelar</button>
                <button className="btn-primary" style={{flex:1}} disabled={uploading} onClick={handleUpload}>
                  {uploading ? "Subiendo..." : "Subir Documento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal IA */}
      {viewingExtracted && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth:800}}>
            <div className="modal-header"><h3>Resultados de Extracción IA</h3></div>
            <div className="modal-body">
              <p style={{fontSize:14, color:'#94a3b8', marginBottom:20}}>{viewingExtracted.resumen}</p>
              <div className="ai-grid">
                <div className="ai-card">
                  <h4>Competencias</h4>
                  <ul>{viewingExtracted.competencias?.map((c,i)=><li key={i}>{c}</li>)}</ul>
                </div>
                <div className="ai-card">
                  <h4>Resultados de Aprendizaje</h4>
                  <ul>{viewingExtracted.resultadosAprendizaje?.map((r,i)=><li key={i}>{r}</li>)}</ul>
                </div>
              </div>
              <div className="ai-card" style={{marginTop:15}}>
                <h4>Núcleos Temáticos</h4>
                <div style={{display:'flex', flexWrap:'wrap', gap:5, marginTop:5}}>
                  {viewingExtracted.nucleosTematicos?.map((n,i)=><span key={i} style={{fontSize:10, background:'#1e293b', padding:'3px 8px', borderRadius:5}}>{n}</span>)}
                </div>
              </div>
              <button className="btn-primary" style={{width:'100%', marginTop:20}} onClick={()=>setViewingExtracted(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRepository;
