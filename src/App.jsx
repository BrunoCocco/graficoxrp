import { useState } from "react";
import "./App.css";
import MarketStrip from "./components/MarketStrip";
import TradingViewChart from "./components/TradingViewChart";

const SYMBOLS = { BTC: "BINANCE:BTCUSD", SOL: "BINANCE:SOLUSD", XRP: "KRAKEN:XRPUSD", HBAR: "KRAKEN:HBARUSD", XLM: "KRAKEN:XLMUSD", VELO: "KRAKEN:VELOUSD", SHX: "KRAKEN:SHXUSD" };
const PERIODS = [{ interval: "W", label: "semanal" }, { interval: "D", label: "diario" }, { interval: "240", label: "4 horas" }];

function App() {
  const [selected, setSelected] = useState("BTC");
  const [visited, setVisited] = useState(["BTC"]);
  function selectAsset(asset) {
    if (!SYMBOLS[asset]) return;
    setVisited((current) => current.includes(asset) ? current : [...current, asset]);
    setSelected(asset);
  }
  return (
    <main className="market-screen">
      <div className="charts-area">
        {visited.map((asset) => (
          <div key={asset} className={`charts-stack${selected === asset ? " is-active" : ""}`} aria-hidden={selected !== asset} inert={selected !== asset}>
            {PERIODS.map(({ interval, label }) => (
              <section className="chart-panel" aria-label={`${asset} ${label}`} key={interval}>
                <TradingViewChart containerId={`tradingview_${asset}_${interval}`} symbol={SYMBOLS[asset]} theme="dark" interval={interval} autosize />
              </section>
            ))}
          </div>
        ))}
      </div>
      <MarketStrip selected={selected} onSelect={selectAsset} />
    </main>
  );
}
export default App;
