import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [userProfile, setUserProfile]   = useState(null);
  const [institution, setInstitution]   = useState(null);
  const [authLoading, setAuthLoading]   = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setUserProfile(null);
        setInstitution(null);
        setAuthLoading(false);
        return;
      }

      setCurrentUser(firebaseUser);

      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const profileSnap = await getDoc(docRef);

        if (profileSnap.exists()) {
          const profile = { id: profileSnap.id, ...profileSnap.data() };

          // ── Usuario desactivado: cerrar la sesión con explicación ──
          if (profile.active === false) {
            await signOut(auth);
            alert('Tu cuenta está desactivada. Contacta al administrador de tu institución.');
            setCurrentUser(null);
            setUserProfile(null);
            setInstitution(null);
            setAuthLoading(false);
            return;
          }

          setUserProfile(profile);

          if (profile.institutionId) {
            const instSnap = await getDoc(doc(db, 'institutions', profile.institutionId));
            if (instSnap.exists()) {
              setInstitution({ id: instSnap.id, ...instSnap.data() });
            }
          }
        }
      } catch (err) {
        console.error('Error cargando perfil de usuario:', err);
      } finally {
        setAuthLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login  = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const role = userProfile?.role ?? null;

  const value = {
    currentUser,
    userProfile,
    institution,
    role,
    authLoading,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
}