import XrpChart from "./components/XrpChart";
import BtcChart from "./components/BtcChart";

function App() {

  return (
    <section
      style={{
        // Ocupa toda la pantalla.
        width: "100vw",
        height: "100vh",

        margin: 0,
        padding: 0,

        background: "#fff",

        color: "#111",

        // IMPORTANTE:
        // Los gráficos se colocan uno debajo del otro.
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* =====================================================
          GRÁFICO DE ARRIBA
          ===================================================== */}

      <div
        style={{
          // CAMBIO:
          // flex: 1 significa que este div ocupa la mitad
          // disponible de la pantalla.
          flex: 1,

          // Evita problemas de tamaño con elementos internos.
          minHeight: 0,

          width: "100%",
        }}
      >

        <XrpChart
          // Ahora sí mostramos XRP.
          symbol="BINANCE:BTCUSD"

          theme="dark"

          interval="M"

          autosize={true}
        />

      </div>


      {/* =====================================================
          GRÁFICO DE ABAJO
          ===================================================== */}

      <div
        style={{
          // La otra mitad de la pantalla.
          flex: 1,

          minHeight: 0,

          width: "100%",
        }}
      >

        <BtcChart
          symbol="BINANCE:BTCUSD"

          theme="dark"

          interval="M"

          autosize={true}
        />

      </div>

    </section>
  );
}


export default App;