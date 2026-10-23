// Frozen before selecting the functional witness; shared by selector and process proof.
export const marketSequenceStrategyConfig = {
  open: { direction: 'long', noMatchAction: 'EXIT',
    indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: -100,
      params: { period: 2 } }], indicatorsShort: [] },
  close: { mode: 'advanced', ttp: [{ percent: 0.08, arm: 0.05 }], tsl: [] },
  additional: { dcaEnabled: true, dcaMode: 'advanced', dcaTimes: 1,
    dcaSizingBasis: 'usdt_contribution_v1',
    dcaLevels: [{ percent: 0.10, multiplier: 1 }], marginMode: 'ISOLATED' },
};
