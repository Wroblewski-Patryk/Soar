export type StrategyIndicatorOperator =
  | '>'
  | '>='
  | '<'
  | '<='
  | '=='
  | '!='
  | 'CROSS_ABOVE'
  | 'CROSS_BELOW'
  | 'IN_RANGE'
  | 'OUT_OF_RANGE';

export type StrategyIndicatorGroup =
  | 'TREND'
  | 'MOMENTUM_OSCILLATOR'
  | 'VOLATILITY'
  | 'VOLUME'
  | 'PRICE_ACTION'
  | 'CANDLE_PATTERNS'
  | 'DERIVATIVES';

export type StrategyIndicatorType =
  | 'trend'
  | 'oscillator'
  | 'momentum'
  | 'volatility'
  | 'derivatives'
  | 'pattern';

export type StrategyIndicatorDataRequirement =
  | 'CLOSE'
  | 'OHLC'
  | 'OHLCV'
  | 'DERIVATIVES';

export type StrategyIndicatorPanel = 'price' | 'oscillator' | 'hidden_filter';

export type StrategyIndicatorMode = 'BACKTEST' | 'PAPER' | 'LIVE';

export type StrategyIndicatorParamMeta = {
  name: string;
  default: number;
  min: number;
  max: number;
};

export type StrategyIndicatorRegistryEntry = {
  key: string;
  name: string;
  group: StrategyIndicatorGroup;
  type: StrategyIndicatorType;
  dataRequirement: StrategyIndicatorDataRequirement;
  params: StrategyIndicatorParamMeta[];
  outputs: string[];
  defaultPanel: StrategyIndicatorPanel;
  supportedModes: StrategyIndicatorMode[];
  operators: StrategyIndicatorOperator[];
};

const comparatorOperators: StrategyIndicatorOperator[] = ['>', '>=', '<', '<=', '==', '!='];
const comparatorAndCrossOperators: StrategyIndicatorOperator[] = [
  ...comparatorOperators,
  'CROSS_ABOVE',
  'CROSS_BELOW',
];
const comparatorCrossAndRangeOperators: StrategyIndicatorOperator[] = [
  ...comparatorAndCrossOperators,
  'IN_RANGE',
  'OUT_OF_RANGE',
];
const comparatorAndRangeOperators: StrategyIndicatorOperator[] = [
  ...comparatorOperators,
  'IN_RANGE',
  'OUT_OF_RANGE',
];
const allModes: StrategyIndicatorMode[] = ['BACKTEST', 'PAPER', 'LIVE'];

export const strategyIndicatorRegistry: StrategyIndicatorRegistryEntry[] = [
  {
    key: 'EMA',
    name: 'EMA',
    group: 'TREND',
    type: 'trend',
    dataRequirement: 'CLOSE',
    params: [
      { name: 'fast', default: 9, min: 2, max: 255 },
      { name: 'slow', default: 21, min: 2, max: 255 },
    ],
    outputs: ['fast', 'slow'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorAndCrossOperators,
  },
  {
    key: 'SMA',
    name: 'SMA',
    group: 'TREND',
    type: 'trend',
    dataRequirement: 'CLOSE',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorAndCrossOperators,
  },
  {
    key: 'RSI',
    name: 'RSI',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'oscillator',
    dataRequirement: 'CLOSE',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'MOMENTUM',
    name: 'MOMENTUM',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'momentum',
    dataRequirement: 'CLOSE',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'MACD',
    name: 'MACD',
    group: 'TREND',
    type: 'trend',
    dataRequirement: 'CLOSE',
    params: [
      { name: 'fast', default: 12, min: 2, max: 255 },
      { name: 'slow', default: 26, min: 2, max: 255 },
      { name: 'signal', default: 9, min: 2, max: 255 },
    ],
    outputs: ['line', 'signal', 'histogram'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorAndCrossOperators,
  },
  {
    key: 'ROC',
    name: 'ROC',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'momentum',
    dataRequirement: 'CLOSE',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'STOCHRSI',
    name: 'STOCHRSI',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'oscillator',
    dataRequirement: 'CLOSE',
    params: [
      { name: 'period', default: 14, min: 2, max: 255 },
      { name: 'stochPeriod', default: 14, min: 2, max: 255 },
      { name: 'smoothK', default: 3, min: 2, max: 50 },
      { name: 'smoothD', default: 3, min: 2, max: 50 },
    ],
    outputs: ['k', 'd'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'BOLLINGER_BANDS',
    name: 'BOLLINGER_BANDS',
    group: 'VOLATILITY',
    type: 'volatility',
    dataRequirement: 'OHLC',
    params: [
      { name: 'period', default: 20, min: 2, max: 255 },
      { name: 'stdDev', default: 2, min: 1, max: 10 },
    ],
    outputs: ['upper', 'middle', 'lower', 'bandwidth', 'percentB'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'ATR',
    name: 'ATR',
    group: 'VOLATILITY',
    type: 'volatility',
    dataRequirement: 'OHLC',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'CCI',
    name: 'CCI',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'oscillator',
    dataRequirement: 'OHLC',
    params: [{ name: 'period', default: 20, min: 2, max: 255 }],
    outputs: ['value'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'ADX',
    name: 'ADX',
    group: 'TREND',
    type: 'trend',
    dataRequirement: 'OHLC',
    params: [{ name: 'period', default: 14, min: 2, max: 255 }],
    outputs: ['adx', 'plusDi', 'minusDi'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorAndCrossOperators,
  },
  {
    key: 'STOCHASTIC',
    name: 'STOCHASTIC',
    group: 'MOMENTUM_OSCILLATOR',
    type: 'oscillator',
    dataRequirement: 'OHLC',
    params: [
      { name: 'period', default: 14, min: 2, max: 255 },
      { name: 'smoothK', default: 3, min: 2, max: 50 },
      { name: 'smoothD', default: 3, min: 2, max: 50 },
    ],
    outputs: ['k', 'd'],
    defaultPanel: 'oscillator',
    supportedModes: allModes,
    operators: comparatorCrossAndRangeOperators,
  },
  {
    key: 'DONCHIAN_CHANNELS',
    name: 'DONCHIAN_CHANNELS',
    group: 'VOLATILITY',
    type: 'volatility',
    dataRequirement: 'OHLC',
    params: [{ name: 'period', default: 20, min: 2, max: 255 }],
    outputs: ['upper', 'middle', 'lower'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'FUNDING_RATE',
    name: 'FUNDING_RATE',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'FUNDING_RATE_ZSCORE',
    name: 'FUNDING_RATE_ZSCORE',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [{ name: 'zScorePeriod', default: 20, min: 2, max: 500 }],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'OPEN_INTEREST',
    name: 'OPEN_INTEREST',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'OPEN_INTEREST_DELTA',
    name: 'OPEN_INTEREST_DELTA',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'OPEN_INTEREST_MA',
    name: 'OPEN_INTEREST_MA',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [{ name: 'period', default: 20, min: 2, max: 500 }],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'OPEN_INTEREST_ZSCORE',
    name: 'OPEN_INTEREST_ZSCORE',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [{ name: 'zScorePeriod', default: 20, min: 2, max: 500 }],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'ORDER_BOOK_IMBALANCE',
    name: 'ORDER_BOOK_IMBALANCE',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'ORDER_BOOK_SPREAD_BPS',
    name: 'ORDER_BOOK_SPREAD_BPS',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'ORDER_BOOK_DEPTH_RATIO',
    name: 'ORDER_BOOK_DEPTH_RATIO',
    group: 'DERIVATIVES',
    type: 'derivatives',
    dataRequirement: 'DERIVATIVES',
    params: [],
    outputs: ['value'],
    defaultPanel: 'hidden_filter',
    supportedModes: allModes,
    operators: comparatorAndRangeOperators,
  },
  {
    key: 'BULLISH_ENGULFING',
    name: 'BULLISH_ENGULFING',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'BEARISH_ENGULFING',
    name: 'BEARISH_ENGULFING',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'HAMMER',
    name: 'HAMMER',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'SHOOTING_STAR',
    name: 'SHOOTING_STAR',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'DOJI',
    name: 'DOJI',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [{ name: 'dojiBodyToRangeMax', default: 0.1, min: 0.01, max: 0.5 }],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'MORNING_STAR',
    name: 'MORNING_STAR',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'EVENING_STAR',
    name: 'EVENING_STAR',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'INSIDE_BAR',
    name: 'INSIDE_BAR',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
  {
    key: 'OUTSIDE_BAR',
    name: 'OUTSIDE_BAR',
    group: 'CANDLE_PATTERNS',
    type: 'pattern',
    dataRequirement: 'OHLC',
    params: [],
    outputs: ['match'],
    defaultPanel: 'price',
    supportedModes: allModes,
    operators: comparatorOperators,
  },
];

export const getStrategyIndicatorRegistry = () => strategyIndicatorRegistry;

export const getStrategyIndicatorRegistryEntry = (key: string) =>
  strategyIndicatorRegistry.find((entry) => entry.key === key.trim().toUpperCase()) ?? null;
