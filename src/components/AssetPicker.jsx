import { useEffect, useRef, useState } from 'react';
import { ASSETS } from '../lib/workspace';
export default function AssetPicker({ initial = [], onApply, onCancel }) {
  const [chosen, setChosen] = useState(initial);
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);
  return <dialog ref={dialog} className="product-card asset-picker" aria-labelledby="picker-title" onCancel={event => { event.preventDefault(); onCancel?.(); }}>
    <span className="eyebrow">TU ESPACIO</span><h1 id="picker-title">¿Qué activos seguís?</h1>
    <p>Seleccioná de 1 a 12. Cada activo tendrá tres gráficos con la distribución actual.</p>
    <div className="asset-options">{ASSETS.map(asset => <label key={asset.id} className={chosen.includes(asset.id) ? 'checked' : ''}><input type="checkbox" checked={chosen.includes(asset.id)} onChange={event => setChosen(current => event.target.checked ? [...current, asset.id] : current.filter(id => id !== asset.id))} /><strong>{asset.id}</strong><span>{asset.name}</span><small>{asset.symbol}</small></label>)}</div>
    <div className="picker-actions"><button disabled={!chosen.length} onClick={() => onApply(chosen)}>Abrir mis gráficos ({chosen.length})</button>{onCancel && <button className="secondary" onClick={onCancel}>Cancelar</button>}</div>
    <p className="fine-print">Las preferencias se guardan en este navegador, por cuenta. Exportalas para llevarlas a otro dispositivo.</p>
  </dialog>;
}
