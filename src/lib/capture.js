export async function capturePng() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('Este navegador no permite capturar pestañas. Exportá el JSON y adjuntá una captura del sistema.');
  }
  let stream;
  let video;
  try {
    // Must remain the first asynchronous operation, directly after the user's click.
    stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 1 }, audio: false });
    video = document.createElement('video');
    video.muted = true;
    video.srcObject = stream;
    await video.play();
    if (!video.videoWidth || !video.videoHeight) throw new Error('No se recibió una imagen válida.');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const capturedAt = new Date().toISOString();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('No se pudo generar el PNG.');
    return { blob, capturedAt, width: canvas.width, height: canvas.height, sourceVerified: false };
  } finally {
    stream?.getTracks().forEach(track => track.stop());
    if (video) video.srcObject = null;
  }
}
