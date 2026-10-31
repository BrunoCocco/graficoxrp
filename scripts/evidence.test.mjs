import { test } from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import { buildEvidence, fetchInitialCandles, EVIDENCE_BAR_LIMIT } from '../src/lib/evidence.js';
import { buildEvidenceZip } from '../src/lib/evidence-zip.js';

const start = Date.UTC(2026, 9, 30);
const day = 86400000;
const binanceRow = (time, duration = day) => [time, '10.00000001', '12', '9', '11', '1.23456789', time + duration - 1, '13', 3];
const reply = data => async () => ({ ok: true, json: async () => data });

test('Binance retains the exact market, decimal strings, times and open candle state', async () => {
  let requested;
  const result = await fetchInitialCandles('BINANCE:BTCUSD', 'D', {
    now: () => start + day + 1000,
    fetchImpl: async (url, options) => {
      requested = new URL(url);
      assert.equal(options.credentials, 'omit');
      return { ok: true, json: async () => [binanceRow(start), binanceRow(start + day)] };
    },
  });
  assert.equal(requested.hostname, 'data-api.binance.vision');
  assert.equal(requested.searchParams.get('symbol'), 'BTCUSD');
  assert.equal(requested.searchParams.get('interval'), '1d');
  assert.equal(result.source.market, 'spot');
  assert.equal(result.candles[0].open, '10.00000001');
  assert.equal(result.candles[0].volume, '1.23456789');
  assert.deepEqual(result.candles.map(row => row.isClosed), [true, false]);
  assert.equal(result.candles[0].closeTimeExclusive, new Date(start + day).toISOString());
});

test('Kraken maps base volume rather than VWAP or trade count and records canonical symbol', async () => {
  const result = await fetchInitialCandles('KRAKEN:XRPUSD', '240', {
    now: () => start + 1000,
    fetchImpl: reply({ error: [], result: { XXRPZUSD: [[start / 1000, '10', '12', '9', '11', '10.5', '123.45', 77]], last: start / 1000 } }),
  });
  assert.equal(result.status, 'available');
  assert.equal(result.source.providerSymbol, 'XXRPZUSD');
  assert.equal(result.candles[0].volume, '123.45');
  assert.equal(result.candles[0].isClosed, false);
  assert.equal(result.candles[0].closeTimeExclusive, new Date(start + 4 * 3600000).toISOString());
});

test('errors and unsupported instruments stay unavailable without silent market substitution', async () => {
  const urls = [];
  const failed = await fetchInitialCandles('BINANCE:BTCUSD', 'W', { fetchImpl: async url => {
    urls.push(url);
    return { ok: true, json: async () => ({ code: -1121, msg: 'Invalid symbol.' }) };
  } });
  assert.equal(urls.length, 1);
  assert.equal(failed.status, 'unavailable');
  assert.deepEqual(failed.candles, []);
  assert.match(failed.error, /Invalid symbol/);
  const unsupported = await fetchInitialCandles('NASDAQ:AAPL', 'D', { fetchImpl: () => { throw new Error('must not call'); } });
  assert.equal(unsupported.requestUrl, null);
  assert.equal(unsupported.status, 'unavailable');
});

test('Kraken weekly alignment stays explicit rather than relabeling Thursday as Monday', async () => {
  const thursday = Date.UTC(2026, 9, 29);
  const result = await fetchInitialCandles('KRAKEN:XRPUSD', 'W', {
    now: () => thursday + day,
    fetchImpl: reply({ error: [], result: { XXRPZUSD: [[thursday / 1000, '10', '12', '9', '11', '10.5', '123.45', 77]], last: thursday / 1000 } }),
  });
  assert.equal(result.weekStartsOnUtc, 'Thursday');
  assert.equal(result.candles[0].openTime, new Date(thursday).toISOString());
  assert.match(result.alignmentWarning, /Comprobar/);
});

test('HTTP, network, empty and malformed data are reported instead of fabricated candles', async () => {
  for (const fetchImpl of [
    async () => ({ ok: false, status: 429 }),
    async () => { throw new TypeError('Failed to fetch'); },
    reply([]),
    reply([binanceRow(start), binanceRow(start)]),
    reply([[start, '10', '2', '9', '11', '4', start + day - 1]]),
    reply([[start, '', '12', '9', '11', '4', start + day - 1]]),
    reply({ error: ['EQuery:Unknown asset pair'] }),
  ]) {
    const result = await fetchInitialCandles('BINANCE:BTCUSD', 'D', { fetchImpl, now: () => start + 1 });
    assert.equal(result.status, 'unavailable');
    assert.deepEqual(result.candles, []);
  }
});

test('recent batches are bounded and gaps remain explicit', async () => {
  const rows = Array.from({ length: 300 }, (_, i) => binanceRow(start + i * day));
  rows.splice(100, 1);
  const result = await fetchInitialCandles('BINANCE:ETHUSDT', 'D', { fetchImpl: reply(rows), now: () => start + 400 * day });
  assert.equal(result.candles.length, EVIDENCE_BAR_LIMIT);
  assert.equal(result.historyScope, 'recent-update-batch');
  assert.equal(result.coverage.gaps.length, 1);
});

test('export freezes initial inputs, fetches all initial intervals and keeps visual changes unverified', async () => {
  const input = { asset: { id: 'BTC', symbol: 'BINANCE:BTCUSD' }, periods: [{ interval: 'W' }, { interval: 'D' }, { interval: '240' }], focus: 'D', journal: [{ hypothesis: 'original' }] };
  const requested = [];
  const exporting = buildEvidence(input, { fetchImpl: async url => {
    requested.push(new URL(url).searchParams.get('interval'));
    await new Promise(resolve => setTimeout(resolve, 1));
    return { ok: true, json: async () => [binanceRow(start)] };
  }, now: () => start + 1 });
  input.asset.symbol = 'KRAKEN:XRPUSD';
  input.periods[0].interval = 'M';
  input.journal[0].hypothesis = 'changed later';
  const evidence = await exporting;
  assert.equal(evidence.asset.symbol, 'BINANCE:BTCUSD');
  assert.deepEqual(requested.sort(), ['1d', '1w', '4h']);
  assert.deepEqual(evidence.initialConfiguration.periods, ['W', 'D', '240']);
  assert.deepEqual(evidence.visiblePeriods, ['D']);
  assert.equal(evidence.widgetStateVerified, false);
  assert.equal(evidence.journal[0].hypothesis, 'original');
  assert.equal(evidence.screenshot, null);
  assert.ok(evidence.limitations.some(text => text.includes('sin reemplazar')));
});

test('ZIP round trip retains both the JSON and original image bytes', async () => {
  const image = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const evidence = { id: 'same-export', screenshot: { filename: 'captura.png' }, marketData: [{ status: 'unavailable' }] };
  const bytes = await buildEvidenceZip(evidence, image);
  const zip = await JSZip.loadAsync(bytes);
  assert.deepEqual(Object.keys(zip.files).sort(), ['analisis.json', 'captura.png']);
  assert.deepEqual(JSON.parse(await zip.file('analisis.json').async('string')), evidence);
  assert.deepEqual(await zip.file('captura.png').async('uint8array'), image);
});
