import { useEffect, useRef, useState } from 'react';
import { MAX_ASSETS, resolveAsset, searchAssets } from '../lib/workspace';
export default function AssetPicker({ initial = [], onApply, onCancel }) {
  const [chosen, setChosen] = useState(initial);
  const [query, setQuery] = useState('');
  const [custom, setCustom] = useState('');
  const [message, setMessage] = useState('');
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  function add(id) {
    const asset = resolveAsset(id);
    if (!asset) { setMessage('Usá el formato MERCADO:SÍMBOLO, por ejemplo NASDAQ:AAPL.'); return; }
    if (chosen.some(value => resolveAsset(value).symbol === asset.symbol)) { setMessage('Ese símbolo ya está en tu selección.'); return; }
    if (chosen.length >= MAX_ASSETS) { setMessage('Llegaste al máximo de 6. Quitá uno para agregar otro.'); return; }
    setChosen(current => [...current, asset.id]); setMessage(`${asset.symbol} agregado.`); setCustom('');
  }
  const results = searchAssets(query);
  return <dialog ref={dialog} className="product-card asset-picker search-picker" aria-labelledby="picker-title" onCancel={event => { event.preventDefault(); onCancel?.(); }}>
    <span className="eyebrow">TU ESPACIO · MÁXIMO 6 ACTIVOS</span><h1 id="picker-title">Armá tu pantalla.</h1>
    <p>Buscá por nombre, ticker o mercado. Cada activo abre sus gráficos semanal, diario y de 4 horas.</p>
    <section className="chosen-section" aria-label="Activos seleccionados"><div className="selection-heading"><strong>Tu selección</strong><span aria-live="polite">{chosen.length} / {MAX_ASSETS}</span></div>
      {chosen.length ? <ul className="chosen-list">{chosen.map(id => { const asset = resolveAsset(id); return <li key={id}><span><strong>{asset.name}</strong><small>{asset.symbol}{asset.custom ? ' · sin verificar' : ''}</small></span><button type="button" aria-label={`Quitar ${asset.symbol}`} onClick={() => { setChosen(current => current.filter(value => value !== id)); setMessage(''); }}>×</button></li>; })}</ul> : <p className="empty-selection">Agregá tu primer activo desde el buscador.</p>}
      {chosen.length > MAX_ASSETS && <p role="alert">Tu espacio anterior tenía más de 6 activos. Elegí cuáles conservar para continuar.</p>}
    </section>
    <label className="search-label">Buscar activos<input autoFocus type="search" placeholder="Bitcoin, XRP, Solana, KRAKEN…" value={query} onChange={event => setQuery(event.target.value)} /></label>
    <p className="catalog-caption">Catálogo inicial · {results.length} resultados · No es el catálogo completo de TradingView.</p>
    <ul className="symbol-results" aria-label="Resultados de búsqueda">{results.map(asset => {
      const included = chosen.some(id => resolveAsset(id).symbol === asset.symbol);
      return <li key={asset.id}><span className="asset-monogram" aria-hidden="true">{asset.id.slice(0,2)}</span><span className="result-name"><strong>{asset.name} <small>{asset.id}</small></strong><small>{asset.symbol}</small></span><button type="button" disabled={included || chosen.length >= MAX_ASSETS} aria-label={`Agregar ${asset.symbol}`} onClick={() => add(asset.id)}>{included ? 'Agregado' : '+ Agregar'}</button></li>;
    })}</ul>
    {!results.length && <p>No hay coincidencias en el catálogo inicial. Podés ingresar un símbolo exacto debajo.</p>}
    <details className="custom-symbol"><summary>Agregar otro símbolo de TradingView</summary><p>Copiá el identificador completo desde TradingView. Se comprueba el formato; su disponibilidad se confirma al abrir el gráfico.</p><form onSubmit={event => { event.preventDefault(); add(custom.trim().toUpperCase()); }}><label>Símbolo exacto<input value={custom} onChange={event => setCustom(event.target.value)} placeholder="NASDAQ:AAPL" maxLength={73} /></label><button disabled={!custom.trim() || chosen.length >= MAX_ASSETS}>Agregar símbolo</button></form></details>
    <p className="selection-message" role="status">{message}</p>
    <div className="picker-actions"><button disabled={!chosen.length || chosen.length > MAX_ASSETS} onClick={() => onApply(chosen)}>Abrir mis gráficos ({chosen.length})</button>{onCancel && <button className="secondary" onClick={onCancel}>Cancelar</button>}</div>
    <p className="fine-print">Guardado por cuenta en este navegador. Podés exportar tu selección para usarla en otro dispositivo.</p>
  </dialog>;
}
