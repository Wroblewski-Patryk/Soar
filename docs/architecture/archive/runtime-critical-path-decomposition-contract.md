# Runtime Critical-Path Decomposition Contract

Status: active (2026-04-19)  
Owner: API runtime maintainability wave (`ARC-A..ARC-E`)

## Purpose
- Freeze deterministic decomposition boundaries for runtime maintainability remediation.
- Prevent refactor drift during hotspot extraction (`runtimeSignalLoop`, runtime live-ordering config, final-candle path).

## Scope
- In scope:
  - extraction of typed runtime/live-ordering config from runtime services,
  - extraction of runtime supervisor/watchdog concerns from `runtimeSignalLoop.service.ts`,
  - extraction of final-candle decision execution flow into a dedicated application service,
  - regression split/coverage aligned to extracted seams.
- Out of scope in this wave:
  - runtime strategy semantics changes,
  - order side-effect policy changes,
  - API contract shape changes for runtime endpoints,
  - exchange adapter behavior changes.

## No-Drift Guardrails
- Refactor-only rule:
  - extracted modules must preserve existing behavior unless a failing test/build/safety contract proves correction is required.
- Contract-first ownership:
  - extracted seams must keep existing public runtime service contracts stable.
- Safety-first lock:
  - no relaxation of fail-closed guards in pre-trade, exchange-min-order checks, wallet-budget checks, and dedupe behavior.
- Scope lock:
  - no opportunistic UI, unrelated copy, or broad cleanup changes in ARC-A commits.
- Tiny-commit execution:
  - one ARC task per commit (`ARC-01` through `ARC-05`), with evidence in canonical planning/context files.

## Validation Baseline for ARC-A
- `pnpm --filter api run typecheck`
- `pnpm --filter api run test -- src/modules/engine/runtimeSignalLoop.service.test.ts --run`
- `pnpm run quality:guardrails`

## Canonical Linkage
- Queue owner: `docs/planning/mvp-next-commits.md`
- Phase owner: `docs/planning/mvp-execution-plan.md`
- Finding source: `history/audits/architecture-maintainability-audit-2026-04-18.md`
