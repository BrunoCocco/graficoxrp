import { useEffect, useState } from "react";
import { ASSETS, resolveAsset } from "../lib/workspace";

const COINS = Object.fromEntries(ASSETS.map(asset => [asset.id, asset.coinId]));
const STORAGE_KEY = "graficoxrp-market-strip";
const REFRESH_MS = 5 * 60 * 1000;

function savedQuotes() {
  try { return (() => { const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"); return Array.isArray(value) ? value : []; })(); }
  catch { return []; }
}

function formatPrice(value) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("es-ES", { minimumFractionDigits: value > 1 ? 2 : 0, maximumFractionDigits: value > 1 ? 2 : 4 }).format(value);
}

function Change({ period, value }) {
  const text = typeof value === "number" ? `${value >= 0 ? "+" : ""}${value.toFixed(2)}%` : "—";
  const className = typeof value !== "number" ? "unavailable" : value >= 0 ? "positive" : "negative";
  return <span aria-label={`${period}: ${text}`} className={className} title={period}>{text}</span>;
}

export default function MarketStrip({ assets, selected, onSelect }) {
  const [quotes, setQuotes] = useState(savedQuotes);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    let active = true;
    async function refresh() {
      try {
        const ids = Object.values(COINS).join(",");
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=1y`);
        if (!response.ok) throw new Error(`CoinGecko ${response.status}`);
        const data = await response.json();
        const byId = new Map(data.map((coin) => [coin.id, coin]));
        const next = Object.entries(COINS).map(([symbol, id]) => {
          const coin = byId.get(id);
          return { symbol, price: coin?.current_price ?? null, change24h: coin?.price_change_percentage_24h ?? null, change1y: coin?.price_change_percentage_1y_in_currency ?? null };
        });
        if (!active) return;
        setQuotes(next);
        setStale(false);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { if (active) setStale(true); }
    }
    refresh();
    const interval = window.setInterval(refresh, REFRESH_MS);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  const display = quotes.length > 0 ? quotes : Object.keys(COINS).map((symbol) => ({ symbol, price: null, change24h: null, change1y: null }));
  return (
    <footer className="market-strip" style={{ "--asset-count": assets.length }} aria-label="Precios de activos seguidos">
      {assets.map(symbol => display.find(quote => quote.symbol === symbol) ?? { symbol, price: null, change24h: null, change1y: null }).map((quote) => (
        <button type="button" className={`market-quote${selected === quote.symbol ? " selected" : ""}`} key={quote.symbol} onClick={() => onSelect(quote.symbol)} aria-pressed={selected === quote.symbol} aria-label={`Ver gráficos de ${quote.symbol}`} title={resolveAsset(quote.symbol)?.symbol}>
          <div className="quote-heading"><strong title={resolveAsset(quote.symbol)?.symbol}>{resolveAsset(quote.symbol)?.id.split(':').pop() ?? quote.symbol}</strong><span>{formatPrice(quote.price)}</span></div>
          <div className="quote-changes"><Change period="Variación diaria" value={quote.change24h} /><Change period="Variación anual" value={quote.change1y} /></div>
        </button>
      ))}
      <span className="sr-only" aria-live="polite">{stale ? "Sin conexión: se conserva el último dato válido" : "Cotizaciones actualizadas"}</span>
    </footer>
  );
}
