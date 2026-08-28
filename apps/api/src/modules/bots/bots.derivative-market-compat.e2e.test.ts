import { beforeEach, describe, expect, it } from 'vitest';
import {
  createMarketGroup,
  createPayload,
  createStrategy,
  registerAndLogin,
  resetBotsE2eState,
} from './bots.e2e.shared';

describe('Bot derivatives market compatibility', () => {
  beforeEach(resetBotsE2eState);

  it('rejects derivatives-indicator strategies for SPOT bots', async () => {
    const email = 'bots-derivatives-spot-guard@example.com';
    const agent = await registerAndLogin(email);
    const strategyId = await createStrategy(agent, 'Derivatives-only Strategy', {
      open: {
        indicatorsLong: [{ name: 'FUNDING_RATE', condition: '>', value: 0, params: {} }],
        indicatorsShort: [],
      },
      close: { mode: 'basic', tp: 2, sl: 1 },
    });
    const spotMarketGroupId = await createMarketGroup(email, 'SPOT');

    const createRes = await agent.post('/dashboard/bots').send(
      createPayload({
        strategyId,
        marketGroupId: spotMarketGroupId,
      })
    );

    expect(createRes.status).toBe(400);
    expect(createRes.body.error.message).toBe(
      'strategies using derivatives indicators require a FUTURES market group'
    );
    expect(createRes.body.error.details).toMatchObject({
      marketType: 'SPOT',
      strategyIds: [strategyId],
    });
  });
});
