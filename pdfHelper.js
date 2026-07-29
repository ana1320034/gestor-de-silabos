import * as pdfjsLib from 'pdfjs-dist';

// Configuración robusta para Vite/Local
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Convierte Base64 a Uint8Array
 */
const base64ToUint8Array = (base64) => {
  const base64String = base64.split(',')[1] || base64;
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Extrae el texto de un PDF
 */
export const extractTextFromPDF = async (dataInput) => {
  try {
    let source;
    
    if (dataInput.startsWith('data:application/pdf;base64,')) {
      source = { data: base64ToUint8Array(dataInput) };
    } else {
      source = { url: dataInput };
    }

    // Iniciar tarea de carga
    const loadingTask = pdfjsLib.getDocument(source);
    const pdf = await loadingTask.promise;
    let fullText = '';

    // Extraer texto de las primeras 15 páginas
    const numPages = Math.min(pdf.numPages, 15);
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  } catch (err) {
    console.error("Error detallado PDF.js:", err);
    throw new Error("Error técnico al leer el PDF: " + err.message);
  }
};
