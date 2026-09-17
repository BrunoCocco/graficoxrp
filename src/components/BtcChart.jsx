import { useEffect, useRef } from "react";

const TRADING_VIEW_SCRIPT = "https://s3.tradingview.com/tv.js";

const BtcChart = ({
  containerId = "tradingview_btc_chart",
  symbol = "BINANCE:BTCUSD",
  theme = "dark",
  interval = "M",
  autosize = true,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let checkTradingView;

    const createBtcWidget = () => {
      if (!containerRef.current || !window.TradingView) {
        return;
      }

      containerRef.current.innerHTML = "";

      new window.TradingView.widget({
        container_id: containerId,
        symbol,
        interval,
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
    };

    if (window.TradingView) {
      createBtcWidget();
    } else {
      const existingScript = document.querySelector(
        `script[src="${TRADING_VIEW_SCRIPT}"]`
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = TRADING_VIEW_SCRIPT;
        script.type = "text/javascript";
        script.async = true;
        script.onload = createBtcWidget;
        document.body.appendChild(script);
      } else {
        checkTradingView = window.setInterval(() => {
          if (window.TradingView) {
            window.clearInterval(checkTradingView);
            createBtcWidget();
          }
        }, 100);
      }
    }

    return () => {
      if (checkTradingView) {
        window.clearInterval(checkTradingView);
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [containerId, symbol, theme, interval, autosize]);

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default BtcChart;
