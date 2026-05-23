# Testing Strategy

## Critical Areas
- Authorization and data isolation.
- Strategy validation and error handling.
- Upload safety and file handling.
- API contract stability between client and server.
- Trading engine correctness across backtest, paper, and live paths.

## Tooling
- Vitest for unit and integration tests.
- Supertest for API endpoints.
- Testing Library for UI behavior.
- Canonical web closure script for deterministic type generation:
  - `pnpm run web:verify:build-typecheck`
- Canonical DB-backed audit isolation script:
  - `pnpm run audit:data:db-isolated`
  - Runs `AUD-07` representative DB-backed packs sequentially with a Prisma
    `migrate reset --force --skip-seed` before each pack.
  - Use this instead of combining wallet/backtest/runtime DB-backed e2e files
    into one shared-database Vitest invocation.

## Manual Verification Standard
- Frontend changes require manual UI verification in addition to automated tests.
- Backend changes require manual API verification in addition to automated tests.
- Delivery summary for each task must include:
  - automated tests run and result,
  - manual checks run (UI/API) and result.

## Planned Tests
- Regression tests for auth flows.
- Contract tests for strategy endpoints.
- Contract tests for markets, bots, and backtests endpoints.
- Deterministic simulator tests for fees, slippage, and funding.
- i18n tests for EN/PL key coverage and fallback behavior.
- Responsive tests for desktop/tablet/mobile core dashboards.
- UX manual checklist for control-center 10-second operator clarity:
  - `docs/operations/control-center-10s-checklist.md`
- Localization QA checklist:
  - `docs/ux/localization-qa.md`
- Accessibility audit checklist:
  - `docs/ux/dashboard-accessibility-baseline.md`
- Load tests for API and worker monitoring endpoints:
  - baseline: `pnpm --filter api test:load:baseline`
  - stress: `pnpm --filter api test:load:stress`
  - defaults target: `/health`, `/ready`, `/metrics`, `/workers/health`
  - configurable with env: `LOAD_TEST_TARGET_URL`, `LOAD_TEST_DURATION_MS`, `LOAD_TEST_CONCURRENCY`, `LOAD_TEST_PATHS`


## AI And Integration Validation

AI features require repeatable multi-turn validation using `AI_TESTING_PROTOCOL.md`. Required coverage includes memory consistency, multi-step context stability, adversarial contradiction handling, role break and prompt injection resistance, memory corruption resistance, edge cases, data leakage, and unauthorized access attempts.

Runtime features require integration validation using `INTEGRATION_CHECKLIST.md`. A feature is not complete until real UI/client paths, API contracts, database schema or migrations, validation, loading states, error states, refresh or restart behavior, and regression risk are verified.

Completion evidence must satisfy `DEFINITION_OF_DONE.md` and include exact commands, manual checks, scenario results, and residual risks.
