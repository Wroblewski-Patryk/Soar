const toDate = (value: Date | string | null | undefined): Date | null => {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

export const toRuntimeAggregateDate = toDate;

export const toRuntimeAggregateTimestamp = (value: Date | string | null | undefined): number =>
  toDate(value)?.getTime() ?? 0;

export const readRuntimeAggregateFiniteNumber = (value: unknown): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
};

const uniqueById = <T extends { id: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  }
  return [...map.values()];
};

export const compareRuntimeAggregateTimestampDescThenIdAsc = (
  leftTs: number,
  rightTs: number,
  leftId: string,
  rightId: string
) => {
  const byTimestamp = rightTs - leftTs;
  if (byTimestamp !== 0) return byTimestamp;
  return leftId.localeCompare(rightId);
};

export const selectLatestRunningProjectionRows = <
  T extends {
    session: {
      id: string;
      status: string;
      lastHeartbeatAt: Date | string | null;
      finishedAt: Date | string | null;
      startedAt: Date | string | null;
    };
  },
>(
  rows: T[]
) => {
  const runningRows = rows.filter((row) => row.session.status === 'RUNNING');
  if (runningRows.length === 0) return rows;
  const nonRunningRows = rows.filter((row) => row.session.status !== 'RUNNING');
  const latestRunningRow = [...runningRows].sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      Math.max(
        toRuntimeAggregateTimestamp(left.session.lastHeartbeatAt),
        toRuntimeAggregateTimestamp(left.session.finishedAt),
        toRuntimeAggregateTimestamp(left.session.startedAt)
      ),
      Math.max(
        toRuntimeAggregateTimestamp(right.session.lastHeartbeatAt),
        toRuntimeAggregateTimestamp(right.session.finishedAt),
        toRuntimeAggregateTimestamp(right.session.startedAt)
      ),
      left.session.id,
      right.session.id
    )
  )[0];
  return latestRunningRow ? [...nonRunningRows, latestRunningRow] : nonRunningRows;
};

export const selectRuntimeAggregateCurrentRows = <
  T extends {
    session: {
      status: string;
    };
  },
>(
  rows: T[]
) => {
  const runningRows = rows.filter((row) => row.session.status === 'RUNNING');
  return runningRows.length > 0 ? runningRows : rows;
};

export const sumRuntimeAggregateProjectedSymbolsTracked = <
  T extends {
    session: {
      symbolsTracked: number;
    };
  },
>(
  rows: T[]
) => rows.reduce((acc, row) => acc + row.session.symbolsTracked, 0);

export const buildRuntimeAggregateProjectedTradeItems = <
  T extends {
    trades: {
      items: Array<{
        id: string;
        executedAt: Date | string | null;
      }>;
    };
  },
>(
  rows: T[]
) =>
  uniqueById(rows.flatMap((row) => row.trades.items)).sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      toRuntimeAggregateTimestamp(left.executedAt),
      toRuntimeAggregateTimestamp(right.executedAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateCurrentOpenItems = <
  T extends {
    openItems: Array<{
      id: string;
      openedAt: Date | string | null;
      entryNotional: number;
      leverage: number;
    }>;
  },
>(
  response: T | null
) =>
  uniqueById(response?.openItems ?? []).sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      toRuntimeAggregateTimestamp(left.openedAt),
      toRuntimeAggregateTimestamp(right.openedAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateCurrentOpenOrders = <
  T extends {
    openOrders: Array<{
      id: string;
      submittedAt?: Date | string | null;
      createdAt: Date | string | null;
    }>;
  },
>(
  response: T | null
) =>
  uniqueById(response?.openOrders ?? []).sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      toRuntimeAggregateTimestamp(left.submittedAt ?? left.createdAt),
      toRuntimeAggregateTimestamp(right.submittedAt ?? right.createdAt),
      left.id,
      right.id
    )
  );

export const buildRuntimeAggregateProjectedHistoryItems = <
  T extends {
    positions: {
      historyItems: Array<{
        id: string;
        closedAt: Date | string | null;
      }>;
    };
  },
>(
  rows: T[]
) =>
  uniqueById(rows.flatMap((row) => row.positions.historyItems)).sort((left, right) =>
    compareRuntimeAggregateTimestampDescThenIdAsc(
      toRuntimeAggregateTimestamp(left.closedAt),
      toRuntimeAggregateTimestamp(right.closedAt),
      left.id,
      right.id
    )
  );

export const resolveRuntimeAggregateCurrentDynamicStopColumns = <
  T extends {
    showDynamicStopColumns?: boolean;
  },
>(
  response: T | null
) => response?.showDynamicStopColumns === true;

export const selectRuntimeAggregateLatestCapitalSummary = <
  T extends {
    positions: {
      summary: {
        referenceBalance?: unknown;
        freeCash?: unknown;
        accountBalance?: unknown;
        baseCurrency?: unknown;
        capitalSource?: unknown;
        allocationMode?: unknown;
        allocationValue?: unknown;
        paperResetAt?: Date | string | null;
      };
    };
  },
>(
  rows: T[]
) =>
  rows
    .map((row) => row.positions.summary)
    .find((summary) => {
      const referenceBalance = readRuntimeAggregateFiniteNumber(summary.referenceBalance);
      const freeCash = readRuntimeAggregateFiniteNumber(summary.freeCash);
      const accountBalance = readRuntimeAggregateFiniteNumber(summary.accountBalance);
      return referenceBalance != null || freeCash != null || accountBalance != null;
    });

export const buildRuntimeAggregateTradesMeta = (params: {
  totalTrades: number;
  returnedItemsCount: number;
  pageSize: number;
}) => {
  const pageSize = Math.max(1, params.pageSize);
  const total = Math.max(0, params.totalTrades);
  const returnedItemsCount = Math.max(0, params.returnedItemsCount);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    page: 1,
    pageSize,
    total,
    totalPages,
    hasPrev: false,
    hasNext: total > returnedItemsCount,
  };
};
