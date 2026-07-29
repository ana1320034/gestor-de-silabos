// userService.js
// Gestión de perfiles de usuario en Firestore + creación de cuentas por admin.

import { db, firebaseConfig } from './firebase';
import {
  doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';

/**
 * Lee el perfil de un usuario desde /users/{uid}.
 */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Crea el perfil de un usuario en Firestore al registrarse.
 */
export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    displayName: data.displayName,
    email: data.email,
    role: data.role ?? 'teacher',
    institutionId: data.institutionId,
    programIds: data.programIds ?? [],
    active: true,                        // ← NUEVO: los usuarios nacen activos
    createdBy: data.createdBy ?? null,
    createdAt: serverTimestamp(),
  });
}

/**
 * El admin crea una cuenta Firebase Auth + perfil Firestore para un nuevo usuario.
 * USA UNA APP SECUNDARIA para que la sesión del admin NO se vea afectada.
 */
export async function adminCreateUser({ email, password, displayName, role, institutionId, programIds }, adminUid) {
  const secondaryApp = initializeApp(firebaseConfig, 'Secondary-' + Date.now());
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const newUid = cred.user.uid;

    await createUserProfile(newUid, {
      displayName,
      email,
      role,
      institutionId,
      programIds,
      createdBy: adminUid,
    });

    return newUid;
  } finally {
    await signOut(secondaryAuth).catch(() => {});
    await deleteApp(secondaryApp).catch(() => {});
  }
}

/**
 * Actualiza el rol de un usuario.
 */
export async function updateUserRole(uid, role) {
  await updateDoc(doc(db, 'users', uid), { role });
}

/**
 * Actualiza los programas asignados a un usuario.
 */
export async function updateUserPrograms(uid, programIds) {
  await updateDoc(doc(db, 'users', uid), { programIds: programIds ?? [] });
}

/**
 * Activa o desactiva un usuario (nunca se elimina: se conserva el historial).
 */
export async function setUserActive(uid, active) {
  await updateDoc(doc(db, 'users', uid), { active: !!active });
}

/**
 * Actualiza el displayName de un usuario.
 */
export async function updateUserDisplayName(uid, displayName) {
  await updateDoc(doc(db, 'users', uid), { displayName });
}

/**
 * Lista todos los usuarios de una institución (activos e inactivos).
 */
export async function listUsers(institutionId) {
  const q = query(
    collection(db, 'users'),
    where('institutionId', '==', institutionId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}