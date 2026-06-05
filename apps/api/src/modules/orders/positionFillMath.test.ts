import { describe, expect, it } from 'vitest';

import { computePositionAddUpdate } from './positionFillMath';

describe('computePositionAddUpdate', () => {
  it('weighted-averages entry price when adding to an existing position', () => {
    expect(
      computePositionAddUpdate({
        currentQuantity: 2,
        currentEntryPrice: 100,
        addedQuantity: 1,
        fillPrice: 130,
      })
    ).toEqual({
      nextQuantity: 3,
      nextEntryPrice: 110,
    });
  });

  it('opens a new position from the positive fill when current quantity is empty', () => {
    expect(
      computePositionAddUpdate({
        currentQuantity: 0,
        currentEntryPrice: 0,
        addedQuantity: 0.5,
        fillPrice: 250,
      })
    ).toEqual({
      nextQuantity: 0.5,
      nextEntryPrice: 250,
    });
  });

  it('keeps the prior position unchanged when fill price is not positive finite truth', () => {
    expect(
      computePositionAddUpdate({
        currentQuantity: 2,
        currentEntryPrice: 100,
        addedQuantity: 1,
        fillPrice: 0,
      })
    ).toEqual({
      nextQuantity: 2,
      nextEntryPrice: 100,
    });

    expect(
      computePositionAddUpdate({
        currentQuantity: 2,
        currentEntryPrice: 100,
        addedQuantity: 1,
        fillPrice: Number.NaN,
      })
    ).toEqual({
      nextQuantity: 2,
      nextEntryPrice: 100,
    });
  });

  it('normalizes negative quantities and entry prices before computing fill math', () => {
    expect(
      computePositionAddUpdate({
        currentQuantity: -2,
        currentEntryPrice: -100,
        addedQuantity: 1,
        fillPrice: 130,
      })
    ).toEqual({
      nextQuantity: 1,
      nextEntryPrice: 130,
    });
  });
});
