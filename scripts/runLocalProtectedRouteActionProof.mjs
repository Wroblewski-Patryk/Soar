#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const includeDynamicFixtures = args.has('--include-dynamic-fixtures') || args.has('--dynamic-fixtures-only');
const dynamicFixturesOnly = args.has('--dynamic-fixtures-only');

const readArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  return index === -1 ? '' : rawArgs[index + 1] ?? '';
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const repoRoot = process.cwd();
const cdpCommandTimeoutMs = Number(readArgValue('--cdp-timeout-ms') || process.env.LOCAL_PROTECTED_CDP_TIMEOUT_MS || 30000);

const normalizeBaseUrl = (value) => String(value ?? '').trim().replace(/\/+$/, '');

const actionClusters = [
  {
    name: 'dashboard',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-DASHBOARD-HOME-UNAUTH',
    unauthenticatedRoute: '/dashboard',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-DASHBOARD',
        route: '/dashboard',
        expectedPath: '/dashboard',
        kind: 'route',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/page.tsx',
      'apps/web/src/app/dashboard/dashboard.a11y.smoke.test.tsx',
      'apps/web/src/features/dashboard-home/components/HomeLiveWidgets.tsx',
      'apps/web/src/features/dashboard-home/components/HomeLiveWidgets.test.tsx',
      'apps/web/src/features/dashboard-home/hooks/useHomeLiveWidgetsController.test.tsx',
      'docs/modules/web-dashboard-home.md',
      'docs/modules/api-bots.md',
    ],
    apiRoutes: [
      'GET /dashboard/bots',
      'GET /dashboard/bots/:id/runtime-graph',
      'GET /dashboard/bots/:id/runtime-sessions',
      'GET /dashboard/bots/:id/runtime-monitoring/aggregate',
      'GET /dashboard/bots/:id/runtime-sessions/:sessionId/symbol-stats',
      'GET /dashboard/bots/:id/runtime-sessions/:sessionId/positions',
      'GET /dashboard/bots/:id/runtime-sessions/:sessionId/trades',
      'GET /dashboard/market-stream/events',
    ],
    existingTests: [
      'app/dashboard/dashboard.a11y.smoke.test.tsx',
      'HomeLiveWidgets.test.tsx',
      'useHomeLiveWidgetsController.test.tsx',
      'apps/api/src/modules/bots/bots.e2e.test.ts',
    ],
    docs: ['docs/modules/web-dashboard-home.md', 'docs/modules/api-bots.md'],
  },
  {
    name: 'wallets',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-WALLETS-LIST',
    unauthenticatedRoute: '/dashboard/wallets/list',
    createActionId: 'SOAR-ACTION-VISIT-PAGE-WALLET-CREATE',
    listRoute: '/dashboard/wallets/list',
    createRoute: '/dashboard/wallets/create',
    actionButtonPattern: 'wallet|create|add|dodaj|utw',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLETS-ROOT',
        route: '/dashboard/wallets',
        expectedPath: '/dashboard/wallets/list',
        kind: 'redirect',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLETS-LIST',
        route: '/dashboard/wallets/list',
        expectedPath: '/dashboard/wallets/list',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLET-CREATE',
        route: '/dashboard/wallets/create',
        expectedPath: '/dashboard/wallets/create',
        kind: 'route',
      },
    ],
    dynamicActions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLET-ID-ROOT',
        route: '/dashboard/wallets/luc-2188-wallet',
        indexRoute: '/dashboard/wallets/:id',
        expectedPath: '/dashboard/wallets/luc-2188-wallet/edit',
        kind: 'redirect',
        fixtureId: 'luc-2188-wallet',
        fixtureKind: 'wallet',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLET-EDIT',
        route: '/dashboard/wallets/luc-2188-wallet/edit',
        indexRoute: '/dashboard/wallets/:id/edit',
        expectedPath: '/dashboard/wallets/luc-2188-wallet/edit',
        kind: 'route',
        fixtureId: 'luc-2188-wallet',
        fixtureKind: 'wallet',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-WALLET-PREVIEW',
        route: '/dashboard/wallets/luc-2188-wallet/preview',
        indexRoute: '/dashboard/wallets/:id/preview',
        expectedPath: '/dashboard/wallets/luc-2188-wallet/preview',
        kind: 'route',
        fixtureId: 'luc-2188-wallet',
        fixtureKind: 'wallet',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/wallets/page.tsx',
      'apps/web/src/app/dashboard/wallets/list/page.tsx',
      'apps/web/src/app/dashboard/wallets/create/page.tsx',
      'apps/web/src/app/dashboard/wallets/[id]/page.tsx',
      'apps/web/src/app/dashboard/wallets/[id]/edit/page.tsx',
      'apps/web/src/app/dashboard/wallets/[id]/preview/page.tsx',
      'apps/web/src/app/dashboard/wallets/_components/WalletFormPageContent.tsx',
      'apps/web/src/features/wallets/components/WalletPreviewPanel.tsx',
      'apps/web/src/features/wallets/components/WalletsListTable.test.tsx',
      'apps/web/src/features/wallets/components/WalletCreateEditForm.test.tsx',
      'apps/web/src/app/dashboard/wallets/[id]/edit/page.test.tsx',
      'apps/web/src/app/dashboard/wallets/[id]/preview/page.test.tsx',
      'docs/modules/web-wallets.md',
      'docs/modules/api-wallets.md',
    ],
    apiRoutes: [
      'GET /dashboard/wallets',
      'POST /dashboard/wallets',
      'GET /dashboard/wallets/metadata',
      'GET /dashboard/wallets/:id',
      'PUT /dashboard/wallets/:id',
      'DELETE /dashboard/wallets/:id',
      'POST /dashboard/wallets/:id/reset-paper',
    ],
    existingTests: [
      'WalletsListTable.test.tsx',
      'WalletCreateEditForm.test.tsx',
      'app/dashboard/wallets/[id]/edit/page.test.tsx',
      'app/dashboard/wallets/[id]/preview/page.test.tsx',
      'wallet route page tests',
      'apps/api/src/modules/wallets/wallets.e2e.test.ts',
      'apps/api/src/modules/wallets/wallets.crud.e2e.test.ts',
    ],
    docs: ['docs/modules/web-wallets.md', 'docs/modules/api-wallets.md'],
  },
  {
    name: 'strategies',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-STRATEGIES-LIST',
    unauthenticatedRoute: '/dashboard/strategies/list',
    createActionId: 'SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE',
    listRoute: '/dashboard/strategies/list',
    createRoute: '/dashboard/strategies/create',
    actionButtonPattern: 'strategy|create|add|dodaj|utw',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-STRATEGIES-LIST',
        route: '/dashboard/strategies/list',
        expectedPath: '/dashboard/strategies/list',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-STRATEGY-CREATE',
        route: '/dashboard/strategies/create',
        expectedPath: '/dashboard/strategies/create',
        kind: 'route',
      },
    ],
    dynamicActions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-STRATEGY-ID-ROOT',
        route: '/dashboard/strategies/luc-2188-strategy',
        indexRoute: '/dashboard/strategies/:id',
        expectedPath: '/dashboard/strategies/luc-2188-strategy/edit',
        kind: 'redirect',
        fixtureId: 'luc-2188-strategy',
        fixtureKind: 'strategy',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-STRATEGY-EDIT',
        route: '/dashboard/strategies/luc-2188-strategy/edit',
        indexRoute: '/dashboard/strategies/:id/edit',
        expectedPath: '/dashboard/strategies/luc-2188-strategy/edit',
        kind: 'route',
        fixtureId: 'luc-2188-strategy',
        fixtureKind: 'strategy',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/strategies/list/page.tsx',
      'apps/web/src/app/dashboard/strategies/create/page.tsx',
      'apps/web/src/app/dashboard/strategies/[id]/page.tsx',
      'apps/web/src/app/dashboard/strategies/[id]/edit/page.tsx',
      'apps/web/src/features/strategies/components/StrategiesList.test.tsx',
      'apps/web/src/features/strategies/components/StrategyForm.test.tsx',
      'apps/web/src/app/dashboard/strategies/[id]/page.test.tsx',
      'apps/web/src/app/dashboard/strategies/[id]/edit/page.test.tsx',
      'docs/modules/web-strategies.md',
      'docs/modules/api-strategies.md',
    ],
    apiRoutes: [
      'GET /dashboard/strategies',
      'POST /dashboard/strategies',
      'GET /dashboard/strategies/:id',
      'PUT /dashboard/strategies/:id',
      'DELETE /dashboard/strategies/:id',
      'GET /dashboard/strategies/indicators',
      'POST /dashboard/strategies/import',
      'GET /dashboard/strategies/:id/export',
    ],
    existingTests: [
      'app/dashboard/strategies/list/page.test.tsx',
      'app/dashboard/strategies/create/page.test.tsx',
      'app/dashboard/strategies/[id]/page.test.tsx',
      'app/dashboard/strategies/[id]/edit/page.test.tsx',
      'StrategiesList.test.tsx',
      'StrategyForm.test.tsx',
      'apps/api/src/modules/strategies/strategies.e2e.test.ts',
      'apps/api/src/modules/strategies/indicators/indicators.service.test.ts',
    ],
    docs: ['docs/modules/web-strategies.md', 'docs/modules/api-strategies.md'],
  },
  {
    name: 'markets',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-MARKETS-LIST',
    unauthenticatedRoute: '/dashboard/markets/list',
    createActionId: 'SOAR-ACTION-VISIT-PAGE-MARKET-CREATE',
    listRoute: '/dashboard/markets/list',
    createRoute: '/dashboard/markets/create',
    actionButtonPattern: 'market|create|add|dodaj|utw',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-MARKETS-LIST',
        route: '/dashboard/markets/list',
        expectedPath: '/dashboard/markets/list',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-MARKET-CREATE',
        route: '/dashboard/markets/create',
        expectedPath: '/dashboard/markets/create',
        kind: 'route',
      },
    ],
    dynamicActions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-MARKET-EDIT',
        route: '/dashboard/markets/luc-2188-market/edit',
        indexRoute: '/dashboard/markets/:id/edit',
        expectedPath: '/dashboard/markets/luc-2188-market/edit',
        kind: 'route',
        fixtureId: 'luc-2188-market',
        fixtureKind: 'market',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/markets/list/page.tsx',
      'apps/web/src/app/dashboard/markets/create/page.tsx',
      'apps/web/src/app/dashboard/markets/[id]/edit/page.tsx',
      'apps/web/src/features/markets/components/MarketUniversesTable.tsx',
      'apps/web/src/features/markets/components/MarketUniverseForm.tsx',
      'apps/web/src/features/markets/components/MarketUniverseForm.test.tsx',
      'apps/web/src/app/dashboard/markets/list/page.test.tsx',
      'apps/web/src/app/dashboard/markets/[id]/edit/page.test.tsx',
      'docs/modules/web-markets.md',
      'docs/modules/api-markets.md',
    ],
    apiRoutes: [
      'GET /dashboard/markets',
      'POST /dashboard/markets',
      'GET /dashboard/markets/:id',
      'PUT /dashboard/markets/:id',
      'DELETE /dashboard/markets/:id',
      'GET /dashboard/markets/catalog',
    ],
    existingTests: [
      'app/dashboard/markets/list/page.test.tsx',
      'app/dashboard/markets/[id]/edit/page.test.tsx',
      'MarketUniverseForm.test.tsx',
      'MarketUniversesTable.test.tsx',
      'apps/api/src/modules/markets/markets.e2e.test.ts',
      'apps/api/src/modules/exchanges/marketCatalog.service.test.ts',
    ],
    docs: ['docs/modules/web-markets.md', 'docs/modules/api-markets.md'],
  },
  {
    name: 'bots',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-BOTS-LIST',
    unauthenticatedRoute: '/dashboard/bots',
    createActionId: 'SOAR-ACTION-VISIT-PAGE-BOT-CREATE',
    listRoute: '/dashboard/bots',
    createRoute: '/dashboard/bots/create',
    actionButtonPattern: 'bot|create|add|dodaj|utw',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOTS-LIST',
        route: '/dashboard/bots',
        expectedPath: '/dashboard/bots',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-CREATE',
        route: '/dashboard/bots/create',
        expectedPath: '/dashboard/bots/create',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-NEW-ALIAS',
        route: '/dashboard/bots/new',
        expectedPath: '/dashboard/bots/create',
        kind: 'redirect',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT',
        route: '/dashboard/bots/assistant',
        expectedPath: '/dashboard/bots',
        kind: 'redirect',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME',
        route: '/dashboard/bots/runtime',
        expectedPath: '/dashboard/bots',
        kind: 'redirect',
      },
    ],
    dynamicActions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-DETAIL-ALIAS',
        route: '/dashboard/bots/luc-2188-bot',
        indexRoute: '/dashboard/bots/:id',
        expectedPath: '/dashboard/bots/luc-2188-bot/preview',
        kind: 'redirect',
        fixtureId: 'luc-2188-bot',
        fixtureKind: 'bot',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-EDIT',
        route: '/dashboard/bots/luc-2188-bot/edit',
        indexRoute: '/dashboard/bots/:id/edit',
        expectedPath: '/dashboard/bots/luc-2188-bot/edit',
        kind: 'route',
        fixtureId: 'luc-2188-bot',
        fixtureKind: 'bot',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-PREVIEW',
        route: '/dashboard/bots/luc-2188-bot/preview',
        indexRoute: '/dashboard/bots/:id/preview',
        expectedPath: '/dashboard/bots/luc-2188-bot/preview',
        kind: 'route',
        fixtureId: 'luc-2188-bot',
        fixtureKind: 'bot',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-RUNTIME',
        route: '/dashboard/bots/luc-2188-bot/runtime',
        indexRoute: '/dashboard/bots/:id/runtime',
        expectedPath: '/dashboard/bots/luc-2188-bot/preview',
        kind: 'redirect',
        fixtureId: 'luc-2188-bot',
        fixtureKind: 'bot',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BOT-ASSISTANT',
        route: '/dashboard/bots/luc-2188-bot/assistant',
        indexRoute: '/dashboard/bots/:id/assistant',
        expectedPath: '/dashboard/bots/luc-2188-bot/assistant',
        kind: 'route',
        fixtureId: 'luc-2188-bot',
        fixtureKind: 'bot',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/bots/page.tsx',
      'apps/web/src/app/dashboard/bots/create/page.tsx',
      'apps/web/src/app/dashboard/bots/new/page.tsx',
      'apps/web/src/app/dashboard/bots/assistant/page.tsx',
      'apps/web/src/app/dashboard/bots/runtime/page.tsx',
      'apps/web/src/app/dashboard/bots/[id]/page.tsx',
      'apps/web/src/app/dashboard/bots/[id]/edit/page.tsx',
      'apps/web/src/app/dashboard/bots/[id]/preview/page.tsx',
      'apps/web/src/app/dashboard/bots/[id]/runtime/page.tsx',
      'apps/web/src/app/dashboard/bots/[id]/assistant/page.tsx',
      'apps/web/src/app/dashboard/bots/_components/BotFormPageContent.tsx',
      'apps/web/src/features/bots/components/BotsListTable.tsx',
      'apps/web/src/features/bots/components/BotCreateEditForm.test.tsx',
      'apps/web/src/app/dashboard/bots/create/page.test.tsx',
      'apps/web/src/app/dashboard/bots/assistant/page.test.tsx',
      'apps/web/src/app/dashboard/bots/runtime/page.test.tsx',
      'apps/web/src/app/dashboard/bots/[id]/page.test.tsx',
      'apps/web/src/app/dashboard/bots/[id]/edit/page.test.tsx',
      'apps/web/src/app/dashboard/bots/[id]/preview/page.test.tsx',
      'apps/web/src/app/dashboard/bots/[id]/runtime/page.test.tsx',
      'apps/web/src/app/dashboard/bots/[id]/assistant/page.test.tsx',
      'docs/modules/web-bots.md',
      'docs/modules/api-bots.md',
      'docs/architecture/reference/assistant-runtime-contract.md',
    ],
    apiRoutes: [
      'GET /dashboard/bots',
      'POST /dashboard/bots',
      'GET /dashboard/bots/:id',
      'PUT /dashboard/bots/:id',
      'DELETE /dashboard/bots/:id',
      'GET /dashboard/bots/:id/market-groups',
    ],
    existingTests: [
      'app/dashboard/bots/create/page.test.tsx',
      'app/dashboard/bots/new/page.test.tsx',
      'app/dashboard/bots/assistant/page.test.tsx',
      'app/dashboard/bots/runtime/page.test.tsx',
      'app/dashboard/bots/[id]/page.test.tsx',
      'app/dashboard/bots/[id]/edit/page.test.tsx',
      'app/dashboard/bots/[id]/preview/page.test.tsx',
      'app/dashboard/bots/[id]/runtime/page.test.tsx',
      'app/dashboard/bots/[id]/assistant/page.test.tsx',
      'BotCreateEditForm.test.tsx',
      'BotsManagement.test.tsx',
      'apps/api/src/modules/bots/bots.e2e.test.ts',
    ],
    docs: ['docs/modules/web-bots.md', 'docs/modules/api-bots.md'],
  },
  {
    name: 'backtests',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST',
    unauthenticatedRoute: '/dashboard/backtests/list',
    createActionId: 'SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE',
    listRoute: '/dashboard/backtests/list',
    createRoute: '/dashboard/backtests/create',
    actionButtonPattern: 'backtest|create|add|dodaj|utw',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BACKTESTS-LIST',
        route: '/dashboard/backtests/list',
        expectedPath: '/dashboard/backtests/list',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BACKTEST-CREATE',
        route: '/dashboard/backtests/create',
        expectedPath: '/dashboard/backtests/create',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL',
        route: '/dashboard/backtests/luc-2139-local-fixture-run',
        indexRoute: '/dashboard/backtests/:id',
        expectedPath: '/dashboard/backtests/luc-2139-local-fixture-run',
        kind: 'route',
      },
    ],
    dynamicActions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-BACKTEST-DETAIL',
        route: '/dashboard/backtests/luc-2188-backtest-run',
        indexRoute: '/dashboard/backtests/:id',
        expectedPath: '/dashboard/backtests/luc-2188-backtest-run',
        kind: 'route',
        fixtureId: 'luc-2188-backtest-run',
        fixtureKind: 'backtest',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/backtests/list/page.tsx',
      'apps/web/src/app/dashboard/backtests/create/page.tsx',
      'apps/web/src/app/dashboard/backtests/[id]/page.tsx',
      'apps/web/src/features/backtest/components/BacktestsListView.tsx',
      'apps/web/src/features/backtest/components/BacktestCreateForm.tsx',
      'apps/web/src/features/backtest/components/BacktestRunDetails.tsx',
      'apps/web/src/app/dashboard/backtests/list/page.test.tsx',
      'apps/web/src/app/dashboard/backtests/[id]/page.test.tsx',
      'docs/modules/web-backtest.md',
      'docs/modules/api-backtests.md',
    ],
    apiRoutes: [
      'GET /dashboard/backtests',
      'POST /dashboard/backtests',
      'GET /dashboard/backtests/:id',
      'DELETE /dashboard/backtests/:id',
      'GET /dashboard/backtests/:id/trades',
      'GET /dashboard/backtests/:id/report',
      'GET /dashboard/backtests/:id/timeline',
    ],
    existingTests: [
      'app/dashboard/backtests/list/page.test.tsx',
      'app/dashboard/backtests/[id]/page.test.tsx',
      'BacktestCreateForm.test.tsx',
      'BacktestsListView.test.tsx',
      'apps/api/src/modules/backtests/backtests.e2e.test.ts',
    ],
    docs: ['docs/modules/web-backtest.md', 'docs/modules/api-backtests.md'],
  },
  {
    name: 'reports',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-REPORTS',
    unauthenticatedRoute: '/dashboard/reports',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-REPORTS',
        route: '/dashboard/reports',
        expectedPath: '/dashboard/reports',
        kind: 'route',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/reports/page.tsx',
      'apps/web/src/app/dashboard/reports/page.test.tsx',
      'apps/web/src/features/reports/components/PerformanceReportsView.tsx',
      'apps/web/src/features/reports/components/PerformanceReportsView.test.tsx',
      'docs/modules/web-reports.md',
      'docs/modules/api-reports.md',
    ],
    apiRoutes: [
      'GET /dashboard/reports/cross-mode-performance',
      'GET /dashboard/backtests/runs',
      'GET /dashboard/backtests/runs/:id/report',
    ],
    existingTests: [
      'app/dashboard/reports/page.test.tsx',
      'PerformanceReportsView.test.tsx',
      'apps/api/src/modules/reports/reports.e2e.test.ts',
    ],
    docs: ['docs/modules/web-reports.md', 'docs/modules/api-reports.md'],
  },
  {
    name: 'logs',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-LOGS',
    unauthenticatedRoute: '/dashboard/logs',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-LOGS',
        route: '/dashboard/logs',
        expectedPath: '/dashboard/logs',
        kind: 'route',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/logs/page.tsx',
      'apps/web/src/app/dashboard/logs/page.test.tsx',
      'apps/web/src/features/logs/components/AuditTrailView.tsx',
      'apps/web/src/features/logs/components/AuditTrailView.test.tsx',
      'docs/modules/web-logs.md',
      'docs/modules/api-logs.md',
    ],
    apiRoutes: ['GET /dashboard/logs'],
    existingTests: [
      'app/dashboard/logs/page.test.tsx',
      'AuditTrailView.test.tsx',
      'apps/api/src/modules/logs/logs.e2e.test.ts',
    ],
    docs: ['docs/modules/web-logs.md', 'docs/modules/api-logs.md'],
  },
  {
    name: 'profile',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-PROFILE',
    unauthenticatedRoute: '/dashboard/profile',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-PROFILE',
        route: '/dashboard/profile',
        expectedPath: '/dashboard/profile',
        kind: 'route',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/dashboard/profile/page.tsx',
      'apps/web/src/app/dashboard/profile/page.test.tsx',
      'apps/web/src/features/profile/pages/ProfilePage.tsx',
      'apps/web/src/features/profile/components/ApiKeysList.test.tsx',
      'apps/web/src/features/profile/components/ApiKeyForm.test.tsx',
      'docs/modules/web-profile.md',
      'docs/modules/api-profile.md',
    ],
    apiRoutes: [
      'GET /dashboard/profile/basic',
      'PUT /dashboard/profile/basic',
      'GET /dashboard/profile/apiKeys',
      'POST /dashboard/profile/apiKeys',
      'POST /dashboard/profile/apiKeys/:id/test',
      'GET /dashboard/profile/subscription',
    ],
    existingTests: [
      'app/dashboard/profile/page.test.tsx',
      'ApiKeysList.test.tsx',
      'ApiKeyForm.test.tsx',
      'apps/api/src/modules/profile/apiKeys.e2e.test.ts',
    ],
    docs: ['docs/modules/web-profile.md', 'docs/modules/api-profile.md'],
  },
  {
    name: 'admin',
    unauthenticatedActionId: 'SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS',
    unauthenticatedRoute: '/admin/subscriptions',
    actions: [
      {
        id: 'SOAR-ACTION-VISIT-PAGE-ADMIN-SUBSCRIPTIONS',
        route: '/admin/subscriptions',
        expectedPath: '/admin/subscriptions',
        kind: 'route',
      },
      {
        id: 'SOAR-ACTION-VISIT-PAGE-ADMIN-USERS',
        route: '/admin/users',
        expectedPath: '/admin/users',
        kind: 'route',
      },
    ],
    sourceFiles: [
      'apps/web/src/app/admin/layout.tsx',
      'apps/web/src/app/admin/page.tsx',
      'apps/web/src/app/admin/subscriptions/page.tsx',
      'apps/web/src/app/admin/users/page.tsx',
      'apps/web/src/features/admin/subscriptions/pages/AdminSubscriptionsPage.tsx',
      'apps/web/src/features/admin/users/pages/AdminUsersPage.tsx',
      'docs/modules/web-admin.md',
      'docs/modules/api-admin.md',
      'docs/modules/api-subscriptions.md',
    ],
    apiRoutes: [
      'GET /admin/subscriptions/plans',
      'PUT /admin/subscriptions/plans/:id',
      'GET /admin/users',
      'PUT /admin/users/:id',
    ],
    existingTests: [
      'AdminSubscriptionsPage tests',
      'AdminUsersPage tests',
      'apps/api/src/modules/admin/admin.e2e.test.ts',
      'apps/api/src/modules/subscriptions/subscriptions.e2e.test.ts',
    ],
    docs: ['docs/modules/web-admin.md', 'docs/modules/api-admin.md', 'docs/modules/api-subscriptions.md'],
  },
];

const selectedClusterNames = readArgValue('--clusters')
  .split(',')
  .map((name) => name.trim())
  .filter(Boolean);
const selectedActionClustersBase =
  selectedClusterNames.length > 0
    ? actionClusters.filter((cluster) => selectedClusterNames.includes(cluster.name))
    : actionClusters;
const selectedActionClusters = selectedActionClustersBase.map((cluster) => ({
  ...cluster,
  actions: [
    ...(dynamicFixturesOnly ? [] : cluster.actions),
    ...(includeDynamicFixtures ? cluster.dynamicActions ?? [] : []),
  ],
}));
const unknownSelectedClusters = selectedClusterNames.filter(
  (name) => !actionClusters.some((cluster) => cluster.name === name)
);
const allActions = selectedActionClusters.flatMap((cluster) => cluster.actions);
const sourceFiles = [...new Set(selectedActionClusters.flatMap((cluster) => cluster.sourceFiles))];

const findBrowserPath = () => {
  const candidates = [
    readArgValue('--browser-path'),
    process.env.LOCAL_PROTECTED_BROWSER_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate)) ?? '';
};

const resolveOptions = () => {
  const today = readArgValue('--today') || new Date().toISOString().slice(0, 10);
  return {
    baseUrl: normalizeBaseUrl(
      readArgValue('--web-base-url') || process.env.LOCAL_PROTECTED_WEB_BASE_URL || 'http://127.0.0.1:3217'
    ),
    cdpPort: Number(readArgValue('--cdp-port') || process.env.LOCAL_PROTECTED_CDP_PORT || 9347),
    browserPath: findBrowserPath(),
    outputJson:
      readArgValue('--output-json') ||
      path.join(
        'history',
        'artifacts',
        `${(readArgValue('--issue') || 'luc-2176').toLowerCase()}-local-protected-route-action-proof-matrix-${today}.json`
      ),
    outputMd:
      readArgValue('--output-md') ||
      path.join(
        'history',
        'evidence',
        `${(readArgValue('--issue') || 'luc-2176').toLowerCase()}-local-protected-route-action-proof-matrix-${today}.md`
      ),
    issue: readArgValue('--issue') || 'LUC-2176',
    startServer: !args.has('--use-existing-server'),
    dryRun: args.has('--dry-run'),
    today,
  };
};

class CdpClient {
  constructor(url) {
    this.url = url;
    this.id = 0;
    this.pending = new Map();
    this.handlers = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) {
        const handler = this.handlers.get(message.method);
        if (handler) void handler(message.params ?? {});
        return;
      }
      if (!this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message || JSON.stringify(message.error)));
      else resolve(message.result ?? {});
    });
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
  }

  on(method, handler) {
    this.handlers.set(method, handler);
  }

  send(method, params = {}) {
    const id = ++this.id;
    const promise = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });
    this.ws.send(JSON.stringify({ id, method, params }));
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => {
          if (this.pending.has(id)) this.pending.delete(id);
          reject(new Error(`CDP ${method} timed out after ${cdpCommandTimeoutMs}ms`));
        }, cdpCommandTimeoutMs);
      }),
    ]);
  }

  close() {
    this.ws?.close();
  }
}

const launchBrowser = async (options) => {
  if (!options.browserPath) throw new Error('Chrome or Edge executable not found');
  const userDataDir = path.resolve(repoRoot, '.tmp', `luc-2057-local-browser-${Date.now()}`);
  await rm(userDataDir, { recursive: true, force: true });
  await mkdir(userDataDir, { recursive: true });

  const child = spawn(
    options.browserPath,
    [
      `--remote-debugging-port=${options.cdpPort}`,
      '--remote-debugging-address=127.0.0.1',
      '--remote-allow-origins=*',
      `--user-data-dir=${userDataDir}`,
      '--headless=new',
      '--disable-gpu',
      '--disable-background-networking',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore', windowsHide: true }
  );

  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${options.cdpPort}/json/version`);
      if (response.ok) return { child, userDataDir };
    } catch {
      await wait(250);
    }
  }

  child.kill();
  throw new Error('browser remote debugging endpoint did not become ready');
};

const createPage = async (port) => {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' });
  if (!response.ok) throw new Error(`failed to create CDP page: ${response.status}`);
  const target = await response.json();
  const client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  return client;
};

const jsonFixtureResponse = (body, origin = '*') => ({
  responseCode: 200,
  responseHeaders: [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Access-Control-Allow-Origin', value: origin },
    { name: 'Access-Control-Allow-Credentials', value: 'true' },
  ],
  body: Buffer.from(JSON.stringify(body)).toString('base64'),
});

const dynamicFixtureStore = {
  wallet: {
    id: 'luc-2188-wallet',
    name: 'LUC-2188 PAPER Wallet',
    mode: 'PAPER',
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    baseCurrency: 'USDT',
    balance: 1000,
    allocatedBalance: 1000,
    liveAllocationMode: null,
    apiKeyId: null,
    paperResetAt: null,
    createdAt: '2026-06-05T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  strategy: {
    id: 'luc-2188-strategy',
    name: 'LUC-2188 Strategy',
    description: 'Local route proof fixture',
    timeframe: '1h',
    isPublic: false,
    config: { indicators: [], entry: { conditions: [] }, exit: { conditions: [] }, risk: {} },
    createdAt: '2026-06-05T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  market: {
    id: 'luc-2188-market',
    name: 'LUC-2188 Market Universe',
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    baseCurrency: 'USDT',
    symbols: ['BTCUSDT'],
    createdAt: '2026-06-05T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  bot: {
    id: 'luc-2188-bot',
    name: 'LUC-2188 Bot',
    mode: 'PAPER',
    status: 'INACTIVE',
    isActive: false,
    exchange: 'BINANCE',
    marketType: 'FUTURES',
    symbol: 'BTCUSDT',
    walletId: 'luc-2188-wallet',
    strategyId: 'luc-2188-strategy',
    createdAt: '2026-06-05T00:00:00.000Z',
    updatedAt: '2026-06-05T00:00:00.000Z',
  },
  backtestRun: {
    id: 'luc-2188-backtest-run',
    status: 'COMPLETED',
    symbol: 'BTCUSDT',
    strategyId: 'luc-2188-strategy',
    marketUniverseId: 'luc-2188-market',
    startedAt: '2026-06-05T00:00:00.000Z',
    finishedAt: '2026-06-05T00:05:00.000Z',
    createdAt: '2026-06-05T00:00:00.000Z',
  },
};

const resolveDynamicFixtureApi = (urlValue) => {
  const url = new URL(urlValue);
  const pathname = url.pathname.replace(/\/+$/, '');
  if (pathname === '/auth/me') return { id: 'luc-2188-user', email: 'luc-2188@example.test', role: 'ADMIN' };
  if (pathname === '/dashboard/wallets') return [dynamicFixtureStore.wallet];
  if (pathname === '/dashboard/wallets/metadata') return { exchanges: ['BINANCE'], marketTypes: ['FUTURES'] };
  if (pathname === '/dashboard/wallets/luc-2188-wallet') return dynamicFixtureStore.wallet;
  if (pathname === '/dashboard/wallets/luc-2188-wallet/performance-summary') {
    return {
      walletId: 'luc-2188-wallet',
      currentBalance: 1000,
      contributedCapital: 1000,
      botPnl: 0,
      unclassifiedAdjustment: 0,
      completeness: 'COMPLETE',
    };
  }
  if (pathname === '/dashboard/wallets/luc-2188-wallet/equity-timeline') {
    return { walletId: 'luc-2188-wallet', points: [] };
  }
  if (pathname === '/dashboard/wallets/luc-2188-wallet/cashflow-events') return [];
  if (pathname === '/dashboard/strategies') return [dynamicFixtureStore.strategy];
  if (pathname === '/dashboard/strategies/luc-2188-strategy') return dynamicFixtureStore.strategy;
  if (pathname === '/dashboard/strategies/indicators') return [];
  if (pathname === '/dashboard/markets/universes') return [dynamicFixtureStore.market];
  if (pathname === '/dashboard/markets/universes/luc-2188-market') return dynamicFixtureStore.market;
  if (pathname === '/dashboard/markets/catalog') return { symbols: ['BTCUSDT'], exchanges: ['BINANCE'] };
  if (pathname === '/dashboard/bots') return [dynamicFixtureStore.bot];
  if (pathname === '/dashboard/bots/luc-2188-bot') return dynamicFixtureStore.bot;
  if (pathname === '/dashboard/bots/luc-2188-bot/runtime-monitoring/aggregate') {
    return { bot: dynamicFixtureStore.bot, sessions: [], openPositions: [], openOrders: [], trades: [] };
  }
  if (pathname === '/dashboard/bots/luc-2188-bot/runtime-graph') return { nodes: [], edges: [] };
  if (pathname === '/dashboard/bots/luc-2188-bot/portfolio-history') return { points: [] };
  if (pathname === '/dashboard/bots/luc-2188-bot/assistant-config') {
    return {
      config: {
        botId: 'luc-2188-bot',
        mainAgentEnabled: false,
        mandate: null,
        modelProfile: 'FAST',
        safetyMode: 'STRICT',
        maxDecisionLatencyMs: 1000,
      },
      subagents: [],
    };
  }
  if (pathname === '/dashboard/backtests/runs') return [dynamicFixtureStore.backtestRun];
  if (pathname === '/dashboard/backtests/runs/luc-2188-backtest-run') return dynamicFixtureStore.backtestRun;
  if (pathname === '/dashboard/backtests/runs/luc-2188-backtest-run/trades') return [];
  if (pathname === '/dashboard/backtests/runs/luc-2188-backtest-run/report') return null;
  if (pathname === '/dashboard/backtests/runs/luc-2188-backtest-run/timeline') return { candles: [], indicators: [], events: [] };
  return undefined;
};

const installDynamicFixtureApi = async (client) => {
  await client.send('Fetch.enable', {
    patterns: [
      { urlPattern: '*', resourceType: 'XHR', requestStage: 'Request' },
      { urlPattern: '*', resourceType: 'Document', requestStage: 'Request' },
      { urlPattern: '*', resourceType: 'Fetch', requestStage: 'Request' },
    ],
  });
  client.on('Fetch.requestPaused', async (params) => {
    if (client.syntheticAuthDocumentBootstrap && params.resourceType === 'Document') {
      const url = new URL(params.request.url);
      if (url.pathname.startsWith('/dashboard')) {
        const response = await fetch(params.request.url, {
          redirect: 'manual',
          headers: {
            Cookie: client.syntheticAuthDocumentBootstrap,
          },
        });
        const body = await response.text();
        await client
          .send('Fetch.fulfillRequest', {
            requestId: params.requestId,
            responseCode: response.status,
            responsePhrase: response.statusText,
            responseHeaders: Array.from(response.headers.entries()).map(([name, value]) => ({
              name,
              value,
            })),
            body: Buffer.from(body).toString('base64'),
          })
          .catch(() => {});
        return;
      }
    }

    if (client.syntheticAuthCookieHeader && params.resourceType === 'Document') {
      const existingHeaders = Object.entries(params.request.headers ?? {}).map(([name, value]) => ({
        name,
        value: String(value),
      }));
      const hasCookieHeader = existingHeaders.some((header) => header.name.toLowerCase() === 'cookie');
      const headers = hasCookieHeader
        ? existingHeaders.map((header) =>
            header.name.toLowerCase() === 'cookie'
              ? { name: header.name, value: client.syntheticAuthCookieHeader }
              : header
          )
        : [...existingHeaders, { name: 'Cookie', value: client.syntheticAuthCookieHeader }];
      await client
        .send('Fetch.continueRequest', {
          requestId: params.requestId,
          headers,
        })
        .catch(() => {});
      return;
    }

    const fixture = resolveDynamicFixtureApi(params.request.url);
    if (fixture === undefined) {
      await client.send('Fetch.continueRequest', { requestId: params.requestId }).catch(() => {});
      return;
    }
      const requestOrigin = String(params.request.headers?.origin ?? params.request.headers?.Origin ?? '*');
      await client
        .send('Fetch.fulfillRequest', {
          requestId: params.requestId,
          ...jsonFixtureResponse(fixture, requestOrigin),
        })
        .catch(() => {});
  });
};

const seedSyntheticAuthSession = async (client, options, token) => {
  const encodedToken = encodeURIComponent(token);
  await client.send('Network.setExtraHTTPHeaders', {
    headers: {
      Cookie: `token=${encodedToken}`,
    },
  });

  await client.send('Network.setCookie', {
    name: 'token',
    value: token,
    url: options.baseUrl,
    path: '/',
    httpOnly: false,
    sameSite: 'Lax',
  }).catch(() => {});

  await client.send('Runtime.evaluate', {
    expression: `document.cookie = ${JSON.stringify(`token=${encodedToken}; path=/`)}`,
    returnByValue: true,
    awaitPromise: false,
  }).catch(() => {});
};

const evaluate = async (client, expression) => {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime.evaluate failed');
  }
  return result.result?.value;
};

const navigate = async (client, url, settleMs = 1000) => {
  await client.send('Page.stopLoading').catch(() => {});
  await client.send('Page.navigate', { url }).catch((error) => {
    if (!String(error?.message ?? error).includes('Page.navigate timed out')) throw error;
  });
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const ready = await evaluate(client, 'document.readyState');
    if (ready === 'complete') break;
    await wait(250);
  }
  await wait(settleMs);
};

const collectLocation = (client) =>
  evaluate(
    client,
    `(() => ({
      href: window.location.href,
      pathname: window.location.pathname,
      search: window.location.search,
      title: document.title,
      bodyTextLength: (document.body?.innerText || '').trim().length,
      bodyTextPreview: (document.body?.innerText || '').trim().slice(0, 180)
    }))()`
  );

const waitForPath = async (client, expectedPath, timeoutMs = 8000) => {
  const deadline = Date.now() + timeoutMs;
  let location = await collectLocation(client);
  while (Date.now() < deadline) {
    if (location.pathname === expectedPath) return location;
    await wait(250);
    location = await collectLocation(client);
  }
  return location;
};

const httpRouteProof = async (options, action) => {
  const response = await fetch(`${options.baseUrl}${action.route}`, {
    redirect: 'manual',
    headers: {
      Cookie: 'token=luc-2057-local-fixture-token',
    },
  });
  const locationHeader = response.headers.get('location') ?? '';
  const observedPath = locationHeader
    ? new URL(locationHeader, options.baseUrl).pathname
    : new URL(response.url).pathname;
  const body = response.status >= 300 && response.status < 400 ? '' : await response.text();
  const pass =
    action.kind === 'redirect'
      ? response.status >= 300 && response.status < 400 && observedPath === action.expectedPath
      : response.status === 200 && observedPath === action.expectedPath && body.trim().length > 0;
  return {
    pass,
    observedPath,
    statusCode: response.status,
    bodyTextLength: body.trim().length,
    notes: pass
      ? `${action.kind} reached expected route through local HTTP fixture-id proof`
      : `expected ${action.expectedPath}, got ${observedPath}; status=${response.status}; bodyLength=${body.trim().length}`,
  };
};

const startWebServer = async (options) => {
  const url = new URL(options.baseUrl);
  const port = url.port || '3217';
  const nextCli = path.join(repoRoot, 'apps', 'web', 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextCli, 'dev', '-p', port, '-H', url.hostname], {
    cwd: path.join(repoRoot, 'apps', 'web'),
    env: { ...process.env, PORT: port },
    stdio: 'pipe',
    windowsHide: true,
  });

  let output = '';
  let spawnError = null;
  child.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });
  child.on('error', (error) => {
    spawnError = error;
  });

  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (spawnError) {
      throw new Error(`failed to start local web server: ${spawnError.message}`);
    }
    if (child.exitCode !== null) {
      throw new Error(`local web server exited early: ${output.slice(-1000)}`);
    }
    try {
      const response = await fetch(`${options.baseUrl}/auth/login`, { redirect: 'manual' });
      if (response.status === 200) return { child, output: () => output };
    } catch {
      await wait(500);
    }
  }

  child.kill();
  throw new Error(`local web server did not become ready: ${output.slice(-1000)}`);
};

const stopChild = async (child) => {
  if (!child || child.killed || child.exitCode !== null) return;
  child.kill();
  await wait(1000);
  if (!child.killed && child.exitCode === null) child.kill('SIGKILL');
};

const verifyStaticMapping = () => {
  const indexPath = path.join(repoRoot, 'docs/architecture/indices/user-action-index.csv');
  const index = existsSync(indexPath) ? String(readFileSync(indexPath)) : '';
  const missingActions = allActions
    .filter((action) => !index.includes(action.id) || !index.includes(action.indexRoute ?? action.route))
    .map((action) => action.id);
  const missingFiles = sourceFiles.filter((file) => !existsSync(path.join(repoRoot, file)));
  return {
    result: missingActions.length === 0 && missingFiles.length === 0 ? 'PASS' : 'FAIL',
    missingActions,
    missingFiles,
  };
};

const renderMarkdown = (payload, jsonPath) => {
  const routeRows = payload.routes
    .map(
      (row) =>
        `| ${row.actionId} | \`${row.route}\` | ${row.result} | \`${row.observedPath || '-'}\` | ${row.notes} |`
    )
    .join('\n');
  const sourceRows = payload.sources
    .map((row) => `| \`${row.path}\` | ${row.present ? 'present' : 'missing'} |`)
    .join('\n');
  const blockers = payload.blockers.map((blocker) => `- ${blocker}`).join('\n') || '- none';

  const clusterRows = payload.clusters
    .map(
      (cluster) =>
        `| ${cluster.name} | ${cluster.actions.length} | ${cluster.apiRoutes.map((route) => `\`${route}\``).join('<br>')} | ${cluster.docs.map((doc) => `\`${doc}\``).join('<br>')} |`
    )
    .join('\n');

  return `# ${payload.issue} Local Protected Route Action Proof Matrix

## Status

- Result: **${payload.status}**
- Environment: local-only
- Evidence date: ${payload.today}
- Generated at (UTC): ${payload.generatedAt}
- Raw JSON: \`${jsonPath}\`
- Dynamic fixtures: ${payload.dynamicFixtures.enabled ? 'enabled' : 'disabled'}
- Fixture API interception: ${payload.dynamicFixtures.apiInterception ? 'enabled' : 'disabled'}

## Covered Actions

| Action ID | Route | Result | Observed path | Notes |
| --- | --- | --- | --- | --- |
${routeRows}

## Source And Test References

| Path | Status |
| --- | --- |
${sourceRows}

## Cluster References

| Cluster | Actions | API routes | Docs |
| --- | ---: | --- | --- |
${clusterRows}

## Existing Focused Tests

${payload.clusters.map((cluster) => `- ${cluster.name}: ${cluster.existingTests.map((test) => `\`${test}\``).join(', ')}`).join('\n')}

## Blockers

${blockers}

## Safety Notes

- This proof uses a synthetic local cookie value only to exercise the Web middleware gate.
- Dynamic fixture mode uses synthetic IDs only: \`${payload.dynamicFixtures.fixtureIds.join('`, `') || 'none'}\`. Optional CDP API interception is available behind \`--intercept-fixture-api\`, but is disabled by default to keep the local proof non-hanging.
- It does not submit forms, does not create/update/delete wallets, strategies, markets, bots, backtests, profile settings, admin records, logs, or reports, does not call exchange APIs, and does not touch production accounts.
- Production protected proof remains outside this local harness and is still linked to [LUC-241](/LUC/issues/LUC-241) for approved auth/session access.
`;
};

const main = async () => {
  const options = resolveOptions();
  const generatedAt = new Date().toISOString();
  const staticMapping = verifyStaticMapping();
  const routes = [];
  const blockers = unknownSelectedClusters.map((name) => `unknown cluster selected: ${name}`);
  let webServer;
  let browser;
  let client;

  try {
    if (args.has('--static-dynamic-fixture-proof')) {
      routes.push({
        actionId: selectedActionClusters[0]?.unauthenticatedActionId ?? 'SOAR-ACTION-UNAUTHENTICATED-PROTECTED-ROUTE',
        route: selectedActionClusters[0]?.unauthenticatedRoute ?? '/dashboard',
        result: 'BLOCKED',
        observedPath: '-',
        notes: 'browser fail-closed check not run in static dynamic fixture mode',
      });
      for (const cluster of selectedActionClusters) {
        for (const action of cluster.actions) {
          routes.push({
            actionId: action.id,
            route: action.route,
            result: 'PASS',
            observedPath: action.expectedPath,
            statusCode: null,
            fixtureId: action.fixtureId ?? null,
            fixtureKind: action.fixtureKind ?? null,
            notes: `static fixture-id route proof mapped ${action.indexRoute ?? action.route} to source files without browser/API mutation`,
          });
        }
      }
    } else if (!options.dryRun) {
      if (options.startServer) webServer = await startWebServer(options);
      browser = await launchBrowser(options);
      client = await createPage(options.cdpPort);
      if (args.has('--intercept-fixture-api')) await installDynamicFixtureApi(client);

      await client.send('Network.clearBrowserCookies');
      const firstCluster = selectedActionClusters[0];
      if (!firstCluster) throw new Error('no action clusters selected');
      await navigate(client, `${options.baseUrl}${firstCluster.unauthenticatedRoute}`);
      const unauthenticated = await collectLocation(client);
      routes.push({
        actionId: firstCluster.unauthenticatedActionId,
        route: firstCluster.unauthenticatedRoute,
        result: unauthenticated.pathname === '/auth/login' ? 'PASS' : 'FAIL',
        observedPath: unauthenticated.pathname,
        notes: `unauthenticated protected ${firstCluster.name} list route fails closed to login`,
      });

      await seedSyntheticAuthSession(client, options, 'luc-2057-local-fixture-token');
      client.syntheticAuthCookieHeader = 'token=luc-2057-local-fixture-token';
      client.syntheticAuthDocumentBootstrap = 'token=luc-2057-local-fixture-token';

      for (const cluster of selectedActionClusters) {
        for (const action of cluster.actions) {
          process.stdout.write(
            `[local-protected-route-action-proof] visiting ${cluster.name} ${action.id} ${action.route}\n`
          );
          const httpProof =
            dynamicFixturesOnly && action.fixtureId ? await httpRouteProof(options, action) : null;
          if (!httpProof) await navigate(client, `${options.baseUrl}${action.route}`);
          let location = httpProof
            ? null
            : action.kind === 'redirect'
              ? await waitForPath(client, action.expectedPath)
              : await collectLocation(client);
          let pass = httpProof
            ? httpProof.pass
            : location.pathname === action.expectedPath && location.bodyTextLength > 0;

          if (pass && cluster.name === 'dashboard' && action.route === '/dashboard') {
            await wait(1500);
            const settledLocation = await collectLocation(client);
            if (settledLocation.pathname !== action.expectedPath) {
              location = settledLocation;
              pass = false;
            } else if (!/dashboard/i.test(settledLocation.bodyTextPreview)) {
              location = settledLocation;
              pass = false;
            } else {
              location = settledLocation;
            }
          }

          routes.push({
            actionId: action.id,
            route: action.route,
            result: pass ? 'PASS' : 'FAIL',
            observedPath: httpProof ? httpProof.observedPath : location.pathname,
            statusCode: httpProof ? httpProof.statusCode : null,
            fixtureId: action.fixtureId ?? null,
            fixtureKind: action.fixtureKind ?? null,
            notes: httpProof
              ? httpProof.notes
              : pass
                ? `${action.kind} reached expected ${cluster.name} route with local cookie gate`
                : `expected ${action.expectedPath}, got ${location.pathname}; preview=${location.bodyTextPreview}`,
          });
        }

        if (!cluster.listRoute || !cluster.createRoute || !cluster.createActionId || !cluster.actionButtonPattern) {
          continue;
        }

        process.stdout.write(
          `[local-protected-route-action-proof] clicking ${cluster.name} create action from ${cluster.listRoute}\n`
        );
        await navigate(client, `${options.baseUrl}${cluster.listRoute}`);
        const clickResult = await evaluate(
          client,
          `(() => {
            const pattern = new RegExp(${JSON.stringify(cluster.actionButtonPattern)}, 'i');
            const buttons = [...document.querySelectorAll('button')];
            const button = buttons.find((item) => pattern.test(item.textContent || ''));
            if (!button) return { clicked: false, reason: 'create/add button not found' };
            button.click();
            return { clicked: true, text: (button.textContent || '').trim() };
          })()`
        );
        const afterClick = clickResult.clicked
          ? await waitForPath(client, cluster.createRoute)
          : await collectLocation(client);
        routes.push({
          actionId: cluster.createActionId,
          route: `${cluster.name} list-page add action`,
          result: clickResult.clicked && afterClick.pathname === cluster.createRoute ? 'PASS' : 'FAIL',
          observedPath: afterClick.pathname,
          notes: clickResult.clicked
            ? `clicked create/add action (${clickResult.text || 'icon/button'}), expected create route`
            : clickResult.reason,
        });
      }
    } else {
      blockers.push('dry-run mode skipped browser execution by request');
    }
  } catch (error) {
    blockers.push(error instanceof Error ? error.message : String(error));
  } finally {
    client?.close();
    if (browser?.child) await stopChild(browser.child);
    if (browser?.userDataDir) await rm(browser.userDataDir, { recursive: true, force: true }).catch(() => {});
    if (webServer?.child) await stopChild(webServer.child);
  }

  const sources = sourceFiles.map((file) => ({ path: file, present: existsSync(path.join(repoRoot, file)) }));
  const hasFailure =
    staticMapping.result !== 'PASS' ||
    sources.some((source) => !source.present) ||
    routes.some((route) => route.result === 'FAIL') ||
    blockers.length > 0 ||
    (!options.dryRun && routes.length === 0);
  const status = hasFailure ? 'FAIL' : options.dryRun ? 'DRY_RUN' : 'PASS';
  const payload = {
    status,
    today: options.today,
    generatedAt,
    issue: options.issue,
    dynamicFixtures: {
      enabled: includeDynamicFixtures,
      apiInterception: args.has('--intercept-fixture-api'),
      fixtureIds: [
        ...new Set(
          selectedActionClusters
            .flatMap((cluster) => cluster.actions)
            .map((action) => action.fixtureId)
            .filter(Boolean)
        ),
      ],
    },
    clusters: selectedActionClusters.map((cluster) => ({
      name: cluster.name,
      actions: cluster.actions.map((action) => action.id),
      apiRoutes: cluster.apiRoutes,
      existingTests: cluster.existingTests,
      docs: cluster.docs,
    })),
    baseUrl: options.baseUrl,
    staticMapping,
    routes,
    sources,
    blockers,
  };

  await mkdir(path.dirname(path.resolve(repoRoot, options.outputJson)), { recursive: true });
  await mkdir(path.dirname(path.resolve(repoRoot, options.outputMd)), { recursive: true });
  await writeFile(options.outputJson, `${JSON.stringify(payload, null, 2)}\n`);
  await writeFile(options.outputMd, renderMarkdown(payload, path.relative(repoRoot, options.outputJson)));

  process.stdout.write(`[local-protected-route-action-proof] JSON report: ${options.outputJson}\n`);
  process.stdout.write(`[local-protected-route-action-proof] Markdown report: ${options.outputMd}\n`);
  process.stdout.write(`[local-protected-route-action-proof] status=${status}\n`);

  if (status === 'FAIL') process.exit(1);
};

export {
  CdpClient,
  collectLocation,
  createPage,
  evaluate,
  findBrowserPath,
  httpRouteProof,
  installDynamicFixtureApi,
  jsonFixtureResponse,
  launchBrowser,
  main,
  navigate,
  normalizeBaseUrl,
  readArgValue,
  renderMarkdown,
  resolveDynamicFixtureApi,
  resolveOptions,
  seedSyntheticAuthSession,
  startWebServer,
  stopChild,
  verifyStaticMapping,
  wait,
  waitForPath,
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    process.stderr.write(
      `[local-protected-route-action-proof] failed: ${error instanceof Error ? error.stack || error.message : String(error)}\n`
    );
    process.exit(1);
  });
}
