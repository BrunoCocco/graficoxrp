import { useEffect, useRef } from "react";

const TradingViewChart = ({
  symbol = "BINANCE:XRPBTC", // par por defecto
  theme = "dark",            // "light" o "dark"
  interval = "60",           // timeframe: 1, 5, 15, 60, 240, D, W, etc.
  autosize = true,
}) => {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Si el script ya está cargado, solo inicializamos el widget
    if (window.TradingView) {
      createWidget();
      return;
    }

    // Evitar cargar el script dos veces
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      createWidget();
    };

    document.body.appendChild(script);

    function createWidget() {
      if (!containerRef.current || !window.TradingView) return;

      // Limpiar contenido previo del contenedor
      containerRef.current.innerHTML = "";

      new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "1", // estilo de velas
        locale: "es",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        autosize,
      });
    }
  }, [symbol, theme, interval, autosize]);

 return (
    <div
      id="tradingview_chart_container"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",   // 👈 clave
      }}
    />
  );
};

export default TradingViewChart;
