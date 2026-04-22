import { normalizeSymbolsUnique } from "./symbols";
import { resolvePublicApiBaseUrl } from "./publicApiBaseUrl";

export const buildMarketStreamEventsUrl = (params: {
  symbols: string[];
  interval: string;
}) => {
  const symbols = normalizeSymbolsUnique(params.symbols);
  const query = new URLSearchParams({
    symbols: symbols.join(","),
    interval: params.interval,
  });
  const path = `/dashboard/market-stream/events?${query.toString()}`;
  const base = resolvePublicApiBaseUrl();
  return base ? `${base}${path}` : path;
};

export const createMarketStreamEventSource = (params: {
  symbols: string[];
  interval: string;
}) => {
  const url = buildMarketStreamEventsUrl(params);
  const hasApiBase = Boolean(resolvePublicApiBaseUrl());
  return hasApiBase ? new EventSource(url, { withCredentials: true }) : new EventSource(url);
};
