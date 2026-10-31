import { useEffect, useRef, useState } from 'react';
import { appendJournal, readJournal, CHECKS, calculateRisk } from '../lib/analyst-tools';
export default function AnalystTools({ userId, symbol, onClose }) {
  const dialog = useRef(null);
  const [hypothesis, setHypothesis] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [checks, setChecks] = useState([]);
  const [history, setHistory] = useState(() => { try { return readJournal(localStorage,userId,symbol); } catch { return []; } });
  const [message, setMessage] = useState('');
  const [inputs, setInputs] = useState({ capital: '', riskPercent: '', entry: '', stop: '' });
  useEffect(() => { dialog.current.showModal(); }, []);
  const result = calculateRisk(Object.fromEntries(Object.entries(inputs).map(([key,value]) => [key, Number(value)])));
  function save() {
    try { setHistory(appendJournal(localStorage,userId,symbol,{hypothesis,invalidation,checks})); setMessage('Corte guardado con fecha. Los registros anteriores se conservan.'); }
    catch(error) { setMessage(error.message); }
  }
  function exportNotes() {
    try {
      const cuts = readJournal(localStorage,userId,symbol);
      const url = URL.createObjectURL(new Blob([JSON.stringify({version:1,symbol,exportedAt:new Date().toISOString(),cuts},null,2)],{type:'application/json'}));
      const a=document.createElement('a');a.href=url;a.download=`cuaderno-${symbol.replace(/[^A-Z0-9]/g,'-')}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    } catch(error) { setMessage(error.message); }
  }
  return <dialog ref={dialog} className="product-card analyst-dialog" onCancel={event=>{event.preventDefault();onClose();}} aria-labelledby="analyst-title">
    <div className="tool-heading"><span className="eyebrow">MESA DE ANÁLISIS</span><button onClick={onClose} aria-label="Cerrar herramientas">×</button></div><h1 id="analyst-title">{symbol}</h1>
    <p>Registrá qué ves y qué tendría que pasar para cambiar de opinión.</p>
    <label>Hipótesis técnica<textarea value={hypothesis} onChange={e=>setHypothesis(e.target.value)} maxLength={4000} placeholder="Estructura, rango, niveles y escenario que estoy evaluando…" /></label>
    <label>Invalidación<textarea value={invalidation} onChange={e=>setInvalidation(e.target.value)} maxLength={2000} placeholder="Mi hipótesis deja de ser válida si…" /></label>
    <fieldset className="analyst-checks"><legend>Checklist de revisión · {checks.length}/{CHECKS.length}</legend>{CHECKS.map((text,index)=><label key={text}><input type="checkbox" checked={checks.includes(index)} onChange={e=>setChecks(current=>e.target.checked?[...current,index]:current.filter(n=>n!==index))} />{text}</label>)}</fieldset>
    <p className="fine-print">Completar la checklist no confirma una señal ni obliga a operar. Guardado local por cuenta y símbolo.</p>
    <div className="picker-actions"><button onClick={save}>Guardar corte de análisis</button><button className="secondary" onClick={exportNotes}>Exportar cuaderno</button></div><p role="status">{message}</p>
    <details><summary>Historial · {history.length} cortes</summary>{[...history].reverse().map(cut=><article className="journal-cut" key={cut.id}><time dateTime={cut.createdAt}>{new Date(cut.createdAt).toLocaleString('es-ES')}</time><p><strong>Hipótesis:</strong> {cut.hypothesis}</p><p><strong>Invalidación:</strong> {cut.invalidation}</p><small>Revisiones: {cut.checks.map(i=>CHECKS[i]).join(' · ') || 'Sin marcar'}</small></article>)}</details>
    <details className="risk-calculator"><summary>Calculadora de riesgo teórico</summary><p className="fine-print">Importes en USD introducidos por vos. Sin cotización automática, comisiones, deslizamiento ni apalancamiento. No ejecuta operaciones.</p><div className="risk-inputs">{[['capital','Capital de referencia (USD)'],['riskPercent','Riesgo (%)'],['entry','Entrada teórica (USD)'],['stop','Invalidación / stop (USD)']].map(([key,label])=><label key={key}>{label}<input type="number" min="0" step="any" value={inputs[key]} onChange={e=>setInputs(current=>({...current,[key]:e.target.value}))} /></label>)}</div>{result ? <output className="risk-output">Riesgo: US${result.risk.toFixed(2)} · Cantidad: {result.units.toLocaleString('es-ES',{maximumFractionDigits:8})} unidades · Exposición: US${result.notional.toFixed(2)}</output> : <p className="fine-print">Completá valores positivos, un riesgo de hasta 100% y una entrada distinta al stop.</p>}</details>
  </dialog>;
}
