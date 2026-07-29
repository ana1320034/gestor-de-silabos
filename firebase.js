import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyD1hgndBq01Hggy9SPMZ4OC-W7Kh2vWxAE",
  authDomain: "gestor-silabos.firebaseapp.com",
  projectId: "gestor-silabos",
  storageBucket: "gestor-silabos.firebasestorage.app",
  messagingSenderId: "124511221752",
  appId: "1:124511221752:web:03fe9c3dec91d33e18c80d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);