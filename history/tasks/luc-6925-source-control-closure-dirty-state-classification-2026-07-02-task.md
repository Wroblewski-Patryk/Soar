# LUC-6925 Source Control Closure Dirty State Classification - 2026-07-02

## Context

- Issue: LUC-6925 `[Soar][Source Control Closure] Classify and close local dirty state for LUC-2791-LUC-2792-LUC-4103-LUC-5526-plus-244`
- Repo: `C:/Personal/Projekty/Aplikacje/Soar`
- Base before closure: `6aeb8b8b`
- Stage: verification and source-control closure

## Goal

Classify the local dirty Soar state, verify that the closable set is coherent and
does not contain protected credentials, and preserve it in one local source
control closure commit when the evidence supports closure.

## Scope

- App/source test stabilization:
  - `apps/web/src/context/AuthContext.tsx`
  - `apps/web/src/app/dashboard/page.tsx`
  - `apps/web/src/features/admin/layout/AdminLayoutShell.tsx`
  - related web tests
  - `apps/api/src/modules/backtests/backtests.e2e.test.ts`
- Protected-input readiness tooling:
  - `scripts/checkProtectedInputReadiness.mjs`
  - `scripts/checkProtectedInputReadiness.test.mjs`
- Generated/current truth, evidence, task, and architecture/status ledgers under
  `.agents/`, `.codex/`, `docs/`, and `history/`.

## Constraints

- No push.
- No deploy.
- No production restart.
- No protected smoke or live account mutation.
- Do not revert unrelated work.

## Classification

| Group | Status | Rationale |
| --- | --- | --- |
| Expired-session redirect preservation | current / closable | Auth context now carries `sessionExpired` into dashboard and admin protected-route redirects; covered by focused web tests. |
| Protected-input readiness account-access gate | current / closable | Readiness script now reports required account-access family presence without exposing values; covered by Node tests. |
| Backtest e2e stability adjustments | current / closable, partially verified | Timeout/wait sequencing is a test-stability delta. The attempted targeted API name-filter run collected the suite but skipped all tests because the filter did not match exact current names. |
| Generated docs, ledgers, task contracts, and evidence packets | current / closable | Files map to the linked LUC issue families and current Soar V1 audit-to-completion/source-truth queue. |
| Secret/protected credential exposure | no blocking finding | High-confidence credential scan found no private key, AWS key, GitHub token, OpenAI-style key, or Slack token pattern. Broader credential-word scan produced test fixture literals only. |

## Acceptance Criteria

- Dirty set classified by group.
- Targeted validation recorded.
- Commit decision recorded.
- Remaining risk and push/deploy posture explicit.

## Verification

- `pnpm run ops:protected-inputs:check:test` - passed, 7/7 Node tests.
- `pnpm --filter web exec vitest run src/context/AuthContext.test.tsx src/app/dashboard/dashboard.a11y.smoke.test.tsx src/features/admin/layout/AdminLayoutShell.test.tsx src/features/backtest/components/BacktestsList.test.tsx --run` - passed, 4 files / 15 tests.
- `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "returns seeded report data after manual trades|returns report timeline and symbol diagnostics" --run` - collected the suite, but skipped all 15 tests because the filter did not match exact current test names.
- `pnpm --filter api exec vitest run src/modules/backtests/backtests.e2e.test.ts -t "supports create/list/get for owner|keeps strategy \+ 3-symbol market-group backtest trace aligned with paper decision contract" --run` - failed before assertions because local PostgreSQL was unavailable at `localhost:5432`.
- `git diff --check` - passed with line-ending warnings only.
- `pnpm run quality:guardrails` - passed.
- `pnpm --filter web run typecheck` - passed.
- High-confidence credential scan - no blocking production secret pattern found.

## Definition of Done

- One local commit preserves the classified closure set.
- Issue comment records repo path, file groups, verification result, commit SHA,
  push status, deploy impact, residual risk, and next owner.

## Result Report

The dirty state is classified as a coherent Soar closure batch spanning source
test fixes plus generated V1 evidence and source-truth ledgers. Local closure is
appropriate after the recorded validation. Push and deploy remain forbidden for
this issue.
