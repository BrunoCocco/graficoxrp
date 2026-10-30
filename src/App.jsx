import { useEffect, useRef, useState } from 'react';
import './App.css';
import MarketStrip from './components/MarketStrip';
import TradingViewChart from './components/TradingViewChart';
import Login from './components/Login';
import AssetPicker from './components/AssetPicker';
import { auth } from './lib/auth';
import { ASSETS, PERIODS, readWorkspace, writeWorkspace, exportWorkspace, validateWorkspace } from './lib/workspace';

function Workspace({ user }) {
  const [workspace, setWorkspace] = useState(() => readWorkspace(window.localStorage, user.id));
  const [visited, setVisited] = useState(() => workspace ? [workspace.selected] : []);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
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
  if (!workspace) return <><AssetPicker onApply={assets => apply({ version: 1, assets, selected: assets[0] })} /><button className="onboarding-logout" onClick={logout}>Cerrar sesión</button></>;
  return <main className="market-screen product-screen">
    <header className="workspace-toolbar"><strong>GRÁFICOS XRP</strong><span className="account-name">{user.email}</span><nav aria-label="Configuración del espacio"><button onClick={() => setEditing(true)}>Activos</button><button onClick={download}>Exportar</button><button onClick={() => fileRef.current?.click()}>Importar</button><button onClick={logout}>Salir</button></nav><input ref={fileRef} hidden type="file" accept="application/json,.json" onChange={upload} /></header>
    <div className="charts-area">{visited.map(id => {
      const asset = ASSETS.find(item => item.id === id);
      const active = workspace.selected === id;
      return <div key={id} className={`charts-stack${active ? ' is-active' : ''}`} aria-hidden={!active} inert={!active}>{PERIODS.map(({ interval, label }) => <section className="chart-panel" aria-label={`${id} ${label}`} key={interval}><TradingViewChart containerId={`tradingview_${id}_${interval}`} symbol={asset.symbol} theme="dark" interval={interval} autosize /></section>)}</div>;
    })}</div>
    <MarketStrip assets={workspace.assets} selected={workspace.selected} onSelect={selectAsset} />
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
