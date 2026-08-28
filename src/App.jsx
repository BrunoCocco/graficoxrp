import BtcChart from "./components/BtcChart";
import SolChart from "./components/SolChart";

function App() {
  return (
    <section
      style={{
        width: "100vw",
        height: "100vh",

        margin: 0,
        padding: 0,

        background: "#fff",
        color: "#111",

        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* =====================================================
          GRÁFICO DE ARRIBA → BTC
          ===================================================== */}

      <div
        style={{
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


      {/* =====================================================
          GRÁFICO DE ABAJO → SOLANA
          ===================================================== */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        <SolChart
          symbol="BINANCE:SOLUSD"
          theme="dark"
          interval="M"
          autosize={true}
        />
      </div>

    </section>
  );
}

export default App;