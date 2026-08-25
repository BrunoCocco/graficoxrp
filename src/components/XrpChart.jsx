import { useEffect, useRef } from "react";

// ============================================================
// XRP CHART
// ============================================================

const XrpChart = ({
  // CAMBIO:
  // Ahora el valor por defecto realmente es XRP.
  //
  // Antes decía:
  // symbol = "BINANCE:BTCUSD"
  //
  // aunque el componente se llamaba XrpChart.
  symbol = "BINANCE:XRPUSD",

  theme = "dark",

  interval = "M",

  autosize = true,
}) => {

  // Referencia al contenedor de ESTE gráfico.
  const containerRef = useRef(null);


  useEffect(() => {

    // --------------------------------------------------------
    // CREAR WIDGET XRP
    // --------------------------------------------------------

    const createXrpWidget = () => {

      // Si falta el contenedor o TradingView todavía no está
      // disponible, salimos.
      if (!containerRef.current || !window.TradingView) {
        return;
      }


      // Limpiamos el contenedor.
      containerRef.current.innerHTML = "";


      // Creamos el widget.
      new window.TradingView.widget({

        // ----------------------------------------------------
        // CAMBIO MUY IMPORTANTE:
        //
        // XRP tiene un ID DIFERENTE al de BTC.
        //
        // BTC:
        // tradingview_btc_chart
        //
        // XRP:
        // tradingview_xrp_chart
        //
        // TradingView necesita poder distinguirlos.
        // ----------------------------------------------------
        container_id: "tradingview_xrp_chart",

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


    // --------------------------------------------------------
    // TRADINGVIEW YA EXISTE
    // --------------------------------------------------------

    if (window.TradingView) {

      createXrpWidget();

      return;
    }


    // --------------------------------------------------------
    // COMPROBAR SI EL SCRIPT YA FUE CREADO
    // --------------------------------------------------------
    //
    // CAMBIO:
    //
    // Eliminamos completamente:
    //
    // const scriptLoadedRef = useRef(false);
    //
    // porque cada componente tenía su propia variable.
    //
    // Ahora buscamos el script directamente en el documento.
    // --------------------------------------------------------

    const existingScript = document.querySelector(
      'script[src="https://s3.tradingview.com/tv.js"]'
    );


    // --------------------------------------------------------
    // SI NO EXISTE EL SCRIPT
    // --------------------------------------------------------

    if (!existingScript) {

      const script = document.createElement("script");

      script.src = "https://s3.tradingview.com/tv.js";

      script.type = "text/javascript";

      script.async = true;


      // Cuando termine de cargar TradingView,
      // creamos el gráfico XRP.
      script.onload = () => {
        createXrpWidget();
      };


      document.body.appendChild(script);


    } else {

      // ------------------------------------------------------
      // EL OTRO COMPONENTE YA ESTÁ CARGANDO TRADINGVIEW
      // ------------------------------------------------------
      //
      // Esperamos hasta que window.TradingView esté disponible.
      // ------------------------------------------------------

      const checkTradingView = setInterval(() => {

        if (window.TradingView) {

          clearInterval(checkTradingView);

          createXrpWidget();
        }

      }, 100);


      // Limpiamos el intervalo si el componente desaparece.
      return () => {
        clearInterval(checkTradingView);
      };
    }

  }, [symbol, theme, interval, autosize]);


  // ============================================================
  // CONTENEDOR XRP
  // ============================================================

  return (
    <div
      // ID ÚNICO para XRP.
      id="tradingview_xrp_chart"

      ref={containerRef}

      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};


export default XrpChart;
