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
export const PERIODS = [{ interval: 'W', label: 'semanal' }, { interval: 'D', label: 'diario' }, { interval: '240', label: '4 horas' }];
export function validateWorkspace(input) {
  if (input?.version !== 1 || !Array.isArray(input.assets) || input.assets.length < 1 || input.assets.length > ASSETS.length) throw new Error('Elegí entre 1 y 12 activos del catálogo.');
  if (new Set(input.assets).size !== input.assets.length || input.assets.some(id => !ASSETS.some(asset => asset.id === id))) throw new Error('La configuración contiene activos inválidos o repetidos.');
  if (!input.assets.includes(input.selected)) throw new Error('El activo seleccionado debe pertenecer al espacio.');
  return { version: 1, assets: [...input.assets], selected: input.selected };
}
export function workspaceKey(userId) { return `graficoxrp:workspace:v1:${userId}`; }
export function readWorkspace(storage, userId) {
  try { const raw = storage.getItem(workspaceKey(userId)); return raw ? validateWorkspace(JSON.parse(raw)) : null; }
  catch { return null; }
}
export function writeWorkspace(storage, userId, workspace) {
  storage.setItem(workspaceKey(userId), JSON.stringify(validateWorkspace(workspace)));
}
export function exportWorkspace(workspace) {
  return JSON.stringify({ ...validateWorkspace(workspace), application: 'graficosxrp', exportedAt: new Date().toISOString(), layout: ['W', 'D', '240'], scope: 'Configuración de activos; no incluye dibujos de TradingView ni credenciales.' }, null, 2);
}
