export const CHECKS = ['Revisé la estructura semanal', 'Marqué soportes y resistencias', 'Contrasté precio y volumen', 'Definí qué invalida mi hipótesis', 'Consideré el escenario contrario'];
export function calculateRisk({ capital, riskPercent, entry, stop }) {
  if (![capital, riskPercent, entry, stop].every(v => typeof v === 'number' && Number.isFinite(v) && v > 0) || riskPercent > 100 || entry === stop) return null;
  const risk = capital * riskPercent / 100;
  const units = risk / Math.abs(entry - stop);
  const notional = units * entry;
  return [risk, units, notional].every(Number.isFinite) ? { risk, units, notional } : null;
}
export function journalKey(userId, symbol) { return `graficoxrp:journal:v1:${userId}:${symbol}`; }
export function readJournal(storage, userId, symbol) {
  const raw = storage.getItem(journalKey(userId, symbol));
  if (!raw) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.some(cut => typeof cut.id !== 'string' || typeof cut.createdAt !== 'string' || typeof cut.hypothesis !== 'string' || typeof cut.invalidation !== 'string' || !Array.isArray(cut.checks) || cut.checks.some(check => !Number.isInteger(check) || check < 0 || check >= CHECKS.length))) throw new Error('No se pudo leer el historial. El original sigue guardado.');
  return data;
}
export function appendJournal(storage, userId, symbol, draft) {
  const history = readJournal(storage, userId, symbol);
  if (history.length >= 100) throw new Error('Llegaste a 100 cortes para este activo. Exportá tu cuaderno; el historial se conserva.');
  if (!draft.hypothesis.trim() || !draft.invalidation.trim()) throw new Error('Completá la hipótesis y su invalidación.');
  const cut = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), hypothesis: draft.hypothesis.trim().slice(0,4000), invalidation: draft.invalidation.trim().slice(0,2000), checks: [...new Set(draft.checks)].filter(check => Number.isInteger(check) && check >= 0 && check < CHECKS.length) };
  const next = [...history, cut];
  storage.setItem(journalKey(userId, symbol), JSON.stringify(next));
  return next;
}
