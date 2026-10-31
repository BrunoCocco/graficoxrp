import JSZip from 'jszip';

export async function buildEvidenceZip(evidence, imageBytes) {
  const zip = new JSZip();
  zip.file('analisis.json', JSON.stringify(evidence, null, 2));
  // PNG is already compressed; compress the JSON without recompressing the image.
  zip.file('captura.png', imageBytes, { compression: 'STORE' });
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}
