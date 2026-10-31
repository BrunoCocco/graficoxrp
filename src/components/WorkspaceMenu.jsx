export default function WorkspaceMenu({ email, onAssets, onExport, onImport, onCapture, onEvidence, onPackage, onLogout, onTools, focus, onFocus, busy }) {
  function action(event, fn) {
    event.currentTarget.closest('[popover]')?.hidePopover();
    fn();
  }
  return <div className="workspace-menu-slot">
    <button className="market-quote workspace-menu-trigger" popoverTarget="workspace-menu" aria-label="Abrir menú del espacio"><strong>☰ Menú</strong><span>Herramientas ↑</span></button>
    <div id="workspace-menu" popover="auto" className="workspace-popover" aria-label="Menú del espacio">
      <div className="menu-identity"><strong>GRÁFICOS XRP</strong><small>{email}</small></div>
      <p className="menu-section-label">CAPTURA Y EVIDENCIA</p>
      <button disabled={busy} onClick={e=>action(e,onPackage)}>📦 Exportar para Cloe (ZIP) <small>Captura + JSON con velas de la configuración inicial</small></button>
      <button disabled={busy} onClick={e=>action(e,onCapture)}>📷 Capturar gráficos <small>Elegí esta pestaña en el diálogo del navegador; descarga PNG con anotaciones visibles</small></button>
      <button disabled={busy} onClick={e=>action(e,onEvidence)}>📄 Exportar evidencia JSON <small>Hasta 240 velas por temporalidad inicial, cuaderno y fuentes; los cambios internos del widget no se verifican</small></button>
      <p className="menu-section-label">ANÁLISIS</p>
      <button onClick={e=>action(e,onTools)}>📝 Cuaderno y checklist <small>Hipótesis, invalidaciones, historial y riesgo teórico</small></button>
      <div className="focus-options"><span>Concentración</span>{[['all','3 gráficos'],['W','Semanal'],['D','Diario'],['240','4 horas']].map(([key,label])=><button key={key} aria-pressed={focus===key} onClick={e=>action(e,()=>onFocus(key))}>{label}</button>)}</div>
      <p className="menu-section-label">ESPACIO DE TRABAJO</p>
      <button onClick={e=>action(e,onAssets)}>Activos <small>Elegí hasta 6</small></button>
      <button onClick={e=>action(e,onExport)}>Exportar espacio <small>Solo selección y configuración</small></button>
      <button onClick={e=>action(e,onImport)}>Importar espacio <small>Restaura configuración, no dibujos</small></button>
      <p className="menu-hint">Para analizar con Cloe, adjuntá el ZIP o el JSON junto con el PNG en el chat. La captura requiere permiso del navegador, no se envía automáticamente y puede no estar disponible en todos los dispositivos.</p>
      <button className="logout-option" onClick={e=>action(e,onLogout)}>Salir <small>Cerrar sesión</small></button>
    </div>
  </div>;
}
