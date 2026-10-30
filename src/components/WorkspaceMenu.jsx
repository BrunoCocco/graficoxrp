export default function WorkspaceMenu({ email, onAssets, onExport, onImport, onLogout, onTools, focus, onFocus }) {
  function action(event, fn) { event.currentTarget.closest('[popover]').hidePopover(); fn(); }
  return <div className="workspace-menu-slot">
    <button className="market-quote workspace-menu-trigger" popoverTarget="workspace-menu" aria-label="Abrir menú del espacio"><strong>☰ Menú</strong><span>Herramientas ↑</span></button>
    <div id="workspace-menu" popover="auto" className="workspace-popover" aria-label="Menú del espacio">
      <div className="menu-identity"><strong>GRÁFICOS XRP</strong><small>{email}</small></div>
      <p className="menu-section-label">TU ESPACIO</p>
      <button onClick={e=>action(e,onAssets)}>Activos <small>Elegí hasta 6</small></button>
      <button onClick={e=>action(e,onExport)}>Exportar <small>Configuración del espacio</small></button>
      <button onClick={e=>action(e,onImport)}>Importar <small>Restaurar configuración</small></button>
      <p className="menu-section-label">PARA TU ANÁLISIS</p>
      <button onClick={e=>action(e,onTools)}>Cuaderno y checklist <small>Hipótesis, invalidación e historial</small></button>
      <div className="focus-options"><span>Concentración</span>{[['all','3 gráficos'],['W','Semanal'],['D','Diario'],['240','4 horas']].map(([key,label])=><button key={key} aria-pressed={focus===key} onClick={e=>action(e,()=>onFocus(key))}>{label}</button>)}</div>
      <p className="menu-hint">La calculadora de riesgo teórico está dentro del cuaderno.</p>
      <button className="logout-option" onClick={e=>action(e,onLogout)}>Salir <small>Cerrar sesión</small></button>
    </div>
  </div>;
}
