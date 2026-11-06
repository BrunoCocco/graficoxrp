import JSZip from 'jszip';
import { CLOE_GUIDE_FILENAME, CLOE_RECEPTION_GUIDE } from './cloe-guide.js';

export async function buildEvidenceZip(evidence, imageBytes) {
  const zip = new JSZip();
  zip.file(CLOE_GUIDE_FILENAME, CLOE_RECEPTION_GUIDE);
  zip.file('analisis.json', JSON.stringify(evidence, null, 2));
  // PNG is already compressed; compress the JSON without recompressing the image.
  zip.file('captura.png', imageBytes, { compression: 'STORE' });
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
