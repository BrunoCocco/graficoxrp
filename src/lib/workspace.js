export const ASSETS = [
  ['BTC', 'Bitcoin', 'BINANCE:BTCUSD', 'bitcoin'],
  ['ETH', 'Ethereum', 'BINANCE:ETHUSDT', 'ethereum'],
  ['SOL', 'Solana', 'BINANCE:SOLUSD', 'solana'],
  ['XRP', 'XRP', 'KRAKEN:XRPUSD', 'ripple'],
  ['HBAR', 'Hedera', 'KRAKEN:HBARUSD', 'hedera-hashgraph'],
  ['XLM', 'Stellar', 'KRAKEN:XLMUSD', 'stellar'],
  ['VELO', 'Velo', 'KRAKEN:VELOUSD', 'velo'],
  ['SHX', 'Stronghold', 'KRAKEN:SHXUSD', 'stronghold-token'],
  ['ADA', 'Cardano', 'BINANCE:ADAUSDT', 'cardano'],
  ['AVAX', 'Avalanche', 'BINANCE:AVAXUSDT', 'avalanche-2'],
  ['LINK', 'Chainlink', 'BINANCE:LINKUSDT', 'chainlink'],
  ['DOGE', 'Dogecoin', 'BINANCE:DOGEUSDT', 'dogecoin'],
].map(([id, name, symbol, coinId]) => ({ id, name, symbol, coinId }));
export const MAX_ASSETS = 7;
const SYMBOL_PATTERN = /^[A-Z0-9_]{1,24}:[A-Z0-9_.!/-]{1,48}$/;
export function resolveAsset(id) {
  if (typeof id !== 'string') return null;
  const known = ASSETS.find(asset => asset.id === id || asset.symbol === id);
  if (known) return known;
  if (!SYMBOL_PATTERN.test(id)) return null;
  return { id, name: id.split(':')[1], symbol: id, coinId: null, custom: true };
}
export function searchAssets(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return ASSETS.filter(asset => words.every(word => `${asset.id} ${asset.name} ${asset.symbol}`.toLowerCase().includes(word)));
}
export const PERIODS = [{ interval: 'W', label: 'semanal' }, { interval: 'D', label: 'diario' }, { interval: '240', label: '4 horas' }];
export function validateWorkspace(input, { allowLegacy = false } = {}) {
  if (input?.version !== 1 || !Array.isArray(input.assets) || input.assets.length < 1 || input.assets.length > (allowLegacy ? 12 : MAX_ASSETS)) throw new Error('Elegí entre 1 y 7 activos.');
  if (input.assets.some(id => !resolveAsset(id)) || new Set(input.assets.map(id => resolveAsset(id).symbol)).size !== input.assets.length) throw new Error('La configuración contiene activos inválidos o repetidos.');
  if (!input.assets.includes(input.selected)) throw new Error('El activo seleccionado debe pertenecer al espacio.');
  return { version: 1, assets: [...input.assets], selected: input.selected };
}
export function workspaceKey(userId) { return `graficoxrp:workspace:v1:${userId}`; }
export function readWorkspace(storage, userId) {
  try { const raw = storage.getItem(workspaceKey(userId)); return raw ? validateWorkspace(JSON.parse(raw), { allowLegacy: true }) : null; }
  catch { return null; }
}
export function writeWorkspace(storage, userId, workspace) {
  storage.setItem(workspaceKey(userId), JSON.stringify(validateWorkspace(workspace)));
}
export function exportWorkspace(workspace) {
  return JSON.stringify({ ...validateWorkspace(workspace), application: 'graficosxrp', exportedAt: new Date().toISOString(), layout: ['W', 'D', '240'], scope: 'Configuración de activos; no incluye dibujos de TradingView ni credenciales.' }, null, 2);
}
