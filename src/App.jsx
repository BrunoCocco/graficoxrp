import "./App.css";
import BtcChart from "./components/BtcChart";
import MarketStrip from "./components/MarketStrip";
import SolChart from "./components/SolChart";

function App() {
  return (
    <main className="market-screen">
      <div className="charts-stack">
      <section className="chart-panel" aria-label="Bitcoin mensual">
        <BtcChart
          containerId="tradingview_btc_monthly"
          symbol="BINANCE:BTCUSD"
          theme="dark"
          interval="M"
          autosize
        />
      </section>

      <section className="chart-panel" aria-label="Bitcoin diario">
        <BtcChart
          containerId="tradingview_btc_daily"
          symbol="BINANCE:BTCUSD"
          theme="dark"
          interval="D"
          autosize
        />
      </section>

      <section className="chart-panel" aria-label="Solana mensual">
        <SolChart
          symbol="BINANCE:SOLUSD"
          theme="dark"
          interval="M"
          autosize
        />
      </section>
      </div>
      <MarketStrip />
    </main>
  );
}

export default App;
