export type BinancePublicRestMarketType = 'FUTURES' | 'SPOT';

const resolveBinancePublicRestBaseUrl = (marketType: BinancePublicRestMarketType) =>
  marketType === 'SPOT'
    ? process.env.BINANCE_SPOT_REST_URL ?? 'https://api.binance.com'
    : process.env.BINANCE_FUTURES_REST_URL ?? 'https://fapi.binance.com';

export const buildBinancePublicRestUrl = (params: {
  marketType: BinancePublicRestMarketType;
  path: string;
  searchParams?: URLSearchParams;
}) => {
  const path = params.path.startsWith('/') ? params.path : `/${params.path}`;
  const query = params.searchParams?.toString();
  return `${resolveBinancePublicRestBaseUrl(params.marketType)}${path}${query ? `?${query}` : ''}`;
};

export const fetchBinancePublicRestJson = async (params: {
  marketType: BinancePublicRestMarketType;
  path: string;
  searchParams?: URLSearchParams;
  init?: RequestInit;
}) => {
  const response = await fetch(buildBinancePublicRestUrl(params), {
    method: 'GET',
    ...params.init,
  });
  if (!response.ok) return null;
  return response.json() as Promise<unknown>;
};
