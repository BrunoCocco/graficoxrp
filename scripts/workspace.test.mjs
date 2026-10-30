import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWorkspace, readWorkspace, writeWorkspace, exportWorkspace, ASSETS, PERIODS } from '../src/lib/workspace.js';
const sample = { version: 1, assets: ['BTC', 'XRP'], selected: 'XRP' };
test('export/import round trip preserves assets and selection, without identity or credentials', () => {
  const json = exportWorkspace(sample);
  assert.deepEqual(validateWorkspace(JSON.parse(json)), sample);
  assert.equal(/password|access_token|userId/.test(json), false);
});
test('invalid and oversized configurations are rejected', () => {
  for (const value of [null, {}, { ...sample, version: 2 }, { ...sample, assets: [] }, { ...sample, assets: ['BTC', 'BTC'] }, { ...sample, selected: 'ETH' }, { ...sample, assets: ['UNKNOWN'] }, { ...sample, assets: Array(13).fill('BTC') }]) assert.throws(() => validateWorkspace(value));
});
test('browser storage is scoped by user and corrupt history is tolerated', () => {
  const map = new Map(); const storage = { getItem: key => map.get(key), setItem: (key, value) => map.set(key, value) };
  writeWorkspace(storage, 'ownerA', sample);
  assert.deepEqual(readWorkspace(storage, 'ownerA'), sample);
  assert.equal(readWorkspace(storage, 'ownerB'), null);
  storage.setItem('graficoxrp:workspace:v1:ownerB', 'broken');
  assert.equal(readWorkspace(storage, 'ownerB'), null);
});
test('validation copies only supported fields and does not mutate source', () => {
  const value = validateWorkspace({ ...sample, token: 'do-not-export' });
  value.assets.push('ETH'); assert.deepEqual(sample.assets, ['BTC', 'XRP']);
  assert.equal('token' in value, false);
});
test('catalog symbols are distinct and original three intervals retained', () => {
  assert.equal(new Set(ASSETS.map(asset => asset.id)).size, ASSETS.length);
  assert.deepEqual(PERIODS.map(period => period.interval), ['W', 'D', '240']);
});
