import { useEffect, useRef } from "react";

// ============================================================
// BTC CHART
// ============================================================

const BtcChart = ({
  symbol = "BINANCE:BTCUSD",
  theme = "dark",
  interval = "M",
  autosize = true,
}) => {

  // Referencia al <div> donde TradingView va a dibujar el gráfico
  const containerRef = useRef(null);

  useEffect(() => {

    // --------------------------------------------------------
    // FUNCIÓN QUE CREA EL GRÁFICO
    // --------------------------------------------------------

    const createBtcWidget = () => {

      // Si todavía no tenemos el contenedor o TradingView
      // todavía no está disponible, no hacemos nada.
      if (!containerRef.current || !window.TradingView) {
        return;
      }

      // Limpiamos el contenedor antes de crear el gráfico.
      // Esto evita que se duplique si el componente se actualiza.
      containerRef.current.innerHTML = "";

      // Creamos el widget de TradingView.
      new window.TradingView.widget({

        // IMPORTANTE:
        // Usamos el ID ÚNICO de este gráfico.
        container_id: "tradingview_btc_chart",

        // Símbolo que queremos mostrar.
        symbol,

        // Temporalidad.
        interval,

        timezone: "Etc/UTC",

        theme,

        style: "1",

        locale: "es",

        toolbar_bg: "#f1f3f6",

        enable_publishing: false,

        hide_side_toolbar: false,

        hide_top_toolbar: false,

        // TradingView ocupará todo el espacio disponible.
        autosize,
      });
    };


    // --------------------------------------------------------
    // SI TRADINGVIEW YA ESTÁ CARGADO
    // --------------------------------------------------------

    if (window.TradingView) {

      // Creamos directamente el gráfico.
      createBtcWidget();

      return;
    }


    // --------------------------------------------------------
    // CARGAMOS TRADINGVIEW
    // --------------------------------------------------------
    //
    // CAMBIO IMPORTANTE:
    //
    // Eliminamos:
    //
    // const scriptLoadedRef = useRef(false);
    //
    // porque cada componente tenía su propia bandera.
    //
    // Eso provocaba que un gráfico pudiera quedarse esperando
    // mientras el otro cargaba el script.
    //
    // Ahora comprobamos si el script ya existe EN TODO EL DOCUMENTO.
    // --------------------------------------------------------

    const existingScript = document.querySelector(
      'script[src="https://s3.tradingview.com/tv.js"]'
    );


    // Si el script todavía no existe, lo creamos.
    if (!existingScript) {

      const script = document.createElement("script");

      script.src = "https://s3.tradingview.com/tv.js";

      script.type = "text/javascript";

      script.async = true;


      // Cuando TradingView termina de cargar,
      // creamos este gráfico.
      script.onload = () => {
        createBtcWidget();
      };


      document.body.appendChild(script);

    } else {

      // ------------------------------------------------------
      // SI OTRO COMPONENTE YA ESTÁ CARGANDO TRADINGVIEW
      // ------------------------------------------------------
      //
      // El otro componente puede haber creado el script.
      //
      // Por eso esperamos hasta que window.TradingView exista.
      // ------------------------------------------------------

      const checkTradingView = setInterval(() => {

        if (window.TradingView) {

          clearInterval(checkTradingView);

          createBtcWidget();
        }

      }, 100);


      // Limpiamos el intervalo cuando el componente desaparece.
      return () => {
        clearInterval(checkTradingView);
      };
    }

  }, [symbol, theme, interval, autosize]);


  // ============================================================
  // CONTENEDOR DEL GRÁFICO
  // ============================================================

  return (
    <div
      // --------------------------------------------------------
      // CAMBIO:
      // ID EXCLUSIVO PARA BTC
      //
      // Antes tenías IDs cruzados entre los componentes.
      // Ahora BTC tiene su propio ID.
      // --------------------------------------------------------
      id="tradingview_btc_chart"

      ref={containerRef}

      style={{
        width: "100%",

        // El gráfico ocupa toda la altura del contenedor
        // que le proporciona App.jsx.
        height: "100%",
      }}
    />
  );
};

export default BtcChart;
