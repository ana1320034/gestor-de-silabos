/**
 * bootstrap.md — Guía de configuración inicial del sistema
 *
 * EJECUTAR SOLO UNA VEZ al desplegar por primera vez.
 *
 * El sistema requiere:
 * 1. Una institución en /institutions/{id}
 * 2. Un perfil de usuario admin en /users/{uid}
 *
 * Cómo hacerlo (sin backend):
 *
 * 1. Ve a Firebase Console → Firestore Database
 *    https://console.firebase.google.com/project/gestor-silabos/firestore
 *
 * 2. Crea la colección "institutions" con un documento nuevo:
 *    {
 *      name: "Nombre de tu institución",
 *      type: "university",   ← o "school"
 *      adminEmail: "admin@tuinstitucion.edu.co",
 *      createdAt: (timestamp actual)
 *    }
 *    Copia el ID generado (ej. "abc123inst")
 *
 * 3. Ve a Firebase Console → Authentication → Users
 *    Copia el UID del usuario admin (ej. "XYZabc123uid")
 *
 * 4. En Firestore, crea la colección "users" con un documento cuyo ID = UID del admin:
 *    {
 *      displayName: "Tu Nombre",
 *      email: "admin@tuinstitucion.edu.co",
 *      role: "admin",
 *      institutionId: "abc123inst",   ← el ID de la institución del paso 2
 *      createdBy: null,
 *      createdAt: (timestamp actual)
 *    }
 *
 * 5. Cierra sesión y vuelve a iniciar sesión en la app.
 *    Ahora verás el panel completo con acceso de administrador.
 *

/**
 * 🚀 CHECKLIST DE PRODUCCIÓN (IMPORTANTE)
 * 
 * 1. MIGRACIÓN A FIREBASE STORAGE (PLAN BLAZE):
 *    Actualmente el sistema usa un bypass de Base64 en Firestore para evitar 
 *    el registro de tarjeta de crédito (documentService.js).
 *    En producción:
 *    - Activar Plan Blaze en Firebase.
 *    - Revertir documentService.js para usar uploadBytes de Storage.
 *    - Esto permitirá archivos de más de 1MB y será más eficiente.
 * 
 * 2. CONFIGURACIÓN DE CORS:
 *    Configurar el bucket de Google Cloud para permitir el dominio definitivo.
 * 
 * 3. API KEYS:
 *    Asegurar que el Worker de Cloudflare tenga restricciones de dominio.
 */
