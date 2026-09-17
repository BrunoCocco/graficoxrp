import BtcChart from "./components/BtcChart";
import SolChart from "./components/SolChart";

const chartPanelStyle = {
  flex: 1,
  minHeight: 0,
  width: "100%",
};

function App() {
  return (
    <main
      style={{
        width: "100vw",
        height: "100dvh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#131722",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section style={chartPanelStyle} aria-label="Bitcoin mensual">
        <BtcChart
          containerId="tradingview_btc_monthly"
          symbol="BINANCE:BTCUSD"
          theme="dark"
          interval="M"
          autosize
        />
      </section>

      <section style={chartPanelStyle} aria-label="Bitcoin diario">
        <BtcChart
          containerId="tradingview_btc_daily"
          symbol="BINANCE:BTCUSD"
          theme="dark"
          interval="D"
          autosize
        />
      </section>

      <section style={chartPanelStyle} aria-label="Solana mensual">
        <SolChart
          symbol="BINANCE:SOLUSD"
          theme="dark"
          interval="M"
          autosize
        />
      </section>
    </main>
  );
}

export default App;
