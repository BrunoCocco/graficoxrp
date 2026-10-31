// Public market data only. Never substitute a quote currency, exchange or market.
const INTERVALS = {
  W: { binance: '1w', kraken: 10080, milliseconds: 7 * 86400000 },
  D: { binance: '1d', kraken: 1440, milliseconds: 86400000 },
  240: { binance: '4h', kraken: 240, milliseconds: 4 * 3600000 },
};
export const EVIDENCE_BAR_LIMIT = 240;

async function publicJson(url, fetchImpl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetchImpl(url, { signal: controller.signal, credentials: 'omit', cache: 'no-store' });
    if (!response.ok) throw new Error(`El proveedor respondió HTTP ${response.status}.`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function decimal(value) {
  if (!['string', 'number'].includes(typeof value) || String(value).trim() === '' || !Number.isFinite(Number(value))) {
    throw new Error('El proveedor devolvió un precio o volumen inválido.');
  }
  return String(value);
}

function candle(openTime, endTime, values, retrievedAt) {
  if (!Number.isSafeInteger(openTime) || !Number.isSafeInteger(endTime) || endTime <= openTime) {
    throw new Error('El proveedor devolvió horarios inválidos.');
  }
  const [open, high, low, close, volume] = values.map(decimal);
  if ([open, high, low, close].some(value => Number(value) <= 0) || Number(volume) < 0 ||
      Number(high) < Math.max(Number(open), Number(close), Number(low)) ||
      Number(low) > Math.min(Number(open), Number(close), Number(high))) {
    throw new Error('El proveedor devolvió una vela inconsistente.');
  }
  return {
    openTime: new Date(openTime).toISOString(),
    closeTimeExclusive: new Date(endTime).toISOString(),
    open, high, low, close, volume,
    isClosed: retrievedAt >= endTime,
  };
}

export async function fetchInitialCandles(symbol, interval, { fetchImpl = fetch, now = Date.now } = {}) {
  const [exchange, pair, extra] = symbol.split(':');
  const spec = INTERVALS[interval];
  const base = { symbol, interval, configurationBasis: 'initial-widget-configuration', timezone: 'Etc/UTC', requestedBars: EVIDENCE_BAR_LIMIT };
  let requestUrl = null;
  try {
    if (!spec || extra || !/^[A-Z0-9]+$/.test(pair ?? '') || !['BINANCE', 'KRAKEN'].includes(exchange)) {
      throw new Error('Este símbolo o temporalidad no tiene un proveedor de velas compatible.');
    }
    const params = new URLSearchParams({ symbol: pair, interval: spec.binance, limit: String(EVIDENCE_BAR_LIMIT) });
    requestUrl = exchange === 'BINANCE'
      ? `https://data-api.binance.vision/api/v3/klines?${params}`
      : `https://api.kraken.com/0/public/OHLC?${new URLSearchParams({ pair, interval: String(spec.kraken) })}`;
    const data = await publicJson(requestUrl, fetchImpl);
    const retrievedAt = now();
    let rows;
    let providerSymbol = pair;
    if (exchange === 'BINANCE') {
      if (!Array.isArray(data)) throw new Error(data?.msg || 'Binance no devolvió velas para este par exacto.');
      rows = data.map(row => candle(row[0], row[6] + 1, [row[1], row[2], row[3], row[4], row[5]], retrievedAt));
    } else {
      if (data?.error?.length) throw new Error(data.error.join('; '));
      const entries = Object.entries(data?.result ?? {}).filter(([key]) => key !== 'last');
      if (entries.length !== 1 || !Array.isArray(entries[0][1])) throw new Error('Kraken no devolvió velas para este par exacto.');
      providerSymbol = entries[0][0];
      rows = entries[0][1].map(row => candle(row[0] * 1000, row[0] * 1000 + spec.milliseconds, [row[1], row[2], row[3], row[4], row[6]], retrievedAt));
    }
    rows = rows.filter(row => Date.parse(row.openTime) <= retrievedAt).slice(-EVIDENCE_BAR_LIMIT);
    if (!rows.length) throw new Error('El proveedor no devolvió barras disponibles.');
    const gaps = [];
    rows.forEach((row, index) => {
      if (!index) return;
      const delta = Date.parse(row.openTime) - Date.parse(rows[index - 1].openTime);
      if (delta <= 0) throw new Error('Las barras están repetidas o fuera de orden.');
      if (delta !== spec.milliseconds) gaps.push({ after: rows[index - 1].openTime, before: row.openTime });
    });
    return {
      ...base, status: 'available', source: { exchange, market: 'spot', providerSymbol, requestUrl },
      retrievedAt: new Date(retrievedAt).toISOString(),
      historyScope: 'recent-update-batch', volumeUnit: 'base-asset', barAlignment: 'provider-native-not-verified-against-widget',
      ...(interval === 'W' ? {
        weekStartsOnUtc: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(rows[0].openTime).getUTCDay()],
        alignmentWarning: 'Comprobar el inicio de semana contra la captura antes de comparar barras; se conservan las semanas originales del proveedor.',
      } : {}),
      coverage: { count: rows.length, firstOpenTime: rows[0].openTime, lastOpenTime: rows.at(-1).openTime, gaps },
      candles: rows,
    };
  } catch (error) {
    return {
      ...base, status: 'unavailable', requestUrl, retrievedAt: new Date(now()).toISOString(), candles: [],
      error: error?.name === 'AbortError' ? 'La consulta superó los 15 segundos.' : error?.message || 'No se pudieron recuperar las velas.',
    };
  }
}

export async function buildEvidence({ asset, periods, focus, journal, screenshot = null, id = crypto.randomUUID() }, options = {}) {
  // Snapshot inputs before the first request: later UI changes cannot relabel the data.
  const initialAsset = { id: asset.id, symbol: asset.symbol };
  const initialPeriods = periods.map(period => period.interval);
  const journalSnapshot = structuredClone(journal);
  const requestedAt = new Date().toISOString();
  const marketData = await Promise.all(initialPeriods.map(interval => fetchInitialCandles(initialAsset.symbol, interval, options)));
  return {
    version: 2, application: 'graficosxrp', type: 'analysis-evidence', id,
    requestedAt, exportedAt: new Date().toISOString(), asset: initialAsset,
    configurationBasis: 'initial-widget-configuration', widgetStateVerified: false,
    initialConfiguration: { symbol: initialAsset.symbol, periods: initialPeriods, timezone: 'Etc/UTC', chartType: 'candles' },
    periods: initialPeriods,
    visiblePeriods: focus === 'all' ? initialPeriods : [focus],
    journal: journalSnapshot, screenshot, marketData,
    analysisInstructions: {
      preserveOriginalData: true,
      visualMismatchAction: 'Si la captura permite identificar otra temporalidad o símbolo, consultar sus velas por separado, conservando fuente y hora de consulta. Si no se identifica con certeza, pedir confirmación.',
      historicalCutoff: 'Para analizar el momento de la captura, excluir las velas posteriores. Una consulta posterior no reconstruye por sí sola el estado de una vela que estaba abierta entonces.',
    },
    limitations: [
      'Símbolo, temporalidades y tipo de gráfico corresponden a la configuración inicial; no se leen los cambios internos del widget.',
      'Si la imagen muestra otra temporalidad o símbolo, analizar esa discrepancia por separado, sin reemplazar las barras originales del JSON.',
      'Las velas son un lote reciente del histórico, no la serie completa. Los valores de una vela abierta pueden cambiar.',
      'La captura y las consultas tienen horarios propios; no constituyen una instantánea simultánea.',
      'Las semanas conservan la alineación nativa del proveedor; no se garantiza que comiencen el mismo día que en el widget.',
      'Los dibujos e indicadores internos de TradingView no se exportan como datos. Un proveedor no disponible se registra sin sustituir el mercado.',
    ],
  };
}
