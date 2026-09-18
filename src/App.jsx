import "./App.css";
import MarketStrip from "./components/MarketStrip";
import TradingViewChart from "./components/TradingViewChart";

function App() {
  return (
    <main className="market-screen">
      <div className="charts-stack">
        <section className="chart-panel" aria-label="Bitcoin mensual">
          <TradingViewChart
            containerId="tradingview_btc_monthly"
            symbol="BINANCE:BTCUSD"
            theme="dark"
            interval="M"
            autosize
          />
        </section>

        <section className="chart-panel" aria-label="Bitcoin diario">
          <TradingViewChart
            containerId="tradingview_btc_daily"
            symbol="BINANCE:BTCUSD"
            theme="dark"
            interval="D"
            autosize
          />
        </section>

        <section className="chart-panel" aria-label="Solana mensual">
          <TradingViewChart
            containerId="tradingview_sol_monthly"
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
