// institutionService.js
// CRUD para Instituciones, Facultades, Programas y Asignaturas (multi-tenant).

import { db } from './firebase';
import {
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, serverTimestamp,
} from 'firebase/firestore';

// ── Instituciones ────────────────────────────────────────────────────────────

/**
 * Lee los datos de una institución.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getInstitution(id) {
  const snap = await getDoc(doc(db, 'institutions', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Crea una institución nueva (llamado normalmente solo una vez al hacer onboarding).
 * @param {{ name: string, type: 'university'|'school', adminEmail: string }} data
 * @returns {Promise<string>} id de la institución creada
 */
export async function createInstitution({ name, type, adminEmail }) {
  const ref = await addDoc(collection(db, 'institutions'), {
    name,
    type,
    adminEmail,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ── Facultades ────────────────────────────────────────────────────────────────

/**
 * Lista las facultades de una institución.
 */
export async function getFaculties(institutionId) {
  const q = query(collection(db, 'faculties'), where('institutionId', '==', institutionId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Crea una facultad.
 */
export async function addFaculty({ name, institutionId, createdBy }) {
  const q = query(
    collection(db, 'faculties'),
    where('institutionId', '==', institutionId),
    where('name', '==', name.trim())
  );
  const existing = await getDocs(q);
  if (!existing.empty) throw new Error(`Ya existe una facultad llamada "${name}".`);

  const ref = await addDoc(collection(db, 'faculties'), {
    name: name.trim(),
    institutionId,
    createdBy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Elimina una facultad. Lanza error si tiene programas activos.
 */
export async function deleteFaculty(facultyId, institutionId) {
  const q = query(
    collection(db, 'programs'),
    where('facultyId', '==', facultyId),
    where('institutionId', '==', institutionId)
  );
  const programs = await getDocs(q);
  if (!programs.empty) {
    throw new Error('No se puede eliminar: esta facultad tiene programas activos. Elimínalos primero.');
  }
  await deleteDoc(doc(db, 'faculties', facultyId));
}

// ── Programas ────────────────────────────────────────────────────────────────

/**
 * Lista los programas de una institución.
 */
export async function getPrograms(institutionId) {
  const q = query(collection(db, 'programs'), where('institutionId', '==', institutionId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Crea un programa.
 */
export async function addProgram({ name, level, facultyId, institutionId, createdBy }) {
  if (!name?.trim()) throw new Error('El nombre del programa es obligatorio.');
  if (!facultyId) throw new Error('Debes seleccionar una facultad.');

  const ref = await addDoc(collection(db, 'programs'), {
    name: name.trim(),
    level: level ?? 'Pregrado',
    facultyId,
    institutionId,
    createdBy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Elimina un programa. Lanza error si tiene asignaturas activas.
 */
export async function deleteProgram(programId, institutionId) {
  const q = query(
    collection(db, 'courses'),
    where('programId', '==', programId),
    where('institutionId', '==', institutionId)
  );
  const courses = await getDocs(q);
  if (!courses.empty) {
    throw new Error('No se puede eliminar: este programa tiene asignaturas activas. Elimínalas primero.');
  }
  await deleteDoc(doc(db, 'programs', programId));
}

// ── Asignaturas (Courses) ────────────────────────────────────────────────────

/**
 * Lista las asignaturas de una institución.
 */
export async function getCourses(institutionId) {
  const q = query(collection(db, 'courses'), where('institutionId', '==', institutionId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Crea una asignatura.
 */
export async function addCourse({ name, code, credits, semester, programId, institutionId, createdBy }) {
  if (!name?.trim()) throw new Error('El nombre de la asignatura es obligatorio.');
  if (!programId) throw new Error('Debes seleccionar un programa.');

  const ref = await addDoc(collection(db, 'courses'), {
    name: name.trim(),
    code: code?.trim() ?? '',
    credits: Number(credits) || 3,
    semester: Number(semester) || 1,
    programId,
    institutionId,
    createdBy,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/**
 * Elimina una asignatura.
 */
export async function deleteCourse(courseId) {
  await deleteDoc(doc(db, 'courses', courseId));
}
