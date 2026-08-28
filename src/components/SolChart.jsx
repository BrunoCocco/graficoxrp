import { useEffect, useRef } from "react";

// ============================================================
// SOLANA CHART
// ============================================================

const SolChart = ({
  symbol = "BINANCE:SOLUSD",
  theme = "dark",
  interval = "M",
  autosize = true,
}) => {

  // Referencia al contenedor de este gráfico
  const containerRef = useRef(null);

  useEffect(() => {

    // --------------------------------------------------------
    // CREAR WIDGET SOLANA
    // --------------------------------------------------------

    const createSolWidget = () => {

      if (!containerRef.current || !window.TradingView) {
        return;
      }

      // Limpiamos el contenedor
      containerRef.current.innerHTML = "";

      // Creamos el widget de TradingView
      new window.TradingView.widget({

        // ID exclusivo de SOLANA
        container_id: "tradingview_sol_chart",

        // Símbolo SOL
        symbol,

        // Temporalidad
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


    // --------------------------------------------------------
    // SI TRADINGVIEW YA ESTÁ CARGADO
    // --------------------------------------------------------

    if (window.TradingView) {

      createSolWidget();

      return;
    }


    // --------------------------------------------------------
    // COMPROBAR SI EL SCRIPT YA EXISTE
    // --------------------------------------------------------

    const existingScript = document.querySelector(
      'script[src="https://s3.tradingview.com/tv.js"]'
    );


    // --------------------------------------------------------
    // SI NO EXISTE, LO CREAMOS
    // --------------------------------------------------------

    if (!existingScript) {

      const script = document.createElement("script");

      script.src = "https://s3.tradingview.com/tv.js";

      script.type = "text/javascript";

      script.async = true;

      script.onload = () => {
        createSolWidget();
      };

      document.body.appendChild(script);

    } else {

      // ------------------------------------------------------
      // EL OTRO COMPONENTE YA ESTÁ CARGANDO TRADINGVIEW
      // ------------------------------------------------------

      const checkTradingView = setInterval(() => {

        if (window.TradingView) {

          clearInterval(checkTradingView);

          createSolWidget();
        }

      }, 100);


      return () => {
        clearInterval(checkTradingView);
      };
    }

  }, [symbol, theme, interval, autosize]);


  // ============================================================
  // CONTENEDOR SOLANA
  // ============================================================

  return (
    <div
      id="tradingview_sol_chart"

      ref={containerRef}

      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default SolChart;