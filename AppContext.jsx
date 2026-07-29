import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, auth } from '../services/firebase';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';
import { AuthContext } from './AuthContext';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const { userProfile } = useContext(AuthContext);
  const institutionId = userProfile?.institutionId ?? null;

  const [faculties,  setFaculties]  = useState([]);
  const [programs,   setPrograms]   = useState([]);
  const [courses,    setCourses]    = useState([]);
  const [documents,  setDocuments]  = useState([]);
  const [syllabi,    setSyllabi]    = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Suscripciones en tiempo real filtradas por institución
  useEffect(() => {
    if (!institutionId) {
      setFaculties([]); setPrograms([]); setCourses([]);
      setDocuments([]); setSyllabi([]);
      setLoading(false);
      return;
    }

    const q = (col) => query(collection(db, col), where('institutionId', '==', institutionId));

    const unsubs = [
      onSnapshot(q('faculties'),  (snap) => setFaculties(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(q('programs'),   (snap) => setPrograms(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(q('courses'),    (snap) => setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(q('documents'),  (snap) => setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
      onSnapshot(q('syllabi'),    (snap) => {
        setSyllabi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }),
    ];

    return () => unsubs.forEach(u => u());
  }, [institutionId]);

  // ── Facultades ──────────────────────────────────────────────────────────────
  const addFaculty = async (name) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    await addDoc(collection(db, 'faculties'), {
      name: name.trim(),
      institutionId,
      createdBy: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
  };

  const deleteFaculty = async (id) => {
    const hasProg = programs.some(p => p.facultyId === id);
    if (hasProg) throw new Error('Elimina primero los programas de esta facultad.');
    await deleteDoc(doc(db, 'faculties', id));
  };

  // ── Programas ───────────────────────────────────────────────────────────────
  const addProgram = async ({ name, level, facultyId }) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    if (!name?.trim()) throw new Error('El nombre del programa es obligatorio.');
    if (!facultyId) throw new Error('Selecciona una facultad.');
    await addDoc(collection(db, 'programs'), {
      name: name.trim(),
      level: level ?? 'Pregrado',
      facultyId,
      institutionId,
      createdBy: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
  };

  const deleteProgram = async (id) => {
    const hasCourses = courses.some(c => c.programId === id);
    if (hasCourses) throw new Error('Elimina primero las asignaturas de este programa.');
    await deleteDoc(doc(db, 'programs', id));
  };

  // ── Asignaturas ─────────────────────────────────────────────────────────────
  const addCourse = async ({ name, code, credits, semester, programId }) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    if (!name?.trim()) throw new Error('El nombre de la asignatura es obligatorio.');
    if (!programId) throw new Error('Selecciona un programa.');
    await addDoc(collection(db, 'courses'), {
      name: name.trim(),
      code: code?.trim() ?? '',
      credits: Number(credits) || 3,
      semester: Number(semester) || 1,
      programId,
      institutionId,
      createdBy: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
  };

  const deleteCourse = async (id) => {
    await deleteDoc(doc(db, 'courses', id));
  };

  // ── Documentos ──────────────────────────────────────────────────────────────
  const addDocument = async (documentData) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    await addDoc(collection(db, 'documents'), {
      ...documentData,
      institutionId,
      date: new Date().toISOString().split('T')[0],
      size: '1.0 MB',
      uploadedBy: auth.currentUser?.uid ?? null,
      createdAt: serverTimestamp(),
    });
  };

  const deleteDocument = async (id) => {
    await deleteDoc(doc(db, 'documents', id));
  };

  // ── Sílabos ─────────────────────────────────────────────────────────────────
  const addSyllabus = async (syllabus) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    const ref = await addDoc(collection(db, 'syllabi'), {
      ...syllabus,
      institutionId,
      authorId: auth.currentUser?.uid ?? null,
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    });
    return ref.id;
  };

  const updateSyllabusStatus = async (id, newStatus, oldStatus = '', message = '') => {
    const updates = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };
    if (newStatus === 'Aprobado') {
      updates.feedback = {}; // Limpia feedback al aprobar
    }
    
    await updateDoc(doc(db, 'syllabi', id), updates);

    // Registro de historial
    if (auth.currentUser) {
      await addDoc(collection(db, `syllabi/${id}/history`), {
        type: 'STATE_CHANGE',
        fromState: oldStatus || 'Desconocido',
        toState: newStatus,
        actorId: auth.currentUser.uid,
        timestamp: serverTimestamp(),
        message: message || `Estado cambiado a ${newStatus}`
      });
    }
  };

  const addFeedback = async (syllabusId, tabId, comment) => {
    if (!auth.currentUser) return;
    const { arrayUnion } = await import('firebase/firestore');
    await updateDoc(doc(db, 'syllabi', syllabusId), {
      [`feedback.${tabId}`]: arrayUnion({
        comment,
        authorId: auth.currentUser.uid,
        date: new Date().toISOString()
      })
    });
  };

  const deleteSyllabus = async (id) => {
    await deleteDoc(doc(db, 'syllabi', id));
  };

  const saveSyllabusDraft = async (draftData, existingId = null) => {
    if (!institutionId) throw new Error('Sin institución asignada.');
    if (existingId) {
      await updateDoc(doc(db, 'syllabi', existingId), {
        ...draftData,
        updatedAt: serverTimestamp(),
      });
      return existingId;
    } else {
      const ref = await addDoc(collection(db, 'syllabi'), {
        ...draftData,
        institutionId,
        status: 'Borrador',
        authorId: auth.currentUser?.uid ?? null,
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
      });
      return ref.id;
    }
  };

  const value = {
    institutionId,
    faculties,  addFaculty,  deleteFaculty,
    programs,   addProgram,  deleteProgram,
    courses,    addCourse,   deleteCourse,
    documents,  addDocument, deleteDocument,
    syllabi,    addSyllabus, updateSyllabusStatus, saveSyllabusDraft, deleteSyllabus, addFeedback,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
