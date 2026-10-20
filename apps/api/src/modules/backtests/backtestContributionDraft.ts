export type ReplayContributionDraft = {
  addSequence: number;
  levelIndex: number | null;
  triggerPercent: number | null;
  multiplier: number | null;
  quantity: number;
  contributionUsdt: number;
};

export const entryContribution = (price: number, quantity: number): ReplayContributionDraft => ({
  addSequence: 0, levelIndex: null, triggerPercent: null, multiplier: null,
  quantity, contributionUsdt: price * quantity,
});

export const dcaContribution = (input: {
  addSequence: number;
  levelIndex: number | undefined;
  levels: number[];
  multipliers: number[];
  price: number;
  quantity: number;
}): ReplayContributionDraft => {
  const { levelIndex } = input;
  if (levelIndex === undefined || !Number.isInteger(levelIndex) || levelIndex < 0 ||
      !Number.isFinite(input.levels[levelIndex]) ||
      !Number.isFinite(input.multipliers[levelIndex])) {
    throw new Error('Confirmed BACKTEST DCA level is incomplete');
  }
  return {
    addSequence: input.addSequence, levelIndex,
    triggerPercent: input.levels[levelIndex] * 100, multiplier: input.multipliers[levelIndex],
    quantity: input.quantity, contributionUsdt: input.price * input.quantity,
  };
};
