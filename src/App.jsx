import TradingViewChart from "./components/TraidingViewChart";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",  // 👈 pantalla completa
        margin: 0,
        padding: 0,
        background: "#111",
        color: "#fff",
      }}
    >
      <TradingViewChart
        symbol="BINANCE:XRPBTC"
        theme="dark"
        interval="60"
        autosize={true}
      />
    </div>
  );
}

export default App;
