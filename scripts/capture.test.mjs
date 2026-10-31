import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capturePng } from '../src/lib/capture.js';

test('capture stops sharing on success, video failure and PNG conversion failure', async () => {
  const nav = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const doc = Object.getOwnPropertyDescriptor(globalThis, 'document');
  try {
    for (const failure of [null, 'video', 'png']) {
      let stopped = 0;
      let drawn = 0;
      const video = { videoWidth: 1280, videoHeight: 720, play: async () => { if (failure === 'video') throw new Error('video failed'); } };
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { mediaDevices: { getDisplayMedia: async () => ({ getTracks: () => [{ stop: () => stopped++ }] }) } } });
      Object.defineProperty(globalThis, 'document', { configurable: true, value: { createElement: tag => tag === 'video' ? video : {
        getContext: () => ({ drawImage: () => drawn++ }),
        toBlob: callback => callback(failure === 'png' ? null : new Blob(['png'], { type: 'image/png' })),
      } } });
      if (failure) await assert.rejects(capturePng());
      else {
        const image = await capturePng();
        assert.equal(image.width, 1280);
        assert.equal(image.sourceVerified, false);
        assert.equal(image.blob.type, 'image/png');
        assert.equal(drawn, 1);
      }
      assert.equal(stopped, 1);
      assert.equal(video.srcObject, null);
    }
  } finally {
    if (nav) Object.defineProperty(globalThis, 'navigator', nav); else delete globalThis.navigator;
    if (doc) Object.defineProperty(globalThis, 'document', doc); else delete globalThis.document;
  }
});
