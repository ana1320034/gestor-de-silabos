import { db, storage } from './firebase';
import {
  collection, addDoc, query, where, getDocs,
  deleteDoc, doc, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const COLLECTION = 'documents';

/** Tipos de documento que el sistema reconoce */
export const DOC_TYPE_CATALOG = [
  { id: 'MAESTRO',      label: 'Doc. Maestro',   required: true  },
  { id: 'PEP',          label: 'PEP',             required: true  },
  { id: 'LINEAMIENTOS', label: 'Lineamientos',    required: false },
  { id: 'PLAN',         label: 'Plan Estudios',   required: true  },
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB (igual que las reglas de Storage)

export const documentService = {
  /**
   * Sube el PDF a Firebase Storage y guarda la ficha en Firestore.
   * El archivo vive en: institutions/{institutionId}/documents/{programId}/{type}_{timestamp}.pdf
   */
  async uploadDocument({ file, programId, institutionId, type, userId }) {
    // Validaciones previas
    if (file.type !== 'application/pdf') {
      throw new Error('Solo se permiten archivos PDF.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo permitido es 20 MB.`
      );
    }

    // 1. Subir el archivo a Storage
    const storagePath = `institutions/${institutionId}/documents/${programId}/${type}_${Date.now()}.pdf`;
    const fileRef = ref(storage, storagePath);
    await uploadBytes(fileRef, file, { contentType: 'application/pdf' });

    // 2. Obtener la URL de descarga (esto es lo que se guarda en la ficha)
    const fileUrl = await getDownloadURL(fileRef);

    // 3. ¿Ya existe un documento del mismo tipo para este programa? → nueva versión
    const existing = await this.findDocument(institutionId, programId, type);
    if (existing) {
      // Borrar el archivo anterior de Storage (si era de Storage)
      if (existing.storagePath && existing.storagePath !== 'db_embedded') {
        await deleteObject(ref(storage, existing.storagePath)).catch(() => {});
      }
      const docRef = doc(db, COLLECTION, existing.id);
      await updateDoc(docRef, {
        fileName: file.name,
        fileUrl,
        storagePath,
        uploadedBy: userId || 'anonymous',
        uploadedAt: serverTimestamp(),
        version: (existing.version || 1) + 1,
        extractedData: null // Resetear IA al subir nueva versión
      });
      return { id: existing.id, version: (existing.version || 1) + 1 };
    }

    // 4. Crear ficha nueva en Firestore (solo metadatos, nada de base64)
    const docData = {
      institutionId,
      programId,
      type,
      fileName: file.name,
      fileUrl,
      storagePath,
      uploadedBy: userId || 'anonymous',
      uploadedAt: serverTimestamp(),
      status: 'active',
      version: 1,
      extractedData: null
    };

    const docRef = await addDoc(collection(db, COLLECTION), docData);
    return { id: docRef.id, ...docData };
  },

  /**
   * Busca un documento específico por institución, programa y tipo.
   */
  async findDocument(institutionId, programId, type) {
    const q = query(
      collection(db, COLLECTION),
      where('institutionId', '==', institutionId),
      where('programId', '==', programId),
      where('type', '==', type),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  },

  /**
   * Obtiene todos los documentos activos de una institución.
   */
  async getDocumentsByInstitution(institutionId) {
    const q = query(
      collection(db, COLLECTION),
      where('institutionId', '==', institutionId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  /**
   * Obtiene todos los documentos de un programa específico.
   */
  async getDocumentsByProgram(institutionId, programId) {
    const q = query(
      collection(db, COLLECTION),
      where('institutionId', '==', institutionId),
      where('programId', '==', programId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  /**
   * Valida qué documentos obligatorios faltan para un programa.
   */
  async validateCompleteness(institutionId, programId) {
    const docs = await this.getDocumentsByProgram(institutionId, programId);
    const uploadedTypes = docs.map(d => d.type);

    const requiredTypes = DOC_TYPE_CATALOG.filter(t => t.required);
    const missing = requiredTypes
      .filter(t => !uploadedTypes.includes(t.id))
      .map(t => t.label);

    const uploaded = requiredTypes
      .filter(t => uploadedTypes.includes(t.id))
      .map(t => t.label);

    const percent = requiredTypes.length > 0
      ? Math.round((uploaded.length / requiredTypes.length) * 100)
      : 100;

    return {
      complete: missing.length === 0,
      missing,
      uploaded,
      percent,
      totalRequired: requiredTypes.length,
      totalUploaded: uploaded.length
    };
  },

  /**
   * Obtiene los datos extraídos por IA de un programa.
   */
  async getExtractedDataForProgram(institutionId, programId) {
    const docs = await this.getDocumentsByProgram(institutionId, programId);
    const result = {};
    for (const d of docs) {
      if (d.extractedData) {
        result[d.type] = {
          fileName: d.fileName,
          extractedData: d.extractedData,
          processedAt: d.processedAt
        };
      }
    }
    return result;
  },

  /**
   * Elimina un documento (borrado lógico de la ficha + borrado real del archivo).
   */
  async deleteDocument(docId, storagePath) {
    const docRef = doc(db, COLLECTION, docId);
    await updateDoc(docRef, { status: 'deleted' });
    if (storagePath && storagePath !== 'db_embedded') {
      await deleteObject(ref(storage, storagePath)).catch(() => {});
    }
  },

  /**
   * Elimina la ficha permanentemente (y el archivo, si se indica la ruta).
   */
  async hardDeleteDocument(docId, storagePath) {
    if (storagePath && storagePath !== 'db_embedded') {
      await deleteObject(ref(storage, storagePath)).catch(() => {});
    }
    return await deleteDoc(doc(db, COLLECTION, docId));
  }
};