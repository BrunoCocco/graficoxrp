import { memo, useEffect, useRef, useState } from "react";

const SCRIPT_URL = "https://s3.tradingview.com/tv.js";
let scriptPromise = null;

function loadTradingView() {
  if (window.TradingView) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    const script = existing ?? document.createElement("script");
    const onLoad = () => window.TradingView ? resolve() : reject(new Error("TradingView no quedó disponible"));
    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", () => reject(new Error("No se pudo cargar TradingView")), { once: true });
    if (!existing) {
      script.src = SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  });
  return scriptPromise;
}

const TradingViewChart = memo(function TradingViewChart({ containerId, symbol, interval, theme = "dark", autosize = true }) {
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    loadTradingView().then(() => {
      if (!active || mountedRef.current || !containerRef.current || !window.TradingView) return;
      mountedRef.current = true;
      new window.TradingView.widget({
        container_id: containerId,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "es",
        toolbar_bg: "#131722",
        enable_publishing: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        allow_symbol_change: true,
        autosize,
        studies: interval === "W" ? ["VWAP@tv-basicstudies", "STD;RSI"] : interval === "D" ? ["STD;RSI"] : ["STD;Bollinger_Bands"],
        studies_overrides: {
          "vwap.anchor period": "Quarter",
          "vwap.source": "hl2",
          "vwap.vwap.color": "#ff9800",
          "vwap.vwap.linestyle": 0,
          "vwap.upper band #1.display": 0,
          "vwap.lower band #1.display": 0,
          "vwap.upper band #2.display": 0,
          "vwap.lower band #2.display": 0,
          "vwap.upper band #3.display": 0,
          "vwap.lower band #3.display": 0,
          "relative strength index.middlelimit.color": "#ff69b4",
          "relative strength index.middlelimit.value": 50,
          "relative strength index.middlelimit.visible": true,
          "relative strength index.upperlimit.visible": false,
          "relative strength index.lowerlimit.visible": false,
          "relative strength index.smoothing line": "EMA",
          "relative strength index.smoothing length": 14,
          "relative strength index.source": "hl2",
        },
      });
    }).catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [autosize, containerId, interval, symbol, theme]);

  if (failed) return <p className="chart-error">No se pudo cargar TradingView.</p>;
  return <div id={containerId} ref={containerRef} className="tradingview-container" />;
});

export default TradingViewChart;
