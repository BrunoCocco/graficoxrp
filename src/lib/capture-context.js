export function captureContext({ asset, periods, focus, capturedAt, filename }) {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return [
    'ANÁLISIS CLOE · contexto v1',
    `PNG: ${filename}`,
    `Activo configurado: ${asset.id} · símbolo TradingView: ${asset.symbol}`,
    `Captura según reloj del dispositivo: ${capturedAt.toISOString()} · zona: ${zone} · desfase UTC: ${-capturedAt.getTimezoneOffset()} minutos`,
    `Gráficos configurados: ${periods.map(p => p.label + ' (' + p.interval + ')').join(' / ')}`,
    `Vista: ${focus === 'all' ? 'todos' : focus} · velas japonesas configuradas · zona del widget UTC`,
    'Plantilla solicitada v1: semanal VWAP Quarter/hl2 + RSI; diario RSI + MA20; 4H Bollinger. TradingView puede no aplicar todos los ajustes.',
    'SIN VERIFICAR: mercado spot/perpetuo, cambios internos de símbolo, temporalidad, tipo de gráfico e indicadores en TradingView. La captura puede diferir de esta configuración.',
    'Hora de mercado: desconocida. No contiene OHLCV. Confirmar símbolo/mercado y marcos visibles antes de consultar velas. Comparar con el corte anterior sin reemplazarlo.',
  ].join('\n');
}
