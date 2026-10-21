import request from 'supertest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { app } from '../../index';
import { prisma } from '../../prisma/client';
import { ensureSubscriptionCatalog, setActiveSubscriptionForUser } from '../subscriptions/subscriptions.service';
import { inspectMomentumPeriodMigration,
  applyMomentumPeriodMigration } from './strategyMomentumMigration';

const createStrategyPayload = () => ({
  name: 'RSI + MACD',
  description: 'Contract test strategy',
  interval: '5m',
  leverage: 3,
  walletRisk: 1.5,
  config: {
    open: { logic: 'AND', rules: [] },
    close: { logic: 'OR', rules: [] },
  },
});

const registerAndLogin = async (email: string) => {
  const agent = request.agent(app);

  const res = await agent.post('/auth/register').send({
    email,
    password: 'test1234',
  });

  expect(res.status).toBe(201);
  await ensureSubscriptionCatalog(prisma);
  await setActiveSubscriptionForUser(prisma, {
    userId: res.body.user.id as string,
    planCode: 'FREE',
    source: 'ADMIN_OVERRIDE',
    autoRenew: false,
    metadata: { reason: 'strategies_test_fixture' },
  });
  return agent;
};

const createMarketGroup = async (
  email: string,
  marketType: 'FUTURES' | 'SPOT' = 'FUTURES'
) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const marketUniverse = await prisma.marketUniverse.create({
    data: {
      userId: user.id,
      name: `Strategies Guard Universe ${marketType} ${Date.now()}`,
      marketType,
      baseCurrency: 'USDT',
      whitelist: [],
      blacklist: [],
    },
  });
  const symbolGroup = await prisma.symbolGroup.create({
    data: {
      userId: user.id,
      marketUniverseId: marketUniverse.id,
      name: `Strategies Guard Group ${marketType} ${Date.now()}`,
      symbols: marketType === 'SPOT' ? ['BTCUSDT'] : ['BTCUSDT', 'ETHUSDT'],
    },
  });

  return symbolGroup.id;
};

const createWallet = async (
  email: string,
  marketType: 'FUTURES' | 'SPOT' = 'FUTURES'
) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const wallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      name: `Strategies Guard Wallet ${marketType} ${Date.now()}`,
      mode: 'PAPER',
      exchange: 'BINANCE',
      marketType,
      baseCurrency: 'USDT',
      paperInitialBalance: 10_000,
    },
  });

  return wallet.id;
};

const createBotWithStrategy = async (params: {
  agent: ReturnType<typeof request.agent>;
  email: string;
  strategyId: string;
  isActive: boolean;
}) => {
  const marketGroupId = await createMarketGroup(params.email, 'FUTURES');
  const walletId = await createWallet(params.email, 'FUTURES');
  const createBotRes = await params.agent.post('/dashboard/bots').send({
    name: `Strategy Guard Bot ${Date.now()}`,
    mode: 'PAPER',
    walletId,
    strategyId: params.strategyId,
    marketGroupId,
    isActive: params.isActive,
    liveOptIn: false,
  });
  expect(createBotRes.status).toBe(201);
  return createBotRes.body.id as string;
};

describe('Strategies CRUD contract', () => {
  beforeEach(async () => {
    await prisma.trade.deleteMany();
    await prisma.order.deleteMany();
    await prisma.position.deleteMany();
    await prisma.signal.deleteMany();
    await prisma.botRuntimeEvent.deleteMany();
    await prisma.botRuntimeSymbolStat.deleteMany();
    await prisma.botRuntimeSession.deleteMany();
    await prisma.backtestTrade.deleteMany();
    await prisma.backtestReport.deleteMany();
    await prisma.backtestRun.deleteMany();
    await prisma.log.deleteMany();
    await prisma.botStrategy.deleteMany();
    await prisma.botSubagentConfig.deleteMany();
    await prisma.botAssistantConfig.deleteMany();
    await prisma.marketGroupStrategyLink.deleteMany();
    await prisma.botMarketGroup.deleteMany();
    await prisma.bot.deleteMany();
    await prisma.runtimeExecutionDedupe.deleteMany();
    await prisma.symbolGroup.deleteMany();
    await prisma.marketUniverse.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.strategy.deleteMany();
    await prisma.user.deleteMany();
  });

  it('rejects unauthenticated access', async () => {
    const res = await request(app).get('/dashboard/strategies');
    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Missing token');
  });

  it('rejects new MOMENTUM 1 on create/update/import and explicitly migrates saved 1', async () => {
    const email = 'strategies-momentum-period-001@example.com';
    const agent = await registerAndLogin(email);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    const legacyConfig = { open: { direction: 'both',
      indicatorsLong: [{ name: 'MOMENTUM', condition: '>', value: 1.5,
        params: { period: 1 } }],
      indicatorsShort: [{ name: 'EMA', condition: '<', value: 0,
        params: { period: 2 }, operand: { kind: 'series', indicator: 'MOMENTUM',
          params: { period: 1 } } }],
    } };
    const invalidCreate = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(), config: legacyConfig,
    });
    expect(invalidCreate.status).toBe(400);
    expect(invalidCreate.body.error.message)
      .toBe('MOMENTUM period must be an integer from 2 to 255');
    expect(invalidCreate.body.error.details).toEqual(expect.objectContaining({
      fields: ['open.indicatorsLong[0].params.period',
        'open.indicatorsShort[0].operand.params.period'], min: 2,
    }));
    expect(await prisma.strategy.count({ where: { userId: user.id } })).toBe(0);

    const validConfig = structuredClone(legacyConfig);
    validConfig.open.indicatorsLong[0].params.period = 2;
    validConfig.open.indicatorsShort[0].operand.params.period = 2;
    const created = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(), config: validConfig,
    });
    expect(created.status).toBe(201);
    const id = created.body.id as string;
    const metadataConfig = { open: { direction: 'long', indicatorsLong: [
      { name: 'EMA', condition: '>', value: 0, params: { period: 2 },
        metadata: { name: 'MOMENTUM', params: { period: 1 } } },
    ], indicatorsShort: [] } };
    const metadataCreated = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(), name: 'metadata only', config: metadataConfig,
    });
    expect(metadataCreated.status).toBe(201);
    const read = await agent.get(`/dashboard/strategies/${id}`);
    expect(read.body.config.open.indicatorsLong[0].params.period).toBe(2);
    for (const period of [0, 1.5, '1', '2', 256]) {
      const invalidConfig = structuredClone(legacyConfig) as any;
      invalidConfig.open.indicatorsLong[0].params.period = period;
      invalidConfig.open.indicatorsShort[0].operand.params.period = period;
      const create = await agent.post('/dashboard/strategies').send({
        ...createStrategyPayload(), config: invalidConfig,
      });
      const update = await agent.put(`/dashboard/strategies/${id}`)
        .send({ config: invalidConfig });
      const imported = await agent.post('/dashboard/strategies/import').send({
        formatVersion: 'strategy.v1', exportedAt: new Date().toISOString(),
        strategy: { ...createStrategyPayload(), config: invalidConfig },
      });
      for (const response of [create, update, imported]) {
        expect(response.status).toBe(400);
        expect(response.body.error.message)
          .toBe('MOMENTUM period must be an integer from 2 to 255');
        expect(response.body.error.details.fields).toEqual([
          'open.indicatorsLong[0].params.period',
          'open.indicatorsShort[0].operand.params.period',
        ]);
      }
    }
    const invalidUpdate = await agent.put(`/dashboard/strategies/${id}`).send({
      config: legacyConfig,
    });
    expect(invalidUpdate.status).toBe(400);
    expect((await agent.get(`/dashboard/strategies/${id}`))
      .body.config.open.indicatorsLong[0].params.period).toBe(2);
    const invalidImport = await agent.post('/dashboard/strategies/import').send({
      formatVersion: 'strategy.v1', exportedAt: new Date().toISOString(),
      strategy: { ...createStrategyPayload(), config: legacyConfig },
    });
    expect(invalidImport.status).toBe(400);
    expect(invalidImport.body.error.message)
      .toBe('MOMENTUM period must be an integer from 2 to 255');

    // This record represents a definition saved before the policy was introduced.
    await prisma.strategy.update({ where: { id }, data: { config: legacyConfig } });
    const historical = await prisma.backtestRun.create({ data: {
      userId: user.id, strategyId: id, name: 'historical period 1 snapshot',
      symbol: 'BTCUSDT', timeframe: '1m', status: 'COMPLETED',
      seedConfig: { strategy: { config: legacyConfig } },
    } });
    const legacyRead = await agent.get(`/dashboard/strategies/${id}`);
    const legacyExport = await agent.get(`/dashboard/strategies/${id}/export`);
    expect(legacyRead.body.config.open.indicatorsLong[0].params.period).toBe(1);
    expect(legacyExport.body.strategy.config.open.indicatorsLong[0].params.period).toBe(1);
    const rename = await agent.put(`/dashboard/strategies/${id}`).send({ name: 'Legacy renamed' });
    expect(rename.status).toBe(200);
    const rejectedLegacyEdit = await agent.put(`/dashboard/strategies/${id}`)
      .send({ config: legacyConfig });
    expect(rejectedLegacyEdit.status).toBe(400);
    const activeBotId = await createBotWithStrategy({ agent, email,
      strategyId: id, isActive: true });
    const staleInventory = await inspectMomentumPeriodMigration(prisma);
    const concurrentlyEditedConfig = { ...legacyConfig,
      metadata: { untouched: 'concurrent edit' } };
    await prisma.strategy.update({ where: { id },
      data: { config: concurrentlyEditedConfig } });
    await expect(applyMomentumPeriodMigration(prisma, staleInventory.digest))
      .rejects.toThrow('Strategy inventory changed since dry-run');
    const dryRun = await inspectMomentumPeriodMigration(prisma);
    expect(dryRun).toMatchObject({ strategyCount: 2,
      candidateLinkedHistoricalRuns: 1,
      candidateActiveLegacyLinks: 0, candidateActiveCanonicalLinks: 1 });
    expect(dryRun.candidates).toEqual([{ id, fields: [
      'open.indicatorsLong[0].params.period',
      'open.indicatorsShort[0].operand.params.period',
    ] }]);
    await expect(applyMomentumPeriodMigration(prisma, '0'.repeat(64)))
      .rejects.toThrow('Strategy inventory changed since dry-run');
    expect((await prisma.strategy.findUniqueOrThrow({ where: { id } })).config)
      .toEqual(concurrentlyEditedConfig);
    expect(await applyMomentumPeriodMigration(prisma, dryRun.digest))
      .toEqual({ migrated: 1, changedFields: 2, ids: [id] });
    const migratedRead = await agent.get(`/dashboard/strategies/${id}`);
    expect(migratedRead.body.config.open.indicatorsLong[0].params.period).toBe(2);
    expect(migratedRead.body.config.open.indicatorsShort[0].operand.params.period).toBe(2);
    expect(migratedRead.body.config.metadata).toEqual(concurrentlyEditedConfig.metadata);
    expect((await prisma.strategy.findUniqueOrThrow({
      where: { id: metadataCreated.body.id as string } })).config).toEqual(metadataConfig);
    expect((await prisma.bot.findUniqueOrThrow({ where: { id: activeBotId } })).isActive)
      .toBe(true);
    const savedHistory = await prisma.backtestRun.findUniqueOrThrow({
      where: { id: historical.id } });
    expect(savedHistory.seedConfig).toEqual({ strategy: { config: legacyConfig } });
    const secondDryRun = await inspectMomentumPeriodMigration(prisma);
    expect(secondDryRun.candidates).toEqual([]);
    expect(await applyMomentumPeriodMigration(prisma, secondDryRun.digest))
      .toMatchObject({ migrated: 0, changedFields: 0 });

    const unsafeCreated = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(), name: 'pre-policy noninteger', config: validConfig,
    });
    expect(unsafeCreated.status).toBe(201);
    const unsafeConfig = structuredClone(validConfig) as any;
    unsafeConfig.open.indicatorsLong[0].params.period = 1.5;
    await prisma.strategy.update({ where: { id: unsafeCreated.body.id as string },
      data: { config: unsafeConfig } });
    const unsafeInventory = await inspectMomentumPeriodMigration(prisma);
    expect(unsafeInventory.unsafe).toEqual([{
      id: unsafeCreated.body.id,
      fields: ['open.indicatorsLong[0].params.period'],
    }]);
    await expect(applyMomentumPeriodMigration(prisma, unsafeInventory.digest))
      .rejects.toThrow('invalid MOMENTUM periods requiring separate review');
  });

  it('supports create/list/get/update/delete flow for authenticated user', async () => {
    const agent = await registerAndLogin('strategies-owner@example.com');

    const createRes = await agent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBeDefined();
    expect(createRes.body.name).toBe('RSI + MACD');
    const strategyId = createRes.body.id as string;

    const listRes = await agent.get('/dashboard/strategies');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body).toHaveLength(1);
    expect(listRes.body[0].id).toBe(strategyId);

    const getRes = await agent.get(`/dashboard/strategies/${strategyId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(strategyId);
    expect(getRes.body.interval).toBe('5m');

    const updateRes = await agent.put(`/dashboard/strategies/${strategyId}`).send({
      name: 'RSI + MACD v2',
      leverage: 5,
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('RSI + MACD v2');
    expect(updateRes.body.leverage).toBe(5);

    const deleteRes = await agent.delete(`/dashboard/strategies/${strategyId}`);
    expect(deleteRes.status).toBe(204);

    const getDeletedRes = await agent.get(`/dashboard/strategies/${strategyId}`);
    expect(getDeletedRes.status).toBe(404);
    expect(getDeletedRes.body.error.message).toBe('Not found');
  });

  it('supports export/import flow with format versioning', async () => {
    const agent = await registerAndLogin('strategies-export@example.com');

    const createRes = await agent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;

    const exportRes = await agent.get(`/dashboard/strategies/${strategyId}/export`);
    expect(exportRes.status).toBe(200);
    expect(exportRes.body.formatVersion).toBe('strategy.v1');
    expect(exportRes.body.strategy.name).toBe('RSI + MACD');

    const importRes = await agent.post('/dashboard/strategies/import').send(exportRes.body);
    expect(importRes.status).toBe(201);
    expect(importRes.body.id).toBeDefined();
    expect(importRes.body.id).not.toBe(strategyId);
    expect(importRes.body.name).toBe(exportRes.body.strategy.name);
    expect(importRes.body.interval).toBe(exportRes.body.strategy.interval);
  });

  it('accepts advanced TSL with negative start and positive step on create', async () => {
    const agent = await registerAndLogin('strategies-valid-close-create@example.com');

    const createRes = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(),
      config: {
        open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
        close: {
          mode: 'advanced',
          sl: 2,
          tp: 3,
          ttp: [],
          tsl: [{ arm: 10, percent: -20 }],
        },
      },
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.config.close.tsl).toEqual([{ arm: 10, percent: -20 }]);
  });

  it('persists the explicit USDT DCA version through create, read and edit', async () => {
    const agent = await registerAndLogin('strategies-usdt-dca-contract@example.com');
    const config = {
      open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
      close: { mode: 'basic', tp: 10, sl: 10, ttp: [], tsl: [] },
      additional: {
        dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1',
        dcaMode: 'advanced', dcaTimes: 2,
        dcaLevels: [{ percent: -20, multiplier: 0.5 }, { percent: 20, multiplier: 2 }],
      },
    };
    const createRes = await agent.post('/dashboard/strategies').send({ ...createStrategyPayload(), config });
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;
    const readRes = await agent.get(`/dashboard/strategies/${strategyId}`);
    expect(readRes.status).toBe(200);
    expect(readRes.body.config.additional).toEqual(config.additional);

    const editedConfig = {
      ...config,
      additional: { ...config.additional, dcaMode: 'basic', dcaTimes: 2,
        dcaLevels: [{ percent: -30.5, multiplier: 0.5 }] },
    };
    const updateRes = await agent.put(`/dashboard/strategies/${strategyId}`)
      .send({ ...createStrategyPayload(), config: editedConfig });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.config.additional).toEqual(editedConfig.additional);
  });

  it.each([
    { label: 'USDT 0.5', basis: 'usdt_contribution_v1', multiplier: 0.5 },
    { label: 'legacy quantity 2', basis: undefined, multiplier: 2 },
  ])('roundtrips Basic $label with the multiplier only in its level', async ({ basis, multiplier }) => {
    const { dtoToForm, formToPayload } = await vi.importActual<{
      dtoToForm: (dto: unknown) => { name: string; additional: Record<string, unknown> };
      formToPayload: (form: unknown) => Record<string, unknown>;
    }>('../../../../web/src/features/strategies/utils/StrategyForm.map');
    const agent = await registerAndLogin(`strategies-basic-${multiplier}@example.com`);
    const config = {
      open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
      close: { mode: 'basic', tp: 10, sl: 10, ttp: [], tsl: [] },
      additional: {
        dcaEnabled: true, dcaMode: 'basic', dcaTimes: 2,
        ...(basis ? { dcaSizingBasis: basis } : {}),
        dcaLevels: [{ percent: -5, multiplier }],
      },
    };
    const created = await agent.post('/dashboard/strategies').send({ ...createStrategyPayload(), config });
    expect(created.status).toBe(201);
    const id = created.body.id as string;
    const read = await agent.get(`/dashboard/strategies/${id}`);
    expect(read.status).toBe(200);
    expect(read.body.config.additional).toEqual(config.additional);

    const form = dtoToForm(read.body);
    expect(form.additional.dcaMultiplier).toBe(multiplier);
    const edited = await agent.put(`/dashboard/strategies/${id}`)
      .send(formToPayload(form));
    expect(edited.status).toBe(200);
    const editedRead = await agent.get(`/dashboard/strategies/${id}`);
    expect(editedRead.status).toBe(200);
    expect(editedRead.body.config.additional).toEqual(expect.objectContaining({
      dcaMultiplier: multiplier,
      dcaLevels: [{ percent: -5, multiplier }],
    }));
    expect(editedRead.body.config.additional.dcaSizingBasis).toBe(basis);

    const cloneForm = dtoToForm(editedRead.body);
    const cloned = await agent.post('/dashboard/strategies').send(formToPayload({
      ...cloneForm,
      name: `Clone ${multiplier}`,
      additional: {
        ...cloneForm.additional,
        dcaSizingBasis: cloneForm.additional.dcaSizingBasis ?? 'quantity_v1',
      },
    }));
    expect(cloned.status).toBe(201);
    const cloneRead = await agent.get(`/dashboard/strategies/${cloned.body.id}`);
    expect(cloneRead.status).toBe(200);
    expect(cloneRead.body.config.additional).toEqual(expect.objectContaining({
      dcaSizingBasis: basis ?? 'quantity_v1', dcaMultiplier: multiplier,
      dcaLevels: [{ percent: -5, multiplier }],
    }));
  });

  it('rejects conflicting Basic multipliers on create and edit', async () => {
    const agent = await registerAndLogin('strategies-basic-multiplier-conflict@example.com');
    const config = {
      close: { mode: 'basic', tp: 10, sl: 10 },
      additional: {
        dcaEnabled: true, dcaSizingBasis: 'usdt_contribution_v1', dcaMode: 'basic',
        dcaTimes: 1, dcaMultiplier: 1, dcaLevels: [{ percent: -5, multiplier: 0.5 }],
      },
    };
    const response = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(),
      config,
    });
    expect(response.status).toBe(400);
    expect(response.body.error.details).toEqual(expect.objectContaining({
      field: 'additional.dcaMultiplier', rule: 'conflicting_basic_dca_multiplier',
    }));

    const validConfig = { ...config,
      additional: { ...config.additional, dcaMultiplier: 0.5 } };
    const created = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(), config: validConfig,
    });
    expect(created.status).toBe(201);
    const update = await agent.put(`/dashboard/strategies/${created.body.id}`)
      .send({ ...createStrategyPayload(), config });
    expect(update.status).toBe(400);
    const read = await agent.get(`/dashboard/strategies/${created.body.id}`);
    expect(read.body.config.additional.dcaMultiplier).toBe(0.5);
  });

  it('rejects TSL levels that do not use negative start and positive step', async () => {
    const agent = await registerAndLogin('strategies-invalid-close-create@example.com');

    const createRes = await agent.post('/dashboard/strategies').send({
      ...createStrategyPayload(),
      config: {
        open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
        close: {
          mode: 'advanced',
          sl: 2,
          tp: 3,
          ttp: [],
          tsl: [{ arm: 10, percent: 20 }],
        },
      },
    });

    expect(createRes.status).toBe(400);
    expect(createRes.body.error.message).toBe('Invalid trailing close configuration');
    expect(createRes.body.error.details).toEqual(
      expect.objectContaining({
        field: 'close.tsl[0]',
        rule: 'tsl_requires_negative_start_and_positive_step',
      })
    );
  });

  it('rejects invalid trailing close configuration on import', async () => {
    const agent = await registerAndLogin('strategies-invalid-close-import@example.com');

    const importRes = await agent.post('/dashboard/strategies/import').send({
      formatVersion: 'strategy.v1',
      exportedAt: new Date().toISOString(),
      strategy: {
        ...createStrategyPayload(),
        config: {
          open: { direction: 'both', indicatorsLong: [], indicatorsShort: [] },
          close: {
            mode: 'advanced',
            sl: 2,
            tp: 3,
            ttp: [{ percent: 10, arm: 20 }],
            tsl: [],
          },
        },
      },
    });

    expect(importRes.status).toBe(400);
    expect(importRes.body.error.message).toBe('Invalid trailing close configuration');
    expect(importRes.body.error.details).toEqual(
      expect.objectContaining({
        field: 'close.ttp[0]',
        rule: 'trail_cannot_exceed_trigger',
      })
    );
  });

  it('rejects import when formatVersion is invalid', async () => {
    const agent = await registerAndLogin('strategies-import-invalid@example.com');
    const invalidPayload = {
      formatVersion: 'strategy.v0',
      exportedAt: new Date().toISOString(),
      strategy: createStrategyPayload(),
    };

    const importRes = await agent.post('/dashboard/strategies/import').send(invalidPayload);
    expect(importRes.status).toBe(400);
    expect(importRes.body.error.message).toBe('Invalid strategy import payload');
  });

  it('enforces ownership isolation on get/update/delete', async () => {
    const ownerAgent = await registerAndLogin('strategies-owner-2@example.com');
    const otherAgent = await registerAndLogin('strategies-other@example.com');

    const createRes = await ownerAgent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;

    const getRes = await otherAgent.get(`/dashboard/strategies/${strategyId}`);
    expect(getRes.status).toBe(404);
    expect(getRes.body.error.message).toBe('Not found');

    const updateRes = await otherAgent.put(`/dashboard/strategies/${strategyId}`).send({
      name: 'Should not update',
    });
    expect(updateRes.status).toBe(404);
    expect(updateRes.body.error.message).toBe('Not found');

    const deleteRes = await otherAgent.delete(`/dashboard/strategies/${strategyId}`);
    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.error.message).toBe('Not found');
  });

  it('blocks strategy updates when strategy is used by any active bot', async () => {
    const email = 'strategies-active-bot-lock@example.com';
    const agent = await registerAndLogin(email);

    const createRes = await agent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;

    await createBotWithStrategy({
      agent,
      email,
      strategyId,
      isActive: true,
    });

    const updateRes = await agent.put(`/dashboard/strategies/${strategyId}`).send({
      name: 'Blocked strategy update',
    });
    expect(updateRes.status).toBe(409);
    expect(updateRes.body.error.message).toBe('strategy is used by active bot and cannot be edited');
    expect(updateRes.body.error.details).toEqual(
      expect.objectContaining({
        botId: expect.any(String),
        botName: expect.stringContaining('Strategy Guard Bot'),
      })
    );
  });

  it('allows strategy updates when linked bots are inactive', async () => {
    const email = 'strategies-inactive-bot-update@example.com';
    const agent = await registerAndLogin(email);

    const createRes = await agent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;

    await createBotWithStrategy({
      agent,
      email,
      strategyId,
      isActive: false,
    });

    const updateRes = await agent.put(`/dashboard/strategies/${strategyId}`).send({
      name: 'Allowed strategy update',
    });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.name).toBe('Allowed strategy update');
  });

  it('blocks strategy delete when strategy is used by any active bot', async () => {
    const email = 'strategies-active-bot-delete-lock@example.com';
    const agent = await registerAndLogin(email);

    const createRes = await agent.post('/dashboard/strategies').send(createStrategyPayload());
    expect(createRes.status).toBe(201);
    const strategyId = createRes.body.id as string;

    await createBotWithStrategy({
      agent,
      email,
      strategyId,
      isActive: true,
    });

    const deleteRes = await agent.delete(`/dashboard/strategies/${strategyId}`);
    expect(deleteRes.status).toBe(409);
    expect(deleteRes.body.error.message).toBe('strategy is used by active bot and cannot be deleted');
    expect(deleteRes.body.error.details).toEqual(
      expect.objectContaining({
        botId: expect.any(String),
        botName: expect.stringContaining('Strategy Guard Bot'),
      })
    );
  });
});


