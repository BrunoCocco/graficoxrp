import { useEffect, useRef } from "react";

const BtcChart = ({
  symbol = "BINANCE:BTCUSD",
  theme = "dark",
  interval = "60",
  autosize = true,
}) => {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    function createWidget() {
      if (!containerRef.current || !window.TradingView) return;

      containerRef.current.innerHTML = "";

      new window.TradingView.widget({
        container_id: containerRef.current.id,
        symbol,
        interval: "M",
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "es",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_side_toolbar: false,
        hide_top_toolbar: false,
        autosize,
      });
    }

    if (window.TradingView) {
      createWidget();
      return;
    }

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
  }, [symbol, theme, interval, autosize]);

  return (
    <div
      id="tradingview_btc_chart"   // 👈 ID único
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",            // ocupa el 100% de su mitad
      }}
    />
  );
};

export default BtcChart;
