import { SignalDirection } from '@prisma/client';

export type RuntimeSignalConditionLine = {
  scope: 'LONG' | 'SHORT';
  left: string;
  value: string;
  operator: string;
  right: string;
  matched?: boolean | null;
};

export type StrategyEvaluation = {
  direction: SignalDirection | null;
  conditionLines: RuntimeSignalConditionLine[];
  indicatorSummary: string | null;
};
