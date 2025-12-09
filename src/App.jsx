import XrpChart from "./components/XrpChart";
import BtcChart from "./components/BtcChart";

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
        flexDirection: "column", // uno arriba del otro
      }}
    >
      {/* Arriba: XRP/BTC */}
      <div style={{ flex: 1 }}>
        <XrpChart
          symbol="BINANCE:XRPBTC"
          theme="dark"
          interval="M"
          autosize={true}
        />0
      </div>

      {/* Abajo: BTC/USD */}
      <div style={{ flex: 1 }}>
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
