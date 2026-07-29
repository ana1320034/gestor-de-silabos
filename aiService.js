// aiService.js
// Proxy hacia Cloudflare Worker → Google Gemini AI

import { auth } from './firebase';

const WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;
const REQUEST_TIMEOUT_MS = 30_000; // 30 segundos
const RETRY_DELAY_MS = 1_500;      // 1.5 segundos entre reintentos

/**
 * Valida que la URL del Worker esté configurada y no sea un placeholder.
 */
function assertWorkerConfigured() {
  if (!WORKER_URL || WORKER_URL.includes('tusubdominio') || WORKER_URL.trim() === '') {
    throw new Error(
      'La URL del Cloudflare Worker no está configurada. ' +
      'Añade VITE_CLOUDFLARE_WORKER_URL=<tu-url> al archivo .env y reinicia el servidor.'
    );
  }
}

/**
 * Realiza un fetch con AbortController para aplicar timeout.
 */
async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`La solicitud superó el tiempo límite (${timeoutMs / 1000}s). Verifica tu conexión o el estado del Worker.`);
    }
    throw err;
  } finally {
    clearTimeout(timerId);
  }
}

/**
 * Llama al Worker con retry 1x en errores de red/servidor (5xx).
 * Envía el token del usuario autenticado (requerido por el Worker blindado).
 */
async function callWorker(prompt) {
  assertWorkerConfigured();

  // Obtener el "carné" (token) del usuario con sesión iniciada
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Debes iniciar sesión para usar el asistente de IA.');
  }
  const idToken = await user.getIdToken();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  };

  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
    }
    try {
      const response = await fetchWithTimeout(WORKER_URL, options);

      if (!response.ok) {
        const body = await response.text();
        const err = new Error(`Worker respondió ${response.status}: ${body}`);
        err.status = response.status;
        if (response.status >= 400 && response.status < 500) throw err;
        lastError = err;
        continue; // reintenta solo para 5xx
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Google API Error: ${data.error.message}`);
      }

      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      if (data.text) {
        return data.text;
      }

      throw new Error('Formato de respuesta desconocido del Worker. Revisa la configuración del Cloudflare Worker.');
    } catch (err) {
      if (err.status >= 400 && err.status < 500) throw err;
      if (err.message.includes('tiempo límite') || err.message.includes('Google API')) throw err;
      lastError = err;
    }
  }
  throw lastError;
}

/**
 * Extrae el primer objeto/array JSON válido del texto de respuesta.
 */
function parseJsonResponse(text) {
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Continuar con extracción manual
  }

  const startBrace  = cleaned.indexOf('{');
  const startBracket = cleaned.indexOf('[');

  let startIdx = -1;
  let endChar = '';

  if (startBrace === -1 && startBracket === -1) {
    throw new Error(`La IA no devolvió un JSON válido. Respuesta:\n${text.slice(0, 300)}`);
  }

  if (startBrace !== -1 && (startBracket === -1 || startBrace < startBracket)) {
    startIdx = startBrace;
    endChar = '}';
  } else {
    startIdx = startBracket;
    endChar = ']';
  }

  const lastIdx = cleaned.lastIndexOf(endChar);
  if (lastIdx === -1 || lastIdx <= startIdx) {
    throw new Error(`La IA devolvió un JSON incompleto. Respuesta:\n${text.slice(0, 300)}`);
  }

  const jsonCandidate = cleaned.slice(startIdx, lastIdx + 1);
  try {
    return JSON.parse(jsonCandidate);
  } catch {
    throw new Error(`La IA devolvió un JSON inválido. Respuesta recibida:\n${text.slice(0, 300)}`);
  }
}

// ── API Pública ──────────────────────────────────────────────────────────────
export const aiService = {

  /**
   * Genera sugerencias curriculares para el sílabo completo.
   */
  generateSyllabusSuggestions: async (courseName) => {
    const prompt = `Eres un experto en diseño curricular universitario. Genera información para un sílabo de la asignatura: "${courseName}".
Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional ni bloques de markdown:
{
  "propositoFormativo": "Propósito general del curso en un párrafo corto.",
  "resultadosAprendizaje": ["Resultado 1", "Resultado 2", "Resultado 3"],
  "competencias": ["Competencia 1", "Competencia 2", "Competencia 3"],
  "metodologiasSugeridas": ["Aprendizaje Basado en Proyectos (ABPr)", "Estudio de Casos"],
  "descripcionEstrategia": "Descripción pedagógica de cómo se aplicarán estas metodologías durante el semestre."
}`;
    const text = await callWorker(prompt);
    return parseJsonResponse(text);
  },

  /**
   * Genera los detalles de una unidad temática individual.
   */
  generateUnitDetails: async (courseName, unitName) => {
    const prompt = `Eres un experto en diseño curricular universitario. Para la asignatura "${courseName}", genera los detalles de la unidad temática: "${unitName}".
Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional ni bloques de markdown:
{
  "learningOutcome": "Resultado de aprendizaje con verbo de acción (Taxonomía de Bloom).",
  "contents": "Lista de temas y subtemas separados por punto y coma.",
  "teacherActivities": "Actividades de enseñanza con acompañamiento del docente.",
  "independentActivities": "Actividades de trabajo autónomo del estudiante.",
  "evidence": "Evidencia de aprendizaje que el estudiante debe entregar.",
  "evaluationType": "Rúbrica",
  "rubric": [
    { "criterion": "Criterio 1", "excellent": "Descriptor Excelente (9-10)", "good": "Descriptor Bueno (7-8)", "acceptable": "Descriptor Aceptable (5-6)", "insufficient": "Descriptor Insuficiente (1-4)" },
    { "criterion": "Criterio 2", "excellent": "Descriptor Excelente", "good": "Descriptor Bueno", "acceptable": "Descriptor Aceptable", "insufficient": "Descriptor Insuficiente" },
    { "criterion": "Criterio 3", "excellent": "Descriptor Excelente", "good": "Descriptor Bueno", "acceptable": "Descriptor Aceptable", "insufficient": "Descriptor Insuficiente" }
  ]
}`;
    const text = await callWorker(prompt);
    return parseJsonResponse(text);
  },

  /**
   * Genera 4-5 unidades temáticas completas para una asignatura.
   */
  generateAllUnits: async (courseName) => {
    const prompt = `Eres un experto en diseño curricular universitario. Genera entre 4 y 5 unidades temáticas completas para el sílabo de la asignatura: "${courseName}".
Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional ni bloques de markdown:
{
  "units": [
    {
      "name": "Unidad 1: Nombre descriptivo",
      "duration": "3 semanas",
      "learningOutcome": "Resultado de aprendizaje con verbo de acción (Bloom).",
      "contents": "Temas y subtemas separados por punto y coma.",
      "teacherActivities": "Actividades con acompañamiento docente.",
      "independentActivities": "Actividades de trabajo autónomo.",
      "evidence": "Evidencia de aprendizaje a entregar.",
      "evaluationType": "Rúbrica",
      "rubric": [
        { "criterion": "Criterio", "excellent": "Descriptor Excelente (9-10)", "good": "Descriptor Bueno (7-8)", "acceptable": "Descriptor Aceptable (5-6)", "insufficient": "Descriptor Insuficiente (1-4)" }
      ]
    }
  ]
}
Cada unidad debe tener mínimo 3 criterios de rúbrica. Las unidades deben ir de lo básico a lo avanzado.`;
    const text = await callWorker(prompt);
    return parseJsonResponse(text);
  },

  /**
   * Extrae información estructurada de un documento oficial (PEP, Maestro, etc.)
   */
  extractCurricularData: async (pdfText, docType) => {
    const prompt = `Eres un experto en diseño curricular. Analiza el siguiente texto extraído de un "${docType}" institucional.
Tu tarea es extraer los pilares fundamentales para que luego podamos generar sílabos coherentes con este documento.

Extrae:
1. Competencias principales.
2. Resultados de aprendizaje globales.
3. Estructura de áreas o núcleos temáticos si existen.

TEXTO DEL DOCUMENTO:
${pdfText.substring(0, 15000)}

Devuelve ÚNICAMENTE un objeto JSON con esta estructura exacta:
{
  "resumen": "Breve resumen del enfoque pedagógico del documento.",
  "competencias": ["Competencia 1", "Competencia 2"],
  "resultadosAprendizaje": ["RA 1", "RA 2"],
  "nucleosTematicos": ["Núcleo A", "Núcleo B"],
  "metadatosIA": {
    "docIdentificado": "${docType}",
    "confianza": "alta"
  }
}
No incluyas explicaciones fuera del JSON.`;

    const text = await callWorker(prompt);
    return parseJsonResponse(text);
  }
};