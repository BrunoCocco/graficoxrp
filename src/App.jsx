import { useEffect, useRef, useState } from 'react';
import './App.css';
import MarketStrip from './components/MarketStrip';
import TradingViewChart from './components/TradingViewChart';
import AnalystTools from './components/AnalystTools';
import WorkspaceMenu from './components/WorkspaceMenu';
import Login from './components/Login';
import AssetPicker from './components/AssetPicker';
import { auth } from './lib/auth';
import { readJournal } from './lib/analyst-tools';
import { MAX_ASSETS, resolveAsset, PERIODS, readWorkspace, writeWorkspace, exportWorkspace, validateWorkspace } from './lib/workspace';

function Workspace({ user }) {
  const [workspace, setWorkspace] = useState(() => readWorkspace(window.localStorage, user.id));
  const [visited, setVisited] = useState(() => workspace ? [workspace.selected] : []);
  const [editing, setEditing] = useState(false);
  const [tools, setTools] = useState(false);
  const [focus, setFocus] = useState('all');
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  function saveFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  function filenameTag() {
    return `${workspace.selected.replace(/[^a-zA-Z0-9_-]/g, '-')}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  }
  async function capture() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setMessage('Este navegador no permite capturar pestañas. Usá la captura del sistema y adjuntala en el chat.');
      return;
    }
    setCapturing(true);
    let stream;
    let video;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 1 }, audio: false });
      video = document.createElement('video');
      video.muted = true;
      video.srcObject = stream;
      await video.play();
      if (!video.videoWidth || !video.videoHeight) throw new Error('No se recibió una imagen válida.');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('No se pudo generar el PNG.');
      saveFile(blob, `graficosxrp-${filenameTag()}.png`);
      setMessage('Captura descargada. Comprobá que elegiste esta pestaña y que los dibujos son visibles antes de enviarla a Cloe.');
    } catch (error) {
      setMessage(error?.name === 'NotAllowedError' ? 'Captura cancelada o permiso rechazado; no se guardó ninguna imagen.' : 'No se pudo capturar la pestaña. Probá con la captura del sistema.');
    } finally {
      stream?.getTracks().forEach(track => track.stop());
      if (video) video.srcObject = null;
      setCapturing(false);
    }
  }
  function exportEvidence() {
    try {
      const asset = resolveAsset(workspace.selected);
      const cuts = readJournal(window.localStorage, user.id, asset.symbol);
      const evidence = {
        version: 1, application: 'graficosxrp', type: 'analysis-evidence',
        exportedAt: new Date().toISOString(),
        asset: { id: asset.id, symbol: asset.symbol },
        periods: PERIODS.map(period => period.interval),
        visiblePeriods: focus === 'all' ? PERIODS.map(period => period.interval) : [focus],
        journal: cuts,
        screenshot: null,
        limitations: 'Los dibujos y las velas de TradingView no están disponibles mediante el widget. Adjuntar captura PNG separada, tomada y revisada por el usuario. No contiene precios OHLCV.'
      };
      saveFile(new Blob([JSON.stringify(evidence, null, 2)], { type: 'application/json' }), `graficosxrp-evidencia-${filenameTag()}.json`);
      setMessage('Evidencia JSON descargada. Adjuntá también el PNG para que Cloe pueda evaluar los dibujos.');
    } catch {
      setMessage('No se pudo exportar la evidencia; los registros originales no se modificaron.');
    }
  }
  function apply(next) {
    const value = validateWorkspace(next);
    try { writeWorkspace(window.localStorage, user.id, value); setMessage('Configuración guardada en este navegador.'); }
    catch { setMessage('No se pudo guardar en el navegador. Exportá tu configuración para conservarla.'); }
    setWorkspace(value);
    setVisited(current => current.includes(value.selected) ? current : [...current, value.selected]);
    setEditing(false);
  }
  function selectAsset(id) {
    if (workspace.assets.includes(id)) apply({ ...workspace, selected: id });
  }
  function download() {
    const url = URL.createObjectURL(new Blob([exportWorkspace(workspace)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'graficosxrp-configuracion.json'; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function upload(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 100000) throw new Error('El archivo es demasiado grande.');
      apply(validateWorkspace(JSON.parse(await file.text())));
    } catch { setMessage('Archivo inválido. Importá una configuración JSON exportada por esta app.'); }
  }
  async function logout() {
    const { error } = await auth.auth.signOut();
    if (error) setMessage('No se pudo cerrar la sesión. Intentá nuevamente.');
  }
  if (!workspace || workspace.assets.length > MAX_ASSETS) return <><AssetPicker initial={workspace?.assets ?? []} onApply={assets => apply({ version: 1, assets, selected: assets[0] })} /><button className="onboarding-logout" onClick={logout}>Cerrar sesión</button></>;
  return <main className="market-screen product-screen">
    <input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={upload} />
    <div className="charts-area">{visited.map((id, index) => {
      const asset = resolveAsset(id);
      const active = workspace.selected === id;
      return <div key={id} className={`charts-stack${focus !== 'all' ? ' single-chart' : ''}${active ? ' is-active' : ''}`} aria-hidden={!active} inert={!active}>{PERIODS.map(({ interval, label }) => <section className={`chart-panel${focus !== 'all' && focus !== interval ? ' focus-hidden' : ''}`} aria-label={`${id} ${label}`} key={interval}><TradingViewChart containerId={`tradingview_${index}_${interval}`} symbol={asset.symbol} theme="dark" interval={interval} autosize /></section>)}</div>;
    })}</div>
    <MarketStrip assets={workspace.assets} selected={workspace.selected} onSelect={selectAsset} menu={<WorkspaceMenu email={user.email} onAssets={() => setEditing(true)} onExport={download} onImport={() => fileRef.current?.click()} onLogout={logout} onTools={() => setTools(true)} onCapture={capture} onEvidence={exportEvidence} busy={capturing} focus={focus} onFocus={setFocus} />} />
    {tools && <AnalystTools key={workspace.selected} userId={user.id} symbol={resolveAsset(workspace.selected).symbol} onClose={() => setTools(false)} />}
    {editing && <AssetPicker initial={workspace.assets} onCancel={() => setEditing(false)} onApply={assets => apply({ version: 1, assets, selected: assets.includes(workspace.selected) ? workspace.selected : assets[0] })} />}
    <p className="workspace-message" role="status">{message}</p>
  </main>;
}
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [failure, setFailure] = useState('');
  useEffect(() => {
    if (!auth) return;
    let active = true;
    const { data: { subscription } } = auth.auth.onAuthStateChange((_event, session) => {
      if (active) { setUser(session?.user ?? null); setLoading(false); }
    });
    auth.auth.getUser().then(({ data, error }) => {
      if (active) { setUser(data?.user ?? null); setLoading(false); if (error && error.name !== 'AuthSessionMissingError') setFailure('No pudimos restaurar la sesión. Volvé a ingresar.'); }
    }).catch(() => { if (active) { setLoading(false); setFailure('No pudimos conectar con el servicio de acceso.'); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  if (loading) return <main className="entry-screen"><p role="status">Comprobando sesión…</p></main>;
  return user ? <Workspace key={user.id} user={user} /> : <><Login />{failure && <p className="auth-notice" role="alert">{failure}</p>}</>;
}
