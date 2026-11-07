import JSZip from 'jszip';
import { CLOE_INSTRUCTIONS, CLOE_INSTRUCTIONS_FILENAME } from './cloe-instructions.js';

export async function buildEvidenceZip(evidence, imageBytes) {
  const zip = new JSZip();
  zip.file(CLOE_INSTRUCTIONS_FILENAME, CLOE_INSTRUCTIONS);
  zip.file('analisis.json', JSON.stringify(evidence, null, 2));
  // PNG is already compressed; compress the text files without recompressing the image.
  zip.file('captura.png', imageBytes, { compression: 'STORE' });
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
